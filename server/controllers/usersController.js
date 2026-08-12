import { drizzle } from "drizzle-orm/node-postgres";
import { eq, and, ne, or, sql } from "drizzle-orm";
import pool from "../db/connection.js";
import { users, languages, blocks, partnerships, sessions } from "../db/schema.js";

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
    if (err.cause?.code === "23505") {
      return res.status(422).json({ error: "Email already in use" });
    }
    console.error(err);
    res.status(500).json({ error: "Failed to create user" });
  }
}

export async function getUser(req, res) {
  const { id } = req.params;
  const userId = parseInt(id);

  try {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userPartnerships = await db
      .select({ id: partnerships.id })
      .from(partnerships)
      .where(or(eq(partnerships.userAId, userId), eq(partnerships.userBId, userId)));

    const partnershipIds = userPartnerships.map((p) => p.id);

    let sessionCount = 0;
    if (partnershipIds.length > 0) {
      const sessionResults = await db
        .select({ id: sessions.id })
        .from(sessions)
        .where(sql`${sessions.partnershipId} IN ${partnershipIds}`);
      sessionCount = sessionResults.length;
    }

    res.json({ ...user, sessionCount });
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

export async function browseUsers(req, res) {
  const { learning, native, currentUserId } = req.query;

  try {
    let matchedUserIds = null;

    if (learning) {
      const nativeSpeakers = await db
        .select({ userId: languages.userId })
        .from(languages)
        .where(and(eq(languages.language, learning), eq(languages.isNative, true)));
      matchedUserIds = new Set(nativeSpeakers.map((r) => r.userId));
    }

    if (native) {
      const learners = await db
        .select({ userId: languages.userId })
        .from(languages)
        .where(and(eq(languages.language, native), eq(languages.isNative, false)));
      const learnerIds = new Set(learners.map((r) => r.userId));

      matchedUserIds = matchedUserIds
        ? new Set([...matchedUserIds].filter((id) => learnerIds.has(id)))
        : learnerIds;
    }

    let allUsers = await db.select().from(users);

    if (currentUserId) {
      allUsers = allUsers.filter((u) => u.id !== parseInt(currentUserId));
    }

   if (matchedUserIds) {
      allUsers = allUsers.filter((u) => matchedUserIds.has(u.id));
    }

    if (currentUserId) {
      const blockedResult = await db
        .select()
        .from(blocks)
        .where(
          or(
            eq(blocks.blockerId, parseInt(currentUserId)),
            eq(blocks.blockedId, parseInt(currentUserId))
          )
        );

      const blockedIds = new Set(
        blockedResult.map((b) =>
          b.blockerId === parseInt(currentUserId) ? b.blockedId : b.blockerId
        )
      );

      allUsers = allUsers.filter((u) => !blockedIds.has(u.id));
    }

    res.json(allUsers);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to browse users" });
  }
}