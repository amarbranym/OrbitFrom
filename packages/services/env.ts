import { z } from "zod";

const urlListSchema = z
  .string()
  .transform((value, ctx) => {
    const items = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (items.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Expected at least one URL",
      });
      return z.NEVER;
    }

    for (const item of items) {
      const parsed = z.string().url().safeParse(item);
      if (!parsed.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Invalid URL in list: ${item}`,
        });
        return z.NEVER;
      }
    }

    return value;
  });

const envSchema = z.object({
  GOOGLE_OAUTH_CLIENT_ID: z.string().optional(),
  GOOGLE_OAUTH_CLIENT_SECRET: z.string().optional(),
  GOOGLE_OAUTH_REDIRECT_URI: z.string().url().optional(),
  SESSION_SECRET: z.string().min(32, "SESSION_SECRET must be at least 32 characters"),
  WEB_URL: urlListSchema.default("http://localhost:3000"),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().email().optional(),
});

function createEnv(env: NodeJS.ProcessEnv) {
  const safeParseResult = envSchema.safeParse(env);
  if (!safeParseResult.success) throw new Error(safeParseResult.error.message);
  return safeParseResult.data;
}

export const env = createEnv(process.env);
