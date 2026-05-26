"use client";

import { clampColSpan } from "@repo/form-schema";

import { Label } from "~/components/ui/label";
import type { PropertyControlProps } from "~/lib/forms/registry/property-registry";
import { cn } from "~/lib/utils";

const presets = [
  { label: "Full width", value: 12 },
  { label: "Half", value: 6 },
  { label: "Third", value: 4 },
] as const;

export function PropertyColumnPicker({ field, onChange }: PropertyControlProps) {
  const colSpan = clampColSpan(field.colSpan);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Width preset</Label>
        <div className="grid grid-cols-3 gap-2">
          {presets.map((preset) => (
            <button
              key={preset.value}
              type="button"
              className={cn(
                "rounded-md border px-3 py-2 text-xs font-medium transition-colors",
                colSpan === preset.value
                  ? "border-primary bg-primary/10 text-primary shadow-xs"
                  : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-muted/50",
              )}
              onClick={() => onChange({ colSpan: preset.value })}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Columns (1–12)</Label>
        <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-6">
          {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => {
            const active = colSpan === n;
            return (
              <button
                key={n}
                type="button"
                aria-pressed={active}
                className={cn(
                  "flex h-9 items-center justify-center rounded-md border text-xs font-medium transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground shadow-xs"
                    : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:bg-muted/50 hover:text-foreground",
                )}
                onClick={() => onChange({ colSpan: n })}
              >
                {n}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">
          Selected: <span className="font-medium text-foreground">{colSpan}</span> of 12 columns
        </p>
      </div>
    </div>
  );
}
