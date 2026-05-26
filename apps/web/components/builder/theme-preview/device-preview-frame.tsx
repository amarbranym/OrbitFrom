"use client";

import type { ReactNode } from "react";

import {
  VIEWPORT_LAYOUT,
  type ThemePreviewViewport,
} from "~/lib/forms/themes/form-theme-presets";
import { cn } from "~/lib/utils";

type DevicePreviewFrameProps = {
  viewport: ThemePreviewViewport;
  children: ReactNode;
};

export function DevicePreviewFrame({ viewport, children }: DevicePreviewFrameProps) {
  const layout = VIEWPORT_LAYOUT[viewport];
  const isDesktop = viewport === "desktop";

  return (
    <div
      className={cn(
        "flex w-full flex-1 justify-center transition-all duration-300 ease-out",
        !isDesktop && "items-start py-6 md:py-10",
        isDesktop && "items-stretch",
      )}
      style={{ padding: layout.canvasPadding }}
    >
      <div
        className={cn(
          "w-full transition-all duration-300 ease-out",
          layout.showDeviceChrome &&
            "overflow-hidden rounded-xl border border-border/40 bg-foreground/5 shadow-2xl ring-1 ring-border/30",
          viewport === "mobile" && layout.showDeviceChrome && "rounded-[1.75rem]",
        )}
        style={{ maxWidth: layout.frameMaxWidth }}
      >
        {layout.showDeviceChrome ? (
          <div
            className={cn(
              "flex items-center justify-center border-b border-border/20 bg-muted/30 px-4 py-2",
              viewport === "mobile" && "py-2.5",
            )}
            aria-hidden
          >
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-destructive/70" />
              <span className="size-2 rounded-full bg-amber-400/80" />
              <span className="size-2 rounded-full bg-emerald-500/70" />
            </div>
            {viewport === "mobile" ? (
              <div className="mx-auto h-1 w-16 rounded-full bg-foreground/15" />
            ) : null}
          </div>
        ) : null}
        <div
          className="w-full transition-all duration-300"
          style={{ maxWidth: layout.formMaxWidth }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
