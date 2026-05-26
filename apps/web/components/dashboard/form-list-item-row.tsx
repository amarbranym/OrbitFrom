"use client";

import type { FormListItem } from "@repo/form-schema";
import {
  IconCopy,
  IconCopyPlus,
  IconDotsVertical,
  IconEdit,
  IconExternalLink,
  IconForms,
  IconTable,
  IconTrash,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { TableCell, TableRow } from "~/components/ui/table";
import { trpc } from "~/trpc/client";

const statusLabels = {
  draft: "Draft",
  published: "Published",
  unpublished: "Unpublished",
} as const;

type FormListItemRowProps = {
  form: FormListItem;
  onDeleted?: () => void;
};

function formatUpdatedAt(iso: string) {
  const date = new Date(iso);
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function FormListItemRow({ form, onDeleted }: FormListItemRowProps) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const utils = trpc.useUtils();
  const updatedLabel = formatUpdatedAt(form.updatedAt);
  const canOpenLive = form.status === "published";

  const deleteMutation = trpc.forms.delete.useMutation({
    onSuccess: () => {
      void utils.forms.list.invalidate();
      onDeleted?.();
      setDeleteOpen(false);
      toast.success(`"${form.title}" deleted`);
    },
    onError: (err) => toast.error(err.message),
  });

  const duplicateMutation = trpc.forms.duplicate.useMutation({
    onSuccess: (created) => {
      void utils.forms.list.invalidate();
      toast.success(`"${form.title}" duplicated`);
      router.push(`/dashboard/builder/${created.id}`);
    },
    onError: (err) => toast.error(err.message),
  });

  const handleShare = async () => {
    const url = `${window.location.origin}/f/${form.slug}`;
    await navigator.clipboard.writeText(url);

    if (form.status !== "published") {
      toast.message("Link copied", {
        description: "Publish this form before respondents can submit.",
      });
      return;
    }
    toast.success("Share link copied");
  };

  return (
    <>
      <TableRow className="group border-border/50 hover:bg-muted/25">
        <TableCell className="px-6 py-3.5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <IconForms className="size-4" stroke={1.75} aria-hidden />
            </div>
            <Link
              href={`/dashboard/builder/${form.id}`}
              className="min-w-0 truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary"
            >
              {form.title}
            </Link>
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

        <TableCell className="px-4 py-3.5 text-sm whitespace-nowrap text-muted-foreground">
          {updatedLabel}
        </TableCell>

        <TableCell className="px-4 py-3.5 text-center text-sm font-medium tabular-nums text-muted-foreground">
          {form.fieldCount}
        </TableCell>

        <TableCell className="px-4 py-3.5 text-center text-sm font-semibold tabular-nums text-foreground">
          {form.responseCount}
        </TableCell>

        <TableCell className="px-4 py-3.5 text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label={`Actions for ${form.title}`}
              >
                <IconDotsVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/builder/${form.id}`}>
                  <IconEdit className="size-4" />
                  Edit form
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/builder/${form.id}/entries`}>
                  <IconTable className="size-4" />
                  View entries
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={duplicateMutation.isPending}
                onClick={() => duplicateMutation.mutate({ formId: form.id })}
              >
                <IconCopyPlus className="size-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => void handleShare()}>
                <IconCopy className="size-4" />
                Copy link
              </DropdownMenuItem>
              {canOpenLive ? (
                <DropdownMenuItem asChild>
                  <Link href={`/f/${form.slug}`} target="_blank" rel="noopener noreferrer">
                    <IconExternalLink className="size-4" />
                    Open live
                  </Link>
                </DropdownMenuItem>
              ) : null}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onSelect={(event) => {
                  event.preventDefault();
                  setDeleteOpen(true);
                }}
              >
                <IconTrash className="size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this form?</AlertDialogTitle>
            <AlertDialogDescription>
              &quot;{form.title}&quot; and all {form.responseCount} response
              {form.responseCount === 1 ? "" : "s"} will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() => deleteMutation.mutate({ formId: form.id })}
            >
              Delete form
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
