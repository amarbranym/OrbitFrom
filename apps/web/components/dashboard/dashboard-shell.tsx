import { AppSidebar } from "~/components/dashboard/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "~/components/ui/sidebar";

type DashboardShellProps = {
  children: React.ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-primary p-2">
        <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-6 lg:p-8 bg-background rounded-2xl">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
