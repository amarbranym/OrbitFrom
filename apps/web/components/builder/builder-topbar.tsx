"use client";

import { IconArrowLeft, IconDeviceFloppy, IconEye, IconForms } from "@tabler/icons-react";

import { useBuilderEditor } from "~/components/builder/builder-editor-context";
import { useBuilderNavigation } from "~/components/builder/builder-unsaved-guard";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import type { FormVisibility } from "@repo/form-schema";

export function BuilderTopbar() {
  const {
    document,
    updateDocument,
    publishForm,
    unpublishForm,
    openThemePreview,
    saveDocumentNow,
    isDirty,
    isSaving,
  } = useBuilderEditor();
  const { requestNavigation } = useBuilderNavigation();

  const handleSave = () => {
    void saveDocumentNow();
  };

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border/60 bg-background px-3 shadow-xs sm:px-4">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="shrink-0 gap-1.5 text-muted-foreground hover:text-foreground"
          onClick={() => requestNavigation("/dashboard/forms")}
        >
          <IconArrowLeft className="size-4" aria-hidden />
          <span className="hidden sm:inline">Back</span>
        </Button>

        <div className="flex h-8 shrink-0 items-center" aria-hidden>
          <Separator orientation="vertical" className="h-5" />
        </div>

        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <IconForms className="size-5" stroke={1.5} aria-hidden />
          </div>
          <p className="truncate text-sm font-semibold text-foreground">{document.title}</p>
          <Badge variant="secondary" className="shrink-0 capitalize">
            {document.status}
          </Badge>
          {isDirty ? (
            <Badge variant="outline" className="shrink-0 border-amber-500/50 text-amber-700">
              Unsaved
            </Badge>
          ) : null}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Select
          value={document.visibility}
          onValueChange={(v) =>
            updateDocument({ visibility: v as FormVisibility })
          }
        >
          <SelectTrigger className="h-8 w-[110px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="public">Public</SelectItem>
            <SelectItem value="unlisted">Unlisted</SelectItem>
          </SelectContent>
        </Select>

        {document.status === "published" ? (
          <Button type="button" variant="outline" size="sm" onClick={() => void unpublishForm()}>
            Unpublish
          </Button>
        ) : (
          <Button type="button" variant="outline" size="sm" onClick={() => void publishForm()}>
            Publish
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => openThemePreview()}
        >
          <IconEye className="size-4" aria-hidden />
          <span className="hidden sm:inline">Preview</span>
        </Button>

        <Button
          type="button"
          size="sm"
          className="gap-1.5"
          disabled={isSaving || !isDirty}
          onClick={handleSave}
        >
          <IconDeviceFloppy className="size-4" aria-hidden />
          <span className="hidden sm:inline">{isSaving ? "Saving…" : "Save"}</span>
        </Button>
      </div>
    </header>
  );
}
