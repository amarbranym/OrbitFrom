"use client";

import { getMultiSelectSettings, type MultiSelectSettings } from "@repo/form-schema";

import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import type { PropertyControlProps } from "~/lib/forms/registry/property-registry";

function patchSettings(
  field: PropertyControlProps["field"],
  onChange: PropertyControlProps["onChange"],
  patch: Partial<MultiSelectSettings>,
) {
  const current = getMultiSelectSettings(field);
  onChange({
    multiSelectSettings: {
      ...current,
      ...patch,
    },
  });
}

export function PropertyMultiSelectSettings({ field, onChange }: PropertyControlProps) {
  if (field.type !== "multi_select") return null;

  const settings = getMultiSelectSettings(field);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="prop-ms-max-count" className="text-sm font-medium">
          Badges shown before summary
        </Label>
        <Input
          id="prop-ms-max-count"
          type="number"
          min={1}
          max={10}
          className="bg-background"
          value={settings.maxCount}
          onChange={(e) => {
            const next = Number(e.target.value);
            if (!Number.isNaN(next)) {
              patchSettings(field, onChange, { maxCount: Math.min(10, Math.max(1, next)) });
            }
          }}
        />
        <p className="text-xs text-muted-foreground">
          Extra selections appear as &quot;+N more&quot; on the trigger.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="prop-ms-min" className="text-xs text-muted-foreground">
            Min selections
          </Label>
          <Input
            id="prop-ms-min"
            type="number"
            min={0}
            className="bg-background"
            value={settings.minSelections ?? ""}
            placeholder={field.required ? "1" : "0"}
            onChange={(e) => {
              const raw = e.target.value;
              patchSettings(field, onChange, {
                minSelections: raw === "" ? undefined : Math.max(0, Number(raw)),
              });
            }}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="prop-ms-max" className="text-xs text-muted-foreground">
            Max selections
          </Label>
          <Input
            id="prop-ms-max"
            type="number"
            min={1}
            className="bg-background"
            value={settings.maxSelections ?? ""}
            placeholder="No limit"
            onChange={(e) => {
              const raw = e.target.value;
              patchSettings(field, onChange, {
                maxSelections: raw === "" ? undefined : Math.max(1, Number(raw)),
              });
            }}
          />
        </div>
      </div>

      <div className="space-y-3 rounded-md border border-border/60 bg-muted/20 p-3">
        <div className="flex items-center gap-2">
          <Checkbox
            id="prop-ms-searchable"
            checked={settings.searchable}
            onCheckedChange={(checked) =>
              patchSettings(field, onChange, { searchable: checked === true })
            }
          />
          <Label htmlFor="prop-ms-searchable" className="font-normal">
            Enable search in dropdown
          </Label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="prop-ms-select-all"
            checked={!settings.hideSelectAll}
            onCheckedChange={(checked) =>
              patchSettings(field, onChange, { hideSelectAll: checked !== true })
            }
          />
          <Label htmlFor="prop-ms-select-all" className="font-normal">
            Show &quot;Select all&quot; action
          </Label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="prop-ms-single-line"
            checked={settings.singleLine}
            onCheckedChange={(checked) =>
              patchSettings(field, onChange, { singleLine: checked === true })
            }
          />
          <Label htmlFor="prop-ms-single-line" className="font-normal">
            Single-line badge layout
          </Label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="prop-ms-close"
            checked={settings.closeOnSelect}
            onCheckedChange={(checked) =>
              patchSettings(field, onChange, { closeOnSelect: checked === true })
            }
          />
          <Label htmlFor="prop-ms-close" className="font-normal">
            Close dropdown after each pick
          </Label>
        </div>
      </div>
    </div>
  );
}
