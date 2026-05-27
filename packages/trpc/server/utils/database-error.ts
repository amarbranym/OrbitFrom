import { TRPCError } from "@trpc/server";

type PgErrorLike = {
  code?: string;
  message?: string;
};

function getPgError(error: unknown): PgErrorLike | null {
  let current: unknown = error;
  for (let depth = 0; depth < 8; depth += 1) {
    if (!current || typeof current !== "object") break;
    const candidate = current as PgErrorLike & { cause?: unknown };
    if (candidate.code) {
      return { code: candidate.code, message: candidate.message };
    }
    current = candidate.cause;
  }
  return null;
}

function isDrizzleQueryError(error: unknown): boolean {
  return error instanceof Error && error.message.startsWith("Failed query:");
}

const PG_MESSAGES: Record<string, string> = {
  "28P01":
    "Database password rejected. Check DATABASE_URL in apps/api/.env (Supabase → Settings → Database).",
  "42P01":
    'Database tables are missing. From the repo root run: pnpm db:migrate (or run supabase/migrations/20260526120000_orbitform_initial_schema.sql in Supabase SQL editor).',
  "3D000":
    "Database does not exist. Fix the database name in DATABASE_URL.",
  "42P07": "Database schema is out of sync with migrations. Contact support or re-run migrations.",
  "08P01": "Database pooler error. Use port 6543 with ?pgbouncer=true in DATABASE_URL.",
};

export function toDatabaseTrpcError(error: unknown): TRPCError | null {
  if (!isDrizzleQueryError(error)) return null;

  const pg = getPgError(error);
  const code = pg?.code;

  if (code && PG_MESSAGES[code]) {
    return new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: PG_MESSAGES[code],
    });
  }

  const detail = pg?.message?.trim();
  return new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: detail
      ? `Database error: ${detail}`
      : "Database error. Restart the API (pnpm dev) after updating apps/api/.env, then try again.",
  });
}
