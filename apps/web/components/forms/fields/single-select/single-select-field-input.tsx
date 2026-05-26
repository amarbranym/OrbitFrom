"use client";

import { getChoiceOptions, type FieldSchema } from "@repo/form-schema";

import { FormControl } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { FieldComponentProps } from "~/lib/forms/registry/types";
import { cn } from "~/lib/utils";

import { FieldShell } from "../shared/field-shell";
import { useBuilderPreview } from "../shared/use-builder-preview";

function RadioChoiceList({
  schema,
  value,
  onChange,
  disabled,
  readOnly,
}: FieldComponentProps & { readOnly?: boolean }) {
  const options = getChoiceOptions(schema);
  const selected = String(value ?? "");
  const otherOption = options.find((option) => option.isOther);
  const standardOptions = options.filter((option) => !option.isOther);
  const isOtherSelected = otherOption && selected === otherOption.id;

  return (
    <div className={cn("space-y-2", readOnly && "pointer-events-none")}>
      <RadioGroup
        value={selected}
        onValueChange={(v) => onChange?.(v)}
        className="gap-2.5"
        disabled={disabled && !readOnly}
      >
        {standardOptions.map((option) => (
          <div key={option.id} className="flex items-center gap-2">
            <RadioGroupItem value={option.id} id={`${schema.id}-${option.id}`} />
            <Label htmlFor={`${schema.id}-${option.id}`} className="font-normal">
              {option.label}
            </Label>
          </div>
        ))}
        {otherOption ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <RadioGroupItem value={otherOption.id} id={`${schema.id}-${otherOption.id}`} />
              <Label htmlFor={`${schema.id}-${otherOption.id}`} className="font-normal">
                {otherOption.label}
              </Label>
            </div>
            {isOtherSelected && !readOnly ? (
              <Input
                className="ml-6 max-w-md bg-background"
                placeholder="Please specify"
                disabled={disabled}
              />
            ) : null}
          </div>
        ) : null}
      </RadioGroup>
    </div>
  );
}

type DropdownSelectProps = {
  schema: FieldSchema;
  value: unknown;
  onChange?: (value: unknown) => void;
  onBlur?: () => void;
  disabled?: boolean;
  error?: string;
  readOnly?: boolean;
  placeholder: string;
  useFormControl: boolean;
};

function DropdownSelect({
  schema,
  value,
  onChange,
  onBlur,
  disabled,
  error,
  readOnly,
  placeholder,
  useFormControl,
}: DropdownSelectProps) {
  const options = getChoiceOptions(schema);
  const selected = String(value ?? "");
  const isDisabled = disabled || readOnly;

  const trigger = (
    <SelectTrigger
      className={cn(
        "w-full min-w-0 bg-background shadow-xs",
        error && "border-destructive",
      )}
      aria-invalid={!!error}
    >
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
  );

  return (
    <Select
      value={selected || undefined}
      onValueChange={(next) => {
        onChange?.(next);
        onBlur?.();
      }}
      onOpenChange={(open) => {
        if (!open) onBlur?.();
      }}
      disabled={isDisabled}
    >
      {useFormControl ? <FormControl>{trigger}</FormControl> : trigger}
      <SelectContent position="popper" className="z-200 max-h-72">
        {options.map((option) => (
          <SelectItem key={option.id} value={option.id}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function SingleSelectFieldInput({
  schema,
  mode,
  value,
  onChange,
  onBlur,
  disabled,
  error,
}: FieldComponentProps) {
  const presentation = schema.choicePresentation ?? "dropdown";
  const isBuilder = useBuilderPreview(mode);
  const selectPlaceholder = schema.placeholder?.trim() || "-Select-";

  if (presentation === "radio") {
    return (
      <FieldShell schema={schema} error={error}>
        <RadioChoiceList
          schema={schema}
          mode={mode}
          value={value}
          onChange={onChange}
          disabled={disabled}
          readOnly={isBuilder}
        />
      </FieldShell>
    );
  }

  return (
    <FieldShell schema={schema} error={error}>
      <DropdownSelect
        schema={schema}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        error={error}
        readOnly={isBuilder}
        placeholder={selectPlaceholder}
        useFormControl={mode === "live"}
      />
    </FieldShell>
  );
}
