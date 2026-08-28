import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 465,
  secure: (process.env.SMTP_SECURE ?? "true") === "true",
  auth: process.env.SMTP_USER
    ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    : undefined,
});

const from = process.env.SMTP_FROM || process.env.SMTP_USER;

export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  const webUrl = process.env.WEB_URL || "http://localhost:3000";
  const verifyUrl = `${webUrl}/verify?token=${token}`;

  await transporter.sendMail({
    from,
    to: email,
    subject: "Verify your Chops account",
    html: `
      <h2>Welcome to Chops!</h2>
      <p>Click the link below to verify your email and create your account:</p>
      <p><a href="${verifyUrl}">Verify my email</a></p>
      <p>This link expires in 1 hour.</p>
      <p>If you didn't sign up for Chops, you can ignore this email.</p>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const webUrl = process.env.WEB_URL || "http://localhost:3000";
  const resetUrl = `${webUrl}/reset-password?token=${token}`;

  await transporter.sendMail({
    from,
    to: email,
    subject: "Reset your Chops password",
    html: `
      <h2>Password Reset</h2>
      <p>Click the link below to reset your password:</p>
      <p><a href="${resetUrl}">Reset my password</a></p>
      <p>This link expires in 5 minutes.</p>
      <p>If you didn't request a password reset, you can ignore this email.</p>
    `,
  });
}
