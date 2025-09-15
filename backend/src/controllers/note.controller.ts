import { Request, Response } from "express";
import Note from "../models/note.model";

// POST /notes
export const createNote = async (req: Request, res: Response) => {
  const { title, content } = req.body;
  const { userId, tenantId } = req.user!;

  try {
    const note = await Note.create({ title, content, userId, tenantId });
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: "CreateNote: Server error" });
  }
};

// GET /notes
export const getNotes = async (req: Request, res: Response) => {
  const { tenantId } = req.user!;
  try {
    const notes = await Note.find({ tenantId });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "GetNote: Server error" });
  }
};

// GET /notes/:id
export const getNoteById = async (req: Request, res: Response) => {
  const { tenantId } = req.user!;
  try {
    // This query ensures a user can only get notes from their own tenant
    const note = await Note.findOne({ _id: req.params.id, tenantId });
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    return res.json(note);
  } catch (error) {
    return res.status(500).json({ message: "NoteById: Server error" });
  }
};

// PUT /notes/:id
export const updateNote = async (req: Request, res: Response) => {
  const { title, content } = req.body;
  const { tenantId } = req.user!;
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, tenantId },
      { title, content },
      { new: true } // Return the updated document
    );
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    return res.json(note);
  } catch (error) {
    return res.status(500).json({ message: "PutNote: Server error" });
  }
};

// DELETE /notes/:id
export const deleteNote = async (req: Request, res: Response) => {
  const { tenantId } = req.user!;
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, tenantId });
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    return res.status(204).send(); // No content
  } catch (error) {
    return res.status(500).json({ message: "DeleteNote: Server error" });
  }
};
