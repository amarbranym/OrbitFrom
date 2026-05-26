import type { FieldSchema } from "./field-schema";

export function defaultValueForFieldType(field: FieldSchema): unknown {
  switch (field.type) {
    case "multi_select":
      return [];
    case "checkbox":
      return false;
    case "rating":
      return undefined;
    case "number":
      return "";
    default:
      return "";
  }
}

export function buildDefaultValues(fields: FieldSchema[]): Record<string, unknown> {
  const values: Record<string, unknown> = {};

  for (const field of fields) {
    if (field.visibility === "hide") continue;
    values[field.id] =
      field.initialValue !== undefined
        ? field.initialValue
        : defaultValueForFieldType(field);
  }

  return values;
}
