import {
  formDocumentSchema,
  formSubmissionSchema,
} from "@repo/form-schema";
import { z } from "zod";
import type { IncomingMessage } from "node:http";

import { publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { getClientIp } from "../../utils/client-ip";
import {
  formService,
  notificationService,
  submissionService,
} from "../../services";

const TAGS = ["Public Forms"];
const getPath = generatePath("/public/forms");

const exploreListItemSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  title: z.string(),
  creatorName: z.string(),
  fieldCount: z.number().int(),
  responseCount: z.number().int(),
  status: z.enum(["draft", "published", "unpublished"]),
  visibility: z.enum(["public", "unlisted"]),
  updatedAt: z.string().datetime(),
});

const publicFormOutputSchema = z.object({
  document: formDocumentSchema.nullable(),
  access: z.object({
    allowed: z.boolean(),
    reason: z.string(),
    canSubmit: z.boolean(),
    showInExplore: z.boolean(),
  }),
});

export const publicFormsRouter = router({
  listExplore: publicProcedure
    .meta({ openapi: { method: "GET", path: getPath("/explore"), tags: TAGS } })
    .input(z.object({}).optional())
    .output(z.array(exploreListItemSchema))
    .query(() => formService.listExplore()),

  getBySlug: publicProcedure
    .meta({ openapi: { method: "GET", path: getPath("/{slug}"), tags: TAGS } })
    .input(z.object({ slug: z.string().min(1) }))
    .output(publicFormOutputSchema)
    .query(({ input }) => formService.getPublicFormView(input.slug)),

  submit: publicProcedure
    .meta({ openapi: { method: "POST", path: getPath("/{slug}/submit"), tags: TAGS } })
    .input(
      z.object({
        slug: z.string().min(1),
        answers: z.record(z.string(), z.unknown()),
        honeypot: z.string().optional(),
      }),
    )
    .output(formSubmissionSchema)
    .mutation(async ({ ctx, input }) => {
      const nodeReq = ctx.req as unknown as IncomingMessage;
      const submission = await submissionService.submitBySlug(input.slug, input.answers, {
        ip: getClientIp(nodeReq),
        userAgent:
          typeof nodeReq.headers["user-agent"] === "string"
            ? nodeReq.headers["user-agent"]
            : undefined,
        honeypot: input.honeypot,
      });

      const context = await formService.getNotificationContext(input.slug);
      if (context) {
        const preview = Object.values(submission.answers)
          .slice(0, 2)
          .map(String)
          .join(", ");

        void notificationService.notifyCreatorOfSubmission({
          form: context.document,
          creatorUserId: context.userId,
          submissionPreview: preview || "New response",
        });

        const emailField = context.document.fields.find((f) => f.type === "email");
        const settings = context.document.settings;
        if (settings?.notifyRespondent && emailField) {
          const respondentEmail = submission.answers[emailField.id];
          if (typeof respondentEmail === "string" && respondentEmail.includes("@")) {
            void notificationService.notifyRespondentConfirmation({
              to: respondentEmail,
              formTitle: context.document.title,
              thankYouMessage: settings.thankYouMessage,
            });
          }
        }
      }

      return submission;
    }),
});
