"use client";

import { getChoiceOptions, getMultiSelectSettings } from "@repo/form-schema";
import { useEffect, useMemo, useRef } from "react";

import { Input } from "~/components/ui/input";
import { MultiSelect, type MultiSelectRef } from "~/components/ui/multi-select";
import type { FieldComponentProps } from "~/lib/forms/registry/types";
import { cn } from "~/lib/utils";

import { mapChoiceOptionsToMultiSelect } from "../shared/map-choice-options";
import { FieldShell } from "../shared/field-shell";
import { useBuilderPreview } from "../shared/use-builder-preview";

export function MultiSelectFieldInput({
  schema,
  mode,
  value,
  onChange,
  onBlur,
  disabled,
  error,
}: FieldComponentProps) {
  const options = useMemo(
    () => getChoiceOptions(schema),
    [schema.options, schema.allowOther],
  );
  const settings = useMemo(() => getMultiSelectSettings(schema), [schema.multiSelectSettings]);
  const selected = Array.isArray(value) ? (value as string[]) : [];
  const isBuilder = useBuilderPreview(mode);
  const otherOption = options.find((option) => option.isOther);
  const otherSelected = otherOption ? selected.includes(otherOption.id) : false;

  const multiSelectOptions = useMemo(
    () => mapChoiceOptionsToMultiSelect(options),
    [options],
  );

  const multiSelectRef = useRef<MultiSelectRef>(null);

  useEffect(() => {
    if (isBuilder) return;
    const current = multiSelectRef.current?.getSelectedValues() ?? [];
    const same =
      current.length === selected.length &&
      current.every((id) => selected.includes(id));
    if (!same) {
      multiSelectRef.current?.setSelectedValues(selected);
    }
  }, [selected, isBuilder]);

  const placeholder = schema.placeholder?.trim() || "Select options";
  const hasError = Boolean(error);

  const handleValueChange = (next: string[]) => {
    if (isBuilder) return;

    let trimmed = next;
    if (settings.maxSelections != null && trimmed.length > settings.maxSelections) {
      trimmed = trimmed.slice(0, settings.maxSelections);
    }

    onChange?.(trimmed);
    onBlur?.();
  };

  return (
    <FieldShell schema={schema} error={error}>
      <div className="space-y-2">
        <MultiSelect
          ref={multiSelectRef}
          options={multiSelectOptions}
          defaultValue={selected}
          onValueChange={handleValueChange}
          disabled={disabled || isBuilder}
          placeholder={placeholder}
          className={cn(
            "w-full min-h-9 border-input bg-background px-3 py-2 text-sm shadow-xs",
            "hover:bg-muted/40 data-[placeholder]:text-muted-foreground",
            hasError && "border-destructive ring-2 ring-destructive/20",
          )}
          maxWidth="100%"
          popoverClassName="z-200 w-[var(--radix-popover-trigger-width)] min-w-[16rem]"
          maxCount={settings.maxCount}
          searchable={settings.searchable}
          hideSelectAll={settings.hideSelectAll || options.length <= 1}
          singleLine={settings.singleLine}
          closeOnSelect={settings.closeOnSelect}
          resetOnDefaultValueChange
          aria-invalid={hasError}
          emptyIndicator={
            <p className="px-2 py-4 text-center text-sm text-muted-foreground">
              No choices configured.
            </p>
          }
        />
        {otherOption && otherSelected && !isBuilder ? (
          <Input
            className="max-w-md bg-background shadow-xs"
            placeholder="Please specify"
            disabled={disabled}
            aria-label="Other option details"
          />
        ) : null}
        {options.length === 0 ? (
          <p className="text-sm text-muted-foreground">Add choices in field properties.</p>
        ) : null}
      </div>
    </FieldShell>
  );
}
