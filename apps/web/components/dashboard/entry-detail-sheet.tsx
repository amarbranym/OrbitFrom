"use client";

import type { FieldSchema, FormSubmission } from "@repo/form-schema";
import { IconCalendar } from "@tabler/icons-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { formatFieldAnswer } from "~/lib/forms/format-field-answer";
import { cn } from "~/lib/utils";

type EntryDetailSheetProps = {
  submission: FormSubmission | null;
  fields: FieldSchema[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EntryDetailSheet({
  submission,
  fields,
  open,
  onOpenChange,
}: EntryDetailSheetProps) {
  const visibleFields = fields.filter((field) => field.visibility !== "hide");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 border-l border-border/60 p-0 sm:max-w-md"
      >
        <SheetHeader className="space-y-3 border-b border-border/60 bg-muted/30 px-6 py-5 text-left">
          <SheetTitle className="text-lg">Entry details</SheetTitle>
          {submission ? (
            <SheetDescription asChild>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <IconCalendar className="size-4 shrink-0" aria-hidden />
                <time dateTime={submission.submittedAt}>
                  {new Date(submission.submittedAt).toLocaleString(undefined, {
                    dateStyle: "full",
                    timeStyle: "short",
                  })}
                </time>
              </div>
            </SheetDescription>
          ) : null}
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {submission ? (
            <dl className="space-y-4">
              {visibleFields.map((field) => {
                const value = formatFieldAnswer(field, submission.answers[field.id]);
                const isEmpty = value === "—";

                return (
                  <div
                    key={field.id}
                    className={cn(
                      "rounded-xl border border-border/50 bg-muted/20 px-4 py-3",
                      isEmpty && "opacity-60",
                    )}
                  >
                    <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {field.label}
                    </dt>
                    <dd className="mt-1.5 text-sm leading-relaxed text-foreground break-words">
                      {value}
                    </dd>
                  </div>
                );
              })}
            </dl>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
