import {
  startSignupSchema,
  completeSignupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../schemas/auth.schema";
import type {
  StartSignupRequest,
  CompleteSignupRequest,
  LoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "../types/auth";
import { extractErrors } from "./utils";

export function validateStartSignup(input: StartSignupRequest): string[] {
  return extractErrors(startSignupSchema.safeParse(input));
}

export function validateCompleteSignup(input: CompleteSignupRequest): string[] {
  return extractErrors(completeSignupSchema.safeParse(input));
}

export function validateLogin(input: LoginRequest): string[] {
  return extractErrors(loginSchema.safeParse(input));
}

export function validateForgotPassword(input: ForgotPasswordRequest): string[] {
  return extractErrors(forgotPasswordSchema.safeParse(input));
}

export function validateResetPassword(input: ResetPasswordRequest): string[] {
  return extractErrors(resetPasswordSchema.safeParse(input));
}
