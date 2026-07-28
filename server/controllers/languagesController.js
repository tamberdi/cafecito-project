import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import pool from "../db/connection.js";
import { languages } from "../db/schema.js";

const db = drizzle(pool);

const ALLOWED_LEVELS = ["beginner", "intermediate", "advanced", "fluent"];

export async function getUserLanguages(req, res) {
  const { userId } = req.params;

  try {
    const result = await db.select().from(languages).where(eq(languages.userId, parseInt(userId)));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch languages" });
  }
}

export async function createLanguage(req, res) {
  const { userId, language, level, isNative } = req.body;

  if (!userId || !language || !level) {
    return res.status(422).json({ error: "userId, language, and level are required" });
  }

  if (!ALLOWED_LEVELS.includes(level)) {
    return res.status(422).json({ error: `Level must be one of: ${ALLOWED_LEVELS.join(", ")}` });
  }

  try {
    const [newLanguage] = await db.insert(languages).values({ userId, language, level, isNative }).returning();
    res.status(201).json(newLanguage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add language" });
  }
}

export async function updateLanguage(req, res) {
  const { id } = req.params;
  const { level, isNative } = req.body;

  if (level && !ALLOWED_LEVELS.includes(level)) {
    return res.status(422).json({ error: `Level must be one of: ${ALLOWED_LEVELS.join(", ")}` });
  }

  try {
    const [updated] = await db
      .update(languages)
      .set({ level, isNative })
      .where(eq(languages.id, parseInt(id)))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: "Language entry not found" });
    }
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update language" });
  }
}

export async function deleteLanguage(req, res) {
  const { id } = req.params;

  try {
    const [deleted] = await db.delete(languages).where(eq(languages.id, parseInt(id))).returning();
    if (!deleted) {
      return res.status(404).json({ error: "Language entry not found" });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete language" });
  }
}