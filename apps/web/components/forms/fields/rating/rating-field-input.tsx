"use client";

import { IconStar } from "@tabler/icons-react";

import type { FieldComponentProps } from "~/lib/forms/registry/types";
import { cn } from "~/lib/utils";

import { FieldShell } from "../shared/field-shell";
import { useBuilderPreview } from "../shared/use-builder-preview";

export function RatingFieldInput({
  schema,
  mode,
  value,
  onChange,
  disabled,
  error,
}: FieldComponentProps) {
  const isBuilder = useBuilderPreview(mode);
  const rating = typeof value === "number" ? value : 0;

  return (
    <FieldShell schema={schema} error={error}>
      <div className={cn("flex gap-1", isBuilder && "pointer-events-none")}>
        {Array.from({ length: 5 }).map((_, index) => {
          const star = index + 1;
          const filled = !isBuilder && star <= rating;

          if (isBuilder) {
            return (
              <span key={star} className="rounded p-0.5" aria-hidden>
                <IconStar
                  className="size-6 text-muted-foreground/35"
                  stroke={1.5}
                />
              </span>
            );
          }

          return (
            <button
              key={star}
              type="button"
              disabled={disabled}
              className="rounded p-0.5 transition-colors hover:bg-muted disabled:pointer-events-none"
              onClick={() => onChange?.(star)}
              aria-label={`Rate ${star} out of 5`}
            >
              <IconStar
                className={cn(
                  "size-6",
                  filled ? "fill-primary text-primary" : "text-muted-foreground/40",
                )}
                stroke={1.5}
              />
            </button>
          );
        })}
      </div>
    </FieldShell>
  );
}
