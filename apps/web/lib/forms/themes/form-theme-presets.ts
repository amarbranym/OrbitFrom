import type { FormDocument } from "@repo/form-schema";

export type ThemePreviewViewport = "desktop" | "tablet" | "mobile";

export type FormThemePreset = {
  id: string;
  name: string;
  primaryColor: string;
  backgroundColor: string;
  headerColor: string;
  headerTextColor: string;
  cardBackground: string;
  textColor: string;
  mutedTextColor: string;
  buttonTextColor: string;
  buttonRadius: string;
  headerStyle: "band" | "inline";
  backgroundImage?: string;
  backgroundGradient?: string;
  fontFamily?: string;
  titleFontFamily?: string;
  submitLabel: string;
  showFooter: boolean;
  preview: {
    header: string;
    body: string;
    accent: string;
    background: string;
  };
};

export const FORM_THEME_PRESETS: FormThemePreset[] = [
  {
    id: "default",
    name: "Default",
    primaryColor: "#0d9488",
    backgroundColor: "#e8ecef",
    headerColor: "#ffffff",
    headerTextColor: "#111827",
    cardBackground: "#ffffff",
    textColor: "#111827",
    mutedTextColor: "#6b7280",
    buttonTextColor: "#ffffff",
    buttonRadius: "9999px",
    headerStyle: "inline",
    submitLabel: "Sign me up",
    showFooter: true,
    preview: {
      header: "#ffffff",
      body: "#f8fafc",
      accent: "#0d9488",
      background: "#e8ecef",
    },
  },
  {
    id: "pastel-garden",
    name: "Pastel Garden",
    primaryColor: "#2563eb",
    backgroundColor: "#faf6ef",
    headerColor: "#faf6ef",
    headerTextColor: "#1d4ed8",
    cardBackground: "#faf6ef",
    textColor: "#1e3a5f",
    mutedTextColor: "#64748b",
    buttonTextColor: "#ffffff",
    buttonRadius: "9999px",
    headerStyle: "inline",
    backgroundGradient:
      "radial-gradient(circle at 10% 20%, #fde68a55 0%, transparent 40%), radial-gradient(circle at 90% 10%, #93c5fd55 0%, transparent 35%), radial-gradient(circle at 80% 90%, #f9a8d455 0%, transparent 40%)",
    titleFontFamily: "Georgia, 'Times New Roman', serif",
    submitLabel: "Sign me up",
    showFooter: true,
    preview: {
      header: "#faf6ef",
      body: "#faf6ef",
      accent: "#2563eb",
      background: "#faf6ef",
    },
  },
  {
    id: "mudful",
    name: "Mudful",
    primaryColor: "#8b5e3c",
    backgroundColor: "#d4a574",
    headerColor: "#8b5e3c",
    headerTextColor: "#ffffff",
    cardBackground: "#ffffff",
    textColor: "#1f2937",
    mutedTextColor: "#6b7280",
    buttonTextColor: "#ffffff",
    buttonRadius: "0.375rem",
    headerStyle: "band",
    backgroundGradient:
      "linear-gradient(180deg, #e8c9a0 0%, #c9956a 45%, #a67c52 100%)",
    titleFontFamily: "Georgia, 'Times New Roman', serif",
    submitLabel: "Sign me up",
    showFooter: true,
    preview: {
      header: "#8b5e3c",
      body: "#ffffff",
      accent: "#8b5e3c",
      background: "#c9956a",
    },
  },
  {
    id: "nebula",
    name: "Nebula",
    primaryColor: "#7c3aed",
    backgroundColor: "#1e1b4b",
    headerColor: "#312e81",
    headerTextColor: "#e9d5ff",
    cardBackground: "#312e81",
    textColor: "#f5f3ff",
    mutedTextColor: "#c4b5fd",
    buttonTextColor: "#ffffff",
    buttonRadius: "9999px",
    headerStyle: "band",
    backgroundGradient:
      "radial-gradient(ellipse at 20% 0%, #6366f155 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, #a855f755 0%, transparent 45%), #1e1b4b",
    submitLabel: "Sign me up",
    showFooter: true,
    preview: {
      header: "#312e81",
      body: "#312e81",
      accent: "#7c3aed",
      background: "#1e1b4b",
    },
  },
  {
    id: "law-bridge",
    name: "Law Bridge",
    primaryColor: "#1e40af",
    backgroundColor: "#f1f5f9",
    headerColor: "#1e3a8a",
    headerTextColor: "#ffffff",
    cardBackground: "#ffffff",
    textColor: "#0f172a",
    mutedTextColor: "#64748b",
    buttonTextColor: "#ffffff",
    buttonRadius: "0.25rem",
    headerStyle: "band",
    submitLabel: "Submit",
    showFooter: true,
    preview: {
      header: "#1e3a8a",
      body: "#ffffff",
      accent: "#1e40af",
      background: "#f1f5f9",
    },
  },
  {
    id: "pawfect-friends",
    name: "Pawfect Friends",
    primaryColor: "#ea580c",
    backgroundColor: "#fff7ed",
    headerColor: "#fff7ed",
    headerTextColor: "#c2410c",
    cardBackground: "#ffffff",
    textColor: "#431407",
    mutedTextColor: "#9a3412",
    buttonTextColor: "#ffffff",
    buttonRadius: "9999px",
    headerStyle: "inline",
    backgroundGradient:
      "radial-gradient(circle at 15% 85%, #fed7aa88 0%, transparent 40%), radial-gradient(circle at 85% 15%, #fdba7488 0%, transparent 35%)",
    titleFontFamily: "Georgia, 'Times New Roman', serif",
    submitLabel: "Sign me up",
    showFooter: true,
    preview: {
      header: "#fff7ed",
      body: "#ffffff",
      accent: "#ea580c",
      background: "#fff7ed",
    },
  },
  {
    id: "blue-desk",
    name: "Blue Desk",
    primaryColor: "#0284c7",
    backgroundColor: "#e0f2fe",
    headerColor: "#0c4a6e",
    headerTextColor: "#f0f9ff",
    cardBackground: "#ffffff",
    textColor: "#0c4a6e",
    mutedTextColor: "#0369a1",
    buttonTextColor: "#ffffff",
    buttonRadius: "0.375rem",
    headerStyle: "band",
    submitLabel: "Sign me up",
    showFooter: true,
    preview: {
      header: "#0c4a6e",
      body: "#ffffff",
      accent: "#0284c7",
      background: "#e0f2fe",
    },
  },
  {
    id: "nightfall",
    name: "Nightfall",
    primaryColor: "#38bdf8",
    backgroundColor: "#0f172a",
    headerColor: "#1e293b",
    headerTextColor: "#f8fafc",
    cardBackground: "#1e293b",
    textColor: "#f1f5f9",
    mutedTextColor: "#94a3b8",
    buttonTextColor: "#0f172a",
    buttonRadius: "0.5rem",
    headerStyle: "band",
    backgroundGradient: "linear-gradient(160deg, #020617 0%, #1e1b4b 50%, #0f172a 100%)",
    submitLabel: "Submit",
    showFooter: false,
    preview: {
      header: "#1e293b",
      body: "#1e293b",
      accent: "#38bdf8",
      background: "#0f172a",
    },
  },
];

