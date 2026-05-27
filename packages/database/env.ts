import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { config } from "dotenv";
import { z } from "zod";

function findMonorepoRoot(startDir: string): string {
  let dir = startDir;
  for (let i = 0; i < 12; i += 1) {
    if (existsSync(resolve(dir, "pnpm-workspace.yaml"))) {
      return dir;
    }
    const parent = resolve(dir, "..");
    if (parent === dir) break;
    dir = parent;
  }
  return startDir;
}

const repoRoot = findMonorepoRoot(process.cwd());
const apiEnvPath = resolve(repoRoot, "apps/api/.env");
const legacyRootEnvPath = resolve(repoRoot, ".env");
const cwdEnvPath = resolve(process.cwd(), ".env");

if (existsSync(apiEnvPath)) {
  config({ path: apiEnvPath });
} else if (existsSync(legacyRootEnvPath)) {
  config({ path: legacyRootEnvPath });
} else if (existsSync(cwdEnvPath)) {
  config({ path: cwdEnvPath });
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
