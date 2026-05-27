import { httpLink, httpBatchStreamLink } from "@repo/trpc/client";
import { env } from "~/env.js";

interface CreateTRPCHttpBatchClientClientOpts {
  enableStreaming?: boolean;
}

export const createTRPCHttpBatchClientClient = (opts?: CreateTRPCHttpBatchClientClientOpts) => {
  const c = opts?.enableStreaming ? httpBatchStreamLink : httpLink;
  // Browser auth relies on a first-party session cookie. Always use the
  // same-origin proxy route so Set-Cookie is written for the web app domain.
  const apiUrl =
    env.NEXT_PUBLIC_API_URL?.startsWith("/") ? env.NEXT_PUBLIC_API_URL : "/trpc";
  return c({
    url: apiUrl,
    fetch(url, options) {
      return fetch(url, {
        ...options,
        credentials: "include",
        signal: options?.signal ?? AbortSignal.timeout(30_000),
      });
    },
  });
};
