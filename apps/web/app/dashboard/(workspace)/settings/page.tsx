import { PageHeader } from "~/components/dashboard/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Switch } from "~/components/ui/switch";

import { SettingsProfile } from "./settings-profile";

export default function SettingsPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 md:gap-8">
      <PageHeader
        title="Settings"
        description="Manage your account and notification preferences."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <SettingsProfile />

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Email alerts for new responses.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">New response alerts</p>
                <p className="text-xs text-muted-foreground">
                  Get emailed when someone submits a form.
                </p>
              </div>
              <Switch defaultChecked disabled />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Weekly summary</p>
                <p className="text-xs text-muted-foreground">
                  Receive a weekly analytics digest.
                </p>
              </div>
              <Switch disabled />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

