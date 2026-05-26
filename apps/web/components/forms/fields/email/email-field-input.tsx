"use client";

import { Input } from "~/components/ui/input";
import type { FieldComponentProps } from "~/lib/forms/registry/types";

import { BuilderCanvasInput } from "../shared/builder-canvas-input";
import { FieldShell } from "../shared/field-shell";
import { useBuilderPreview } from "../shared/use-builder-preview";

export function EmailFieldInput({
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
          fallback="name@example.com"
        />
      </FieldShell>
    );
  }

  return (
    <FieldShell schema={schema} error={error}>
      <Input
        type="email"
        value={String(value ?? "")}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        placeholder={schema.placeholder ?? "name@example.com"}
        aria-invalid={!!error}
        className="w-full bg-background shadow-xs"
      />
    </FieldShell>
  );
}
