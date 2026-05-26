"use client";

import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useState } from "react";

import { ThemeThumbnail } from "~/components/builder/theme-preview/theme-thumbnail";
import { Button } from "~/components/ui/button";
import type { FormThemePreset } from "~/lib/forms/themes/form-theme-presets";
import { cn } from "~/lib/utils";

type ThemeSelectorPanelProps = {
  themes: FormThemePreset[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export function ThemeSelectorPanel({
  themes,
  selectedId,
  onSelect,
}: ThemeSelectorPanelProps) {
  const [collapsed, setCollapsed] = useState(false);

  if (collapsed) {
    return (
      <aside className="relative hidden w-11 shrink-0 flex-col border-l border-border/60 bg-card lg:flex">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="mt-5 size-8 text-muted-foreground hover:text-foreground"
          onClick={() => setCollapsed(false)}
          aria-label="Expand theme panel"
        >
          <IconChevronLeft className="size-4" />
        </Button>
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        "relative flex w-full shrink-0 flex-col border-t border-border/60 bg-card",
        "lg:w-[min(42vw,480px)] lg:min-w-[400px] lg:max-w-[520px] lg:border-t-0 lg:border-l",
        "xl:w-[min(38vw,520px)]",
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute top-1/2 -left-3.5 z-10 hidden size-8 rounded-full border border-border/60 bg-card shadow-md hover:bg-muted lg:flex"
        onClick={() => setCollapsed(true)}
        aria-label="Collapse theme panel"
      >
        <IconChevronRight className="size-4" />
      </Button>

      <div className="shrink-0 border-b border-border/60 px-5 py-4">
        <p className="text-base font-semibold tracking-tight">Themes</p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Click a preset to preview · Apply when ready
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto bg-background px-4 py-4 sm:px-5 sm:py-5">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {themes.map((theme) => (
            <ThemeThumbnail
              key={theme.id}
              theme={theme}
              selected={selectedId === theme.id}
              onSelect={() => onSelect(theme.id)}
              variant="panel"
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
