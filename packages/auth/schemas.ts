import { z } from "zod";

import { OTP_LENGTH, OTP_PURPOSES } from "./constants";

const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Enter a valid email address")
  .max(255)
  .transform((value) => value.toLowerCase());

const fullNameSchema = z
  .string()
  .trim()
  .min(2, "Full name must be at least 2 characters")
  .max(80, "Full name must be 80 characters or less");

export const signupEmailSchema = z.object({
  fullName: fullNameSchema,
  email: emailSchema,
});

export const loginEmailSchema = z.object({
  email: emailSchema,
});

export const verifyOtpSchema = z.object({
  email: emailSchema,
  code: z
    .string()
    .trim()
    .length(OTP_LENGTH, `Enter the ${OTP_LENGTH}-digit code`)
    .regex(/^\d+$/, "Code must contain only numbers"),
  purpose: z.enum(OTP_PURPOSES),
  fullName: fullNameSchema.optional(),
});

export const resendOtpSchema = z.object({
  email: emailSchema,
  purpose: z.enum(OTP_PURPOSES),
  fullName: fullNameSchema.optional(),
});

export const sessionUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  fullName: z.string(),
  emailVerified: z.boolean(),
  profileImageUrl: z.string().nullable(),
});

export type SignupEmailInput = z.infer<typeof signupEmailSchema>;
export type LoginEmailInput = z.infer<typeof loginEmailSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type ResendOtpInput = z.infer<typeof resendOtpSchema>;
export type SessionUser = z.infer<typeof sessionUserSchema>;
