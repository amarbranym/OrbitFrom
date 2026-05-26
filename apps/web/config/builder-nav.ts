import type { Icon } from "@tabler/icons-react";
import {
  IconBrush,
  IconPlug,
  IconShare,
  IconTable,
  IconTool,
} from "@tabler/icons-react";

export type BuilderNavSegment = "builder" | "themes" | "integrations" | "entries" | "share";

export type BuilderNavItem = {
  id: BuilderNavSegment;
  title: string;
  icon: Icon;
  segment?: string;
};

export const builderNavItems: BuilderNavItem[] = [
  {
    id: "builder",
    title: "Builder",
    icon: IconTool,
  },
  {
    id: "themes",
    title: "Themes",
    icon: IconBrush,
    segment: "themes",
  },
  {
    id: "share",
    title: "Share",
    icon: IconShare,
  },
  {
    id: "integrations",
    title: "Integrations",
    icon: IconPlug,
    segment: "integrations",
  },
  {
    id: "entries",
    title: "All entries",
    icon: IconTable,
    segment: "entries",
  },
];

export function builderHref(
  formId: string,
  segment?: string,
  query?: Record<string, string | undefined>,
) {
  const base = segment
    ? `/dashboard/builder/${formId}/${segment}`
    : `/dashboard/builder/${formId}`;

  if (!query) {
    return base;
  }

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value) {
      params.set(key, value);
    }
  }

  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

export function getActiveBuilderSegment(pathname: string, formId: string): BuilderNavSegment {
  const prefix = `/dashboard/builder/${formId}`;

  if (pathname.startsWith(`${prefix}/themes`)) return "themes";
  if (pathname.startsWith(`${prefix}/integrations`)) return "integrations";
  if (pathname.startsWith(`${prefix}/entries`)) return "entries";
  return "builder";
}
