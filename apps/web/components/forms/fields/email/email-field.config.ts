import { buildZodRuleForField, type FieldSchema } from "@repo/form-schema";

import { createFieldFromType } from "~/lib/forms/create-document";
import type { FieldMeta } from "~/lib/forms/registry/types";

export const emailFieldMeta: FieldMeta = {
  type: "email",
  label: "Email",
  libraryItemId: "email",
  defaultSchema: () =>
    createFieldFromType("email", "Email", { placeholder: "name@example.com" }),
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
