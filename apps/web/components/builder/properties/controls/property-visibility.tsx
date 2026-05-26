"use client";

import type { FieldVisibility } from "@repo/form-schema";

import { Label } from "~/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import type { PropertyControlProps } from "~/lib/forms/registry/property-registry";

export function PropertyVisibility({ field, onChange }: PropertyControlProps) {
  return (
    <div className="space-y-2">
      <Label className="sr-only">Visibility mode</Label>
      <ToggleGroup
        type="single"
        value={field.visibility}
        onValueChange={(v) => {
          if (v) onChange({ visibility: v as FieldVisibility });
        }}
        className="w-full"
      >
        <ToggleGroupItem value="show" className="flex-1">
          Show
        </ToggleGroupItem>
        <ToggleGroupItem value="hide" className="flex-1">
          Hide
        </ToggleGroupItem>
        <ToggleGroupItem value="disable" className="flex-1">
          Disable
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
