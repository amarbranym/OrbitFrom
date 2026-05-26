"use client";

import type { ReactNode } from "react";

import { cn } from "~/lib/utils";

type PropertySectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function PropertySection({
  title,
  description,
  children,
  className,
}: PropertySectionProps) {
  return (
    <section
      className={cn(
        "rounded-lg border border-border/70 bg-muted/20 p-4",
        className,
      )}
    >
      <div className="mb-4 space-y-1 border-b border-border/50 pb-3">
        <h3 className="text-sm font-semibold tracking-tight text-foreground">{title}</h3>
        {description ? (
          <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
