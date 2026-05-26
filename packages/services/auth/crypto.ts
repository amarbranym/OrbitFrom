import { createHash, randomBytes, randomInt } from "node:crypto";

import { OTP_LENGTH } from "@repo/auth/constants";
import { env } from "../env";

export function hashToken(value: string): string {
  return createHash("sha256")
    .update(`${value}:${env.SESSION_SECRET}`)
    .digest("hex");
}

export function generateOtpCode(): string {
  const max = 10 ** OTP_LENGTH;
  const code = randomInt(0, max).toString().padStart(OTP_LENGTH, "0");
  return code;
}

export function generateSessionToken(): string {
  return randomBytes(32).toString("hex");
}
