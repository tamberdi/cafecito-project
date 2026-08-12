import { drizzle } from "drizzle-orm/node-postgres";
import { eq, or, and } from "drizzle-orm";
import pool from "../db/connection.js";
import { reports, blocks } from "../db/schema.js";

const db = drizzle(pool);

export async function createReport(req, res) {
  const { reporterId, reportedId, reason } = req.body;

  if (!reporterId || !reportedId) {
    return res.status(422).json({ error: "reporterId and reportedId are required" });
  }

  try {
    const [newReport] = await db.insert(reports).values({ reporterId, reportedId, reason }).returning();
    res.status(201).json(newReport);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create report" });
  }
}

export async function createBlock(req, res) {
  const { blockerId, blockedId } = req.body;

  if (!blockerId || !blockedId) {
    return res.status(422).json({ error: "blockerId and blockedId are required" });
  }

  try {
    const [newBlock] = await db.insert(blocks).values({ blockerId, blockedId }).returning();
    res.status(201).json(newBlock);
  } catch (err) {
    if (err.cause?.code === "23505") {
      return res.status(422).json({ error: "You have already blocked this user" });
    }
    console.error(err);
    res.status(500).json({ error: "Failed to block user" });
  }
}

export async function deleteBlock(req, res) {
  const { id } = req.params;

  try {
    const [deleted] = await db.delete(blocks).where(eq(blocks.id, parseInt(id))).returning();
    if (!deleted) {
      return res.status(404).json({ error: "Block not found" });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to unblock user" });
  }
}

export async function getUserBlocks(req, res) {
  const { userId } = req.params;

  try {
    const result = await db.select().from(blocks).where(eq(blocks.blockerId, parseInt(userId)));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch blocks" });
  }
}