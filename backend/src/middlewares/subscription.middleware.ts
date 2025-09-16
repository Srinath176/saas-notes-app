import { Request, Response, NextFunction } from "express";
import Tenant from "../models/tenant.model";
import Note from "../models/note.model";

/**
 * Subscription Middleware
 *
 * Provides subscription-based feature limiting middleware for the multi-tenant
 * application. This module enforces business rules based on tenant subscription plans.
 *
 * Current limitations:
 * - Free plan: Maximum 3 notes per tenant
 * - Pro plan: Unlimited notes
 */

/**
 * Note limit enforcement middleware
 *
 * Checks if a tenant on the free plan has reached their note limit (3 notes).
 * This middleware should be applied to note creation endpoints to enforce
 * subscription-based limits.
 *
 * @param req - Express request object (requires authenticated user)
 * @param res - Express response object
 * @param next - Express next function
 *
 * Behavior:
 * - For pro plan tenants: Always allows operation
 * - For free plan tenants: Blocks if they already have 3+ notes
 * - Returns 403 Forbidden with upgrade message if limit exceeded
 *
 * Usage: Apply this middleware before note creation controllers
 */
export const checkNoteLimit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const tenant = await Tenant.findById(req.user.tenantId);
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    if (tenant.subscriptionPlan === "free") {
      const noteCount = await Note.countDocuments({
        tenantId: req.user.tenantId,
      });
      if (noteCount >= 3) {
        return res.status(403).json({
          message: "Note limit reached. Please upgrade to the Pro plan.",
        });
      }
    }
    return next();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error while checking subscription" });
  }
};
