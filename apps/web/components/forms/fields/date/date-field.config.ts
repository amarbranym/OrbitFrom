import { buildZodRuleForField, type FieldSchema } from "@repo/form-schema";

import { createFieldFromType } from "~/lib/forms/create-document";
import type { FieldMeta } from "~/lib/forms/registry/types";

export const dateFieldMeta: FieldMeta = {
  type: "date",
  label: "Date",
  libraryItemId: "date",
  defaultSchema: () => createFieldFromType("date", "Date"),
  propertyKeys: [
    "label",
    "hideLabel",
    "instructions",
    "colSpan",
    "required",
    "visibility",
  ],
  buildZodRule: (field: FieldSchema) => buildZodRuleForField(field),
};
