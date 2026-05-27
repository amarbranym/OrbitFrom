import {
  loginEmailSchema,
  resendOtpSchema,
  sessionUserSchema,
  signupEmailSchema,
  verifyOtpSchema,
} from "@repo/auth/schemas";
import type { ServerResponse } from "node:http";

import { z, zodUndefinedModel } from "../../schema";
import { authService, userService } from "../../services";
import { getAuthenticationMethodOutputSchema } from "@repo/services/user/model";
import { authProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";

const TAGS = ["Authentication"];
const getPath = generatePath("/authentication");

const otpSentSchema = z.object({
  success: z.literal(true),
  expiresAt: z.string().datetime(),
});

export const authRouter = router({
  getSupportedAuthenticationProviders: publicProcedure
    .meta({ openapi: { method: "GET", path: getPath("/supported-providers"), tags: TAGS } })
    .input(zodUndefinedModel)
    .output(z.readonly(z.array(getAuthenticationMethodOutputSchema)))
    .query(async () => userService.getAuthenticationMethods()),

  getSession: publicProcedure
    .meta({ openapi: { method: "GET", path: getPath("/session"), tags: TAGS } })
    .input(zodUndefinedModel)
    .output(
      z.object({
        user: sessionUserSchema.nullable(),
      }),
    )
    .query(({ ctx }) => ({
      user: ctx.user,
    })),

  sendSignupOtp: authProcedure
    .meta({ openapi: { method: "POST", path: getPath("/signup/send-otp"), tags: TAGS } })
    .input(signupEmailSchema)
    .output(otpSentSchema)
    .mutation(async ({ input }) => {
      const result = await authService.sendSignupOtp(input);
      return {
        success: true as const,
        expiresAt: result.expiresAt.toISOString(),
      };
    }),

  sendLoginOtp: authProcedure
    .meta({ openapi: { method: "POST", path: getPath("/login/send-otp"), tags: TAGS } })
    .input(loginEmailSchema)
    .output(otpSentSchema)
    .mutation(async ({ input }) => {
      const result = await authService.sendLoginOtp(input);
      return {
        success: true as const,
        expiresAt: result.expiresAt.toISOString(),
      };
    }),

  resendOtp: authProcedure
    .meta({ openapi: { method: "POST", path: getPath("/otp/resend"), tags: TAGS } })
    .input(resendOtpSchema)
    .output(otpSentSchema)
    .mutation(async ({ input }) => {
      const result = await authService.resendOtp(input);
      return {
        success: true as const,
        expiresAt: result.expiresAt.toISOString(),
      };
    }),

  verifySignupOtp: authProcedure
    .meta({ openapi: { method: "POST", path: getPath("/signup/verify-otp"), tags: TAGS } })
    .input(verifyOtpSchema)
    .output(z.object({ user: sessionUserSchema }))
    .mutation(({ input, ctx }) =>
      authService.verifySignupOtp(input, ctx.res as unknown as ServerResponse),
    ),

  verifyLoginOtp: authProcedure
    .meta({ openapi: { method: "POST", path: getPath("/login/verify-otp"), tags: TAGS } })
    .input(verifyOtpSchema)
    .output(z.object({ user: sessionUserSchema }))
    .mutation(({ input, ctx }) =>
      authService.verifyLoginOtp(input, ctx.res as unknown as ServerResponse),
    ),

  signOut: authProcedure
    .meta({ openapi: { method: "POST", path: getPath("/sign-out"), tags: TAGS } })
    .input(zodUndefinedModel)
    .output(z.object({ success: z.literal(true) }))
    .mutation(({ ctx }) =>
      authService.signOut(
        ctx.req as unknown as import("node:http").IncomingMessage,
        ctx.res as unknown as ServerResponse,
      ),
    ),
});
