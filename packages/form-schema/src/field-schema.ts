import { z } from "zod";

export const formFieldTypes = [
  "text",
  "long_text",
  "email",
  "number",
  "single_select",
  "multi_select",
  "checkbox",
  "rating",
  "date",
] as const;

export type FormFieldType = (typeof formFieldTypes)[number];

export const fieldVisibilityModes = ["show", "hide", "disable"] as const;
export type FieldVisibility = (typeof fieldVisibilityModes)[number];

export const fieldSchema = z.object({
  id: z.string().uuid(),
  ref: z
    .string()
    .regex(/^[a-zA-Z0-9_-]+$/)
    .optional(),
  type: z.enum(formFieldTypes),
  label: z.string().min(1),
  hideLabel: z.boolean().optional(),
  instructions: z.string().optional(),
  colSpan: z.number().int().min(1).max(12).default(12),
  pageId: z.string().uuid().optional(),
  placeholder: z.string().optional(),
  hoverText: z.string().optional(),
  initialValue: z.unknown().optional(),
  required: z.boolean().default(false),
  noDuplicates: z.boolean().optional(),
  visibility: z.enum(fieldVisibilityModes).default("show"),
  charLimit: z
    .object({
      min: z.number().int().min(0).optional(),
      max: z.number().int().positive().optional(),
      restrictOnReach: z.boolean().optional(),
    })
    .optional(),
  choicePresentation: z.enum(["dropdown", "radio"]).optional(),
  allowOther: z.boolean().optional(),
  multiSelectSettings: z
    .object({
      maxCount: z.number().int().min(1).max(10).optional(),
      searchable: z.boolean().optional(),
      hideSelectAll: z.boolean().optional(),
      singleLine: z.boolean().optional(),
      closeOnSelect: z.boolean().optional(),
      minSelections: z.number().int().min(0).optional(),
      maxSelections: z.number().int().min(1).optional(),
    })
    .optional(),
  options: z
    .array(
      z.object({
        id: z.string(),
        label: z.string().min(1),
        isOther: z.boolean().optional(),
      }),
    )
    .optional(),
});

export type FieldSchema = z.infer<typeof fieldSchema>;

export type FieldOption = NonNullable<FieldSchema["options"]>[number];

export function createFieldId() {
  return crypto.randomUUID();
}

export function createFieldRef(label: string) {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 48) || "field";
}
