import { initTRPC, TRPCError } from "@trpc/server";
import type { OpenApiMeta } from "trpc-to-openapi";

import { AuthError } from "@repo/services/auth";
import { FormError } from "@repo/services/forms";

import { createContext } from "./context";
import { toDatabaseTrpcError } from "./utils/database-error";

export const tRPCContext = initTRPC
  .meta<OpenApiMeta>()
  .context<typeof createContext>()
  .create({});

export const router = tRPCContext.router;

export const publicProcedure = tRPCContext.procedure;

function mapFormError(error: FormError): TRPCError {
  const code =
    error.code === "NOT_FOUND"
      ? "NOT_FOUND"
      : error.code === "FORBIDDEN"
        ? "FORBIDDEN"
        : error.code === "SLUG_TAKEN"
          ? "CONFLICT"
          : error.code === "RATE_LIMITED" || error.code === "HONEYPOT"
            ? "TOO_MANY_REQUESTS"
            : error.code === "VALIDATION_FAILED"
              ? "BAD_REQUEST"
              : error.code === "SUBMIT_FORBIDDEN"
                ? "FORBIDDEN"
                : "BAD_REQUEST";

  return new TRPCError({ code, message: error.message });
}

const domainErrorMiddleware = tRPCContext.middleware(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error instanceof FormError) {
      throw mapFormError(error);
    }

    if (error instanceof AuthError) {
      const code =
        error.code === "EMAIL_TAKEN" || error.code === "EMAIL_NOT_FOUND"
          ? "CONFLICT"
          : error.code === "OTP_COOLDOWN"
            ? "TOO_MANY_REQUESTS"
            : error.code === "OTP_MAX_ATTEMPTS"
              ? "TOO_MANY_REQUESTS"
              : "BAD_REQUEST";
      throw new TRPCError({
        code,
        message: error.message,
      });
    }

    const databaseError = toDatabaseTrpcError(error);
    if (databaseError) throw databaseError;

    throw error;
  }
});

export const authProcedure = publicProcedure.use(domainErrorMiddleware);

export const protectedProcedure = authProcedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "You must be signed in" });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});
