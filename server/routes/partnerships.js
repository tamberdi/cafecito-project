import express from "express";
import { createPartnership, updatePartnershipStatus, getUserPartnerships, getPartnershipStreak } from "../controllers/partnershipsController.js";

const router = express.Router();

router.post("/", createPartnership);
router.patch("/:id", updatePartnershipStatus);
router.get("/user/:userId", getUserPartnerships);
router.get("/:id/streak", getPartnershipStreak);

export default router;

