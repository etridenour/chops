import { Request, Response, NextFunction } from "express";
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
} from "@chops/shared";
import * as authService from "../services/auth.service";

function setRefreshTokenCookie(res: Response, token: string): void {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/auth",
  });
}

function buildAuthResponse(
  req: Request,
  res: Response,
  result: {
    authUser: AuthResponse["user"];
    accessToken: string;
    refreshToken: string;
  },
  statusCode: number = 200,
) {
  const isMobile = req.headers["x-client-type"] === "mobile";

  if (!isMobile) {
    setRefreshTokenCookie(res, result.refreshToken);
  }

  const response: AuthResponse & { refreshToken?: string } = {
    user: result.authUser,
    accessToken: result.accessToken,
  };

  if (isMobile) {
    response.refreshToken = result.refreshToken;
  }

  return res.status(statusCode).json(response);
}

// POST /auth/signup/start
export const startSignup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body = req.body as StartSignupRequest;
    const errors = validateStartSignup(body);
    if (errors.length > 0) {
      return res.status(400).json({ message: errors[0] });
    }

    const result = await authService.startSignup(body.email);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// POST /auth/signup/complete
export const completeSignup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body = req.body as CompleteSignupRequest;
    const errors = validateCompleteSignup(body);
    if (errors.length > 0) {
      return res.status(400).json({ message: errors[0] });
    }

    const result = await authService.completeSignup(body.token, body.password);
    return buildAuthResponse(req, res, result, 201);
  } catch (err) {
    next(err);
  }
};

// POST /auth/login
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body = req.body as LoginRequest;
    const errors = validateLogin(body);
    if (errors.length > 0) {
      return res.status(400).json({ message: errors[0] });
    }

    const result = await authService.login(body.email, body.password);
    return buildAuthResponse(req, res, result);
  } catch (err) {
    next(err);
  }
};

// POST /auth/logout
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    await authService.logout(token);

    res.clearCookie("refreshToken", { path: "/auth" });
    return res.status(200).json({ message: "Logged out" });
  } catch (err) {
    next(err);
  }
};

// POST /auth/refresh
export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const result = await authService.refreshTokens(token);
    return buildAuthResponse(req, res, result);
  } catch (err) {
    next(err);
  }
};

// GET /auth/me
export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.sub;
    const result = await authService.getMe(userId);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// POST /auth/forgot-password
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body = req.body as ForgotPasswordRequest;
    const errors = validateForgotPassword(body);
    if (errors.length > 0) {
      return res.status(400).json({ message: errors[0] });
    }

    const result = await authService.forgotPassword(body.email);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// POST /auth/reset-password
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body = req.body as ResetPasswordRequest;
    const errors = validateResetPassword(body);
    if (errors.length > 0) {
      return res.status(400).json({ message: errors[0] });
    }

    const result = await authService.resetPassword(body.token, body.password);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
