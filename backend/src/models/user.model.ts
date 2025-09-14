import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password?: string; // Password is optional on the interface
  role: "admin" | "member";
  tenantId: Schema.Types.ObjectId;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false }, // Hide by default
  role: { type: String, enum: ["admin", "member"], required: true },
  tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true },
});

const User = model<IUser>("User", UserSchema);

export default User;
