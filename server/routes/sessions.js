import express from "express";
import { getPartnershipSessions, createSession, updateSession, deleteSession } from "../controllers/sessionsController.js";

const router = express.Router();

router.get("/partnership/:partnershipId", getPartnershipSessions);
router.post("/", createSession);
router.patch("/:id", updateSession);
router.delete("/:id", deleteSession);

export default router;