const THEME_ALIASES: Record<string, string> = {
  "anime-neon": "nebula",
  "startup-minimal": "default",
  "retro-game": "nightfall",
};

export function getThemePreset(id: string): FormThemePreset {
  const resolved = THEME_ALIASES[id] ?? id;
  return FORM_THEME_PRESETS.find((theme) => theme.id === resolved) ?? FORM_THEME_PRESETS[0]!;
}

export function getFormThemePreset(id: string): FormThemePreset {
  return getThemePreset(id);
}

export function themePresetToDocumentTheme(preset: FormThemePreset) {
  return {
    preset: preset.id,
    primaryColor: preset.primaryColor,
    backgroundColor: preset.backgroundColor,
  };
}

export function getDocumentThemePreset(document: FormDocument) {
  return getThemePreset(document.theme?.preset ?? "default");
}

export type ViewportLayoutConfig = {
  /** Outer device frame max width */
  frameMaxWidth: string;
  /** Inner form card max width (desktop only; tablet/mobile fill frame) */
  formMaxWidth: string;
  /** Horizontal padding on preview canvas */
  canvasPadding: string;
  /** Whether to show device chrome (bezel) */
  showDeviceChrome: boolean;
};

export const VIEWPORT_LAYOUT: Record<ThemePreviewViewport, ViewportLayoutConfig> = {
  desktop: {
    frameMaxWidth: "min(100%, 960px)",
    formMaxWidth: "100%",
    canvasPadding: "2rem 2.5rem",
    showDeviceChrome: false,
  },
  tablet: {
    frameMaxWidth: "768px",
    formMaxWidth: "100%",
    canvasPadding: "2.5rem 1.5rem",
    showDeviceChrome: true,
  },
  mobile: {
    frameMaxWidth: "390px",
    formMaxWidth: "100%",
    canvasPadding: "2rem 1rem",
    showDeviceChrome: true,
  },
};

/** @deprecated Use VIEWPORT_LAYOUT */
export const VIEWPORT_MAX_WIDTH: Record<ThemePreviewViewport, string> = {
  desktop: VIEWPORT_LAYOUT.desktop.formMaxWidth,
  tablet: VIEWPORT_LAYOUT.tablet.formMaxWidth,
  mobile: VIEWPORT_LAYOUT.mobile.formMaxWidth,
};
