import { Schema, model, Document } from "mongoose";

/**
 * Note Model
 *
 * Defines the data structure for notes in the multi-tenant application.
 * Each note is associated with both a user (creator) and a tenant (organization)
 * to enable proper data isolation and access control.
 */

/**
 * Note interface extending Mongoose Document
 *
 * @interface INote
 * @extends Document
 */
export interface INote extends Document {
  title: string;
  content: string;
  userId: Schema.Types.ObjectId;
  tenantId: Schema.Types.ObjectId;
}

/**
 * Mongoose schema definition for Note collection
 *
 * Features:
 * - All fields are required to ensure data integrity
 * - References to User and Tenant collections for relational data
 * - Automatic timestamps (createdAt, updatedAt) for audit trail
 * - Multi-tenant architecture support via tenantId field
 */

const NoteSchema = new Schema<INote>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true },
  },
  { timestamps: true }
);

const Note = model<INote>("Note", NoteSchema);

export default Note;
