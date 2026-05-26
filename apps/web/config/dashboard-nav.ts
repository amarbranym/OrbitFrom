import type { Icon } from "@tabler/icons-react";
import {
  IconBrush,
  IconForms,
  IconLayoutDashboard,
  IconPlug,
  IconSettings,
  IconTable,
  IconUsers,
  IconWorld,
} from "@tabler/icons-react";

export type DashboardNavItem = {
  title: string;
  href: string;
  icon: Icon;
  description?: string;
  external?: boolean;
};

export type DashboardNavGroup = {
  label: string;
  items: DashboardNavItem[];
};

export const dashboardNavGroups: DashboardNavGroup[] = [
  {
    label: "Workspace",
    items: [
      {
        title: "Overview",
        href: "/dashboard",
        icon: IconLayoutDashboard,
        description: "Summary and recent activity",
      },
      {
        title: "My Forms",
        href: "/dashboard/forms",
        icon: IconForms,
        description: "Forms you created",
      },
      {
        title: "Shared Forms",
        href: "/dashboard/shared-forms",
        icon: IconUsers,
        description: "Forms shared with you",
      },
    ],
  },
  {
    label: "Responses",
    items: [
      {
        title: "All entries",
        href: "/dashboard/entries",
        icon: IconTable,
        description: "Submissions across all forms",
      },
    ],
  },
  {
    label: "Customize",
    items: [
      {
        title: "Themes",
        href: "/dashboard/themes",
        icon: IconBrush,
        description: "Form theme presets",
      },
      {
        title: "Integrations",
        href: "/dashboard/integrations",
        icon: IconPlug,
        description: "Webhooks and automations",
      },
    ],
  },
  {
    label: "Discover",
    items: [
      {
        title: "Explore",
        href: "/dashboard/explore",
        icon: IconWorld,
        description: "Public forms gallery",
      },
    ],
  },
];

export const dashboardSettingsNavItem: DashboardNavItem = {
  title: "Settings",
  href: "/dashboard/settings",
  icon: IconSettings,
  description: "Account and notifications",
};

/** @deprecated Use dashboardNavGroups */
export const dashboardNavItems: DashboardNavItem[] = dashboardNavGroups.flatMap(
  (group) => group.items,
);
