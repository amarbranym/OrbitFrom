"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SidebarMenuButton, SidebarMenuItem } from "~/components/ui/sidebar";
import { dashboardSettingsNavItem } from "~/config/dashboard-nav";

export function NavSettings() {
  const pathname = usePathname();
  const active =
    pathname === dashboardSettingsNavItem.href ||
    pathname.startsWith(`${dashboardSettingsNavItem.href}/`);
  const Icon = dashboardSettingsNavItem.icon;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={active} tooltip={dashboardSettingsNavItem.title}>
        <Link href={dashboardSettingsNavItem.href}>
          <Icon />
          <span>{dashboardSettingsNavItem.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
