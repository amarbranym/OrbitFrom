"use client";

import type { FormThemePreset } from "~/lib/forms/themes/form-theme-presets";
import { cn } from "~/lib/utils";

type ThemeFormMockupProps = {
  theme: FormThemePreset;
  className?: string;
};

export function ThemeFormMockup({ theme, className }: ThemeFormMockupProps) {
  const backgroundStyle = theme.backgroundGradient
    ? { background: theme.backgroundGradient }
    : { backgroundColor: theme.backgroundColor };

  return (
    <div
      className={cn("relative flex h-full w-full items-center justify-center p-3", className)}
      style={backgroundStyle}
    >
      <div
        className="w-full max-w-[92%] overflow-hidden shadow-lg"
        style={{
          borderRadius: theme.id === "pastel-garden" ? "0.5rem" : "0.25rem",
        }}
      >
        {theme.headerStyle === "band" ? (
          <div
            className="px-2 py-2 text-center"
            style={{
              backgroundColor: theme.headerColor,
              color: theme.headerTextColor,
            }}
          >
            <p
              className="truncate text-[9px] font-semibold leading-tight"
              style={{ fontFamily: theme.titleFontFamily }}
            >
              Registration Form
            </p>
            <p className="mt-0.5 truncate text-[6px] opacity-80">Register with us</p>
          </div>
        ) : null}

        <div
          className="px-2.5 py-2.5"
          style={{
            backgroundColor: theme.cardBackground,
            color: theme.textColor,
          }}
        >
          {theme.headerStyle === "inline" ? (
            <div className="mb-2 text-center">
              <p
                className="text-[9px] font-bold leading-tight"
                style={{
                  color: theme.headerTextColor,
                  fontFamily: theme.titleFontFamily,
                }}
              >
                Registration Form
              </p>
              <p
                className="mt-0.5 text-[6px]"
                style={{ color: theme.mutedTextColor }}
              >
                Register with us to get more details.
              </p>
            </div>
          ) : null}

          <div className="space-y-1.5">
            <div>
              <div
                className="mb-0.5 h-1 w-8 rounded-sm opacity-70"
                style={{ backgroundColor: theme.mutedTextColor }}
              />
              <div
                className="h-2.5 w-full rounded-sm border"
                style={{
                  borderColor: `${theme.mutedTextColor}40`,
                  backgroundColor:
                    theme.id === "nightfall" ? "rgba(30,41,59,0.5)" : "#fff",
                }}
              />
            </div>
            <div>
              <div
                className="mb-0.5 h-1 w-6 rounded-sm opacity-70"
                style={{ backgroundColor: theme.mutedTextColor }}
              />
              <div
                className="h-2.5 w-full rounded-sm border"
                style={{
                  borderColor: `${theme.mutedTextColor}40`,
                  backgroundColor:
                    theme.id === "nightfall" ? "rgba(30,41,59,0.5)" : "#fff",
                }}
              />
            </div>
            <div className="flex justify-center pt-1">
              <div
                className="h-2.5 min-w-[40%] px-2"
                style={{
                  backgroundColor: theme.primaryColor,
                  borderRadius: theme.buttonRadius,
                }}
              />
            </div>
          </div>
        </div>

        {theme.showFooter ? (
          <div
            className="px-1 py-1 text-center text-[5px] leading-tight opacity-80"
            style={{
              backgroundColor: theme.id === "nightfall" ? "#0f172a" : "#1e3a5f",
              color: "#cbd5e1",
            }}
          >
            Powered by OrbitForm
          </div>
        ) : null}
      </div>
    </div>
  );
}
