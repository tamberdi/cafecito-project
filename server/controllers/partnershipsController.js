import { drizzle } from "drizzle-orm/node-postgres";
import { eq, or, and } from "drizzle-orm";
import pool from "../db/connection.js";
import { partnerships, users } from "../db/schema.js";

const db = drizzle(pool);

export async function createPartnership(req, res) {
  const { userAId, userBId } = req.body;

  if (!userAId || !userBId) {
    return res.status(422).json({ error: "userAId and userBId are required" });
  }

  if (userAId === userBId) {
    return res.status(422).json({ error: "Cannot create a partnership with yourself" });
  }

  try {
    // Check for an existing pending/active partnership between these two users, either direction
    const existing = await db
      .select()
      .from(partnerships)
      .where(
        or(
          and(eq(partnerships.userAId, userAId), eq(partnerships.userBId, userBId)),
          and(eq(partnerships.userAId, userBId), eq(partnerships.userBId, userAId))
        )
      );

    const activeOrPending = existing.find((p) => p.status === "pending" || p.status === "active");
    if (activeOrPending) {
      return res.status(422).json({ error: "A partnership already exists between these users" });
    }

    // TODO: reject if either user has blocked the other, once issue #13 is built

    const today = new Date().toISOString().split("T")[0];
    const [newPartnership] = await db
      .insert(partnerships)
      .values({ userAId, userBId, matchDate: today, status: "pending" })
      .returning();

    res.status(201).json(newPartnership);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create partnership request" });
  }
}

export async function updatePartnershipStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  const ALLOWED_STATUSES = ["active", "declined", "ended"];
  if (!ALLOWED_STATUSES.includes(status)) {
    return res.status(422).json({ error: `Status must be one of: ${ALLOWED_STATUSES.join(", ")}` });
  }

  try {
    const [updated] = await db
      .update(partnerships)
      .set({ status })
      .where(eq(partnerships.id, parseInt(id)))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: "Partnership not found" });
    }
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update partnership" });
  }
}

export async function getUserPartnerships(req, res) {
  const { userId } = req.params;
  const id = parseInt(userId);

  try {
    const result = await db
      .select()
      .from(partnerships)
      .where(or(eq(partnerships.userAId, id), eq(partnerships.userBId, id)));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch partnerships" });
  }
}