"use client";

import type { FormDocument } from "@repo/form-schema";

import { ThemedFormPreview } from "~/components/builder/theme-preview/themed-form-preview";
import { resolveDocumentTheme } from "~/lib/forms/themes/form-theme-presets";

type ThemedLiveFormProps = {
  document: FormDocument;
  onSubmit: (
    values: Record<string, unknown>,
    meta?: { honeypot?: string },
  ) => void | Promise<void>;
  submitLabel?: string;
  showHoneypot?: boolean;
};

/** Public shared form — full theme preset (same look as builder theme preview). */
export function ThemedLiveForm({
  document,
  onSubmit,
  submitLabel,
  showHoneypot,
}: ThemedLiveFormProps) {
  const theme = resolveDocumentTheme(document);

  return (
    <div className="min-h-screen">
      <ThemedFormPreview
        document={document}
        theme={theme}
        viewport="desktop"
        fullHeight
        live={{
          onSubmit,
          showHoneypot,
          submitLabel,
        }}
      />
    </div>
  );
}
