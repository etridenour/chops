import { Router } from "express";
import {
  startSignup,
  completeSignup,
  login,
  logout,
  refresh,
  me,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth.middleware";

export const authRouter: Router = Router();

authRouter.post("/signup/start", startSignup);
authRouter.post("/signup/complete", completeSignup);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/refresh", refresh);
authRouter.get("/me", requireAuth, me);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);
