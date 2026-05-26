import { DashboardShell } from "~/components/dashboard/dashboard-shell";
import { InitFormRegistry } from "~/components/forms/init-form-registry";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell>
      <InitFormRegistry />
      {children}
    </DashboardShell>
  );
}
