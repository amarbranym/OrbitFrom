"use client";

import {
  buildDefaultValues,
  buildZodSchema,
  getFieldsForPage,
  getFormPages,
  type FormDocument,
} from "@repo/form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { FormStepper } from "~/components/forms/form-stepper";
import { FormRenderer } from "~/components/forms/form-renderer";
import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";

type StepperFormProps = {
  document: FormDocument;
  onSubmit: (
    values: Record<string, unknown>,
    meta?: { honeypot?: string },
  ) => void | Promise<void>;
  submitLabel?: string;
  className?: string;
  showHoneypot?: boolean;
};

export function StepperForm({
  document,
  onSubmit,
  submitLabel = "Submit",
  className,
  showHoneypot = false,
}: StepperFormProps) {
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

  const form = useForm<Record<string, unknown> & { _honeypot?: string }>({
    resolver: zodResolver(zodSchema),
    defaultValues: { ...defaultValues, _honeypot: "" },
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

  const handleNext = async () => {
    const valid = await validateCurrentStep();
    if (!valid) return;
    setCurrentStep((step) => Math.min(step + 1, pages.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((step) => Math.max(step - 1, 0));
  };

  return (
    <Form {...form} key={fieldsVersion}>
      <form
        className={className}
        onSubmit={form.handleSubmit(async (values) => {
          const { _honeypot, ...answers } = values;
          await onSubmit(answers, { honeypot: _honeypot });
        })}
      >
        {showHoneypot ? (
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            className="pointer-events-none absolute h-0 w-0 opacity-0"
            {...form.register("_honeypot")}
          />
        ) : null}

        <FormStepper pages={pages} currentIndex={currentStep} className="mb-8" />

        <div className="min-h-[200px]">
          <FormRenderer fields={currentFields} mode="live" control={form.control} />
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            Back
          </Button>
          {isLastStep ? (
            <Button type="submit" size="lg">
              {submitLabel}
            </Button>
          ) : (
            <Button type="button" size="lg" onClick={handleNext}>
              Next
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
