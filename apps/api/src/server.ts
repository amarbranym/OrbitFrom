import "./preload-env";

import express from "express";
import rateLimit from "express-rate-limit";
import { logger } from "@repo/logger";
import cors from "cors";

import * as trpcExpress from "@trpc/server/adapters/express";
import { generateOpenApiDocument, createOpenApiExpressMiddleware } from "trpc-to-openapi";

import { serverRouter, createContext } from "@repo/trpc/server";

import { env } from "./env";

export const app = express();

const openApiDocument = generateOpenApiDocument(serverRouter, {
  title: "OrbitForm API",
  version: "1.0.0",
  baseUrl: env.BASE_URL.concat("/api"),
});

const trpcRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again later." },
});

const submitRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: express.Request) => {
    const forwarded = req.headers["x-forwarded-for"];
    const ip =
      typeof forwarded === "string"
        ? forwarded.split(",")[0]?.trim()
        : req.socket.remoteAddress ?? "unknown";
    return `submit:${ip}`;
  },
  message: { error: "Too many form submissions. Please wait a minute." },
});

const isProduction =
  env.NODE_ENV === "prod" || env.NODE_ENV === "production";

function normalizeOrigin(value: string) {
  return value.trim().replace(/\/$/, "");
}

function toHttpsOrigin(value?: string) {
  if (!value) return null;
  const cleaned = value.trim().replace(/\/$/, "");
  if (!cleaned) return null;
  if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) {
    return cleaned;
  }
  return `https://${cleaned}`;
}

const allowedOrigins = new Set(
  [
    ...(process.env.WEB_URL ?? "")
      .split(",")
      .map(normalizeOrigin)
      .filter(Boolean),
    toHttpsOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL),
    toHttpsOrigin(process.env.VERCEL_BRANCH_URL),
    toHttpsOrigin(process.env.VERCEL_URL),
  ].filter((value): value is string => Boolean(value)),
);

if (!isProduction) {
  allowedOrigins.add("http://localhost:3000");
}

function isAllowedOrigin(origin: string) {
  const normalizedOrigin = normalizeOrigin(origin);
  if (allowedOrigins.has(normalizedOrigin)) return true;

  // Allow Vercel preview/production domains when not explicitly listed.
  if (normalizedOrigin.endsWith(".vercel.app")) return true;

  return false;
}

const corsMiddleware = cors({
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (isAllowedOrigin(origin)) {
      callback(null, true);
      return;
    }

    callback(null, false);
  },
  credentials: true,
  optionsSuccessStatus: 204,
});

app.use(corsMiddleware);
app.options(/.*/, corsMiddleware);

app.use(express.json());

app.get("/", (_req: express.Request, res: express.Response) => {
  return res.json({ message: "OrbitForm API is running", docs: "/docs" });
});

app.get("/health", (_req: express.Request, res: express.Response) => {
  return res.json({ message: "OrbitForm API is healthy", healthy: true });
});

logger.debug(`openapi.json: ${env.BASE_URL}/openapi.json`);
app.get("/openapi.json", (_req: express.Request, res: express.Response) => {
  return res.json(openApiDocument);
});

logger.debug(`docs: ${env.BASE_URL}/docs`);
app.use("/docs", (req: express.Request, res: express.Response, next: express.NextFunction) => {
  import("@scalar/express-api-reference")
    .then(({ apiReference }) => {
      apiReference({ url: "/openapi.json" })(req, res);
    })
    .catch(next);
});

app.use(
  "/api",
  createOpenApiExpressMiddleware({
    router: serverRouter,
    createContext,
  }),
);

app.use("/trpc/publicForms.submit", submitRateLimiter);

app.use(
  "/trpc",
  trpcRateLimiter,
  trpcExpress.createExpressMiddleware({
    router: serverRouter,
    createContext,
  }),
);

// Required on Vercel serverless so unhandled errors don't leave the function in a bad state.
app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    logger.error("Unhandled API error", { err });
    if (res.headersSent) return;
    res.status(500).json({ error: "Internal server error" });
  },
);

export default app;
