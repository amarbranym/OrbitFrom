"use client";

import { getFieldsForPage, type FormPage } from "@repo/form-schema";
import { IconPlus } from "@tabler/icons-react";
import { useMemo, useState } from "react";

import { CanvasFieldRow } from "~/components/builder/canvas/canvas-field-row";
import { CanvasSubmitButton } from "~/components/builder/canvas/canvas-submit-button";
import { useBuilderEditor } from "~/components/builder/builder-editor-context";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { FIELD_DRAG_TYPE } from "~/lib/builder/constants";
import { getFieldGlobalIndex } from "~/lib/forms/field-page-order";
import { cn } from "~/lib/utils";

type BuilderCanvasPageProps = {
  page: FormPage;
  pageNumber: number;
  isLastPage: boolean;
};

export function BuilderCanvasPage({ page, pageNumber, isLastPage }: BuilderCanvasPageProps) {
  const {
    document,
    fields,
    isLoaded,
    addFieldFromLibrary,
    addPage,
    moveField,
    updatePageTitle,
  } = useBuilderEditor();

  const [isDragOver, setIsDragOver] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const pageFields = useMemo(
    () => getFieldsForPage(document, page.id),
    [document, page.id],
  );

  const showPageLabel = document.settings?.pages && document.settings.pages.length > 1;

  const handleDragOver = (event: React.DragEvent) => {
    if (
      !event.dataTransfer.types.includes(FIELD_DRAG_TYPE) &&
      !event.dataTransfer.types.includes("application/x-orbitform-field-index")
    ) {
      return;
    }
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDrop = (event: React.DragEvent, targetFieldId?: string) => {
    event.preventDefault();
    setIsDragOver(false);
    setDragOverIndex(null);

    const libraryItemId = event.dataTransfer.getData(FIELD_DRAG_TYPE);
    const fromIndexRaw = event.dataTransfer.getData("application/x-orbitform-field-index");

    if (libraryItemId) {
      addFieldFromLibrary(libraryItemId, page.id);
      return;
    }

    if (fromIndexRaw) {
      const fromIndex = Number(fromIndexRaw);
      if (Number.isNaN(fromIndex)) return;

      const toIndex = targetFieldId
        ? getFieldGlobalIndex(fields, targetFieldId)
        : pageFields.length > 0
          ? getFieldGlobalIndex(fields, pageFields[pageFields.length - 1]!.id)
          : fields.length;

      moveField(fromIndex, toIndex, page.id);
    }
  };

  return (
    <section className="flex flex-col gap-4" aria-label={page.title}>
      {showPageLabel ? (
        <div className="flex items-center justify-center">
          {isEditingTitle ? (
            <Input
              autoFocus
              defaultValue={page.title}
              className="h-8 max-w-[200px] text-center text-sm font-medium"
              onBlur={(event) => {
                const next = event.target.value.trim() || page.title;
                updatePageTitle(page.id, next);
                setIsEditingTitle(false);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") event.currentTarget.blur();
                if (event.key === "Escape") setIsEditingTitle(false);
              }}
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsEditingTitle(true)}
              className="rounded-md px-2 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {page.title || `Page ${pageNumber}`}
            </button>
          )}
        </div>
      ) : null}

      <div
        className={cn(
          "h-auto min-h-[280px] w-full overflow-visible rounded-md border bg-card p-4 shadow-sm transition-colors",
          isDragOver ? "border-primary ring-2 ring-primary/20" : "border-border/60",
        )}
        onDragOver={handleDragOver}
        onDragLeave={() => {
          setIsDragOver(false);
          setDragOverIndex(null);
        }}
        onDrop={(event) => handleDrop(event)}
      >
        {!isLoaded ? (
          <p className="py-12 text-center text-sm text-muted-foreground">Loading form…</p>
        ) : pageFields.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            Drop a field here or use + below to add another page.
          </p>
        ) : (
          <div className="grid w-full grid-cols-12 gap-x-3 gap-y-3 overflow-visible">
            {pageFields.map((field) => {
              const globalIndex = getFieldGlobalIndex(fields, field.id);
              return (
                <CanvasFieldRow
                  key={field.id}
                  index={globalIndex}
                  isDragOver={dragOverIndex === globalIndex}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverIndex(globalIndex);
                  }}
                  onDrop={(e) => handleDrop(e, field.id)}
                />
              );
            })}
          </div>
        )}

        {isLastPage && isLoaded ? <CanvasSubmitButton /> : null}
      </div>

      {isLastPage ? (
        <div className="mx-auto flex w-full shrink-0 items-center gap-3 pb-2">
          <div className="h-px min-w-0 flex-1 border-t border-dashed border-primary" aria-hidden />
          <Button
            type="button"
            size="icon-lg"
            className="size-11 shrink-0 rounded-full shadow-md"
            aria-label="Add page"
            onClick={() => addPage(page.id)}
          >
            <IconPlus className="size-5" />
          </Button>
          <div className="h-px min-w-0 flex-1 border-t border-dashed border-primary" aria-hidden />
        </div>
      ) : null}
    </section>
  );
}
