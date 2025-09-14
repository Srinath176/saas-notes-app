import { Schema, model, Document } from "mongoose";

export interface INote extends Document {
  title: string;
  content: string;
  userId: Schema.Types.ObjectId;
  tenantId: Schema.Types.ObjectId;
}

const NoteSchema = new Schema<INote>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true },
  },
  { timestamps: true }
);

const Note =  model<INote>("Note", NoteSchema);

export default Note;
