import {
  createDefaultChoiceOptions,
  createFieldId,
  createFieldRef,
  createFormPage,
  DEFAULT_MULTI_SELECT_SETTINGS,
  slugifyTitle,
  type FieldSchema,
  type FormDocument,
  type FormFieldType,
} from "@repo/form-schema";

import { ensureUniqueSlug } from "./storage";

export function createEmptyDocument(title: string, id?: string): FormDocument {
  const formId = id ?? createFieldId();
  const slug = ensureUniqueSlug(slugifyTitle(title), formId);
  const defaultPage = createFormPage("Page 1");

  return {
    id: formId,
    slug,
    title,
    status: "draft",
    visibility: "unlisted",
    presentationMode: "classic",
    theme: { preset: "default" },
    fields: [],
    settings: {
      thankYouMessage: "Thanks for your response!",
      submitButtonLabel: "Submit",
      pages: [defaultPage],
    },
    updatedAt: new Date().toISOString(),
  };
}

export function createFieldFromType(
  type: FormFieldType,
  label: string,
  overrides?: Partial<FieldSchema>,
): FieldSchema {
  const field: FieldSchema = {
    id: createFieldId(),
    ref: createFieldRef(label),
    type,
    label,
    colSpan: 12,
    required: false,
    visibility: "show",
    ...overrides,
  };

  if (type === "single_select" || type === "multi_select") {
    field.options = overrides?.options ?? createDefaultChoiceOptions(3);
    if (type === "single_select" && !field.choicePresentation) {
      field.choicePresentation = "dropdown";
    }
    if (type === "single_select" && !field.placeholder) {
      field.placeholder = "-Select-";
    }
    if (type === "multi_select") {
      if (!field.placeholder) field.placeholder = "Select options";
      field.multiSelectSettings = {
        ...DEFAULT_MULTI_SELECT_SETTINGS,
        ...field.multiSelectSettings,
      };
    }
  }

  if (type === "date" && !field.placeholder) {
    field.placeholder = "DD/MM/YYYY";
  }

  if (type === "checkbox" && !field.placeholder) {
    field.placeholder = "I agree";
  }

  if (!field.placeholder) {
    field.placeholder = `Enter ${label.toLowerCase()}`;
  }

  return field;
}
