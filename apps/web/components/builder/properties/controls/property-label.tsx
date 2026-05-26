"use client";

import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import type { PropertyControlProps } from "~/lib/forms/registry/property-registry";

export function PropertyLabel({ field, onChange }: PropertyControlProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="prop-label" className="text-sm font-medium">
          Field label
        </Label>
        <Input
          id="prop-label"
          className="bg-background"
          value={field.label}
          onChange={(e) => onChange({ label: e.target.value })}
        />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="prop-hide-label"
          checked={field.hideLabel ?? false}
          onCheckedChange={(checked) => onChange({ hideLabel: checked === true })}
        />
        <Label htmlFor="prop-hide-label" className="font-normal">
          Hide field label
        </Label>
      </div>
    </div>
  );
}
