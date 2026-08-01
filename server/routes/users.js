import express from "express";
import { createUser, getUser, updateUser, browseUsers } from "../controllers/usersController.js";

const router = express.Router();

router.get("/", browseUsers);
router.post("/", createUser);
router.get('/:id', getUser);
router.patch('/:id', updateUser);

export default router;