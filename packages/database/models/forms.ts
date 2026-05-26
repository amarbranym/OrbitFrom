import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { usersTable } from "./user";

export const formsTable = pgTable(
  "forms",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),

    slug: varchar("slug", { length: 120 }).notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    description: text("description"),

    status: varchar("status", { length: 20 }).notNull().default("draft"),
    visibility: varchar("visibility", { length: 20 }).notNull().default("unlisted"),
    presentationMode: varchar("presentation_mode", { length: 20 })
      .notNull()
      .default("classic"),

    theme: jsonb("theme").notNull().$type<Record<string, unknown>>(),
    settings: jsonb("settings").$type<Record<string, unknown>>(),
    fields: jsonb("fields").notNull().$type<unknown[]>(),
    logic: jsonb("logic").$type<unknown[]>(),

    responseCount: integer("response_count").notNull().default(0),
    archivedAt: timestamp("archived_at", { withTimezone: true }),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("forms_user_id_idx").on(table.userId),
    uniqueIndex("forms_slug_unique").on(table.slug),
    index("forms_status_visibility_idx").on(table.status, table.visibility),
  ],
);

export type SelectForm = typeof formsTable.$inferSelect;
export type InsertForm = typeof formsTable.$inferInsert;
