import express from "express";
import { createPartnership, updatePartnershipStatus, getUserPartnerships } from "../controllers/partnershipsController.js";

const router = express.Router();

router.post("/", createPartnership);
router.patch("/:id", updatePartnershipStatus);
router.get("/user/:userId", getUserPartnerships);

export default router;

