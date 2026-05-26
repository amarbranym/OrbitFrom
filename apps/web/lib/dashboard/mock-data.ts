import {
  IconChartBar,
  IconEye,
  IconForms,
  IconMessageCircle,
} from "@tabler/icons-react";

import type { RecentForm } from "~/components/dashboard/recent-forms-list";
import type { StatCard } from "~/components/dashboard/stats-grid";

export const dashboardStats: StatCard[] = [
  {
    title: "Total forms",
    value: "0",
    description: "Across all visibility modes",
    icon: IconForms,
    href: "/dashboard/forms",
  },
  {
    title: "Published",
    value: "0",
    description: "Public and unlisted forms",
    icon: IconEye,
    href: "/dashboard/forms",
  },
  {
    title: "Responses",
    value: "0",
    description: "Total submissions received",
    icon: IconMessageCircle,
    href: "/dashboard/entries",
  },
  {
    title: "Completion rate",
    value: "—",
    description: "Average across active forms",
    icon: IconChartBar,
    trend: { value: "No data", direction: "neutral" },
  },
];

export const recentForms: RecentForm[] = [];
