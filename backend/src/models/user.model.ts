import { Schema, model, Document } from "mongoose";

/**
 * User Model
 *
 * Defines the data structure for users in the multi-tenant application.
 * Each user belongs to a specific tenant and has a role that determines
 * their access permissions within that tenant.
 */

/**
 * User interface extending Mongoose Document
 *
 * @interface IUser
 * @extends Document
 */
export interface IUser extends Document {
  email: string;
  password?: string; // Password is optional on the interface
  role: "admin" | "member";
  tenantId: Schema.Types.ObjectId;
}

/**
 * Mongoose schema definition for User collection
 *
 * Security Features:
 * - Password field hidden by default (select: false)
 * - Unique email constraint to prevent duplicate accounts
 * - Role-based access control with enum validation
 * - Multi-tenant isolation via tenantId reference
 *
 * Role Definitions:
 * - admin: Can manage tenant settings, upgrade subscriptions, full CRUD on notes
 * - member: Standard user with CRUD access to notes within their tenant
 */
const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false }, // Hide by default
  role: { type: String, enum: ["admin", "member"], required: true },
  tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true },
});

const User = model<IUser>("User", UserSchema);

export default User;
