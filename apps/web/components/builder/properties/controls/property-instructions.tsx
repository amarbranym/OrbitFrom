"use client";

import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import type { PropertyControlProps } from "~/lib/forms/registry/property-registry";

export function PropertyInstructions({ field, onChange }: PropertyControlProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="prop-instructions" className="text-sm font-medium">
        Instructions
      </Label>
      <Textarea
        id="prop-instructions"
        value={field.instructions ?? ""}
        onChange={(e) => onChange({ instructions: e.target.value })}
        placeholder="Shown below the field to guide respondents"
        className="min-h-24 resize-y bg-background"
      />
    </div>
  );
}
