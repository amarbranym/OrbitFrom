"use client";

import { usePathname } from "next/navigation";

import { SidebarTrigger } from "~/components/ui/sidebar";
import { Separator } from "~/components/ui/separator";
import { dashboardNavGroups, dashboardSettingsNavItem } from "~/config/dashboard-nav";

function getPageTitle(pathname: string): string {
  if (pathname === "/dashboard") return "Overview";
  if (pathname.startsWith("/dashboard/settings")) return dashboardSettingsNavItem.title;

  for (const group of dashboardNavGroups) {
    for (const item of group.items) {
      if (item.external) continue;
      if (pathname === item.href || pathname.startsWith(`${item.href}/`)) {
        return item.title;
      }
    }
  }

  return "Dashboard";
}

export function DashboardTopBar() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b border-border/60 bg-card/95 px-4 backdrop-blur-sm md:px-6">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-5" />
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
    </header>
  );
}
