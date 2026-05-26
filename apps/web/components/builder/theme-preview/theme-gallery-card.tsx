"use client";

import { IconCheck } from "@tabler/icons-react";

import { ThemeFormMockup } from "~/components/builder/theme-preview/theme-form-mockup";
import { Button } from "~/components/ui/button";
import type { FormThemePreset } from "~/lib/forms/themes/form-theme-presets";
import { cn } from "~/lib/utils";

type ThemeGalleryCardProps = {
  theme: FormThemePreset;
  selected: boolean;
  onApply: () => void;
  onPreview: () => void;
  disabled?: boolean;
};

export function ThemeGalleryCard({
  theme,
  selected,
  onApply,
  onPreview,
  disabled = false,
}: ThemeGalleryCardProps) {
  return (
    <article className="group flex w-full flex-col bg-white p-4 rounded-2xl duration-500 hover:scale-105">
      <div
        className={cn(
          "relative overflow-hidden rounded-sm shadow-sm transition-all ",
          "ring-1 ring-black/5",
          selected
            ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
            : "group-hover:shadow-md group-hover:ring-primary/30",
        )}
      >
        {selected ? (
          <span className="pointer-events-none absolute right-2 top-2 z-20 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md group-hover:opacity-0">
            <IconCheck className="size-3" stroke={2.5} />
          </span>
        ) : null}

        <div className="aspect-5/4 w-full">
          <ThemeFormMockup theme={theme} className="h-full" />
        </div>

        <div
          className={cn(
            "absolute inset-0 z-10 flex items-center justify-center gap-2",
            "bg-black/45 opacity-0 transition-opacity duration-200",
            "group-hover:opacity-100 group-focus-within:opacity-100",
          )}
        >
          <Button
            type="button"
            size="sm"
            className="min-w-[72px] shadow-md"
            disabled={disabled}
            onClick={(event) => {
              event.stopPropagation();
              onApply();
            }}
          >
            {disabled ? "Saving…" : "Apply"}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="min-w-[72px] shadow-md"
            onClick={(event) => {
              event.stopPropagation();
              onPreview();
            }}
          >
            Preview
          </Button>
        </div>
      </div>

      <p
        className={cn(
          "mt-2.5 text-center text-sm font-medium tracking-tight",
          selected ? "text-primary" : "text-foreground",
        )}
      >
        {theme.name}
      </p>
    </article>
  );
}
