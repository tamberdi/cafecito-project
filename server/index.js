import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db/connection.js"
import usersRouter from "./routes/users.js"
import languagesRouter from "./routes/languages.js";
import partnershipsRouter from "./routes/partnerships.js";
import sessionsRouter from "./routes/sessions.js";
import { sessions } from "./db/schema.js";
import topicsRouter from "./routes/topics.js";
import safetyRouter from "./routes/safety.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use("/users", usersRouter);
app.use("/languages", languagesRouter);
app.use("/partnerships", partnershipsRouter);
app.use("/sessions", sessionsRouter);
app.use("/topics", topicsRouter);
app.use("/safety", safetyRouter);

//Health-check route 
app.get("/", async (req, res) => {
    res.json({ message: "Cafecito API is running"});
});

// DB health-check route 
app.get("/db-check", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json({ dbTime: result.rows[0].now });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database connection failed"});
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});