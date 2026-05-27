import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";

import type { SessionUser } from "@repo/auth/schemas";

import { authService } from "./services";

export type Context = CreateExpressContextOptions & {
  user: SessionUser | null;
};

export async function createContext(
  opts: CreateExpressContextOptions,
): Promise<Context> {
  const user = await authService.getSessionFromRequest(opts.req);
  return { ...opts, user };
}
