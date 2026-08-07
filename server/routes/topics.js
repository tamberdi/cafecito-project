import express from "express";
import { getAllTopics, createTopic, tagSession, untagSession, getSessionTopics } from "../controllers/topicsController.js";

const router = express.Router();

router.get("/", getAllTopics);
router.post("/", createTopic);
router.post("/tag", tagSession);
router.delete("/tag/:id", untagSession);
router.get("/session/:sessionId", getSessionTopics);

export default router;