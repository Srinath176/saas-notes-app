import { Request, Response } from "express";
import Note from "../models/note.model";

/**
 * Note Controller
 *
 * Handles CRUD operations for notes in a multi-tenant environment.
 * All operations are scoped to the authenticated user's tenant to ensure data isolation.
 *
 * Security features:
 * - Tenant-scoped queries for data isolation
 * - User authentication required (via middleware)
 * - Automatic userId and tenantId assignment from JWT payload
 */

/**
 * Creates a new note
 *
 * @route POST /notes
 * @middleware authenticate, checkNoteLimit (for free tier)
 * @param req - Express request with title and content in body
 * @param res - Express response
 * @returns Created note object with 201 status
 */
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

/**
 * Retrieves all notes for the authenticated user's tenant
 *
 * @route GET /notes
 * @middleware authenticate
 * @param req - Express request
 * @param res - Express response
 * @returns Array of notes belonging to the user's tenant
 */
export const getNotes = async (req: Request, res: Response) => {
  const { tenantId } = req.user!;
  try {
    const notes = await Note.find({ tenantId });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "GetNote: Server error" });
  }
};

/**
 * Retrieves a specific note by ID
 *
 * @route GET /notes/:id
 * @middleware authenticate
 * @param req - Express request with note ID in params
 * @param res - Express response
 * @returns Single note object or 404 if not found/not accessible
 */
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

/**
 * Updates an existing note
 *
 * @route PUT /notes/:id
 * @middleware authenticate
 * @param req - Express request with note ID in params and updated fields in body
 * @param res - Express response
 * @returns Updated note object or 404 if not found/not accessible
 */
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

/**
 * Deletes a note by ID
 *
 * @route DELETE /notes/:id
 * @middleware authenticate
 * @param req - Express request with note ID in params
 * @param res - Express response
 * @returns 204 No Content on successful deletion, 404 if not found/not accessible
 */
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
