import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { config } from "dotenv";
import { z } from "zod";

const envPaths = [
  resolve(process.cwd(), ".env"),
  resolve(process.cwd(), "../../.env"),
];

for (const envPath of envPaths) {
  if (existsSync(envPath)) {
    config({ path: envPath });
    if (process.env.DATABASE_URL) break;
  }
}

const envSchema = z.object({
  DATABASE_URL: z.string().describe("Postgres URL (use Supabase pooler in production)"),
  DIRECT_URL: z
    .string()
    .optional()
    .describe("Direct/session Postgres URL for migrations (Supabase port 5432)"),
});

function createEnv(env: NodeJS.ProcessEnv) {
  const safeParseResult = envSchema.safeParse(env);
  if (!safeParseResult.success) throw new Error(safeParseResult.error.message);
  return safeParseResult.data;
}

export const env = createEnv(process.env);
