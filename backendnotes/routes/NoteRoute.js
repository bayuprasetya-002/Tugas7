import express from "express";
import { createNote, deleteNote, getNotes, updateNote,getNoteById } from "../controller/NoteController.js";

const router = express.Router();

router.get("/notes/:id", getNoteById);
router.get("/notes", getNotes);
router.post("/notes", createNote);
router.put("/notes/:id", updateNote);
router.delete("/notes/:id", deleteNote);

export default router;
