import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import {
  validateStartSignup,
  validateCompleteSignup,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
} from "@chops/shared";
import type {
  StartSignupRequest,
  CompleteSignupRequest,
  LoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  AuthResponse,
  AuthUser,
} from "@chops/shared";
import { prisma } from "../utils/prisma";
import { signAccessToken, getRefreshTokenExpiresAt } from "../utils/jwt.util";
import { sendVerificationEmail, sendPasswordResetEmail } from "../utils/email.util";

function toAuthUser(user: {
  id: string;
  email: string;
  displayName: string;
}): AuthUser {
  return { id: user.id, email: user.email, displayName: user.displayName };
}

function setRefreshTokenCookie(res: Response, token: string): void {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/auth",
  });
}

async function issueTokens(
  res: Response,
  req: Request,
  user: { id: string; email: string; displayName: string }
): Promise<AuthResponse & { refreshToken?: string }> {
  const accessToken = signAccessToken({ sub: user.id, email: user.email });
  const refreshTokenValue = crypto.randomBytes(40).toString("hex");

  await prisma.refreshToken.create({
    data: {
      token: refreshTokenValue,
      userId: user.id,
      expiresAt: getRefreshTokenExpiresAt(),
    },
  });

  const isMobile = req.headers["x-client-type"] === "mobile";

  if (!isMobile) {
    setRefreshTokenCookie(res, refreshTokenValue);
  }

  const response: AuthResponse & { refreshToken?: string } = {
    user: toAuthUser(user),
    accessToken,
  };

  if (isMobile) {
    response.refreshToken = refreshTokenValue;
  }

  return response;
}

// POST /auth/signup/start
export const startSignup = async (req: Request, res: Response) => {
  const body = req.body as StartSignupRequest;
  const errors = validateStartSignup(body);
  if (errors.length > 0) {
    return res.status(400).json({ message: errors[0] });
  }

  const email = body.email.toLowerCase().trim();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ message: "An account with this email already exists" });
  }

  // Delete any existing verification tokens for this email
  await prisma.verificationToken.deleteMany({ where: { email } });

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.verificationToken.create({
    data: { email, token, expiresAt },
  });

  await sendVerificationEmail(email, token);

  return res.status(200).json({ message: "Verification email sent" });
};

// POST /auth/signup/complete
export const completeSignup = async (req: Request, res: Response) => {
  const body = req.body as CompleteSignupRequest;
  const errors = validateCompleteSignup(body);
  if (errors.length > 0) {
    return res.status(400).json({ message: errors[0] });
  }

  const verification = await prisma.verificationToken.findUnique({
    where: { token: body.token },
  });

  if (!verification || verification.expiresAt < new Date()) {
    if (verification) {
      await prisma.verificationToken.delete({ where: { id: verification.id } });
    }
    return res.status(400).json({ message: "Invalid or expired verification token" });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: verification.email },
  });
  if (existingUser) {
    await prisma.verificationToken.delete({ where: { id: verification.id } });
    return res.status(409).json({ message: "An account with this email already exists" });
  }

  const passwordHash = await bcrypt.hash(body.password, 12);

  const user = await prisma.user.create({
    data: {
      email: verification.email,
      displayName: body.displayName.trim(),
      accounts: {
        create: {
          provider: "credentials",
          passwordHash,
        },
      },
    },
  });

  await prisma.verificationToken.delete({ where: { id: verification.id } });

  const response = await issueTokens(res, req, user);
  return res.status(201).json(response);
};

// POST /auth/login
export const login = async (req: Request, res: Response) => {
  const body = req.body as LoginRequest;
  const errors = validateLogin(body);
  if (errors.length > 0) {
    return res.status(400).json({ message: errors[0] });
  }

  const user = await prisma.user.findUnique({
    where: { email: body.email.toLowerCase().trim() },
    include: { accounts: { where: { provider: "credentials" } } },
  });

  if (!user || user.accounts.length === 0 || !user.accounts[0].passwordHash) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const valid = await bcrypt.compare(body.password, user.accounts[0].passwordHash);
  if (!valid) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const response = await issueTokens(res, req, user);
  return res.status(200).json(response);
};

// POST /auth/logout
export const logout = async (req: Request, res: Response) => {
  const cookieToken = req.cookies?.refreshToken;
  const bodyToken = req.body?.refreshToken;
  const token = cookieToken || bodyToken;

  if (token) {
    await prisma.refreshToken.deleteMany({ where: { token } });
  }

  res.clearCookie("refreshToken", { path: "/auth" });
  return res.status(200).json({ message: "Logged out" });
};

// POST /auth/refresh
export const refresh = async (req: Request, res: Response) => {
  const cookieToken = req.cookies?.refreshToken;
  const bodyToken = req.body?.refreshToken;
  const token = cookieToken || bodyToken;

  if (!token) {
    return res.status(401).json({ message: "No refresh token" });
  }

  const stored = await prisma.refreshToken.findUnique({ where: { token } });

  if (!stored || stored.expiresAt < new Date()) {
    if (stored) await prisma.refreshToken.delete({ where: { id: stored.id } });
    return res.status(401).json({ message: "Invalid or expired refresh token" });
  }

  const user = await prisma.user.findUnique({ where: { id: stored.userId } });
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  // Rotate: delete old, create new
  await prisma.refreshToken.delete({ where: { id: stored.id } });

  const response = await issueTokens(res, req, user);
  return res.status(200).json(response);
};

// GET /auth/me
export const me = async (req: Request, res: Response) => {
  const userId = (req as any).user.sub;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json({ user: toAuthUser(user) });
};

// POST /auth/forgot-password
export const forgotPassword = async (req: Request, res: Response) => {
  const body = req.body as ForgotPasswordRequest;
  const errors = validateForgotPassword(body);
  if (errors.length > 0) {
    return res.status(400).json({ message: errors[0] });
  }

  const email = body.email.toLowerCase().trim();

  const user = await prisma.user.findUnique({ where: { email } });

  // Always return 200 to prevent email enumeration
  if (!user) {
    return res.status(200).json({
      message: "If an account with that email exists, a reset link has been sent",
    });
  }

  // Delete any existing reset tokens for this email
  await prisma.passwordResetToken.deleteMany({ where: { email } });

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  await prisma.passwordResetToken.create({
    data: { email, token, expiresAt },
  });

  await sendPasswordResetEmail(email, token);

  return res.status(200).json({
    message: "If an account with that email exists, a reset link has been sent",
  });
};

// POST /auth/reset-password
export const resetPassword = async (req: Request, res: Response) => {
  const body = req.body as ResetPasswordRequest;
  const errors = validateResetPassword(body);
  if (errors.length > 0) {
    return res.status(400).json({ message: errors[0] });
  }

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token: body.token },
  });

  if (!resetToken || resetToken.expiresAt < new Date()) {
    if (resetToken) {
      await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });
    }
    return res.status(400).json({ message: "Invalid or expired reset token" });
  }

  const user = await prisma.user.findUnique({
    where: { email: resetToken.email },
    include: { accounts: { where: { provider: "credentials" } } },
  });

  if (!user || user.accounts.length === 0) {
    await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });
    return res.status(400).json({ message: "Invalid or expired reset token" });
  }

  const passwordHash = await bcrypt.hash(body.password, 12);

  await prisma.account.update({
    where: { id: user.accounts[0].id },
    data: { passwordHash },
  });

  await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });

  return res.status(200).json({ message: "Password reset successfully" });
};
