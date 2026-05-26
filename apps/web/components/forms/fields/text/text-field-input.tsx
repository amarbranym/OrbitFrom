"use client";

import { Input } from "~/components/ui/input";
import type { FieldComponentProps } from "~/lib/forms/registry/types";

import { BuilderCanvasInput } from "../shared/builder-canvas-input";
import { getFieldInputConstraints } from "../shared/field-input-constraints";
import { FieldShell } from "../shared/field-shell";
import { useBuilderPreview } from "../shared/use-builder-preview";

export function TextFieldInput({
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
        <BuilderCanvasInput schema={schema} placeholder={schema.placeholder} fallback="Enter text" />
      </FieldShell>
    );
  }

  const constraints = getFieldInputConstraints(schema);

  return (
    <FieldShell schema={schema} error={error}>
      <Input
        value={String(value ?? "")}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        placeholder={schema.placeholder}
        title={schema.hoverText}
        aria-invalid={!!error}
        className="w-full bg-background shadow-xs"
        {...constraints}
      />
    </FieldShell>
  );
}
