"use client";

import { IconTrash } from "@tabler/icons-react";

import { useBuilderEditor } from "~/components/builder/builder-editor-context";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";

export function FieldPropertiesPanel() {
  const { selectedField, updateField, removeField, selectField } = useBuilderEditor();

  if (!selectedField) {
    return (
      <aside className="flex w-72 shrink-0 flex-col border-l border-border/60 bg-card">
        <div className="border-b border-border/60 px-4 py-3">
          <h2 className="text-sm font-semibold text-foreground">Field properties</h2>
        </div>
        <div className="flex flex-1 items-center justify-center p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Select a field on the canvas to edit its label, placeholder and validation.
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="flex w-72 shrink-0 flex-col border-l border-border/60 bg-card">
      <div className="border-b border-border/60 px-4 py-3">
        <h2 className="text-sm font-semibold text-foreground">Field properties</h2>
        <p className="mt-0.5 text-xs capitalize text-muted-foreground">
          {selectedField.type.replace("_", " ")}
        </p>
      </div>

      <div className="space-y-5 p-4">
        <div className="space-y-2">
          <Label htmlFor="field-label">Label</Label>
          <Input
            id="field-label"
            value={selectedField.label}
            onChange={(event) =>
              updateField(selectedField.id, { label: event.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="field-placeholder">Placeholder</Label>
          <Input
            id="field-placeholder"
            value={selectedField.placeholder ?? ""}
            onChange={(event) =>
              updateField(selectedField.id, { placeholder: event.target.value })
            }
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2.5">
          <Label htmlFor="field-required" className="cursor-pointer">
            Required
          </Label>
          <Switch
            id="field-required"
            checked={selectedField.required}
            onCheckedChange={(checked) =>
              updateField(selectedField.id, { required: checked })
            }
          />
        </div>

        <Button
          type="button"
          variant="destructive"
          className="w-full"
          onClick={() => {
            removeField(selectedField.id);
            selectField(null);
          }}
        >
          <IconTrash className="size-4" />
          Delete field
        </Button>
      </div>
    </aside>
  );
}
