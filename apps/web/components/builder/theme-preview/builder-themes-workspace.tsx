"use client";

import { useMemo } from "react";
import { toast } from "sonner";

import { useBuilderEditor } from "~/components/builder/builder-editor-context";
import { ThemeGalleryCard } from "~/components/builder/theme-preview/theme-gallery-card";
import {
  FORM_THEME_PRESETS,
  getThemePreset,
  themePresetToDocumentTheme,
} from "~/lib/forms/themes/form-theme-presets";

export function BuilderThemesWorkspace() {
  const { document, updateDocument, openThemePreview } = useBuilderEditor();

  const filteredThemes = useMemo(() => FORM_THEME_PRESETS, []);

  const handleApplyTheme = (id: string) => {
    const preset = getThemePreset(id);
    updateDocument({ theme: themePresetToDocumentTheme(preset) });
    toast.success(`${preset.name} theme applied`);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-auto">
      <div className="px-5 py-5 sm:px-6 sm:py-6 lg:px-8">
        <p className="text-sm font-normal text-foreground">
          Choose a pre-designed theme for your form.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:gap-6">
          {filteredThemes.map((theme) => (
            <ThemeGalleryCard
              key={theme.id}
              theme={theme}
              selected={document.theme.preset === theme.id}
              onApply={() => handleApplyTheme(theme.id)}
              onPreview={() => openThemePreview(theme.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
