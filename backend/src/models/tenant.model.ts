import { Schema, model, Document } from "mongoose";

export interface ITenant extends Document {
  name: string;
  slug: string;
  subscriptionPlan: "free" | "pro";
}

const TenantSchema = new Schema<ITenant>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  subscriptionPlan: { type: String, enum: ["free", "pro"], default: "free" },
});

const Tenant = model<ITenant>("Tenant", TenantSchema);

export default Tenant;
