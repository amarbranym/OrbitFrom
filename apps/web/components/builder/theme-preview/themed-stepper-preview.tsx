"use client";

import {
  buildDefaultValues,
  buildZodSchema,
  getFieldsForPage,
  getFormPages,
  getSubmitButtonLabel,
  type FormDocument,
} from "@repo/form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { FormStepper } from "~/components/forms/form-stepper";
import { FormRenderer } from "~/components/forms/form-renderer";
import { Form } from "~/components/ui/form";
import type { FormThemePreset } from "~/lib/forms/themes/form-theme-presets";
import { cn } from "~/lib/utils";

type ThemedStepperPreviewProps = {
  document: FormDocument;
  theme: FormThemePreset;
  compact: boolean;
};

export function ThemedStepperPreview({ document, theme, compact }: ThemedStepperPreviewProps) {
  const submitLabel = getSubmitButtonLabel(document, theme.submitLabel);
  const pages = useMemo(() => getFormPages(document), [document]);
  const [currentStep, setCurrentStep] = useState(0);

  const allFields = document.fields;
  const fieldsVersion = useMemo(
    () =>
      allFields
        .map(
          (f) =>
            `${f.id}:${f.type}:${f.required}:${f.pageId ?? ""}:${f.charLimit?.min ?? ""}:${f.charLimit?.max ?? ""}`,
        )
        .join("|"),
    [allFields],
  );

  const zodSchema = useMemo(() => buildZodSchema(allFields), [fieldsVersion]);
  const defaultValues = useMemo(() => buildDefaultValues(allFields), [fieldsVersion]);

  const form = useForm<Record<string, unknown>>({
    resolver: zodResolver(zodSchema),
    defaultValues,
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const currentPage = pages[currentStep]!;
  const currentFields = useMemo(
    () => getFieldsForPage(document, currentPage.id),
    [document, currentPage.id],
  );
  const isLastStep = currentStep === pages.length - 1;

  const validateCurrentStep = async () => {
    const fieldIds = currentFields.map((f) => f.id);
    return form.trigger(fieldIds as (keyof typeof form.formState.defaultValues)[]);
  };

  const buttonClass = cn(
    "font-semibold shadow-md transition-opacity hover:opacity-90",
    compact ? "px-6 py-2 text-xs" : "px-8 py-2.5 text-sm",
  );

  return (
    <Form {...form} key={fieldsVersion}>
      <form
        onSubmit={form.handleSubmit(() => {
          /* preview only */
        })}
        className={cn(compact ? "space-y-4" : "space-y-6")}
      >
        <FormStepper
          pages={pages}
          currentIndex={currentStep}
          className={compact ? "mb-4" : "mb-6"}
        />

        <div
          className="min-h-[160px]"
          style={
            {
              "--foreground": theme.textColor,
              "--muted-foreground": theme.mutedTextColor,
            } as React.CSSProperties
          }
        >
          <FormRenderer fields={currentFields} mode="live" control={form.control} />
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            className={cn(buttonClass, "border border-current/20 bg-transparent")}
            style={{ color: theme.textColor, borderRadius: theme.buttonRadius }}
            disabled={currentStep === 0}
            onClick={() => setCurrentStep((step) => Math.max(step - 1, 0))}
          >
            Back
          </button>
          {isLastStep ? (
            <button
              type="submit"
              className={buttonClass}
              style={{
                backgroundColor: theme.primaryColor,
                color: theme.buttonTextColor,
                borderRadius: theme.buttonRadius,
              }}
            >
              {submitLabel}
            </button>
          ) : (
            <button
              type="button"
              className={buttonClass}
              style={{
                backgroundColor: theme.primaryColor,
                color: theme.buttonTextColor,
                borderRadius: theme.buttonRadius,
              }}
              onClick={async () => {
                const valid = await validateCurrentStep();
                if (valid) setCurrentStep((step) => Math.min(step + 1, pages.length - 1));
              }}
            >
              Next
            </button>
          )}
        </div>
      </form>
    </Form>
  );
}
