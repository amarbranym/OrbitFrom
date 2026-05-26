"use client";

import type { FormListItem } from "@repo/form-schema";
import {
  IconDotsVertical,
  IconEdit,
  IconForms,
  IconTable,
} from "@tabler/icons-react";
import Link from "next/link";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

const statusLabels = {
  draft: "Draft",
  published: "Published",
  unpublished: "Unpublished",
} as const;

type WorkspaceFormsEntriesTableProps = {
  forms: FormListItem[];
};

function formatUpdatedAt(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function WorkspaceFormEntriesRow({ form }: { form: FormListItem }) {
  return (
    <TableRow className="group border-border/50 hover:bg-muted/25">
      <TableCell className="px-6 py-3.5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <IconForms className="size-4" stroke={1.75} aria-hidden />
          </div>
          <span className="min-w-0 truncate text-sm font-medium text-foreground group-hover:text-primary">
            {form.title}
          </span>
        </div>
      </TableCell>

      <TableCell className="px-4 py-3.5">
        <div className="inline-flex max-w-full flex-nowrap items-center gap-1.5">
          <Badge
            variant={form.status === "published" ? "default" : "secondary"}
            className="h-6 shrink-0 rounded-md px-2 text-[10px] font-semibold uppercase tracking-wide whitespace-nowrap"
          >
            {statusLabels[form.status]}
          </Badge>
          {form.visibility === "public" ? (
            <Badge
              variant="outline"
              className="h-6 shrink-0 rounded-md border-primary/30 px-2 text-[10px] font-medium whitespace-nowrap text-primary"
            >
              Public
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="h-6 shrink-0 rounded-md px-2 text-[10px] font-medium whitespace-nowrap"
            >
              Unlisted
            </Badge>
          )}
        </div>
      </TableCell>

      <TableCell className="px-4 py-3.5 text-center text-sm font-medium tabular-nums text-muted-foreground">
        {form.fieldCount}
      </TableCell>

      <TableCell className="px-4 py-3.5 text-center text-sm font-semibold tabular-nums text-foreground">
        {form.responseCount}
      </TableCell>

      <TableCell className="px-4 py-3.5 text-sm whitespace-nowrap text-muted-foreground">
        {formatUpdatedAt(form.updatedAt)}
      </TableCell>

      <TableCell className="px-4 py-3.5 text-right">
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" className="h-8 rounded-md" asChild>
            <Link href={`/dashboard/builder/${form.id}/entries`}>
              View entries
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label={`More actions for ${form.title}`}
              >
                <IconDotsVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/builder/${form.id}/entries`}>
                  <IconTable className="size-4" />
                  View entries
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/builder/${form.id}`}>
                  <IconEdit className="size-4" />
                  Edit form
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function WorkspaceFormsEntriesTable({ forms }: WorkspaceFormsEntriesTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table className="min-w-[800px]">
        <TableHeader>
          <TableRow className="border-border/50 bg-muted/20 hover:bg-muted/20">
            <TableHead className="h-11 min-w-[200px] px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Form
            </TableHead>
            <TableHead className="h-11 w-[188px] px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Status
            </TableHead>
            <TableHead className="h-11 w-[72px] px-4 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Fields
            </TableHead>
            <TableHead className="h-11 w-[88px] px-4 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Responses
            </TableHead>
            <TableHead className="h-11 w-[120px] px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Updated
            </TableHead>
            <TableHead className="h-11 min-w-[160px] px-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {forms.map((form) => (
            <WorkspaceFormEntriesRow key={form.id} form={form} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
