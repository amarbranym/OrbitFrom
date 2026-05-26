import type { FieldSchema, FormFieldType } from "@repo/form-schema";
import type { z } from "zod";

export type FieldRenderMode = "builder" | "live";

export type FieldComponentProps = {
  schema: FieldSchema;
  mode: FieldRenderMode;
  value?: unknown;
  onChange?: (value: unknown) => void;
  onBlur?: () => void;
  disabled?: boolean;
  error?: string;
};

export const propertyKeys = [
  "label",
  "hideLabel",
  "instructions",
  "colSpan",
  "placeholder",
  "hoverText",
  "initialValue",
  "charLimit",
  "required",
  "noDuplicates",
  "visibility",
  "options",
  "choicePresentation",
  "multiSelectSettings",
] as const;

export type PropertyKey = (typeof propertyKeys)[number];

export type FieldMeta = {
  type: FormFieldType;
  label: string;
  libraryItemId: string;
  defaultSchema: () => FieldSchema;
  propertyKeys: ReadonlyArray<PropertyKey>;
  buildZodRule: (field: FieldSchema) => z.ZodTypeAny;
};
