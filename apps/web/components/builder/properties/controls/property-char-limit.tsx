"use client";

import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import type { PropertyControlProps } from "~/lib/forms/registry/property-registry";

export function PropertyCharLimit({ field, onChange }: PropertyControlProps) {
  const limit = field.charLimit ?? {};

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Character limit</Label>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Min</Label>
          <Input
            type="number"
            min={0}
            className="bg-background"
            value={limit.min ?? ""}
            onChange={(e) =>
              onChange({
                charLimit: {
                  ...limit,
                  min: e.target.value ? Number(e.target.value) : undefined,
                },
              })
            }
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Max</Label>
          <Input
            type="number"
            min={1}
            className="bg-background"
            value={limit.max ?? 255}
            onChange={(e) =>
              onChange({
                charLimit: {
                  ...limit,
                  max: e.target.value ? Number(e.target.value) : undefined,
                },
              })
            }
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="prop-restrict"
          checked={limit.restrictOnReach ?? false}
          onCheckedChange={(checked) =>
            onChange({
              charLimit: { ...limit, restrictOnReach: checked === true },
            })
          }
        />
        <Label htmlFor="prop-restrict" className="font-normal text-sm">
          Restrict input on reaching the limit
        </Label>
      </div>
    </div>
  );
}
