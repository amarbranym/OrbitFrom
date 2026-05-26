import { createFieldId } from "./field-schema";
import type { FieldOption } from "./field-schema";

const DEFAULT_LABELS = ["First choice", "Second choice", "Third choice"] as const;

export function createDefaultChoiceOptions(count = 3): FieldOption[] {
  return Array.from({ length: count }, (_, index) => ({
    id: createFieldId(),
    label: DEFAULT_LABELS[index] ?? `Choice ${index + 1}`,
  }));
}

export function getChoiceOptions(field: {
  options?: FieldOption[];
  allowOther?: boolean;
}): FieldOption[] {
  const base = field.options?.length ? field.options : createDefaultChoiceOptions();
  const withoutOther = base.filter((option) => !option.isOther);
  if (!field.allowOther) return withoutOther;
  const other = base.find((option) => option.isOther);
  return [
    ...withoutOther,
    other ?? { id: createFieldId(), label: "Other", isOther: true },
  ];
}

export function stripOtherOption(options: FieldOption[]): FieldOption[] {
  return options.filter((option) => !option.isOther);
}
