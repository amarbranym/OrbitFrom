"use client";

import { IconSearch } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";

import { TemplateCard } from "~/components/forms/template-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  filterTemplates,
  formTemplates,
  groupTemplatesByCategory,
  templateCategories,
  type TemplateCategoryId,
} from "~/lib/forms/template-gallery-data";
import { cn } from "~/lib/utils";

type TemplateGalleryDialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function TemplateGalleryDialog({ open, onOpenChange }: TemplateGalleryDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<TemplateCategoryId>("all");

  const filteredTemplates = useMemo(
    () => filterTemplates(formTemplates, activeCategory, searchQuery),
    [activeCategory, searchQuery],
  );

  const groupedTemplates = useMemo(
    () => groupTemplatesByCategory(filteredTemplates),
    [filteredTemplates],
  );

  const handleClose = () => onOpenChange?.(false);

  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setActiveCategory("all");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="fixed inset-0 z-50 flex h-dvh w-screen max-h-none max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-none border-0 p-0 ring-0 sm:max-w-none"
      >
        <DialogHeader className="relative shrink-0 space-y-4 overflow-hidden border-b border-border/60 bg-gradient-to-br from-primary/15 via-accent to-chart-2/15 px-6 pb-6 pt-8 text-center sm:px-10">
          <DialogTitle className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Template Gallery
          </DialogTitle>

          <div className="relative mx-auto w-full max-w-xl">
            <IconSearch
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              type="search"
              placeholder="Search templates"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="h-11 rounded-full border-border/60 bg-background/90 pl-10 shadow-xs backdrop-blur-sm"
            />
          </div>
        </DialogHeader>

        <div className="flex min-h-0 flex-1">
          <aside className="hidden w-64 shrink-0 border-r border-border/60 bg-muted/20 p-4 sm:block">
            <p className="mb-3 px-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Categories
            </p>
            <nav className="space-y-1">
              {templateCategories.map((category) => {
                const IconComponent = category.icon;
                const isActive = activeCategory === category.id;

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setActiveCategory(category.id)}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                      isActive
                        ? "bg-accent font-medium text-accent-foreground"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                    )}
                  >
                    <IconComponent className="size-4 shrink-0" stroke={1.5} aria-hidden />
                    {category.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          <ScrollArea className="min-h-0 flex-1">
            <div className="space-y-6 p-4 sm:space-y-8 sm:p-6">
              <div className="flex gap-2 overflow-x-auto pb-1 sm:hidden">
                {templateCategories.map((category) => {
                  const isActive = activeCategory === category.id;

                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setActiveCategory(category.id)}
                      className={cn(
                        "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                        isActive
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-muted-foreground",
                      )}
                    >
                      {category.label}
                    </button>
                  );
                })}
              </div>

              {groupedTemplates.length === 0 ? (
                <div className="flex min-h-48 flex-col items-center justify-center gap-2 text-center">
                  <p className="text-sm font-medium text-foreground">No templates found</p>
                  <p className="text-sm text-muted-foreground">
                    Try a different search term or category.
                  </p>
                </div>
              ) : (
                groupedTemplates.map(([sectionLabel, templates]) => (
                  <section key={sectionLabel}>
                    <h2 className="mb-4 text-base font-semibold text-foreground">{sectionLabel}</h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                      {templates.map((template) => (
                        <TemplateCard key={template.id} template={template} onUse={handleClose} />
                      ))}
                    </div>
                  </section>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
