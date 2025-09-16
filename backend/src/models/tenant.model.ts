import { Schema, model, Document } from "mongoose";

/**
 * Tenant Model
 *
 * Defines the data structure for tenants (organizations) in the multi-tenant application.
 * Tenants represent separate organizations that use the application with isolated data
 * and their own subscription plans.
 */

/**
 * Tenant interface extending Mongoose Document
 *
 * @interface ITenant
 * @extends Document
 */
export interface ITenant extends Document {
  name: string;
  slug: string;
  subscriptionPlan: "free" | "pro";
}

/**
 * Mongoose schema definition for Tenant collection
 * 
 * Features:
 * - Unique slug constraint for tenant identification
 * - Enum validation for subscription plans
 * - Default free subscription for new tenants
 * - Support for future subscription plan extensions
 */
const TenantSchema = new Schema<ITenant>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  subscriptionPlan: { type: String, enum: ["free", "pro"], default: "free" },
});

const Tenant = model<ITenant>("Tenant", TenantSchema);

export default Tenant;
