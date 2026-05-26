import type { IncomingMessage } from "node:http";

export function getClientIp(req: IncomingMessage): string | undefined {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0]?.trim();
  }
  if (Array.isArray(forwarded)) {
    return forwarded[0]?.split(",")[0]?.trim();
  }
  return req.socket.remoteAddress ?? undefined;
}
