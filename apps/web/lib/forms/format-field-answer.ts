import type { FieldSchema } from "@repo/form-schema";
import { getChoiceOptions } from "@repo/form-schema";

export function formatFieldAnswer(field: FieldSchema, value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  switch (field.type) {
    case "checkbox":
      return value === true ? "Yes" : "No";
    case "multi_select": {
      const selected = Array.isArray(value) ? value.map(String) : [];
      if (selected.length === 0) return "—";
      const labels = getChoiceOptions(field)
        .filter((opt) => selected.includes(opt.id))
        .map((opt) => opt.label);
      return labels.length > 0 ? labels.join(", ") : selected.join(", ");
    }
    case "single_select": {
      const option = getChoiceOptions(field).find((opt) => opt.id === String(value));
      return option?.label ?? String(value);
    }
    case "rating":
      return `${value} / 5`;
    case "date":
      try {
        return new Date(String(value)).toLocaleDateString(undefined, {
          dateStyle: "medium",
        });
      } catch {
        return String(value);
      }
    default:
      return String(value);
  }
}
