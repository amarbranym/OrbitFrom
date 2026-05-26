"use client";

import { clampColSpan, getColSpanClass, getColSpanStyle } from "@repo/form-schema";
import {
  IconCopy,
  IconGripVertical,
  IconSettings,
  IconTrash,
} from "@tabler/icons-react";

import { useBuilderEditor } from "~/components/builder/builder-editor-context";
import { FieldContent } from "~/components/forms/form-renderer";
import { cn } from "~/lib/utils";

type CanvasFieldRowProps = {
  index: number;
  isDragOver?: boolean;
  onDragOver?: (event: React.DragEvent) => void;
  onDrop?: (event: React.DragEvent) => void;
};

export function CanvasFieldRow({
  index,
  isDragOver,
  onDragOver,
  onDrop,
}: CanvasFieldRowProps) {
  const {
    fields,
    selectedFieldId,
    openProperties,
    duplicateField,
    removeField,
  } = useBuilderEditor();

  const field = fields[index];
  if (!field) return null;

  const isSelected = selectedFieldId === field.id;
  const isActive = isSelected;
  const colSpan = clampColSpan(field.colSpan ?? 12);

  const handleOpenProperties = () => {
    openProperties(field.id);
  };

  const showChrome = "hidden group-hover:flex";

  return (
    <div
      style={getColSpanStyle(colSpan)}
      className={cn(getColSpanClass(colSpan), "group relative mx-2 min-w-0 py-1")}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div
        role="button"
        tabIndex={0}
        className={cn(
          "relative h-full cursor-pointer rounded-md border border-transparent bg-background/50 p-4 transition-all duration-150",
          "hover:border-primary hover:border-dashed hover:bg-primary/5",
          isActive && "border-primary border-dashed bg-primary/5",
          isDragOver && "ring-2 ring-primary/25",
        )}
        onClick={handleOpenProperties}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleOpenProperties();
          }
        }}
      >
        <div
          className={cn(
            "absolute top-1/2 -left-2 z-20 -translate-y-1/2 cursor-grab rounded-sm  bg-primary text-primary-foreground py-1  active:cursor-grabbing",
            showChrome,
          )}
          draggable
          onDragStart={(event) => {
            event.stopPropagation();
            event.dataTransfer.setData("application/x-orbitform-field-index", String(index));
            event.dataTransfer.effectAllowed = "move";
          }}
          onMouseDown={(event) => event.stopPropagation()}
          onClick={(event) => event.stopPropagation()}
        >
          <IconGripVertical className="size-4 text-primary-foreground" stroke={1.5} />
        </div>

        <div
          className={cn(
            "absolute top-0 -right-9 z-20 flex flex-col overflow-hidden rounded-md border border-border/50 shadow-md",
            showChrome,
          )}
          onMouseDown={(event) => event.stopPropagation()}
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            className="flex size-8 items-center cursor-pointer justify-center bg-slate-800 text-white transition-colors hover:bg-slate-900"
            onClick={(event) => {
              event.stopPropagation();
              handleOpenProperties();
            }}
            aria-label="Field settings"
          >
            <IconSettings className="size-4" stroke={1.75} />
          </button>
          <button
            type="button"
            className="flex size-8 items-center cursor-pointer justify-center border-t border-white/10 bg-slate-800 text-white transition-colors hover:bg-slate-900"
            onClick={(event) => {
              event.stopPropagation();
              duplicateField(field.id);
            }}
            aria-label="Duplicate field"
          >
            <IconCopy className="size-4" stroke={1.75} />
          </button>
          <button
            type="button"
            className="flex size-8 items-center cursor-pointer justify-center bg-red-500 text-white transition-colors hover:bg-red-600"
            onClick={(event) => {
              event.stopPropagation();
              removeField(field.id);
            }}
            aria-label="Delete field"
          >
            <IconTrash className="size-4" stroke={1.75} />
          </button>
        </div>

        <div className="pointer-events-none w-full min-w-0">
          <FieldContent schema={field} mode="builder" />
        </div>
      </div>
    </div>
  );
}
