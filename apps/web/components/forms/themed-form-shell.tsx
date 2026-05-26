"use client";

import type { FormDocument } from "@repo/form-schema";

import { getThemePreset } from "~/lib/forms/themes/form-theme-presets";
import { cn } from "~/lib/utils";

type ThemedFormShellProps = {
  document: FormDocument;
  children: React.ReactNode;
  className?: string;
};

export function ThemedFormShell({ document, children, className }: ThemedFormShellProps) {
  const preset = getThemePreset(document.theme.preset);
  const primary = document.theme.primaryColor ?? preset.primaryColor;
  const background = document.theme.backgroundColor ?? preset.backgroundColor;

  return (
    <div
      className="min-h-screen py-10 md:py-16"
      style={{
        background: `linear-gradient(160deg, ${background} 0%, color-mix(in srgb, ${background} 88%, ${primary}) 100%)`,
      }}
    >
      <div
        className={cn(
          "mx-auto w-full max-w-2xl rounded-xl border p-6 shadow-sm md:p-10",
          className,
        )}
        style={{
          borderColor: `color-mix(in srgb, ${primary} 25%, transparent)`,
          backgroundColor: "var(--card)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
