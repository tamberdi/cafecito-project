import express from "express";
import { getUserLanguages, createLanguage, updateLanguage, deleteLanguage } from "../controllers/languagesController.js";

const router = express.Router();

router.get("/user/:userId", getUserLanguages);
router.post("/", createLanguage);
router.patch("/:id", updateLanguage);
router.delete("/:id", deleteLanguage);

export default router;