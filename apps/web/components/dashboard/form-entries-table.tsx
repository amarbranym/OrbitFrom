"use client";

import type { FieldSchema, FormSubmission } from "@repo/form-schema";
import {
  IconDotsVertical,
  IconEye,
  IconSearch,
  IconTable,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { formatFieldAnswer } from "~/lib/forms/format-field-answer";

type FormEntriesTableProps = {
  submissions: FormSubmission[];
  fields: FieldSchema[];
  onSelect: (submission: FormSubmission) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
};

function formatSubmittedAt(iso: string) {
  const date = new Date(iso);
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatSubmittedTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function findFieldByHint(fields: FieldSchema[], hints: string[]) {
  const lowerHints = hints.map((h) => h.toLowerCase());
  return fields.find((field) =>
    lowerHints.some(
      (hint) =>
        field.label.toLowerCase().includes(hint) ||
        field.ref?.toLowerCase().includes(hint),
    ),
  );
}

function submissionMatchesQuery(
  submission: FormSubmission,
  fields: FieldSchema[],
  query: string,
): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const dateStr = new Date(submission.submittedAt).toLocaleString().toLowerCase();
  if (dateStr.includes(q)) return true;

  for (const field of fields) {
    const formatted = formatFieldAnswer(field, submission.answers[field.id]).toLowerCase();
    if (formatted.includes(q)) return true;
  }

  return false;
}

export function FormEntriesTable({
  submissions,
  fields,
  onSelect,
  onLoadMore,
  hasMore,
  isLoadingMore,
}: FormEntriesTableProps) {
  const [query, setQuery] = useState("");

  const visibleFields = useMemo(
    () => fields.filter((field) => field.visibility !== "hide"),
    [fields],
  );

  const nameField =
    findFieldByHint(visibleFields, ["name", "full name"]) ?? visibleFields[0];
  const emailField = findFieldByHint(visibleFields, ["email", "e-mail"]);

  const displayFields = useMemo(() => {
    const skip = new Set([nameField?.id, emailField?.id].filter(Boolean));
    return visibleFields.filter((field) => !skip.has(field.id)).slice(0, 2);
  }, [visibleFields, nameField?.id, emailField?.id]);

  const filtered = useMemo(
    () =>
      submissions.filter((submission) =>
        submissionMatchesQuery(submission, visibleFields, query),
      ),
    [submissions, visibleFields, query],
  );

  const showNameColumn = Boolean(nameField);
  const showEmailColumn = Boolean(emailField);

  const colSpan =
    3 + (showNameColumn ? 1 : 0) + (showEmailColumn ? 1 : 0) + displayFields.length;

  if (submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border/80 bg-muted/15 px-6 py-20 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <IconTable className="size-7" stroke={1.5} aria-hidden />
        </div>
        <div className="max-w-sm space-y-1">
          <p className="text-base font-semibold">No entries yet</p>
          <p className="text-sm text-muted-foreground">
            Publish and share your form. Responses appear here after someone submits.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <IconSearch
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search entries…"
            className="h-10 rounded-lg border-border/60 bg-background pl-9"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {filtered.length} of {submissions.length} shown
        </p>
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-[720px]">
          <TableHeader>
            <TableRow className="border-border/50 bg-muted/20 hover:bg-muted/20">
              <TableHead className="h-11 w-12 px-4 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                #
              </TableHead>
              <TableHead className="h-11 w-[120px] px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Submitted
              </TableHead>
              {showNameColumn ? (
                <TableHead className="h-11 min-w-[140px] px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {nameField!.label}
                </TableHead>
              ) : null}
              {showEmailColumn ? (
                <TableHead className="h-11 min-w-[160px] px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {emailField!.label}
                </TableHead>
              ) : null}
              {displayFields.map((field) => (
                <TableHead
                  key={field.id}
                  className="h-11 min-w-[120px] px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  {field.label}
                </TableHead>
              ))}
              <TableHead className="h-11 w-[56px] px-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={colSpan}
                  className="h-28 px-4 text-center text-sm text-muted-foreground"
                >
                  No entries match your search.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((submission, index) => (
                <TableRow
                  key={submission.id}
                  className="group cursor-pointer border-border/50 hover:bg-muted/25"
                  onClick={() => onSelect(submission)}
                >
                  <TableCell className="px-4 py-3.5 text-center text-xs font-medium tabular-nums text-muted-foreground">
                    {index + 1}
                  </TableCell>
                  <TableCell className="px-4 py-3.5">
                    <p className="text-sm font-medium text-foreground">
                      {formatSubmittedAt(submission.submittedAt)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatSubmittedTime(submission.submittedAt)}
                    </p>
                  </TableCell>
                  {showNameColumn ? (
                    <TableCell className="px-4 py-3.5">
                      <span className="block max-w-[180px] truncate text-sm font-medium text-foreground">
                        {formatFieldAnswer(nameField!, submission.answers[nameField!.id])}
                      </span>
                    </TableCell>
                  ) : null}
                  {showEmailColumn ? (
                    <TableCell className="px-4 py-3.5">
                      <span className="block max-w-[200px] truncate text-sm text-muted-foreground">
                        {formatFieldAnswer(
                          emailField!,
                          submission.answers[emailField!.id],
                        )}
                      </span>
                    </TableCell>
                  ) : null}
                  {displayFields.map((field) => (
                    <TableCell key={field.id} className="px-4 py-3.5">
                      <span className="block max-w-[160px] truncate text-sm text-muted-foreground">
                        {formatFieldAnswer(field, submission.answers[field.id])}
                      </span>
                    </TableCell>
                  ))}
                  <TableCell className="px-4 py-3.5 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                          aria-label="Entry actions"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <IconDotsVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                          onClick={(event) => {
                            event.stopPropagation();
                            onSelect(submission);
                          }}
                        >
                          <IconEye className="size-4" />
                          View details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {hasMore && onLoadMore ? (
        <div className="flex justify-center pt-1">
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg"
            disabled={isLoadingMore}
            onClick={onLoadMore}
          >
            {isLoadingMore ? "Loading…" : "Load more entries"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
