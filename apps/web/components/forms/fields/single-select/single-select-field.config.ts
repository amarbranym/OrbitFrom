import { buildZodRuleForField, type FieldSchema } from "@repo/form-schema";

import { createFieldFromType } from "~/lib/forms/create-document";
import type { FieldMeta } from "~/lib/forms/registry/types";

export const singleSelectFieldMeta: FieldMeta = {
  type: "single_select",
  label: "Dropdown",
  libraryItemId: "dropdown",
  defaultSchema: () =>
    createFieldFromType("single_select", "Dropdown", {
      choicePresentation: "dropdown",
      placeholder: "-Select-",
    }),
  propertyKeys: [
    "label",
    "hideLabel",
    "instructions",
    "colSpan",
    "placeholder",
    "choicePresentation",
    "options",
    "required",
    "visibility",
  ],
  buildZodRule: (field: FieldSchema) => buildZodRuleForField(field),
};
