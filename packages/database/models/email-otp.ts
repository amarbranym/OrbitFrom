import { integer, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const emailOtpsTable = pgTable("email_otps", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull(),
  purpose: varchar("purpose", { length: 20 }).notNull(),
  codeHash: varchar("code_hash", { length: 64 }).notNull(),
  fullName: varchar("full_name", { length: 80 }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  lastSentAt: timestamp("last_sent_at", { withTimezone: true }).notNull(),
  attemptCount: integer("attempt_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export type SelectEmailOtp = typeof emailOtpsTable.$inferSelect;
export type InsertEmailOtp = typeof emailOtpsTable.$inferInsert;
