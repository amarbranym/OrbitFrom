"use client";

import { getSubmitButtonLabel } from "@repo/form-schema";
import { IconPencil } from "@tabler/icons-react";
import { useState } from "react";

import { useBuilderEditor } from "~/components/builder/builder-editor-context";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

export function CanvasSubmitButton() {
  const { document, updateDocument } = useBuilderEditor();
  const [isEditing, setIsEditing] = useState(false);

  const label = getSubmitButtonLabel(document);

  const saveLabel = (value: string) => {
    const next = value.trim() || "Submit";
    updateDocument({
      settings: {
        ...document.settings,
        submitButtonLabel: next,
      },
    });
    setIsEditing(false);
  };

  return (
    <div className="mt-6 flex justify-end border-t border-dashed border-border/60 pt-6">
      {isEditing ? (
        <Input
          autoFocus
          defaultValue={label}
          className="h-10 max-w-[240px] text-center font-semibold"
          onBlur={(event) => saveLabel(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") event.currentTarget.blur();
            if (event.key === "Escape") setIsEditing(false);
          }}
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className={cn(
            "group relative inline-flex items-center gap-2 rounded-md bg-primary px-8 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm",
            "hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
        >
          {label}
          <IconPencil
            className="size-3.5 opacity-0 transition-opacity group-hover:opacity-80"
            aria-hidden
          />
          <span className="sr-only">Edit submit button label</span>
        </button>
      )}
    </div>
  );
}
