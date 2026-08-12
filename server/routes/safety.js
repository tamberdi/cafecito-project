import express from "express";
import { createReport, createBlock, deleteBlock, getUserBlocks } from "../controllers/safetyController.js";

const router = express.Router();

router.post("/reports", createReport);
router.post("/blocks", createBlock);
router.delete("/blocks/:id", deleteBlock);
router.get("/blocks/user/:userId", getUserBlocks);

export default router;