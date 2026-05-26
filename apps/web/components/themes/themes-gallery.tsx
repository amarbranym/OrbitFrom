"use client";

import { useState } from "react";

import { ThemeShowcaseCard } from "~/components/cards/theme-showcase-card";
import { ThemeGalleryPreviewDialog } from "~/components/themes/theme-gallery-preview-dialog";
import { FORM_THEME_PRESETS } from "~/lib/forms/themes/form-theme-presets";

export function ThemesGallery() {
  const [previewThemeId, setPreviewThemeId] = useState<string | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {FORM_THEME_PRESETS.map((theme) => (
          <ThemeShowcaseCard
            key={theme.id}
            theme={theme}
            onPreview={() => setPreviewThemeId(theme.id)}
          />
        ))}
      </div>

      <ThemeGalleryPreviewDialog
        open={previewThemeId !== null}
        onOpenChange={(open) => {
          if (!open) setPreviewThemeId(null);
        }}
        initialThemeId={previewThemeId ?? "default"}
      />
    </>
  );
}

export function ThemesGallerySkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
      {FORM_THEME_PRESETS.map((theme) => (
        <div
          key={theme.id}
          className="aspect-5/4 animate-pulse rounded-2xl border border-border/60 bg-muted/40"
          aria-hidden
        />
      ))}
    </div>
  );
}
