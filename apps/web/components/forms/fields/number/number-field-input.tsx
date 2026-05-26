"use client";

import { Input } from "~/components/ui/input";
import type { FieldComponentProps } from "~/lib/forms/registry/types";

import { BuilderCanvasInput } from "../shared/builder-canvas-input";
import { FieldShell } from "../shared/field-shell";
import { useBuilderPreview } from "../shared/use-builder-preview";

export function NumberFieldInput({
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
        <BuilderCanvasInput schema={schema} placeholder={schema.placeholder} fallback="0" />
      </FieldShell>
    );
  }

  return (
    <FieldShell schema={schema} error={error}>
      <Input
        type="number"
        value={value === undefined || value === "" ? "" : String(value)}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        placeholder={schema.placeholder}
        aria-invalid={!!error}
        className="w-full bg-background shadow-xs"
      />
    </FieldShell>
  );
}
