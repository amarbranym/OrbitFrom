import { buildZodRuleForField, type FieldSchema } from "@repo/form-schema";

import { createFieldFromType } from "~/lib/forms/create-document";
import type { FieldMeta } from "~/lib/forms/registry/types";

export const textFieldMeta: FieldMeta = {
  type: "text",
  label: "Short text",
  libraryItemId: "single-line",
  defaultSchema: () => createFieldFromType("text", "Short answer"),
  propertyKeys: [
    "label",
    "hideLabel",
    "instructions",
    "colSpan",
    "placeholder",
    "hoverText",
    "initialValue",
    "charLimit",
    "required",
    "visibility",
  ],
  buildZodRule: (field: FieldSchema) => buildZodRuleForField(field),
};
