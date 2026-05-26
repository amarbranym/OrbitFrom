import type { FieldSchema } from "@repo/form-schema";

export function getFieldInputConstraints(schema: FieldSchema) {
  const max = schema.charLimit?.max;
  if (max == null || !schema.charLimit?.restrictOnReach) {
    return {};
  }

  return { maxLength: max };
}
