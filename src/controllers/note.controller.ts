import { Response } from "express";
import { NoteService } from "../services/note.service";
import { createNoteSchema, updateNoteSchema } from "../schema/note.schema";
import { AuthRequest } from "../middlewares/auth.middleware";

const noteService = new NoteService();

export const createNote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const parsed = createNoteSchema.parse(req.body);
    const result = await noteService.createNote(userId, parsed.title, parsed.content);
    res.status(201).json(result);
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
};

export const getNotes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const result = await noteService.getNotes(userId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getNoteById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const result = await noteService.getNoteById(req.params.id as string, userId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const updateNote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const parsed = updateNoteSchema.parse(req.body);
    const result = await noteService.updateNote(req.params.id as string, userId, parsed.title, parsed.content);
    res.status(200).json(result);
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
};

export const deleteNote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    await noteService.deleteNote(req.params.id as string, userId);
    res.status(200).json({ message: "Note successfully deleted." });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
