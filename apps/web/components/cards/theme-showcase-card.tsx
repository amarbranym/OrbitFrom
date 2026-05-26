"use client";

import { IconSparkles } from "@tabler/icons-react";

import { ThemeFormMockup } from "~/components/builder/theme-preview/theme-form-mockup";
import { Button } from "~/components/ui/button";
import type { FormThemePreset } from "~/lib/forms/themes/form-theme-presets";
import { cn } from "~/lib/utils";

type ThemeShowcaseCardProps = {
  theme: FormThemePreset;
  className?: string;
  featured?: boolean;
  onPreview?: () => void;
};

function ThemeSwatches({ theme }: { theme: FormThemePreset }) {
  const swatches = [
    theme.preview.accent,
    theme.preview.header,
    theme.preview.body,
    theme.preview.background,
  ];

  return (
    <div className="mt-2 flex items-center justify-center gap-1.5">
      {swatches.map((color, index) => (
        <span
          key={`${theme.id}-swatch-${index}`}
          className="size-2.5 rounded-full ring-1 ring-border/60"
          style={{ backgroundColor: color }}
          aria-hidden
        />
      ))}
    </div>
  );
}

export function ThemeShowcaseCard({
  theme,
  className,
  featured = false,
  onPreview,
}: ThemeShowcaseCardProps) {
  return (
    <article className={cn("group flex h-full min-h-0 flex-col", className)}>
      <div
        className={cn(
          "relative flex-1 overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm",
          "transition-all duration-300 ease-out",
          "group-hover:-translate-y-0.5 group-hover:border-primary/35 group-hover:shadow-lg group-hover:shadow-primary/10",
          featured ? "min-h-[280px] lg:min-h-0" : "aspect-5/4",
        )}
      >
        {featured ? (
          <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/90 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-primary-foreground uppercase">
            <IconSparkles className="size-3" stroke={2} />
            Popular
          </span>
        ) : null}

        <ThemeFormMockup theme={theme} className="h-full min-h-full" />

        {onPreview ? (
          <div
            className={cn(
              "absolute inset-0 z-10 flex items-center justify-center",
              "bg-black/45 opacity-0 transition-opacity duration-200",
              "group-hover:opacity-100 group-focus-within:opacity-100",
            )}
          >
            <Button
              type="button"
              size="sm"
              className="min-w-[88px] shadow-md"
              onClick={(event) => {
                event.stopPropagation();
                onPreview();
              }}
            >
              Preview
            </Button>
          </div>
        ) : (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-background/50 via-background/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            aria-hidden
          />
        )}
      </div>

      <div className="mt-3 shrink-0 text-center">
        <p
          className={cn(
            "font-medium tracking-tight text-foreground",
            featured ? "text-base" : "text-sm",
          )}
        >
          {theme.name}
        </p>
        <ThemeSwatches theme={theme} />
      </div>
    </article>
  );
}
