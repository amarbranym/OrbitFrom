"use client";

import type { FormDocument } from "@repo/form-schema";
import {
  IconDeviceDesktop,
  IconDeviceMobile,
  IconDeviceTablet,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";

import { DevicePreviewFrame } from "~/components/builder/theme-preview/device-preview-frame";
import { ThemeSelectorPanel } from "~/components/builder/theme-preview/theme-selector-panel";
import { ThemedFormPreview } from "~/components/builder/theme-preview/themed-form-preview";
import { Button } from "~/components/ui/button";
import { createEmptyDocument } from "~/lib/forms/create-document";
import type { FormTemplate } from "~/lib/forms/template-gallery-data";
import { getTemplateDefinition } from "~/lib/forms/template-fields";
import {
  FORM_THEME_PRESETS,
  getThemePreset,
  type ThemePreviewViewport,
} from "~/lib/forms/themes/form-theme-presets";
import { cn } from "~/lib/utils";

type TemplatePreviewDialogProps = {
  template: FormTemplate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUseTemplate: (templateId: string, themePresetId?: string) => void;
  isCreating: boolean;
};

const viewportOptions: {
  id: ThemePreviewViewport;
  label: string;
  icon: typeof IconDeviceDesktop;
}[] = [
  { id: "desktop", label: "Desktop", icon: IconDeviceDesktop },
  { id: "tablet", label: "Tablet", icon: IconDeviceTablet },
  { id: "mobile", label: "Mobile", icon: IconDeviceMobile },
];

export function TemplatePreviewDialog({
  template,
  open,
  onOpenChange,
  onUseTemplate,
  isCreating,
}: TemplatePreviewDialogProps) {
  const [viewport, setViewport] = useState<ThemePreviewViewport>("desktop");
  const [selectedThemeId, setSelectedThemeId] = useState("default");

  useEffect(() => {
    if (open) {
      setViewport("desktop");
      setSelectedThemeId("default");
    }
  }, [open, template?.id]);

  const previewDocument = useMemo<FormDocument | null>(() => {
    if (!template) return null;

    const definition = getTemplateDefinition(template.id);
    const document = createEmptyDocument(definition.title);

    return {
      ...document,
      title: definition.title,
      description: definition.description,
      fields: definition.fields,
    };
  }, [template]);

  if (!open || !template || !previewDocument) return null;

  const selectedTheme = getThemePreset(selectedThemeId);

  return (
    <div
      className="pointer-events-auto fixed inset-0 z-120 flex flex-col bg-muted/80 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label={`${template.name} template preview`}
    >
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-border/60 bg-card px-3 text-foreground shadow-sm sm:px-4">
        <p className="min-w-0 truncate text-sm font-medium">
          {template.name}{" "}
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
          <Button
            type="button"
            size="sm"
            disabled={isCreating}
            onClick={() => onUseTemplate(template.id, selectedThemeId)}
          >
            {isCreating ? "Creating…" : "Use Template"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => onOpenChange(false)}
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
                document={previewDocument}
                theme={selectedTheme}
                viewport={viewport}
              />
            </DevicePreviewFrame>
          </div>
        </div>

        <ThemeSelectorPanel
          themes={FORM_THEME_PRESETS}
          selectedId={selectedThemeId}
          onSelect={setSelectedThemeId}
        />
      </div>
    </div>
  );
}
