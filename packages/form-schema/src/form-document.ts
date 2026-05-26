import { z } from "zod";

import { fieldSchema } from "./field-schema";

export const formStatuses = ["draft", "published", "unpublished"] as const;
export type FormStatus = (typeof formStatuses)[number];

export const formVisibilities = ["public", "unlisted"] as const;
export type FormVisibility = (typeof formVisibilities)[number];

export const presentationModes = ["classic", "stepper"] as const;
export type PresentationMode = (typeof presentationModes)[number];

export const formThemeSchema = z.object({
  preset: z.string(),
  primaryColor: z.string().optional(),
  backgroundColor: z.string().optional(),
});

export const formSettingsSchema = z.object({
  thankYouMessage: z.string().optional(),
  submitButtonLabel: z.string().min(1).optional(),
  closeAt: z.string().optional(),
  responseLimit: z.number().int().positive().optional(),
  notifyCreator: z.boolean().optional(),
  notifyCreatorEmail: z.string().email().optional(),
  notifyRespondent: z.boolean().optional(),
  pages: z
    .array(
      z.object({
        id: z.string().uuid(),
        title: z.string().min(1),
      }),
    )
    .optional(),
});

export const formDocumentSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(formStatuses).default("draft"),
  visibility: z.enum(formVisibilities).default("unlisted"),
  presentationMode: z.enum(presentationModes).default("classic"),
  theme: formThemeSchema,
  fields: z.array(fieldSchema),
  settings: formSettingsSchema.optional(),
  logic: z.array(z.unknown()).optional(),
  updatedAt: z.string().datetime(),
});

export type FormDocument = z.infer<typeof formDocumentSchema>;

export type FormListItem = {
  id: string;
  slug: string;
  title: string;
  fieldCount: number;
  responseCount: number;
  status: FormStatus;
  visibility: FormVisibility;
  updatedAt: string;
};

export type ExploreListItem = FormListItem & {
  creatorName: string;
};

export function getSubmitButtonLabel(document: FormDocument, fallback = "Submit"): string {
  const custom = document.settings?.submitButtonLabel?.trim();
  return custom && custom.length > 0 ? custom : fallback;
}

export function slugifyTitle(title: string) {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return base || "untitled-form";
}
