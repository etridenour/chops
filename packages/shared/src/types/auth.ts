import type { z } from "zod";
import type {
  startSignupSchema,
  completeSignupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../schemas/auth.schema";

// ---------- Request types (inferred from Zod schemas) ----------

export type StartSignupRequest = z.infer<typeof startSignupSchema>;
export type CompleteSignupRequest = z.infer<typeof completeSignupSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
export type ForgotPasswordRequest = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordRequest = z.infer<typeof resetPasswordSchema>;

// ---------- Response types ----------

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  emailVerified: boolean;
}

// ---------- Token payload ----------

export interface AccessTokenPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}
