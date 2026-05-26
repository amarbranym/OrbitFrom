import postgres from "postgres";

import { env } from "../env";

async function main() {
  const url = env.DATABASE_URL;
  const isSupabase = url.includes("supabase.com");
  const usesPooler = url.includes("pgbouncer=true") || url.includes(":6543/");

  console.log("DATABASE_URL host:", isSupabase ? "supabase" : "other");
  console.log("pooler:", usesPooler);

  const sql = postgres(url, {
    prepare: usesPooler ? false : true,
    ssl: isSupabase ? "require" : false,
    connect_timeout: 15,
  });

  try {
    const rows = await sql`select count(*)::int as c from users`;
    console.log("users count:", rows[0]?.c);
  } catch (error) {
    console.error("Query failed:", error);
    process.exitCode = 1;
  } finally {
    await sql.end();
  }
}

void main();
