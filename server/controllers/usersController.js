import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import pool from "../db/connection.js";
import { users } from "../db/schema.js";

const db = drizzle(pool);

export async function createUser(req, res) {
  const { name, email, timezone } = req.body;

  if (!name || !email) {
    return res.status(422).json({ error: "Name and email are required" });
  }

  try {
    const [newUser] = await db.insert(users).values({ name, email, timezone }).returning();
    res.status(201).json(newUser);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(422).json({ error: "Email already in use" });
    }
    console.error(err);
    res.status(500).json({ error: "Failed to create user" });
  }
}

export async function getUser(req, res) {
  const { id } = req.params;

  try {
    const [user] = await db.select().from(users).where(eq(users.id, parseInt(id)));
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
}

export async function updateUser(req, res) {
  const { id } = req.params;
  const { name, timezone } = req.body;

  try {
    const [updatedUser] = await db
      .update(users)
      .set({ name, timezone })
      .where(eq(users.id, parseInt(id)))
      .returning();

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update user" });
  }
}