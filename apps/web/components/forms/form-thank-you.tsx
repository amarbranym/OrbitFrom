"use client";

import { IconCircleCheck } from "@tabler/icons-react";
import { motion } from "motion/react";
import Link from "next/link";

import type { FormDocument } from "@repo/form-schema";

import { ThemedFormPreview } from "~/components/builder/theme-preview/themed-form-preview";
import { resolveDocumentTheme } from "~/lib/forms/themes/form-theme-presets";
import { cn } from "~/lib/utils";

type FormThankYouProps = {
  document: FormDocument;
  message?: string;
  className?: string;
};

export function FormThankYou({ document, message, className }: FormThankYouProps) {
  const theme = resolveDocumentTheme(document);
  const primary = theme.primaryColor;
  const thankYouMessage =
    message?.trim() || document.settings?.thankYouMessage?.trim() || "Thanks for your response!";

  return (
    <ThemedFormPreview document={document} theme={theme} viewport="desktop" fullHeight>
      <motion.div
        className={cn("flex flex-col items-center gap-6 py-4 text-center md:py-8", className)}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="flex size-20 items-center justify-center rounded-full"
          style={{
            backgroundColor: `color-mix(in srgb, ${primary} 14%, transparent)`,
            color: primary,
          }}
          initial={{ scale: 0.85 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 22, delay: 0.05 }}
        >
          <IconCircleCheck className="size-11" stroke={1.5} aria-hidden />
        </motion.div>

        <div className="space-y-2">
          <p
            className="text-xs font-semibold uppercase tracking-[0.2em]"
            style={{ color: theme.mutedTextColor }}
          >
            Submission received
          </p>
          <p className="text-base leading-relaxed" style={{ color: theme.mutedTextColor }}>
            {thankYouMessage}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/explore"
            className="inline-flex h-10 items-center justify-center rounded-md px-6 text-sm font-medium shadow-sm transition-opacity hover:opacity-90"
            style={{
              backgroundColor: primary,
              color: theme.buttonTextColor,
              borderRadius: theme.buttonRadius,
            }}
          >
            Explore more forms
          </Link>
          <Link
            href={`/f/${document.slug}`}
            className="inline-flex h-10 items-center justify-center rounded-md border px-6 text-sm font-medium transition-colors hover:opacity-90"
            style={{
              borderColor: `color-mix(in srgb, ${primary} 35%, transparent)`,
              color: theme.textColor,
            }}
          >
            Submit another response
          </Link>
        </div>
      </motion.div>
    </ThemedFormPreview>
  );
}
