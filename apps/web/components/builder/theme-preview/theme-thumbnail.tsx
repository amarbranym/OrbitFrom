"use client";

import { IconCheck } from "@tabler/icons-react";

import { ThemeFormMockup } from "~/components/builder/theme-preview/theme-form-mockup";
import type { FormThemePreset } from "~/lib/forms/themes/form-theme-presets";
import { cn } from "~/lib/utils";

type ThemeThumbnailProps = {
  theme: FormThemePreset;
  selected: boolean;
  onSelect: () => void;
  variant?: "default" | "panel";
};

export function ThemeThumbnail({
  theme,
  selected,
  onSelect,
  variant = "default",
}: ThemeThumbnailProps) {
  const isPanel = variant === "panel";

  if (isPanel) {
    return (
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "group flex w-full flex-col text-left transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        )}
      >
        <div
          className={cn(
            "relative overflow-hidden rounded-md shadow-sm ring-1 ring-black/5 transition-all",
            selected
              ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
              : "group-hover:shadow-md group-hover:ring-primary/35",
          )}
        >
          {selected ? (
            <span className="absolute right-2 top-2 z-10 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
              <IconCheck className="size-3.5" stroke={2.5} />
            </span>
          ) : null}

          <div className="aspect-5/4 w-full">
            <ThemeFormMockup theme={theme} className="h-full" />
          </div>
        </div>

        <p
          className={cn(
            "mt-2 line-clamp-2 text-center text-sm font-medium leading-snug",
            selected ? "text-primary" : "text-foreground",
          )}
          title={theme.name}
        >
          {theme.name}
        </p>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group relative w-full overflow-hidden rounded-xl border text-left transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        selected
          ? "border-primary shadow-md ring-2 ring-primary/20"
          : "border-border/60 hover:border-primary/50 hover:shadow-sm",
      )}
    >
      {selected ? (
        <span className="absolute right-2 top-2 z-10 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
          <IconCheck className="size-3.5" stroke={2.5} />
        </span>
      ) : null}

      <div className="relative aspect-4/5 w-full overflow-hidden">
        <ThemeFormMockup theme={theme} className="h-full" />
      </div>

      <div
        className={cn(
          "border-t px-3 py-2.5",
          selected ? "bg-primary/5" : "bg-card",
        )}
      >
        <p
          className={cn(
            "truncate text-center text-sm font-medium",
            selected ? "text-primary" : "text-foreground",
          )}
        >
          {theme.name}
        </p>
      </div>
    </button>
  );
}
