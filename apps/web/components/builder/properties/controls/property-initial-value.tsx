"use client";

import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import type { PropertyControlProps } from "~/lib/forms/registry/property-registry";

export function PropertyInitialValue({ field, onChange }: PropertyControlProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="prop-initial">Initial value</Label>
      <Input
        id="prop-initial"
        value={String(field.initialValue ?? "")}
        onChange={(e) => onChange({ initialValue: e.target.value })}
      />
    </div>
  );
}
