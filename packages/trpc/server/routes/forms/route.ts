import {
  fieldSchema,
  formDocumentSchema,
  formThemeSchema,
  formSettingsSchema,
  formVisibilities,
  presentationModes,
} from "@repo/form-schema";
import { z } from "zod";

import { protectedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import {
  analyticsService,
  formService,
  submissionService,
} from "../../services";

const TAGS = ["Forms"];
const getPath = generatePath("/forms");

const formListItemSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  title: z.string(),
  fieldCount: z.number().int(),
  responseCount: z.number().int(),
  status: z.enum(["draft", "published", "unpublished"]),
  visibility: z.enum(formVisibilities),
  updatedAt: z.string().datetime(),
});

const formUpdateInputSchema = z.object({
  formId: z.string().uuid(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  slug: z.string().min(1).max(120).optional(),
  visibility: z.enum(formVisibilities).optional(),
  presentationMode: z.enum(presentationModes).optional(),
  theme: formThemeSchema.optional(),
  settings: formSettingsSchema.optional(),
  fields: z.array(fieldSchema).optional(),
  logic: z.array(z.unknown()).optional(),
});

const analyticsOutputSchema = z.object({
  totalResponses: z.number().int(),
  responsesLast7Days: z.number().int(),
  responsesLast30Days: z.number().int(),
  dailyCounts: z.array(
    z.object({
      date: z.string(),
      count: z.number().int(),
    }),
  ),
  fieldBreakdowns: z.array(
    z.object({
      fieldId: z.string().uuid(),
      label: z.string(),
      type: z.string(),
      counts: z.record(z.string(), z.number().int()),
    }),
  ),
});

export const formsRouter = router({
  list: protectedProcedure
    .meta({ openapi: { method: "GET", path: getPath("/"), tags: TAGS } })
    .input(
      z
        .object({
          visibility: z.enum(formVisibilities).optional(),
        })
        .optional(),
    )
    .output(z.array(formListItemSchema))
    .query(({ ctx, input }) => formService.listForUser(ctx.user.id, input)),

  getById: protectedProcedure
    .meta({ openapi: { method: "GET", path: getPath("/{formId}"), tags: TAGS } })
    .input(z.object({ formId: z.string().uuid() }))
    .output(formDocumentSchema)
    .query(({ ctx, input }) => formService.getByIdForUser(ctx.user.id, input.formId)),

  create: protectedProcedure
    .meta({ openapi: { method: "POST", path: getPath("/"), tags: TAGS } })
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        fields: z.array(fieldSchema).optional(),
        theme: formThemeSchema.optional(),
        visibility: z.enum(formVisibilities).optional(),
        slug: z.string().optional(),
      }),
    )
    .output(formDocumentSchema)
    .mutation(({ ctx, input }) => formService.create(ctx.user.id, input)),

  update: protectedProcedure
    .meta({ openapi: { method: "PATCH", path: getPath("/{formId}"), tags: TAGS } })
    .input(formUpdateInputSchema)
    .output(formDocumentSchema)
    .mutation(({ ctx, input }) => {
      const { formId, ...patch } = input;
      return formService.update(ctx.user.id, formId, patch);
    }),

  delete: protectedProcedure
    .meta({ openapi: { method: "DELETE", path: getPath("/{formId}"), tags: TAGS } })
    .input(z.object({ formId: z.string().uuid() }))
    .output(z.object({ success: z.literal(true) }))
    .mutation(async ({ ctx, input }) => {
      await formService.delete(ctx.user.id, input.formId);
      return { success: true as const };
    }),

  publish: protectedProcedure
    .meta({ openapi: { method: "POST", path: getPath("/{formId}/publish"), tags: TAGS } })
    .input(z.object({ formId: z.string().uuid() }))
    .output(formDocumentSchema)
    .mutation(({ ctx, input }) => formService.publish(ctx.user.id, input.formId)),

  unpublish: protectedProcedure
    .meta({ openapi: { method: "POST", path: getPath("/{formId}/unpublish"), tags: TAGS } })
    .input(z.object({ formId: z.string().uuid() }))
    .output(formDocumentSchema)
    .mutation(({ ctx, input }) => formService.unpublish(ctx.user.id, input.formId)),

  duplicate: protectedProcedure
    .meta({ openapi: { method: "POST", path: getPath("/{formId}/duplicate"), tags: TAGS } })
    .input(z.object({ formId: z.string().uuid() }))
    .output(formDocumentSchema)
    .mutation(({ ctx, input }) => formService.duplicate(ctx.user.id, input.formId)),

  archive: protectedProcedure
    .meta({ openapi: { method: "POST", path: getPath("/{formId}/archive"), tags: TAGS } })
    .input(z.object({ formId: z.string().uuid() }))
    .output(formDocumentSchema)
    .mutation(({ ctx, input }) => formService.archive(ctx.user.id, input.formId)),

  checkSlug: protectedProcedure
    .meta({ openapi: { method: "GET", path: getPath("/check-slug"), tags: TAGS } })
    .input(
      z.object({
        slug: z.string().min(1),
        excludeFormId: z.string().uuid().optional(),
      }),
    )
    .output(z.object({ available: z.boolean() }))
    .query(({ input }) =>
      formService.slugAvailable(input.slug, input.excludeFormId).then((available) => ({
        available,
      })),
    ),

  listSubmissions: protectedProcedure
    .meta({
      openapi: { method: "GET", path: getPath("/{formId}/submissions"), tags: TAGS },
    })
    .input(
      z.object({
        formId: z.string().uuid(),
        cursor: z.string().datetime().optional(),
        limit: z.number().int().min(1).max(100).optional(),
      }),
    )
    .output(
      z.object({
        items: z.array(
          z.object({
            id: z.string().uuid(),
            formId: z.string().uuid(),
            submittedAt: z.string().datetime(),
            answers: z.record(z.string(), z.unknown()),
          }),
        ),
        nextCursor: z.string().datetime().nullable(),
      }),
    )
    .query(({ ctx, input }) =>
      submissionService.listForForm(ctx.user.id, input.formId, {
        cursor: input.cursor,
        limit: input.limit,
      }),
    ),

  getAnalytics: protectedProcedure
    .meta({ openapi: { method: "GET", path: getPath("/{formId}/analytics"), tags: TAGS } })
    .input(z.object({ formId: z.string().uuid() }))
    .output(analyticsOutputSchema)
    .query(({ ctx, input }) => analyticsService.getForForm(ctx.user.id, input.formId)),

  exportSubmissionsCsv: protectedProcedure
    .meta({
      openapi: { method: "GET", path: getPath("/{formId}/submissions/export"), tags: TAGS },
    })
    .input(z.object({ formId: z.string().uuid() }))
    .output(z.object({ csv: z.string() }))
    .query(({ ctx, input }) =>
      submissionService.exportCsv(ctx.user.id, input.formId).then((csv) => ({ csv })),
    ),
});
