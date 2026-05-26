import type { FieldSchema } from "@repo/form-schema";

import { createFieldFromType } from "./create-document";
import { getMetaByLibraryItemId } from "./registry/field-registry";

const libraryDefaults: Record<string, { label: string; overrides?: Partial<FieldSchema> }> =
  {
    name: { label: "Name" },
    address: { label: "Address", overrides: { type: "long_text" } },
    phone: { label: "Phone", overrides: { type: "text", placeholder: "+1 (555) 000-0000" } },
    email: { label: "Email", overrides: { type: "email" } },
    website: { label: "Website", overrides: { type: "text", placeholder: "https://" } },
    "single-line": { label: "Single Line" },
    "multi-line": { label: "Long answer", overrides: { type: "long_text" } },
    number: { label: "Number", overrides: { type: "number" } },
    decimal: { label: "Decimal", overrides: { type: "number" } },
    dropdown: {
      label: "Dropdown",
      overrides: {
        type: "single_select",
        choicePresentation: "dropdown",
        placeholder: "-Select-",
      },
    },
    radio: {
      label: "Radio",
      overrides: {
        type: "single_select",
        choicePresentation: "radio",
      },
    },
    "multi-select": { label: "Multi Select", overrides: { type: "multi_select" } },
    checkbox: { label: "Checkbox", overrides: { type: "checkbox", placeholder: "I agree" } },
    rating: { label: "Rating", overrides: { type: "rating" } },
    date: { label: "Date", overrides: { type: "date" } },
    "email-field": { label: "Email", overrides: { type: "email" } },
  };

export function createFieldFromLibraryItem(libraryItemId: string): FieldSchema {
  const meta = getMetaByLibraryItemId(libraryItemId);
  if (meta) return meta.defaultSchema();

  const preset = libraryDefaults[libraryItemId];
  if (preset) {
    const type = preset.overrides?.type ?? "text";
    return createFieldFromType(type, preset.label, preset.overrides);
  }

  return createFieldFromType("text", "Untitled field");
}
