import { drizzle } from "drizzle-orm/node-postgres";
import { eq, ilike } from "drizzle-orm";
import pool from "../db/connection.js";
import { topics, sessionTopics, sessions } from "../db/schema.js";

const db = drizzle(pool);

export async function getAllTopics(req, res) {
  try {
    const result = await db.select().from(topics);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch topics" });
  }
}

export async function createTopic(req, res) {
  const { name, category } = req.body;

  if (!name) {
    return res.status(422).json({ error: "Topic name is required" });
  }

  try {
    // Check case-insensitively for an existing topic first
    const [existing] = await db.select().from(topics).where(ilike(topics.name, name));
    if (existing) {
      return res.json(existing);
    }

    const [newTopic] = await db.insert(topics).values({ name, category }).returning();
    res.status(201).json(newTopic);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create topic" });
  }
}

export async function tagSession(req, res) {
  const { sessionId, topicId } = req.body;

  if (!sessionId || !topicId) {
    return res.status(422).json({ error: "sessionId and topicId are required" });
  }

  try {
    const [newTag] = await db.insert(sessionTopics).values({ sessionId, topicId }).returning();
    res.status(201).json(newTag);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to tag session" });
  }
}

export async function untagSession(req, res) {
  const { id } = req.params;

  try {
    const [deleted] = await db.delete(sessionTopics).where(eq(sessionTopics.id, parseInt(id))).returning();
    if (!deleted) {
      return res.status(404).json({ error: "Tag not found" });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to remove tag" });
  }
}

export async function getSessionTopics(req, res) {
  const { sessionId } = req.params;

  try {
    const result = await db
      .select({
        tagId: sessionTopics.id,
        topicId: topics.id,
        name: topics.name,
        category: topics.category,
      })
      .from(sessionTopics)
      .innerJoin(topics, eq(sessionTopics.topicId, topics.id))
      .where(eq(sessionTopics.sessionId, parseInt(sessionId)));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch session topics" });
  }
}