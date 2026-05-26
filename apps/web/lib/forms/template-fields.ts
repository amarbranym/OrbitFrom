import {
  createDefaultChoiceOptions,
  createFieldId,
  createFieldRef,
  type FieldSchema,
  type FormFieldType,
} from "@repo/form-schema";

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

const templateFieldMap: Record<string, FieldSchema[]> = {
  "contact-us": [
    field("text", "Full name", { required: true, colSpan: 6 }),
    field("email", "Email", { required: true, colSpan: 6 }),
    field("long_text", "Message", { required: true }),
  ],
  "email-subscription": [
    field("text", "Name", { colSpan: 6 }),
    field("email", "Email", { required: true, colSpan: 6 }),
  ],
  "customer-feedback": [
    field("rating", "Overall satisfaction", { required: true }),
    field("long_text", "What can we improve?"),
  ],
  "event-registration": [
    field("text", "Full name", { required: true }),
    field("email", "Email", { required: true, colSpan: 6 }),
    field("date", "Event date", { required: true, colSpan: 6 }),
    field("single_select", "Ticket type", {
      required: true,
      options: createDefaultChoiceOptions(3),
    }),
  ],
  "job-application": [
    field("text", "Full name", { required: true }),
    field("email", "Email", { required: true, colSpan: 6 }),
    field("long_text", "Cover letter"),
    field("single_select", "Role", {
      required: true,
      options: [
        { id: createFieldId(), label: "Engineering" },
        { id: createFieldId(), label: "Design" },
        { id: createFieldId(), label: "Operations" },
      ],
    }),
  ],
};

export function getTemplateFields(templateId: string): FieldSchema[] {
  return templateFieldMap[templateId] ?? [
    field("text", "Name", { required: true }),
    field("email", "Email", { required: true }),
  ];
}
