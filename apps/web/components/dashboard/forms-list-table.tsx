"use client";

import type { FormListItem } from "@repo/form-schema";

import { FormListItemRow } from "~/components/dashboard/form-list-item-row";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

type FormsListTableProps = {
  forms: FormListItem[];
  onDeleted?: () => void;
};

export function FormsListTable({ forms, onDeleted }: FormsListTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table className="min-w-[880px]">
        <TableHeader>
          <TableRow className="border-border/50 bg-muted/20 hover:bg-muted/20">
            <TableHead className="h-11 min-w-[220px] px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Form
            </TableHead>
            <TableHead className="h-11 w-[188px] px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Status
            </TableHead>
            <TableHead className="h-11 w-[128px] px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Updated
            </TableHead>
            <TableHead className="h-11 w-[72px] px-4 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Fields
            </TableHead>
            <TableHead className="h-11 w-[88px] px-4 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Responses
            </TableHead>
            <TableHead className="h-11 w-[72px] px-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {forms.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={6} className="h-24 text-center text-sm text-muted-foreground">
                No forms to display.
              </TableCell>
            </TableRow>
          ) : (
            forms.map((form) => (
              <FormListItemRow key={form.id} form={form} onDeleted={onDeleted} />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
