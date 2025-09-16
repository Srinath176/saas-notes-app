import { Request, Response } from "express";
import Tenant from "../models/tenant.model";

/**
 * Tenant Controller
 *
 * Handles tenant management operations including subscription upgrades.
 * This controller manages the multi-tenant subscription system where tenants
 * can upgrade from free to pro plans.
 *
 * Security: Only admins can perform tenant operations (enforced by isAdmin middleware)
 */

/**
 * Upgrades a tenant's subscription from free to pro
 *
 * @route POST/PUT /tenant/upgrade (or similar)
 * @middleware authenticate, isAdmin
 * @param req - Express request object
 * @param res - Express response object
 * @returns Success message with updated tenant information
 *
 * Security Note: Uses the admin's own tenantId from JWT payload rather than
 * accepting it from request parameters to prevent privilege escalation attacks
 */
export const upgradeSubscription = async (req: Request, res: Response) => {
  // The admin's own tenantId is used, not from the params, for security.
  const tenantId = req.user?.tenantId;

  try {
    const tenant = await Tenant.findById(tenantId);
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    tenant.subscriptionPlan = "pro";
    await tenant.save();

    return res.json({
      message: "Subscription Plan upgraded to Pro successfully.",
      tenant,
    });
  } catch (error) {
    return res.status(500).json({ message: "TenantUpgrade: Server error" });
  }
};
