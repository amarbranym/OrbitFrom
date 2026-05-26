"use client";

import { Textarea } from "~/components/ui/textarea";
import type { FieldComponentProps } from "~/lib/forms/registry/types";

import { BuilderCanvasInput } from "../shared/builder-canvas-input";
import { getFieldInputConstraints } from "../shared/field-input-constraints";
import { FieldShell } from "../shared/field-shell";
import { useBuilderPreview } from "../shared/use-builder-preview";

export function LongTextFieldInput({
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
          fallback="Write your answer"
          multiline
        />
      </FieldShell>
    );
  }

  const constraints = getFieldInputConstraints(schema);

  return (
    <FieldShell schema={schema} error={error}>
      <Textarea
        value={String(value ?? "")}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        placeholder={schema.placeholder}
        aria-invalid={!!error}
        className="min-h-24 w-full resize-none bg-background shadow-xs"
        {...constraints}
      />
    </FieldShell>
  );
}
