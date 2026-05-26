"use client";

import { IconPencil } from "@tabler/icons-react";

import { BuilderCanvasPage } from "~/components/builder/canvas/builder-canvas-page";
import { useBuilderEditor } from "~/components/builder/builder-editor-context";
import { cn } from "~/lib/utils";

export function BuilderCanvas() {
  const { document, pages, openFormProperties } = useBuilderEditor();

  return (
    <div className="relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-muted/30">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6 pb-16 md:p-10 md:pb-20">
        <button
          type="button"
          onClick={openFormProperties}
          className={cn(
            "group shrink-0 rounded-xl border border-transparent bg-card px-6 py-5 text-center shadow-sm transition-colors",
            "hover:border-primary/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
        >
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {document.title || "Untitled form"}
          </h1>
          <p
            className={cn(
              "mt-2 text-sm",
              document.description ? "text-muted-foreground" : "text-muted-foreground/70 italic",
            )}
          >
            {document.description || "Add a description…"}
          </p>
          <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
            <IconPencil className="size-3.5" />
            Edit form properties
          </span>
        </button>

        <div className="flex flex-col gap-8">
          {pages.map((page, index) => (
            <BuilderCanvasPage
              key={page.id}
              page={page}
              pageNumber={index + 1}
              isLastPage={index === pages.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
