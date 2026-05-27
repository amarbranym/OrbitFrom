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
  keyGenerator: (req) => {
    const forwarded = req.headers["x-forwarded-for"];
    const ip =
      typeof forwarded === "string"
        ? forwarded.split(",")[0]?.trim()
        : req.socket.remoteAddress ?? "unknown";
    return `submit:${ip}`;
  },
  message: { error: "Too many form submissions. Please wait a minute." },
});

const webOrigin = process.env.WEB_URL ?? "http://localhost:3000";
const isProduction =
  env.NODE_ENV === "prod" || env.NODE_ENV === "production";
const allowedOrigins = webOrigin
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

if (!isProduction) {
  allowedOrigins.push("http://localhost:3000");
}

const corsMiddleware = cors({
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }

    const normalizedOrigin = origin.replace(/\/$/, "");
    if (allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  credentials: true,
  optionsSuccessStatus: 204,
});

app.use(corsMiddleware);
app.options(/.*/, corsMiddleware);

app.use(express.json());

app.get("/", (req, res) => {
  return res.json({ message: "OrbitForm API is running", docs: "/docs" });
});

app.get("/health", (req, res) => {
  return res.json({ message: "OrbitForm API is healthy", healthy: true });
});

logger.debug(`openapi.json: ${env.BASE_URL}/openapi.json`);
app.get("/openapi.json", (req, res) => {
  return res.json(openApiDocument);
});

logger.debug(`docs: ${env.BASE_URL}/docs`);
app.use("/docs", (req, res, next) => {
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

export default app;
