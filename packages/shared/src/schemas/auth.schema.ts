import { z } from "zod";

export const startSignupSchema = z.object({
  email: z.string().min(1, "Email is required").email("Email is not valid"),
});

export const completeSignupSchema = z
  .object({
    token: z.string().min(1, "Verification token is required"),
    displayName: z
      .string()
      .min(1, "Display name is required")
      .max(50, "Display name must be 50 characters or less"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Email is not valid"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Email is not valid"),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
