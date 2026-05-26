import { logger } from "@repo/logger";
import nodemailer from "nodemailer";

import { env } from "../env";

export function createMailTransport() {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT ?? 587,
    secure: false,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });
}

export async function sendPlainEmail(params: {
  to: string;
  subject: string;
  text: string;
  logTag: string;
}): Promise<void> {
  const transport = createMailTransport();

  if (!transport) {
    logger.info(`[${params.logTag}] email (dev) to=${params.to} subject=${params.subject}`);
    logger.info(`[${params.logTag}] body:\n${params.text}`);
    return;
  }

  const from = env.SMTP_FROM ?? env.SMTP_USER;

  await transport.sendMail({
    from: `OrbitForm <${from}>`,
    to: params.to,
    subject: params.subject,
    text: params.text,
  });

  logger.info(`[${params.logTag}] email sent to=${params.to}`);
}
