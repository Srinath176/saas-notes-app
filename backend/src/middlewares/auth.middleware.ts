import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/env";

// Extend the Express Request type to include our user payload
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: "admin" | "member";
        tenantId: string;
      };
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication token required" });
  }

  const token = authHeader.split(" ")[1];
  const secret = config.jwt.secret;
  if (!secret) throw new Error("JWT_SECRET not defined");

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded as Express.Request["user"];
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }
  return next();
};
