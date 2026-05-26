import { buildZodRuleForField, type FieldSchema } from "@repo/form-schema";

import { createFieldFromType } from "~/lib/forms/create-document";
import type { FieldMeta } from "~/lib/forms/registry/types";

export const longTextFieldMeta: FieldMeta = {
  type: "long_text",
  label: "Long text",
  libraryItemId: "multi-line",
  defaultSchema: () =>
    createFieldFromType("long_text", "Long answer", { placeholder: "Write your answer" }),
  propertyKeys: [
    "label",
    "hideLabel",
    "instructions",
    "colSpan",
    "placeholder",
    "charLimit",
    "required",
    "visibility",
  ],
  buildZodRule: (field: FieldSchema) => buildZodRuleForField(field),
};
