"use client";

import {
  createFieldId,
  createDefaultChoiceOptions,
  getChoiceOptions,
  stripOtherOption,
  type FieldOption,
} from "@repo/form-schema";
import { IconCircle, IconMinus, IconPlus, IconSquare } from "@tabler/icons-react";

import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import type { PropertyControlProps } from "~/lib/forms/registry/property-registry";
import { cn } from "~/lib/utils";

const MIN_OPTIONS = 1;

function defaultChoiceLabel(index: number) {
  const presets = ["First choice", "Second choice", "Third choice"];
  return presets[index] ?? `Choice ${index + 1}`;
}

export function PropertyOptions({ field, onChange }: PropertyControlProps) {
  if (field.type !== "single_select" && field.type !== "multi_select") return null;

  const variant = field.type === "single_select" ? "radio" : "checkbox";
  const options = getChoiceOptions(field);
  const standardOptions = options.filter((option) => !option.isOther);
  const otherOption = options.find((option) => option.isOther);

  const setOptions = (next: FieldOption[]) => {
    onChange({ options: next });
  };

  const updateStandardOption = (index: number, label: string) => {
    const current = standardOptions[index];
    if (!current) return;
    const next = [...standardOptions];
    next[index] = { ...current, label };
    setOptions(otherOption ? [...next, otherOption] : next);
  };

  const addOption = (index: number) => {
    const next = [...standardOptions];
    next.splice(index + 1, 0, {
      id: createFieldId(),
      label: defaultChoiceLabel(next.length),
    });
    setOptions(otherOption ? [...next, otherOption] : next);
  };

  const removeOption = (index: number) => {
    if (standardOptions.length <= MIN_OPTIONS) return;
    const next = standardOptions.filter((_, i) => i !== index);
    setOptions(otherOption ? [...next, otherOption] : next);
  };

  const toggleOther = (enabled: boolean) => {
    if (enabled) {
      setOptions([
        ...standardOptions,
        otherOption ?? { id: createFieldId(), label: "Other", isOther: true },
      ]);
      onChange({ allowOther: true });
      return;
    }
    onChange({
      allowOther: false,
      options: stripOtherOption(options),
    });
  };

  const updateOtherLabel = (label: string) => {
    if (!otherOption) return;
    setOptions([...standardOptions, { ...otherOption, label }]);
  };

  return (
    <div className="space-y-3">
      <Label>Choices</Label>
      <div className="space-y-2">
        {standardOptions.map((option, index) => (
          <div key={option.id} className="flex items-center gap-2">
            {variant === "radio" ? (
              <IconCircle className="size-4 shrink-0 text-muted-foreground/60" stroke={1.5} />
            ) : (
              <IconSquare className="size-4 shrink-0 text-muted-foreground/60" stroke={1.5} />
            )}
            <Input
              value={option.label}
              onChange={(e) => updateStandardOption(index, e.target.value)}
              className="h-9 flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 shrink-0 text-emerald-600 hover:text-emerald-700"
              onClick={() => addOption(index)}
              aria-label="Add choice below"
            >
              <IconPlus className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 shrink-0 text-destructive hover:text-destructive"
              onClick={() => removeOption(index)}
              disabled={standardOptions.length <= MIN_OPTIONS}
              aria-label="Remove choice"
            >
              <IconMinus className="size-4" />
            </Button>
          </div>
        ))}
      </div>

      <div
        className={cn(
          "flex items-center gap-2 rounded-md border px-3 py-2",
          field.allowOther ? "border-primary/40 bg-muted/50" : "border-border/60 bg-muted/30",
        )}
      >
        <Checkbox
          id={`${field.id}-allow-other`}
          checked={field.allowOther ?? false}
          onCheckedChange={(checked) => toggleOther(checked === true)}
        />
        <Input
          value={otherOption?.label ?? "Other"}
          disabled={!field.allowOther}
          onChange={(e) => updateOtherLabel(e.target.value)}
          className="h-8 flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
        />
        <Label htmlFor={`${field.id}-allow-other`} className="sr-only">
          Allow Other option
        </Label>
      </div>
    </div>
  );
}
