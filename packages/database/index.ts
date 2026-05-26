import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "./env";

function createQueryClient() {
  const isSupabase = env.DATABASE_URL.includes("supabase.com");
  const usesPooler =
    env.DATABASE_URL.includes("pgbouncer=true") || env.DATABASE_URL.includes(":6543/");

  return postgres(env.DATABASE_URL, {
    prepare: usesPooler ? false : true,
    ssl: isSupabase ? "require" : false,
    max: isSupabase ? 10 : undefined,
  });
}

const queryClient = createQueryClient();

export const db = drizzle(queryClient);
export * from "drizzle-orm";
export default db;
