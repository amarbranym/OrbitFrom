import type { FieldOption } from "@repo/form-schema";

import type { MultiSelectOption } from "~/components/ui/multi-select";

export function mapChoiceOptionsToMultiSelect(options: FieldOption[]): MultiSelectOption[] {
  return options.map((option) => ({
    label: option.label,
    value: option.id,
  }));
}
