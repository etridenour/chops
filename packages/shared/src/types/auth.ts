// ---------- Request types ----------

export interface StartSignupRequest {
  email: string;
}

export interface CompleteSignupRequest {
  token: string;
  displayName: string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

// ---------- Response types ----------

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
}

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
}

// ---------- Token payload ----------

export interface AccessTokenPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}
