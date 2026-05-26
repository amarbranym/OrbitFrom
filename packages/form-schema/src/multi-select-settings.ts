import type { FieldSchema } from "./field-schema";

export type MultiSelectSettings = {
  /** Max badges shown before "+N more" summary */
  maxCount?: number;
  /** Show search box in the dropdown */
  searchable?: boolean;
  /** Hide "Select all" in the dropdown */
  hideSelectAll?: boolean;
  /** Keep selected badges on one scrollable line */
  singleLine?: boolean;
  /** Close dropdown after each selection */
  closeOnSelect?: boolean;
  /** Minimum options respondents must pick */
  minSelections?: number;
  /** Maximum options respondents can pick */
  maxSelections?: number;
};

export const DEFAULT_MULTI_SELECT_SETTINGS: Required<
  Pick<
    MultiSelectSettings,
    "maxCount" | "searchable" | "hideSelectAll" | "singleLine" | "closeOnSelect"
  >
> = {
  maxCount: 3,
  searchable: true,
  hideSelectAll: false,
  singleLine: false,
  closeOnSelect: false,
};

export function getMultiSelectSettings(
  field: Pick<FieldSchema, "multiSelectSettings">,
): MultiSelectSettings & typeof DEFAULT_MULTI_SELECT_SETTINGS {
  return {
    ...DEFAULT_MULTI_SELECT_SETTINGS,
    ...field.multiSelectSettings,
  };
}
