import type {
  StartSignupRequest,
  CompleteSignupRequest,
  LoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "../types/auth";

export function validateStartSignup(input: StartSignupRequest): string[] {
  const errors: string[] = [];

  if (!input.email || input.email.trim().length === 0) {
    errors.push("Email is required");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    errors.push("Email is not valid");
  }

  return errors;
}

export function validateCompleteSignup(input: CompleteSignupRequest): string[] {
  const errors: string[] = [];

  if (!input.token) {
    errors.push("Verification token is required");
  }

  if (!input.displayName || input.displayName.trim().length === 0) {
    errors.push("Display name is required");
  } else if (input.displayName.length > 50) {
    errors.push("Display name must be 50 characters or less");
  }

  if (!input.password || input.password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }

  if (input.password !== input.confirmPassword) {
    errors.push("Passwords do not match");
  }

  return errors;
}

export function validateLogin(input: LoginRequest): string[] {
  const errors: string[] = [];

  if (!input.email || input.email.trim().length === 0) {
    errors.push("Email is required");
  }

  if (!input.password || input.password.length === 0) {
    errors.push("Password is required");
  }

  return errors;
}

export function validateForgotPassword(input: ForgotPasswordRequest): string[] {
  const errors: string[] = [];

  if (!input.email || input.email.trim().length === 0) {
    errors.push("Email is required");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    errors.push("Email is not valid");
  }

  return errors;
}

export function validateResetPassword(input: ResetPasswordRequest): string[] {
  const errors: string[] = [];

  if (!input.token) {
    errors.push("Reset token is required");
  }

  if (!input.password || input.password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }

  if (input.password !== input.confirmPassword) {
    errors.push("Passwords do not match");
  }

  return errors;
}
