import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { config } from "dotenv";

/** Load apps/api/.env before any @repo/database import. */
const apiEnv = resolve(__dirname, "../.env");
const legacyRootEnv = resolve(__dirname, "../../../.env");

if (existsSync(apiEnv)) {
  config({ path: apiEnv, override: true });
} else if (existsSync(legacyRootEnv)) {
  config({ path: legacyRootEnv, override: true });
}
