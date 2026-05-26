import { buildZodRuleForField, type FieldSchema } from "@repo/form-schema";

import { createFieldFromType } from "~/lib/forms/create-document";
import type { FieldMeta } from "~/lib/forms/registry/types";

export const checkboxFieldMeta: FieldMeta = {
  type: "checkbox",
  label: "Checkbox",
  libraryItemId: "checkbox",
  defaultSchema: () =>
    createFieldFromType("checkbox", "Checkbox", { placeholder: "I agree" }),
  propertyKeys: ["label", "instructions", "colSpan", "placeholder", "required", "visibility"],
  buildZodRule: (field: FieldSchema) => buildZodRuleForField(field),
};
