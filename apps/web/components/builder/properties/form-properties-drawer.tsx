"use client";

import { IconDeviceFloppy, IconX } from "@tabler/icons-react";

import { getSubmitButtonLabel } from "@repo/form-schema";

import { useBuilderEditor } from "~/components/builder/builder-editor-context";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { Textarea } from "~/components/ui/textarea";

export function FormPropertiesDrawer() {
  const {
    document,
    isFormPropertiesOpen,
    closeFormProperties,
    saveDocumentNow,
    updateDocument,
  } = useBuilderEditor();

  const titleInvalid = document.title.trim().length === 0;

  return (
    <Sheet open={isFormPropertiesOpen} onOpenChange={(open) => !open && closeFormProperties()}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="flex w-full flex-col gap-0 border-l border-border/80 bg-background p-0 data-[side=right]:sm:max-w-[420px]"
      >
        <SheetHeader className="shrink-0 space-y-1 rounded-none border-b border-primary/20 bg-primary px-5 py-4 text-primary-foreground">
          <div className="flex items-start justify-between gap-3">
            <SheetTitle className="text-base font-semibold text-primary-foreground">
              Form Properties
            </SheetTitle>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 text-primary-foreground hover:bg-primary-foreground/10"
              onClick={closeFormProperties}
              aria-label="Close form properties"
            >
              <IconX className="size-5" />
            </Button>
          </div>
        </SheetHeader>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5">
          <div className="space-y-2">
            <Label htmlFor="form-title">
              Form title <span className="text-destructive" aria-hidden>*</span>
            </Label>
            <Input
              id="form-title"
              value={document.title}
              onChange={(event) => updateDocument({ title: event.target.value })}
              placeholder="Event Registration"
              aria-invalid={titleInvalid}
            />
            {titleInvalid ? (
              <p className="text-xs text-destructive">Form title is required.</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="submit-button-label">Submit button label</Label>
            <Input
              id="submit-button-label"
              value={document.settings?.submitButtonLabel ?? getSubmitButtonLabel(document)}
              onChange={(event) =>
                updateDocument({
                  settings: {
                    ...document.settings,
                    submitButtonLabel: event.target.value || "Submit",
                  },
                })
              }
              placeholder="Submit"
            />
            <p className="text-xs text-muted-foreground">
              Shown on the last step of your form in preview and when published.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="form-description">Description</Label>
            <Textarea
              id="form-description"
              value={document.description ?? ""}
              onChange={(event) =>
                updateDocument({
                  description: event.target.value || undefined,
                })
              }
              placeholder="Register with us to get more details."
              rows={4}
              className="resize-y min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thank-you-message">Thank you message</Label>
            <Textarea
              id="thank-you-message"
              value={document.settings?.thankYouMessage ?? ""}
              onChange={(event) =>
                updateDocument({
                  settings: {
                    ...document.settings,
                    thankYouMessage: event.target.value || undefined,
                  },
                })
              }
              placeholder="Thanks for your response! We'll be in touch soon."
              rows={3}
              className="resize-y min-h-[80px]"
            />
            <p className="text-xs text-muted-foreground">
              Shown on the thank you page after someone submits your published form.
            </p>
          </div>
        </div>

        <SheetFooter className="shrink-0 flex-col gap-2 border-t border-border/80 bg-muted/30 px-5 py-4">
          <div className="flex w-full gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={closeFormProperties}>
              Close
            </Button>
            <Button
              type="button"
              className="flex-1 gap-2"
              disabled={titleInvalid}
              onClick={() => {
                if (titleInvalid) return;
                void saveDocumentNow().then(() => {
                  closeFormProperties();
                });
              }}
            >
              <IconDeviceFloppy className="size-4" />
              Save
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
