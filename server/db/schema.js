import { pgTable, serial, varchar, integer, boolean, date, timestamp, unique } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  timezone: varchar("timezone", { length: 100 }),
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const languages = pgTable("languages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  language: varchar("language", { length: 100 }).notNull(),
  level: varchar("level", { length: 50 }).notNull(),
  isNative: boolean("is_native").default(false),
});

export const partnerships = pgTable("partnerships", {
  id: serial("id").primaryKey(),
  userAId: integer("user_a_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  userBId: integer("user_b_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  matchDate: date("match_date").notNull(),
  status: varchar("status", { length: 50 }).default("pending"),
}, (table) => ({
  uniqueMatchDate: unique().on(table.userAId, table.userBId, table.matchDate),
}));

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  partnershipId: integer("partnership_id").references(() => partnerships.id, { onDelete: "cascade" }).notNull(),
  sessionDate: date("session_date").notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  notes: varchar("notes", { length: 1000 }),
});

export const topics = pgTable("topics", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  category: varchar("category", { length: 100 }),
});

export const sessionTopics = pgTable("session_topics", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").references(() => sessions.id, { onDelete: "cascade" }).notNull(),
  topicId: integer("topic_id").references(() => topics.id, { onDelete: "cascade" }).notNull(),
});

export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  reporterId: integer("reporter_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  reportedId: integer("reported_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  reason: varchar("reason", { length: 500 }),
  reportedAt: timestamp("reported_at").defaultNow(),
});

export const blocks = pgTable("blocks", {
  id: serial("id").primaryKey(),
  blockerId: integer("blocker_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  blockedId: integer("blocked_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  blockedAt: timestamp("blocked_at").defaultNow(),
}, (table) => ({
  uniqueBlock: unique().on(table.blockerId, table.blockedId),
}));