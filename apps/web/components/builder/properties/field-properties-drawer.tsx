"use client";

import { IconDeviceFloppy, IconTrash, IconX } from "@tabler/icons-react";
import { toast } from "sonner";

import { useBuilderEditor } from "~/components/builder/builder-editor-context";
import { PropertySection } from "~/components/builder/properties/property-section";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { getFieldMeta } from "~/lib/forms/registry/field-registry";
import { RenderPropertyControl } from "~/lib/forms/registry/property-registry";
import type { PropertyKey } from "~/lib/forms/registry/types";

type SectionConfig = {
  title: string;
  description?: string;
  keys: PropertyKey[];
};

const PROPERTY_SECTIONS: SectionConfig[] = [
  {
    title: "General",
    description: "Label and helper text shown to people filling out the form.",
    keys: ["label"],
  },
  {
    title: "Layout",
    description: "Control how wide this field appears on the form grid.",
    keys: ["colSpan"],
  },
  {
    title: "Field settings",
    description: "Placeholder, defaults, and input-specific options.",
    keys: [
      "instructions",
      "placeholder",
      "hoverText",
      "initialValue",
      "charLimit",
      "options",
      "choicePresentation",
      "multiSelectSettings",
    ],
  },
  {
    title: "Validation",
    keys: ["required", "noDuplicates"],
  },
  {
    title: "Visibility",
    description: "Show, hide, or disable this field on the live form.",
    keys: ["visibility"],
  },
];

export function FieldPropertiesDrawer() {
  const {
    selectedField,
    isPropertiesOpen,
    closeProperties,
    saveDocumentNow,
    updateField,
    removeField,
    selectField,
  } = useBuilderEditor();

  if (!selectedField) return null;

  const meta = getFieldMeta(selectedField.type);
  const fieldKeys = new Set<PropertyKey>((meta?.propertyKeys ?? []) as PropertyKey[]);
  const onChange = (patch: Partial<typeof selectedField>) =>
    updateField(selectedField.id, patch);

  const visibleSections = PROPERTY_SECTIONS.map((section) => ({
    ...section,
    keys: section.keys.filter((key) => fieldKeys.has(key)),
  })).filter((section) => section.keys.length > 0);

  return (
    <Sheet open={isPropertiesOpen} onOpenChange={(open) => !open && closeProperties()}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="flex w-full flex-col gap-0 border-l border-border/80 bg-background p-0 data-[side=right]:sm:max-w-[520px] lg:data-[side=right]:lg:max-w-[560px]"
      >
        <SheetHeader className="shrink-0 space-y-3 rounded-none border-b border-primary/20 bg-primary px-5 py-4 text-primary-foreground">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-2">
              <SheetTitle className="text-base font-semibold text-primary-foreground">
                Field properties
              </SheetTitle>
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="secondary"
                  className="border-primary-foreground/20 bg-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/15"
                >
                  {meta?.label ?? selectedField.type.replace(/_/g, " ")}
                </Badge>
                <span className="truncate text-xs text-primary-foreground/80">
                  {selectedField.label || "Untitled field"}
                </span>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 text-primary-foreground hover:bg-primary-foreground/10"
              onClick={closeProperties}
              aria-label="Close properties"
            >
              <IconX className="size-5" />
            </Button>
          </div>
        </SheetHeader>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5">
          {visibleSections.map((section) => (
            <PropertySection
              key={section.title}
              title={section.title}
              description={section.description}
            >
              {section.keys.map((key) => (
                <RenderPropertyControl
                  key={key}
                  propertyKey={key}
                  field={selectedField}
                  onChange={onChange}
                />
              ))}
            </PropertySection>
          ))}
        </div>

        <SheetFooter className="shrink-0 flex-col gap-2 border-t border-border/80 bg-muted/30 px-5 py-4">
          <div className="flex w-full gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={closeProperties}>
              Close
            </Button>
            <Button
              type="button"
              className="flex-1 gap-2"
              onClick={() => {
                void saveDocumentNow().then(() => {
                  closeProperties();
                });
              }}
            >
              <IconDeviceFloppy className="size-4" />
              Save
            </Button>
          </div>
          <Button
            type="button"
            variant="destructive"
            className="w-full gap-2"
            onClick={() => {
              removeField(selectedField.id);
              selectField(null);
            }}
          >
            <IconTrash className="size-4" />
            Delete field
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
