"use client";

import {
  buildDefaultValues,
  buildZodSchema,
  getSubmitButtonLabel,
  isMultiPageForm,
  type FormDocument,
} from "@repo/form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

import { FormRenderer } from "~/components/forms/form-renderer";
import { StepperForm } from "~/components/forms/stepper-form";
import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";

type DynamicFormProps = {
  document: FormDocument;
  onSubmit: (
    values: Record<string, unknown>,
    meta?: { honeypot?: string },
  ) => void | Promise<void>;
  submitLabel?: string;
  className?: string;
  showHoneypot?: boolean;
};

export function DynamicForm({
  submitLabel,
  ...props
}: DynamicFormProps) {
  const resolvedSubmitLabel =
    submitLabel ?? getSubmitButtonLabel(props.document);

  if (isMultiPageForm(props.document)) {
    return <StepperForm {...props} submitLabel={resolvedSubmitLabel} />;
  }
  return <ClassicDynamicForm {...props} submitLabel={resolvedSubmitLabel} />;
}

function ClassicDynamicForm({
  document,
  onSubmit,
  submitLabel = "Submit",
  className,
  showHoneypot = false,
}: DynamicFormProps) {
  const fields = document.fields;
  const fieldsVersion = useMemo(
    () =>
      fields
        .map(
          (f) =>
            `${f.id}:${f.type}:${f.required}:${f.colSpan}:${f.charLimit?.min ?? ""}:${f.charLimit?.max ?? ""}`,
        )
        .join("|"),
    [fields],
  );

  const zodSchema = useMemo(() => buildZodSchema(fields), [fieldsVersion]);
  const defaultValues = useMemo(() => buildDefaultValues(fields), [fieldsVersion]);

  const form = useForm<Record<string, unknown> & { _honeypot?: string }>({
    resolver: zodResolver(zodSchema),
    defaultValues: { ...defaultValues, _honeypot: "" },
    mode: "onTouched",
    reValidateMode: "onChange",
  });

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
        {document.description ? (
          <p className="mb-6 text-sm text-muted-foreground">{document.description}</p>
        ) : null}
        <FormRenderer fields={fields} mode="live" control={form.control} />
        <div className="mt-8 flex justify-end">
          <Button type="submit" size="lg">
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
