import { TRPCError } from "@trpc/server";

type PgErrorLike = {
  code?: string;
  message?: string;
};

function getPgError(error: unknown): PgErrorLike | null {
  if (!(error instanceof Error)) return null;

  const cause = error.cause;
  if (cause instanceof Error) {
    return { message: cause.message, code: (cause as PgErrorLike).code };
  }
  if (cause && typeof cause === "object") {
    return cause as PgErrorLike;
  }
  return null;
}

function isDrizzleQueryError(error: unknown): boolean {
  return error instanceof Error && error.message.startsWith("Failed query:");
}

export function toDatabaseTrpcError(error: unknown): TRPCError | null {
  if (!isDrizzleQueryError(error)) return null;

  const pg = getPgError(error);
  const code = pg?.code;

  if (code === "28P01") {
    return new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message:
        "Database connection failed. Set DATABASE_URL in .env to your local PostgreSQL username and password.",
    });
  }

  if (code === "42P01") {
    return new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: 'Database tables are missing. Run "pnpm db:migrate" after DATABASE_URL is correct.',
    });
  }

  if (code === "3D000") {
    return new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message:
        "Database does not exist. Create it or fix the database name in DATABASE_URL.",
    });
  }

  return new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: pg?.message ?? "Database error",
  });
}
