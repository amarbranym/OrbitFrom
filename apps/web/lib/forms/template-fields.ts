import {
  createDefaultChoiceOptions,
  createFieldId,
  createFieldRef,
  type FieldSchema,
  type FormFieldType,
} from "@repo/form-schema";

import { formTemplates } from "~/lib/forms/template-gallery-data";

function field(
  type: FormFieldType,
  label: string,
  overrides?: Partial<FieldSchema>,
): FieldSchema {
  return {
    id: createFieldId(),
    ref: createFieldRef(label),
    type,
    label,
    colSpan: 12,
    required: false,
    visibility: "show",
    ...overrides,
  };
}

function choiceOptions(labels: string[]) {
  return labels.map((label) => ({ id: createFieldId(), label }));
}

function cloneTemplateField(fieldValue: FieldSchema): FieldSchema {
  return {
    ...fieldValue,
    id: createFieldId(),
    ref: createFieldRef(fieldValue.label),
    options: fieldValue.options?.map((option) => ({
      ...option,
      id: createFieldId(),
    })),
  };
}

function cloneTemplateFields(fields: FieldSchema[]): FieldSchema[] {
  return fields.map((fieldValue) => cloneTemplateField(fieldValue));
}

const templateFieldMap: Record<string, FieldSchema[]> = {
  "contact-us": [
    field("text", "Full name", { required: true, colSpan: 6 }),
    field("email", "Email", { required: true, colSpan: 6 }),
    field("long_text", "Message", { required: true }),
  ],
  "client-details": [
    field("text", "Full name", { required: true, colSpan: 6 }),
    field("email", "Work email", { required: true, colSpan: 6 }),
    field("text", "Phone", { colSpan: 6 }),
    field("text", "Company", { required: true, colSpan: 6 }),
    field("text", "Job title", { colSpan: 6 }),
    field("text", "Industry", { colSpan: 6 }),
  ],
  "email-subscription": [
    field("text", "Name", { colSpan: 6 }),
    field("email", "Email", { required: true, colSpan: 6 }),
    field("checkbox", "Send me product updates", { required: true }),
  ],
  "software-evaluation": [
    field("rating", "Overall satisfaction", { required: true }),
    field("rating", "Ease of use", { required: true }),
    field("multi_select", "Features you used", {
      options: choiceOptions(["Dashboard", "Reports", "Integrations", "API"]),
    }),
    field("long_text", "What should we improve?"),
  ],
  complaints: [
    field("text", "Subject", { required: true }),
    field("long_text", "Describe your complaint", { required: true }),
    field("single_select", "Priority", {
      required: true,
      options: choiceOptions(["Low", "Medium", "High"]),
    }),
    field("email", "Contact email", { required: true, colSpan: 6 }),
  ],
  "bug-tracker": [
    field("text", "Bug title", { required: true }),
    field("long_text", "Steps to reproduce", { required: true }),
    field("single_select", "Severity", {
      required: true,
      colSpan: 6,
      options: choiceOptions(["Low", "Medium", "High", "Critical"]),
    }),
    field("email", "Reporter email", { required: true, colSpan: 6 }),
  ],
  "order-form": [
    field("single_select", "Product", {
      required: true,
      options: createDefaultChoiceOptions(4),
    }),
    field("number", "Quantity", { required: true, colSpan: 6 }),
    field("email", "Email", { required: true, colSpan: 6 }),
    field("long_text", "Special instructions"),
  ],
  "event-rsvp": [
    field("text", "Full name", { required: true, colSpan: 6 }),
    field("email", "Email", { required: true, colSpan: 6 }),
    field("single_select", "Will you attend?", {
      required: true,
      options: choiceOptions(["Yes", "No", "Maybe"]),
    }),
    field("text", "Dietary requirements"),
    field("number", "Number of guests", { colSpan: 6 }),
  ],
  "lead-capture": [
    field("text", "Full name", { required: true, colSpan: 6 }),
    field("email", "Work email", { required: true, colSpan: 6 }),
    field("text", "Company", { required: true, colSpan: 6 }),
    field("single_select", "Company size", {
      required: true,
      colSpan: 6,
      options: choiceOptions(["1-10", "11-50", "51-200", "200+"]),
    }),
    field("text", "Role"),
  ],
  "support-request": [
    field("text", "Subject", { required: true }),
    field("single_select", "Category", {
      required: true,
      colSpan: 6,
      options: choiceOptions(["Billing", "Technical", "Account", "Other"]),
    }),
    field("single_select", "Priority", {
      required: true,
      colSpan: 6,
      options: choiceOptions(["Low", "Normal", "Urgent"]),
    }),
    field("long_text", "Describe the issue", { required: true }),
    field("email", "Contact email", { required: true }),
  ],
  "membership-signup": [
    field("text", "Full name", { required: true, colSpan: 6 }),
    field("email", "Email", { required: true, colSpan: 6 }),
    field("single_select", "Membership plan", {
      required: true,
      options: choiceOptions(["Basic", "Pro", "Enterprise"]),
    }),
    field("checkbox", "I agree to the terms and conditions", { required: true }),
  ],
  "product-feedback": [
    field("rating", "How satisfied are you?", { required: true }),
    field("long_text", "What do you like most?"),
    field("single_select", "Would you recommend us?", {
      required: true,
      options: choiceOptions(["Definitely", "Probably", "Not sure", "No"]),
    }),
    field("email", "Email (optional)", { colSpan: 6 }),
  ],
};

export type TemplateDefinition = {
  title: string;
  description?: string;
  fields: FieldSchema[];
};

export function getTemplateDefinition(templateId: string): TemplateDefinition {
  const meta = formTemplates.find((template) => template.id === templateId);
  const templateFields = templateFieldMap[templateId];

  return {
    title: meta?.name ?? "Untitled form",
    description: meta?.description,
    fields: templateFields
      ? cloneTemplateFields(templateFields)
      : [
          field("text", "Name", { required: true }),
          field("email", "Email", { required: true }),
        ],
  };
}

export function getTemplateFields(templateId: string): FieldSchema[] {
  return getTemplateDefinition(templateId).fields;
}
