"use client";

import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import type { PropertyControlProps } from "~/lib/forms/registry/property-registry";

export function PropertyRequired({ field, onChange, propertyKey }: PropertyControlProps) {
  if (propertyKey === "noDuplicates") {
    return (
      <div className="flex items-center gap-2">
        <Checkbox
          id="prop-no-dup"
          checked={field.noDuplicates ?? false}
          onCheckedChange={(checked) => onChange({ noDuplicates: checked === true })}
        />
        <Label htmlFor="prop-no-dup" className="font-normal">
          No duplicates
        </Label>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id="prop-required"
        checked={field.required}
        onCheckedChange={(checked) => onChange({ required: checked === true })}
      />
      <Label htmlFor="prop-required" className="font-normal">
        Mandatory
      </Label>
    </div>
  );
}
