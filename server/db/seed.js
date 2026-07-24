import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pool from "./connection.js"
import { users, languages, partnerships, sessions, topics, sessionTopics } from "./schema.js"

const db = drizzle(pool);



async function seed() {
     console.log("Resetting database...");
  await db.execute(`TRUNCATE TABLE users, languages, partnerships, sessions, topics, session_topics, reports, blocks RESTART IDENTITY CASCADE`);

    console.log("Seeding database...");

    // Users
   const [reina, marco, yuki, sofia, ben] = await db.insert(users).values([
    { name: "Reina Vidal", email: "reina@example.com", timezone: "Europe/Madrid" },
    { name: "Marco Rossi", email: "marco@example.com", timezone: "Europe/Rome" },
    { name: "Yuki Tanaka", email: "yuki@example.com", timezone: "Asia/Tokyo" },
    { name: "Sofia Reyes", email: "sofia@example.com", timezone: "America/Mexico_City" },
    { name: "Ben Carter", email: "ben@example.com", timezone: "America/Chicago" },
    ]).returning();

    //Languages
    await db.insert(languages).values([
    { userId: reina.id, language: "Spanish", level: "fluent", isNative: true },
    { userId: reina.id, language: "French", level: "intermediate", isNative: false },
    { userId: marco.id, language: "Italian", level: "fluent", isNative: true },
    { userId: marco.id, language: "Spanish", level: "beginner", isNative: false },
    { userId: yuki.id, language: "Japanese", level: "fluent", isNative: true },
    { userId: yuki.id, language: "English", level: "advanced", isNative: false },
    { userId: sofia.id, language: "Spanish", level: "fluent", isNative: true },
    { userId: sofia.id, language: "English", level: "advanced", isNative: false },
    { userId: ben.id, language: "English", level: "fluent", isNative: true },
    { userId: ben.id, language: "Spanish", level: "intermediate", isNative: false },
  ]);

  // Partnerships
  const [partnership1, partnership2] = await db.insert(partnerships).values([
    { userAId: reina.id, userBId: ben.id, matchDate: "2026-06-01", status: "active" },
    { userAId: sofia.id, userBId: marco.id, matchDate: "2026-06-10", status: "active" },
  ]).returning();

  // Sessions
  const [session1] = await db.insert(sessions).values([
    { partnershipId: partnership1.id, sessionDate: "2026-06-05", durationMinutes: 30, notes: "Talked about weekend plans" },
    { partnershipId: partnership1.id, sessionDate: "2026-06-12", durationMinutes: 45, notes: "Practiced past tense" },
    { partnershipId: partnership2.id, sessionDate: "2026-06-15", durationMinutes: 20, notes: "Quick vocabulary review" },
  ]).returning();

   // Topics
  const [pastTense, smallTalk, travelVocab] = await db.insert(topics).values([
    { name: "past tense", category: "grammar" },
    { name: "small talk", category: "conversation" },
    { name: "travel vocabulary", category: "vocabulary" },
  ]).returning();

  // Session-topic tags
  await db.insert(sessionTopics).values([
    { sessionId: session1.id, topicId: pastTense.id },
  ]);

  console.log("Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});