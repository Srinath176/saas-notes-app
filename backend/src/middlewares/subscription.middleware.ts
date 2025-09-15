import { Request, Response, NextFunction } from "express";
import Tenant from "../models/tenant.model";
import Note from "../models/note.model";

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
