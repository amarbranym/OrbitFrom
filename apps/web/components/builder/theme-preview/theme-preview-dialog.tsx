"use client";

import {
  IconDeviceDesktop,
  IconDeviceMobile,
  IconDeviceTablet,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useBuilderEditor } from "~/components/builder/builder-editor-context";
import { DevicePreviewFrame } from "~/components/builder/theme-preview/device-preview-frame";
import { ThemeSelectorPanel } from "~/components/builder/theme-preview/theme-selector-panel";
import { ThemedFormPreview } from "~/components/builder/theme-preview/themed-form-preview";
import { Button } from "~/components/ui/button";
import {
  FORM_THEME_PRESETS,
  getThemePreset,
  getDocumentThemePreset,
  themePresetToDocumentTheme,
  type ThemePreviewViewport,
} from "~/lib/forms/themes/form-theme-presets";
import { cn } from "~/lib/utils";

const viewportOptions: {
  id: ThemePreviewViewport;
  label: string;
  icon: typeof IconDeviceDesktop;
}[] = [
  { id: "desktop", label: "Desktop", icon: IconDeviceDesktop },
  { id: "tablet", label: "Tablet", icon: IconDeviceTablet },
  { id: "mobile", label: "Mobile", icon: IconDeviceMobile },
];

export function ThemePreviewDialog() {
  const {
    document,
    isThemePreviewOpen,
    themePreviewPresetId,
    closeThemePreview,
    updateDocument,
  } = useBuilderEditor();

  const appliedPreset = getDocumentThemePreset(document);
  const [selectedId, setSelectedId] = useState(appliedPreset.id);
  const [viewport, setViewport] = useState<ThemePreviewViewport>("desktop");

  useEffect(() => {
    if (isThemePreviewOpen) {
      const initialId = themePreviewPresetId ?? getDocumentThemePreset(document).id;
      setSelectedId(initialId);
      setViewport("desktop");
    }
  }, [isThemePreviewOpen, themePreviewPresetId, document.theme?.preset]);

  if (!isThemePreviewOpen) return null;

  const selectedTheme = getThemePreset(selectedId);

  const handleApply = () => {
    updateDocument({ theme: themePresetToDocumentTheme(selectedTheme) });
    toast.success(`${selectedTheme.name} theme applied`);
    closeThemePreview();
  };

  return (
    <div
      className="fixed inset-0 z-100 flex flex-col bg-muted/80 backdrop-blur-[2px]"
      data-viewport={viewport}
    >
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-border/60 bg-card px-3 text-foreground shadow-sm sm:px-4">
        <p className="min-w-0 truncate text-sm font-medium">
          {selectedTheme.name}{" "}
          <span className="font-normal text-muted-foreground">(Preview)</span>
        </p>

        <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-1 sm:gap-6">
          {viewportOptions.map((option) => {
            const Icon = option.icon;
            const active = viewport === option.id;
            return (
              <button
                key={option.id}
                type="button"
                className={cn(
                  "flex min-w-12 flex-col items-center gap-0.5 px-2 pb-1 transition-colors sm:min-w-0",
                  active
                    ? "border-b-2 border-primary text-primary"
                    : "border-b-2 border-transparent text-muted-foreground hover:text-foreground",
                )}
                onClick={() => setViewport(option.id)}
                aria-label={option.label}
                aria-pressed={active}
              >
                <Icon className="size-5" stroke={1.5} />
                <span className="hidden text-[10px] font-medium sm:inline">
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Button type="button" size="sm" onClick={handleApply}>
            Apply Theme
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            onClick={closeThemePreview}
            aria-label="Close preview"
          >
            <IconX className="size-5" />
          </Button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col-reverse lg:flex-row">
        <div
          className={cn(
            "relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-muted transition-all duration-300",
            viewport === "mobile" && "items-center",
          )}
        >
          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
            <DevicePreviewFrame viewport={viewport}>
              <ThemedFormPreview
                document={document}
                theme={selectedTheme}
                viewport={viewport}
              />
            </DevicePreviewFrame>
          </div>
        </div>

        <ThemeSelectorPanel
          themes={FORM_THEME_PRESETS}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>
    </div>
  );
}
