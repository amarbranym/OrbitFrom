"use client";

import { IconEye } from "@tabler/icons-react";

import { Button } from "~/components/ui/button";
import type { FormTemplate, TemplatePreviewVariant } from "~/lib/forms/template-gallery-data";
import { cn } from "~/lib/utils";

const previewHeaderClasses: Record<TemplatePreviewVariant, string> = {
  primary: "bg-primary text-primary-foreground",
  accent: "bg-accent text-accent-foreground",
  "chart-1": "bg-chart-1 text-primary-foreground",
  "chart-2": "bg-chart-2 text-primary-foreground",
  "chart-3": "bg-chart-3 text-primary-foreground",
  muted: "bg-muted text-foreground",
};

type TemplateCardProps = {
  template: FormTemplate;
  onPreviewTemplate?: (templateId: string) => void;
  onUseTemplate?: (templateId: string) => void;
  isCreating?: boolean;
};

export function TemplateCard({
  template,
  onPreviewTemplate,
  onUseTemplate,
  isCreating = false,
}: TemplateCardProps) {
  const handleUse = () => {
    if (isCreating) return;
    onUseTemplate?.(template.id);
  };

  return (
    <article className="group overflow-hidden rounded-xl border border-border/60 bg-card shadow-xs transition-shadow hover:shadow-md">
      <div className="relative aspect-4/3 overflow-hidden">
        <TemplatePreview template={template} />

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-foreground/40 opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100">
          <Button
            type="button"
            size="sm"
            className="min-w-28 bg-chart-2 text-primary-foreground hover:bg-chart-2/90"
            disabled={isCreating}
            onClick={() => onPreviewTemplate?.(template.id)}
          >
            <IconEye className="size-4" />
            Preview
          </Button>
          <Button
            type="button"
            size="sm"
            className="min-w-28 bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isCreating}
            onClick={handleUse}
          >
            {isCreating ? "Creating…" : "Use"}
          </Button>
        </div>
      </div>

      <div className="space-y-1 border-t border-border/60 px-4 py-3">
        <h3 className="text-sm font-medium text-foreground">{template.name}</h3>
        <p className="line-clamp-2 text-xs text-muted-foreground">{template.description}</p>
      </div>
    </article>
  );
}

function TemplatePreview({ template }: { template: FormTemplate }) {
  return (
    <div
      className={cn(
        "flex h-full flex-col p-3",
        template.darkPreview ? "bg-foreground" : "bg-background",
      )}
    >
      <div
        className={cn(
          "mb-2 rounded-md px-2 py-1.5 text-[10px] font-semibold",
          previewHeaderClasses[template.previewVariant],
        )}
      >
        {template.name}
      </div>

      <div
        className={cn(
          "space-y-1.5 rounded-md border p-2",
          template.darkPreview
            ? "border-border/30 bg-card/10"
            : "border-border/60 bg-card",
        )}
      >
        <div
          className={cn(
            "h-1.5 w-12 rounded-full",
            template.darkPreview ? "bg-muted-foreground/50" : "bg-muted-foreground/30",
          )}
        />
        <div
          className={cn(
            "h-5 w-full rounded-sm border",
            template.darkPreview ? "border-border/30 bg-background/10" : "border-input bg-background",
          )}
        />
        <div
          className={cn(
            "h-4 w-10 rounded-sm",
            template.darkPreview ? "bg-primary/80" : "bg-primary",
          )}
        />
      </div>
    </div>
  );
}
