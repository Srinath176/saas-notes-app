import { Router } from "express";
import { upgradeSubscription } from "../controllers/tenant.controller";
import { authenticate, isAdmin } from "../middlewares/auth.middleware";

const tenantRoutes = Router();

// The slug is just for semantic API design, but we use the user's token for actual tenant ID
tenantRoutes.post("/:slug/upgrade", authenticate, isAdmin, upgradeSubscription);

export default tenantRoutes;
