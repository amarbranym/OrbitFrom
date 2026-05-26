import { drizzle } from "drizzle-orm/postgres-js";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "./env";

function createQueryClient() {
  const isSupabase = env.DATABASE_URL.includes("supabase.com");
  const usesPooler =
    env.DATABASE_URL.includes("pgbouncer=true") || env.DATABASE_URL.includes(":6543/");

  if (process.env.NODE_ENV !== "prod") {
    try {
      const host = new URL(env.DATABASE_URL.replace(/^postgresql?:/, "http:")).host;
      console.info(`[database] connecting to ${host} (pooler=${usesPooler})`);
    } catch {
      console.info(`[database] connecting (pooler=${usesPooler})`);
    }
  }

  return postgres(env.DATABASE_URL, {
    prepare: usesPooler ? false : true,
    ssl: isSupabase ? "require" : false,
    max: isSupabase ? 10 : undefined,
    connect_timeout: 15,
    idle_timeout: 20,
  });
}

let queryClient: ReturnType<typeof postgres> | undefined;
let database: PostgresJsDatabase | undefined;

function getQueryClient() {
  if (!queryClient) {
    queryClient = createQueryClient();
  }
  return queryClient;
}

function getDb() {
  if (!database) {
    database = drizzle(getQueryClient());
  }
  return database;
}

export const db = new Proxy({} as PostgresJsDatabase, {
  get(_target, prop, receiver) {
    return Reflect.get(getDb(), prop, receiver);
  },
});

export async function closeDatabase() {
  if (queryClient) {
    await queryClient.end();
    queryClient = undefined;
    database = undefined;
  }
}

export * from "drizzle-orm";
export default db;
