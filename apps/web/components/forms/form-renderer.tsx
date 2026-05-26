"use client";

import { getColSpanClass, getColSpanStyle, type FieldSchema } from "@repo/form-schema";
import { memo } from "react";
import type { Control } from "react-hook-form";

import { FormField as RHFFormField, FormItem } from "~/components/ui/form";
import { getFieldComponent } from "~/lib/forms/registry/field-registry";
import type { FieldRenderMode } from "~/lib/forms/registry/types";
import { cn } from "~/lib/utils";

type FormRendererProps = {
  fields: FieldSchema[];
  mode: FieldRenderMode;
  control?: Control<Record<string, unknown>>;
  className?: string;
};

type FieldContentProps = {
  schema: FieldSchema;
  mode: FieldRenderMode;
  control?: Control<Record<string, unknown>>;
};

/** Renders one field input (no grid column wrapper). */
export const FieldContent = memo(function FieldContent({
  schema,
  mode,
  control,
}: FieldContentProps) {
  const Component = getFieldComponent(schema.type);
  if (!Component) return null;

  const disabled = mode === "builder" || schema.visibility === "disable";

  if (mode === "builder" || !control) {
    return <Component schema={schema} mode={mode} disabled={disabled} />;
  }

  return (
    <RHFFormField
      control={control}

      name={schema.id}
      render={({ field, fieldState }) => (
        <FormItem className="w-full">
          <Component
            schema={schema}
            mode="live"
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            disabled={disabled}
            error={fieldState.error?.message}
          />
        </FormItem>
      )}
    />
  );
});

type FieldRendererProps = FieldContentProps;

const FieldRenderer = memo(function FieldRenderer({
  schema,
  mode,
  control,
}: FieldRendererProps) {
  const colSpan = schema.colSpan ?? 12;

  return (
    <div
      style={getColSpanStyle(colSpan)}
      className={cn("min-w-0 ", getColSpanClass(colSpan))}
    >
      <FieldContent schema={schema} mode={mode} control={control} />
    </div>
  );
});

export function FormRenderer({ fields, mode, control, className }: FormRendererProps) {
  const visibleFields =
    mode === "builder"
      ? fields
      : fields.filter((field) => field.visibility !== "hide");

  return (
    <div className={cn("grid w-full grid-cols-12 gap-4", className)}>
      {visibleFields.map((schema) => (
        <FieldRenderer key={schema.id} schema={schema} mode={mode} control={control} />
      ))}
    </div>
  );
}
