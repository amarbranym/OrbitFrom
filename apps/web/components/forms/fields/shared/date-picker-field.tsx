"use client";

import { format, isValid, parseISO } from "date-fns";
import { IconCalendar } from "@tabler/icons-react";
import { useState } from "react";

import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { cn } from "~/lib/utils";

type DatePickerFieldProps = {
  value?: unknown;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  "aria-invalid"?: boolean;
};

function parseDateValue(value: unknown): Date | undefined {
  if (value == null || value === "") return undefined;
  const str = String(value).trim();
  if (!str) return undefined;

  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    const parsed = parseISO(str);
    if (isValid(parsed)) return parsed;
  }

  const fallback = new Date(str);
  return isValid(fallback) ? fallback : undefined;
}

function toStoredDate(date: Date) {
  return format(date, "yyyy-MM-dd");
}

export function DatePickerField({
  value,
  onChange,
  onBlur,
  disabled,
  placeholder = "Pick a date",
  className,
  "aria-invalid": ariaInvalid,
}: DatePickerFieldProps) {
  const [open, setOpen] = useState(false);
  const selected = parseDateValue(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          aria-invalid={ariaInvalid}
          className={cn(
            "h-9 w-full justify-start bg-background px-3 font-normal shadow-xs",
            !selected && "text-muted-foreground",
            ariaInvalid && "border-destructive ring-destructive/20",
            className,
          )}
          onBlur={onBlur}
        >
          <IconCalendar className="mr-2 size-4 shrink-0 opacity-70" stroke={1.5} />
          {selected ? format(selected, "PPP") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => {
            onChange?.(date ? toStoredDate(date) : "");
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
