"use client";

import type { FieldComponentProps } from "~/lib/forms/registry/types";

import { BuilderCanvasInput } from "../shared/builder-canvas-input";
import { DatePickerField } from "../shared/date-picker-field";
import { FieldShell } from "../shared/field-shell";
import { useBuilderPreview } from "../shared/use-builder-preview";

export function DateFieldInput({
  schema,
  mode,
  value,
  onChange,
  onBlur,
  disabled,
  error,
}: FieldComponentProps) {
  const isBuilder = useBuilderPreview(mode);

  if (isBuilder) {
    return (
      <FieldShell schema={schema} error={error}>
        <BuilderCanvasInput
          schema={schema}
          placeholder={schema.placeholder}
          fallback="Pick a date"
        />
      </FieldShell>
    );
  }

  return (
    <FieldShell schema={schema} error={error}>
      <DatePickerField
        value={value}
        onChange={(next) => onChange?.(next)}
        onBlur={onBlur}
        disabled={disabled}
        placeholder={schema.placeholder?.trim() || "Pick a date"}
        aria-invalid={!!error}
      />
    </FieldShell>
  );
}
