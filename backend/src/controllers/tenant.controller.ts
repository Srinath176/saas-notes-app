import { Request, Response } from "express";
import Tenant from "../models/tenant.model";

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

    return res.json({ message: "Subscription upgraded to Pro successfully.", tenant });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
