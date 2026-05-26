"use client";

import type { FieldSchema } from "@repo/form-schema";

import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";

type FieldShellProps = {
  schema: FieldSchema;
  error?: string;
  children: React.ReactNode;
  className?: string;
};

export function FieldShell({ schema, error, children, className }: FieldShellProps) {
  const hasError = Boolean(error);

  return (
    <div className={cn("w-full min-w-0 space-y-1.5", className)}>
      {!schema.hideLabel ? (
        <Label
          className={cn(
            "text-sm font-semibold text-foreground",
            hasError && "text-destructive",
          )}
        >
          {schema.label}
          {schema.required ? <span className="text-destructive"> *</span> : null}
        </Label>
      ) : null}

      <div
        className={cn(
          hasError &&
            "[&_input]:border-destructive [&_input]:ring-2 [&_input]:ring-destructive/20 [&_textarea]:border-destructive [&_textarea]:ring-2 [&_textarea]:ring-destructive/20 [&_[data-slot=select-trigger]]:border-destructive",
        )}
      >
        {children}
      </div>

      {schema.instructions ? (
        <p className="text-xs italic text-muted-foreground">{schema.instructions}</p>
      ) : null}

      {hasError ? (
        <p className="text-sm font-medium text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
