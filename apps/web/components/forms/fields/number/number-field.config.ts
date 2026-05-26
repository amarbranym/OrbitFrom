import { buildZodRuleForField, type FieldSchema } from "@repo/form-schema";

import { createFieldFromType } from "~/lib/forms/create-document";
import type { FieldMeta } from "~/lib/forms/registry/types";

export const numberFieldMeta: FieldMeta = {
  type: "number",
  label: "Number",
  libraryItemId: "number",
  defaultSchema: () => createFieldFromType("number", "Number"),
  propertyKeys: [
    "label",
    "hideLabel",
    "instructions",
    "colSpan",
    "placeholder",
    "required",
    "visibility",
  ],
  buildZodRule: (field: FieldSchema) => buildZodRuleForField(field),
};
