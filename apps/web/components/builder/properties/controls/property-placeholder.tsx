"use client";

import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import type { PropertyControlProps } from "~/lib/forms/registry/property-registry";

export function PropertyPlaceholder({ field, onChange, propertyKey }: PropertyControlProps) {
  if (propertyKey === "hoverText") {
    return (
      <div className="space-y-2">
        <Label htmlFor="prop-hover">Hover text</Label>
        <Input
          id="prop-hover"
          className="bg-background"
          value={field.hoverText ?? ""}
          onChange={(e) => onChange({ hoverText: e.target.value })}
        />
      </div>
    );
  }

  const placeholderLabel =
    field.type === "checkbox" ? "Checkbox text" : "Placeholder";

  return (
    <div className="space-y-2">
      <Label htmlFor="prop-placeholder">{placeholderLabel}</Label>
      <Input
        id="prop-placeholder"
        className="bg-background"
        value={field.placeholder ?? ""}
        onChange={(e) => onChange({ placeholder: e.target.value })}
      />
    </div>
  );
}
