import bcrypt from "bcryptjs";
import crypto from "crypto";
import type { AuthUser } from "@chops/shared";
import { prisma } from "../utils/prisma";
import { signAccessToken, getRefreshTokenExpiresAt } from "../utils/jwt.util";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../utils/email.util";
import { AppError } from "../errors/AppError";

function toAuthUser(user: {
  id: string;
  email: string;
  role: string;
  emailVerified: boolean;
}): AuthUser {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    emailVerified: user.emailVerified,
  };
}

async function issueTokens(user: {
  id: string;
  email: string;
  role: string;
  emailVerified: boolean;
}): Promise<{ authUser: AuthUser; accessToken: string; refreshToken: string }> {
  const accessToken = signAccessToken({ sub: user.id, email: user.email });
  const refreshToken = crypto.randomBytes(40).toString("hex");

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: getRefreshTokenExpiresAt(),
    },
  });

  return { authUser: toAuthUser(user), accessToken, refreshToken };
}

export async function startSignup(email: string): Promise<{ message: string }> {
  const normalizedEmail = email.toLowerCase().trim();

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (existing) {
    throw new AppError(409, "An account with this email already exists");
  }

  await prisma.verificationToken.deleteMany({
    where: { email: normalizedEmail },
  });

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.verificationToken.create({
    data: { email: normalizedEmail, token, expiresAt },
  });

  await sendVerificationEmail(normalizedEmail, token);

  return { message: "Verification email sent" };
}

export async function completeSignup(
  token: string,
  password: string,
): Promise<{ authUser: AuthUser; accessToken: string; refreshToken: string }> {
  const verification = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!verification || verification.expiresAt < new Date()) {
    if (verification) {
      await prisma.verificationToken.delete({ where: { id: verification.id } });
    }
    throw new AppError(400, "Invalid or expired verification token");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: verification.email },
  });
  if (existingUser) {
    await prisma.verificationToken.delete({ where: { id: verification.id } });
    throw new AppError(409, "An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email: verification.email,
      emailVerified: true,
      displayName: null, // Default empty, can be updated later
      accounts: {
        create: {
          provider: "credentials",
          passwordHash,
        },
      },
    },
  });

  await prisma.verificationToken.delete({ where: { id: verification.id } });

  return issueTokens(user);
}

export async function login(
  email: string,
  password: string,
): Promise<{ authUser: AuthUser; accessToken: string; refreshToken: string }> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    include: { accounts: { where: { provider: "credentials" } } },
  });

  if (!user || user.accounts.length === 0 || !user.accounts[0].passwordHash) {
    throw new AppError(401, "Invalid email or password");
  }

  const valid = await bcrypt.compare(password, user.accounts[0].passwordHash);
  if (!valid) {
    throw new AppError(401, "Invalid email or password");
  }

  return issueTokens(user);
}

export async function logout(refreshToken: string | undefined): Promise<void> {
  if (refreshToken) {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
  }
}

export async function refreshTokens(
  refreshToken: string,
): Promise<{ authUser: AuthUser; accessToken: string; refreshToken: string }> {
  const stored = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  });

  if (!stored || stored.expiresAt < new Date()) {
    if (stored) await prisma.refreshToken.delete({ where: { id: stored.id } });
    throw new AppError(401, "Invalid or expired refresh token");
  }

  const user = await prisma.user.findUnique({ where: { id: stored.userId } });
  if (!user) {
    throw new AppError(401, "User not found");
  }

  // Rotate: delete old, create new
  await prisma.refreshToken.delete({ where: { id: stored.id } });

  return issueTokens(user);
}

export async function getMe(userId: string): Promise<{ user: AuthUser }> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError(404, "User not found");
  }

  return { user: toAuthUser(user) };
}

export async function forgotPassword(
  email: string,
): Promise<{ message: string }> {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  // Always return same message to prevent email enumeration
  if (!user) {
    return {
      message:
        "If an account with that email exists, a reset link has been sent",
    };
  }

  await prisma.passwordResetToken.deleteMany({
    where: { email: normalizedEmail },
  });

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  await prisma.passwordResetToken.create({
    data: { email: normalizedEmail, token, expiresAt },
  });

  await sendPasswordResetEmail(normalizedEmail, token);

  return {
    message: "If an account with that email exists, a reset link has been sent",
  };
}

export async function resetPassword(
  token: string,
  password: string,
): Promise<{ message: string }> {
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!resetToken || resetToken.expiresAt < new Date()) {
    if (resetToken) {
      await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });
    }
    throw new AppError(400, "Invalid or expired reset token");
  }

  const user = await prisma.user.findUnique({
    where: { email: resetToken.email },
    include: { accounts: { where: { provider: "credentials" } } },
  });

  if (!user || user.accounts.length === 0) {
    await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });
    throw new AppError(400, "Invalid or expired reset token");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.account.update({
    where: { id: user.accounts[0].id },
    data: { passwordHash },
  });

  await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });

  return { message: "Password reset successfully" };
}
