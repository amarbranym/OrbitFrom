import { buildZodRuleForField, type FieldSchema } from "@repo/form-schema";

import { createFieldFromType } from "~/lib/forms/create-document";
import type { FieldMeta } from "~/lib/forms/registry/types";

export const ratingFieldMeta: FieldMeta = {
  type: "rating",
  label: "Rating",
  libraryItemId: "rating",
  defaultSchema: () => createFieldFromType("rating", "Rating"),
  propertyKeys: ["label", "instructions", "colSpan", "required", "visibility"],
  buildZodRule: (field: FieldSchema) => buildZodRuleForField(field),
};
