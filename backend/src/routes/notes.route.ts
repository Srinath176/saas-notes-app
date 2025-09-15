import { Router } from "express";
import {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
} from "../controllers/note.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { checkNoteLimit } from "../middlewares/subscription.middleware";

const noteRoutes = Router();

noteRoutes.post("/", authenticate, checkNoteLimit, createNote);
noteRoutes.get("/", authenticate, getNotes);
noteRoutes.get("/:id", authenticate, getNoteById);
noteRoutes.put("/:id", authenticate, updateNote);
noteRoutes.delete("/:id", authenticate, deleteNote);

export default noteRoutes;
