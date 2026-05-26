import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { config } from "dotenv";

/** Load monorepo root .env before any @repo/database import. */
const rootEnv = resolve(__dirname, "../../../.env");
if (existsSync(rootEnv)) {
  config({ path: rootEnv, override: true });
}
