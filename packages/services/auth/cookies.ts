import { serialize, parse } from "cookie";
import type { IncomingMessage, ServerResponse } from "node:http";

import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_MS } from "@repo/auth/constants";

const isProduction = process.env.NODE_ENV === "production";

export function getSessionTokenFromRequest(req: IncomingMessage): string | null {
  const header = req.headers.cookie;
  if (!header) return null;
  const cookies = parse(header);
  const token = cookies[SESSION_COOKIE_NAME];
  return token ?? null;
}

export function setSessionCookie(res: ServerResponse, token: string): void {
  const cookie = serialize(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(SESSION_MAX_AGE_MS / 1000),
  });
  res.setHeader("Set-Cookie", cookie);
}

export function clearSessionCookie(res: ServerResponse): void {
  const cookie = serialize(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  res.setHeader("Set-Cookie", cookie);
}
