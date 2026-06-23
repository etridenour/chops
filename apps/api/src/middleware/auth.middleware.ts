import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.util";
import { prisma } from "../utils/prisma";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Missing or invalid authorization header" });
  }

  const token = header.split(" ")[1];

  try {
    const payload = verifyAccessToken(token);
    (req as any).user = payload;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const requireRole =
  (...roles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.sub;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    next();
  };
