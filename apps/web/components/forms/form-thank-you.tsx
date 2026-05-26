"use client";

import { IconCircleCheck } from "@tabler/icons-react";
import { motion } from "motion/react";
import Link from "next/link";

import type { FormDocument } from "@repo/form-schema";

import { Button } from "~/components/ui/button";
import { ThemedFormShell } from "~/components/forms/themed-form-shell";
import { getThemePreset } from "~/lib/forms/themes/form-theme-presets";
import { cn } from "~/lib/utils";

type FormThankYouProps = {
  document: FormDocument;
  message?: string;
  className?: string;
};

export function FormThankYou({ document, message, className }: FormThankYouProps) {
  const preset = getThemePreset(document.theme.preset);
  const primary = document.theme.primaryColor ?? preset.primaryColor;
  const thankYouMessage =
    message?.trim() || document.settings?.thankYouMessage?.trim() || "Thanks for your response!";

  return (
    <ThemedFormShell document={document} className={cn("text-center", className)}>
      <motion.div
        className="flex flex-col items-center gap-6 py-4 md:py-8"
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
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Submission received
          </p>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{document.title}</h1>
          <p className="mx-auto max-w-md text-base leading-relaxed text-muted-foreground">
            {thankYouMessage}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button
            asChild
            style={{
              backgroundColor: primary,
              color: "white",
            }}
            className="border-0 shadow-sm hover:opacity-90"
          >
            <Link href="/explore">Explore more forms</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/f/${document.slug}`}>Submit another response</Link>
          </Button>
        </div>
      </motion.div>
    </ThemedFormShell>
  );
}
