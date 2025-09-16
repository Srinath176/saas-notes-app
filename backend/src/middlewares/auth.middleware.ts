import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/env";

/**
 * Authentication Middleware
 *
 * Provides JWT-based authentication and role-based authorization middleware
 * for the multi-tenant application. This module extends Express Request type
 * to include user payload information for downstream controllers.
 */

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

/**
 * Authentication middleware
 *
 * Verifies JWT tokens and attaches user information to the request object.
 * This middleware must be applied to all protected routes.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 *
 * Expected Authorization header format: "Bearer <jwt_token>"
 *
 * On success: Adds user object to req.user with userId, role, and tenantId
 * On failure: Returns 401 Unauthorized
 */
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

/**
 * Admin authorization middleware
 *
 * Ensures that only users with "admin" role can access protected admin routes.
 * Must be used after the authenticate middleware to ensure req.user is populated.
 *
 * @param req - Express request object (must have req.user from authenticate middleware)
 * @param res - Express response object
 * @param next - Express next function
 *
 * On success: Calls next() to continue to the protected route
 * On failure: Returns 403 Forbidden
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }
  return next();
};
