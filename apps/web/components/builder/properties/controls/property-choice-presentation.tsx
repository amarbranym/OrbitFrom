"use client";

import { Label } from "~/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import type { PropertyControlProps } from "~/lib/forms/registry/property-registry";

export function PropertyChoicePresentation({ field, onChange }: PropertyControlProps) {
  if (field.type !== "single_select") return null;

  const presentation = field.choicePresentation ?? "dropdown";

  return (
    <div className="space-y-2">
      <Label>Display as</Label>
      <ToggleGroup
        type="single"
        value={presentation}
        onValueChange={(value) => {
          if (value === "dropdown" || value === "radio") {
            onChange({ choicePresentation: value });
          }
        }}
        className="w-full"
      >
        <ToggleGroupItem value="dropdown" className="flex-1">
          Dropdown
        </ToggleGroupItem>
        <ToggleGroupItem value="radio" className="flex-1">
          Radio list
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
