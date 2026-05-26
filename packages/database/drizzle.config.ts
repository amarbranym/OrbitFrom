import { defineConfig } from "drizzle-kit";

import { env } from "./env";

/** Migrations require a session-mode connection (Supabase DIRECT_URL, not the pooler). */
const migrationUrl = env.DIRECT_URL ?? env.DATABASE_URL;

export default defineConfig({
  out: "./drizzle",
  schema: "./schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: migrationUrl,
  },
});
