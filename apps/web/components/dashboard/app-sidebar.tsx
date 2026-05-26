import Link from "next/link";
import { IconForms, IconPlus } from "@tabler/icons-react";
import { CreateFormDialog } from "~/components/forms/create-form-dialog";
import { NavMain } from "~/components/dashboard/nav-main";
import { NavUser } from "~/components/dashboard/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "~/components/ui/sidebar";
import { cn } from "~/lib/utils";

const sidebarSurfaceClass =
  "[&_[data-slot=sidebar-inner]]:bg-primary [&_[data-slot=sidebar-inner]]:text-primary-foreground [&_[data-mobile=true]]:bg-primary [&_[data-mobile=true]]:text-primary-foreground border-none";

export function AppSidebar({ className, ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="icon"
      variant="sidebar"
      className={cn(sidebarSurfaceClass, className)}
      {...props}
    >
      <SidebarHeader className="">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
                  <IconForms className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold tracking-tight text-primary-foreground">
                    OrbitForm
                  </span>
                  <span className="truncate text-xs text-primary-foreground/70">
                    Form Builder
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        <NavMain />
      </SidebarContent>

      <SidebarFooter >
        <SidebarMenu>
          <SidebarMenuItem>
            <CreateFormDialog
              trigger={
                <SidebarMenuButton
                  tooltip="New form"
                  className="bg-sidebar-primary font-medium text-sidebar-primary-foreground shadow-sm hover:bg-sidebar-primary/90 hover:text-sidebar-primary-foreground"
                >
                  <IconPlus className="size-4" />
                  <span>New form</span>
                </SidebarMenuButton>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
        <NavUser />
      </SidebarFooter>
      {/* <SidebarRail /> */}
    </Sidebar>
  );
}
