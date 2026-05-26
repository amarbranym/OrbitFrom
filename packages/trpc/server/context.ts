import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { IncomingMessage, ServerResponse } from "node:http";

import type { SessionUser } from "@repo/auth/schemas";

import { authService } from "./services";

export type Context = {
  req: IncomingMessage;
  res: ServerResponse;
  user: SessionUser | null;
};

export async function createContext({
  req,
  res,
}: CreateExpressContextOptions): Promise<Context> {
  const user = await authService.getSessionFromRequest(req);
  return { req, res, user };
}
