import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";

import { formsTable } from "./forms";

export const formSubmissionsTable = pgTable(
  "form_submissions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    formId: uuid("form_id")
      .notNull()
      .references(() => formsTable.id, { onDelete: "cascade" }),

    answers: jsonb("answers").notNull().$type<Record<string, unknown>>(),
    submittedAt: timestamp("submitted_at", { withTimezone: true }).defaultNow().notNull(),

    ipHash: varchar("ip_hash", { length: 64 }),
    userAgent: text("user_agent"),
  },
  (table) => [
    index("form_submissions_form_id_submitted_at_idx").on(
      table.formId,
      table.submittedAt,
    ),
  ],
);

export type SelectFormSubmission = typeof formSubmissionsTable.$inferSelect;
export type InsertFormSubmission = typeof formSubmissionsTable.$inferInsert;
