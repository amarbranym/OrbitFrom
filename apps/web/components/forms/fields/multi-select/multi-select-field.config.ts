import { buildZodRuleForField, type FieldSchema } from "@repo/form-schema";

import { createFieldFromType } from "~/lib/forms/create-document";
import type { FieldMeta } from "~/lib/forms/registry/types";

export const multiSelectFieldMeta: FieldMeta = {
  type: "multi_select",
  label: "Multi select",
  libraryItemId: "multi-select",
  defaultSchema: () =>
    createFieldFromType("multi_select", "Multi Select", {
      placeholder: "Select options",
    }),
  propertyKeys: [
    "label",
    "hideLabel",
    "instructions",
    "colSpan",
    "placeholder",
    "options",
    "multiSelectSettings",
    "required",
    "visibility",
  ],
  buildZodRule: (field: FieldSchema) => buildZodRuleForField(field),
};
