"use client";

import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import type { FieldComponentProps } from "~/lib/forms/registry/types";
import { cn } from "~/lib/utils";

import { FieldShell } from "../shared/field-shell";
import { useBuilderPreview } from "../shared/use-builder-preview";

export function CheckboxFieldInput({
  schema,
  mode,
  value,
  onChange,
  disabled,
  error,
}: FieldComponentProps) {
  const isBuilder = useBuilderPreview(mode);
  const caption = schema.placeholder?.trim() || "I agree";

  return (
    <FieldShell schema={schema} error={error}>
      <div
        className={cn(
          "flex items-center gap-2.5 rounded-md  px-3 py-2.5 ",
          isBuilder && "pointer-events-none",
        )}
      >
        <Checkbox
          id={schema.id}
          checked={isBuilder ? false : value === true}
          disabled={disabled && !isBuilder}
          onCheckedChange={(v) => onChange?.(v === true)}
        />
        <Label htmlFor={schema.id} className="font-normal text-foreground">
          {caption}
        </Label>
      </div>
    </FieldShell>
  );
}
