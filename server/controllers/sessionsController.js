import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import pool from "../db/connection.js";
import { sessions, partnerships } from "../db/schema.js";

const db = drizzle(pool);

export async function getPartnershipSessions(req, res) {
  const { partnershipId } = req.params;

  try {
    const result = await db
      .select()
      .from(sessions)
      .where(eq(sessions.partnershipId, parseInt(partnershipId)));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
}

export async function createSession(req, res) {
  const { partnershipId, sessionDate, durationMinutes, notes } = req.body;

  if (!partnershipId || !sessionDate || durationMinutes === undefined || durationMinutes === null) {
    return res.status(422).json({ error: "partnershipId, sessionDate, and durationMinutes are required" });
  }

  if (durationMinutes <= 0 || durationMinutes > 480) {
    return res.status(422).json({ error: "Duration must be between 1 and 480 minutes" });
  }

  try {
    const [newSession] = await db
      .insert(sessions)
      .values({ partnershipId, sessionDate, durationMinutes, notes })
      .returning();
    res.status(201).json(newSession);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create session" });
  }
}

export async function updateSession(req, res) {
  const { id } = req.params;
  const { sessionDate, durationMinutes, notes } = req.body;

  if (durationMinutes !== undefined && (durationMinutes <= 0 || durationMinutes > 480)) {
    return res.status(422).json({ error: "Duration must be between 1 and 480 minutes" });
  }

  try {
    const [updated] = await db
      .update(sessions)
      .set({ sessionDate, durationMinutes, notes })
      .where(eq(sessions.id, parseInt(id)))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: "Session not found" });
    }
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update session" });
  }
}

export async function deleteSession(req, res) {
  const { id } = req.params;

  try {
    const [deleted] = await db.delete(sessions).where(eq(sessions.id, parseInt(id))).returning();
    if (!deleted) {
      return res.status(404).json({ error: "Session not found" });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete session" });
  }
}