import { IconPlug } from "@tabler/icons-react";

import { PageHeader } from "~/components/dashboard/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default function IntegrationsPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 md:gap-8">
      <PageHeader
        title="Integrations"
        description="Connect email, webhooks and third-party tools to your forms."
      />

      <Card>
        <CardHeader>
          <CardTitle>Available integrations</CardTitle>
          <CardDescription>Extend OrbitForm with notifications and automation.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16 text-center">
            <IconPlug className="size-10 text-muted-foreground" />
            <div>
              <p className="font-medium">No integrations connected</p>
              <p className="text-sm text-muted-foreground">
                Email notifications, Zapier and API webhooks will be available here.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
