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

import { ThemedStepperPreview } from "~/components/builder/theme-preview/themed-stepper-preview";
import { FormRenderer } from "~/components/forms/form-renderer";
import { Form } from "~/components/ui/form";
import type {
  FormThemePreset,
  ThemePreviewViewport,
} from "~/lib/forms/themes/form-theme-presets";
import { cn } from "~/lib/utils";

type ThemedFormPreviewProps = {
  document: FormDocument;
  theme: FormThemePreset;
  viewport: ThemePreviewViewport;
};

export function ThemedFormPreview({ document, theme, viewport }: ThemedFormPreviewProps) {
  const fields = document.fields;
  const fieldsVersion = useMemo(
    () =>
      fields
        .map(
          (f) =>
            `${f.id}:${f.type}:${f.required}:${f.charLimit?.min ?? ""}:${f.charLimit?.max ?? ""}`,
        )
        .join("|"),
    [fields],
  );

  const zodSchema = useMemo(() => buildZodSchema(fields), [fieldsVersion]);
  const defaultValues = useMemo(() => buildDefaultValues(fields), [fieldsVersion]);

  const form = useForm<Record<string, unknown>>({
    resolver: zodResolver(zodSchema),
    defaultValues,
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const backgroundStyle = theme.backgroundImage
    ? { backgroundImage: theme.backgroundImage, backgroundSize: "cover", backgroundPosition: "center" }
    : theme.backgroundGradient
      ? { background: theme.backgroundGradient }
      : { backgroundColor: theme.backgroundColor };

  const description = document.description?.trim();
  const submitLabel = getSubmitButtonLabel(document, theme.submitLabel);

  const compact = viewport === "mobile";
  const cozy = viewport === "tablet";

  return (
    <div
      className="flex min-h-full w-full justify-center"
      style={backgroundStyle}
    >
      <div
        className={cn(
          "w-full overflow-hidden shadow-2xl transition-all duration-300",
          compact ? "text-sm" : "",
        )}
        style={{
          borderRadius:
            theme.id === "pastel-garden" ? "0.75rem" : compact ? "0.375rem" : "0.5rem",
        }}
      >
        {theme.headerStyle === "band" ? (
          <div
            className={cn(
              "text-center",
              compact ? "px-4 py-5" : cozy ? "px-6 py-6" : "px-6 py-8",
            )}
            style={{
              backgroundColor: theme.headerColor,
              color: theme.headerTextColor,
              fontFamily: theme.titleFontFamily,
            }}
          >
            <h1
              className={cn(
                "font-semibold tracking-tight",
                compact ? "text-xl" : cozy ? "text-2xl" : "text-3xl md:text-4xl",
              )}
            >
              {document.title}
            </h1>
            {description ? (
              <p className={cn("mt-2 opacity-90", compact ? "text-sm" : "text-base")}>
                {description}
              </p>
            ) : null}
          </div>
        ) : null}

        <div
          className={cn(
            compact ? "px-4 py-5" : cozy ? "px-6 py-7" : "px-6 py-8 md:px-10 md:py-10",
          )}
          style={{
            backgroundColor: theme.cardBackground,
            color: theme.textColor,
            fontFamily: theme.fontFamily,
          }}
        >
          {theme.headerStyle === "inline" ? (
            <header className={cn("space-y-2 text-center", compact ? "mb-5" : "mb-8")}>
              <h1
                className={cn(
                  "font-bold tracking-tight",
                  compact ? "text-xl" : cozy ? "text-2xl" : "text-3xl",
                )}
                style={{
                  color: theme.headerTextColor,
                  fontFamily: theme.titleFontFamily,
                }}
              >
                {document.title}
              </h1>
              {description ? (
                <p className="text-base" style={{ color: theme.mutedTextColor }}>
                  {description}
                </p>
              ) : null}
            </header>
          ) : null}

          {isMultiPageForm(document) ? (
            <ThemedStepperPreview document={document} theme={theme} compact={compact} />
          ) : (
            <Form {...form} key={fieldsVersion}>
              <form
                onSubmit={form.handleSubmit(() => {
                  /* Preview only — validation feedback without persisting */
                })}
                className={cn(compact ? "space-y-4" : "space-y-6")}
              >
                <div
                  className={cn(
                    "[&_label]:font-medium",
                    theme.id === "nightfall" &&
                      "[&_input]:border-slate-600 [&_input]:bg-slate-800/50 [&_textarea]:border-slate-600 [&_textarea]:bg-slate-800/50",
                  )}
                  style={
                    {
                      "--foreground": theme.textColor,
                      "--muted-foreground": theme.mutedTextColor,
                    } as React.CSSProperties
                  }
                >
                  <FormRenderer fields={fields} mode="live" control={form.control} />
                </div>

                <div className="flex justify-center pt-2">
                  <button
                    type="submit"
                    className={cn(
                      "font-semibold shadow-md transition-opacity hover:opacity-90",
                      compact ? "px-8 py-2 text-xs" : "px-10 py-2.5 text-sm",
                    )}
                    style={{
                      backgroundColor: theme.primaryColor,
                      color: theme.buttonTextColor,
                      borderRadius: theme.buttonRadius,
                    }}
                  >
                    {submitLabel}
                  </button>
                </div>
              </form>
            </Form>
          )}
        </div>

        {theme.showFooter ? (
          <div
            className="px-4 py-3 text-center text-[10px] leading-relaxed"
            style={{
              backgroundColor: theme.id === "nightfall" ? "#0f172a" : "#1e3a5f",
              color: "#cbd5e1",
            }}
          >
            <p>
              Never submit passwords through forms. Report suspicious forms to
              protect our community.
            </p>
            <p className="mt-1 opacity-70">Powered by OrbitForm</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
