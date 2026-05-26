"use client";

import type { FormPage } from "@repo/form-schema";

import { cn } from "~/lib/utils";

type FormStepperProps = {
  pages: FormPage[];
  currentIndex: number;
  className?: string;
};

export function FormStepper({ pages, currentIndex, className }: FormStepperProps) {
  return (
    <nav aria-label="Form progress" className={cn("w-full", className)}>
      <ol className="flex items-center justify-center gap-0">
        {pages.map((page, index) => {
          const isActive = index === currentIndex;
          const isComplete = index < currentIndex;
          const isLast = index === pages.length - 1;

          return (
            <li key={page.id} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-2">
                <span
                  className={cn(
                    "flex size-9 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground ring-2 ring-primary/30 ring-offset-2"
                      : isComplete
                        ? "bg-primary/80 text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                  )}
                  aria-current={isActive ? "step" : undefined}
                >
                  {index + 1}
                </span>
                <span
                  className={cn(
                    "max-w-[88px] truncate text-center text-xs font-medium",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {page.title}
                </span>
              </div>
              {!isLast ? (
                <div
                  className={cn(
                    "mx-2 h-0.5 min-w-[24px] flex-1 rounded-full",
                    isComplete ? "bg-primary/60" : "bg-border",
                  )}
                  aria-hidden
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
