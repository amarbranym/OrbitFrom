"use client";

import type { FieldSchema } from "@repo/form-schema";
import {
  Icon123,
  IconCalendar,
  IconForms,
  IconMail,
  IconPhone,
  IconTypography,
  IconWorld,
} from "@tabler/icons-react";
import type { ComponentType } from "react";

import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";

type BuilderCanvasInputProps = {
  schema: FieldSchema;
  placeholder?: string;
  fallback?: string;
  multiline?: boolean;
};

function resolveBuilderIcon(schema: FieldSchema): ComponentType<{ className?: string }> | null {
  if (schema.type === "email") return IconMail;
  if (schema.ref === "phone") return IconPhone;
  if (schema.ref === "website") return IconWorld;
  if (schema.ref === "name") return IconForms;
  if (schema.type === "number") return Icon123;
  if (schema.type === "date") return IconCalendar;
  if (schema.type === "long_text") return IconTypography;
  if (schema.type === "text") return IconTypography;
  return null;
}

export function BuilderCanvasInput({
  schema,
  placeholder,
  fallback = "Enter value",
  multiline = false,
}: BuilderCanvasInputProps) {
  const Icon = resolveBuilderIcon(schema);
  const displayPlaceholder = placeholder?.trim() || fallback;

  if (multiline) {
    return (
      <div className="pointer-events-none w-full">
        <Textarea
          readOnly
          tabIndex={-1}
          value=""
          placeholder={displayPlaceholder}
          className="min-h-24 w-full resize-none bg-background shadow-xs"
        />
      </div>
    );
  }

  return (
    <div className="pointer-events-none relative w-full">
      {Icon ? (
        <Icon
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          stroke={1.5}
          aria-hidden
        />
      ) : null}
      <Input
        readOnly
        tabIndex={-1}
        value=""
        placeholder={displayPlaceholder}
        className={cn("w-full bg-background shadow-xs", Icon && "pl-9")}
      />
    </div>
  );
}
