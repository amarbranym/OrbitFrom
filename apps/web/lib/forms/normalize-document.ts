import {
  clampColSpan,
  createDefaultChoiceOptions,
  DEFAULT_MULTI_SELECT_SETTINGS,
  ensureFormPages,
  getChoiceOptions,
  stripOtherOption,
  type FieldSchema,
  type FormDocument,
} from "@repo/form-schema";

export function normalizeField(field: FieldSchema): FieldSchema {
  const normalized: FieldSchema = {
    ...field,
    colSpan: clampColSpan(field.colSpan ?? 12),
    visibility: field.visibility ?? "show",
    required: field.required ?? false,
  };

  if (field.type === "single_select" || field.type === "multi_select") {
    if (field.type === "single_select") {
      normalized.choicePresentation = field.choicePresentation ?? "dropdown";
      normalized.placeholder = field.placeholder ?? "-Select-";
    }
    if (field.type === "multi_select") {
      normalized.placeholder = field.placeholder ?? "Select options";
      normalized.multiSelectSettings = {
        ...DEFAULT_MULTI_SELECT_SETTINGS,
        ...field.multiSelectSettings,
      };
    }
    const base = field.options?.length ? field.options : createDefaultChoiceOptions(3);
    normalized.options = field.allowOther
      ? getChoiceOptions({ ...field, options: base })
      : stripOtherOption(base);
  }

  if (field.type === "date") {
    normalized.placeholder = field.placeholder ?? "DD/MM/YYYY";
  }

  if (field.type === "checkbox") {
    normalized.placeholder = field.placeholder ?? "I agree";
  }

  return normalized;
}

export function normalizeDocument(document: FormDocument): FormDocument {
  return ensureFormPages({
    ...document,
    fields: document.fields.map(normalizeField),
  });
}
