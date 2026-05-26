import { IconUsers } from "@tabler/icons-react";

import { PageHeader } from "~/components/dashboard/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default function SharedFormsPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 md:gap-8">
      <PageHeader
        title="Shared Forms"
        description="Forms that teammates or collaborators have shared with you."
      />

      <Card>
        <CardHeader>
          <CardTitle>Shared with you</CardTitle>
          <CardDescription>View and respond to forms shared by others in your workspace.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16 text-center">
            <IconUsers className="size-10 text-muted-foreground" />
            <div>
              <p className="font-medium">No shared forms</p>
              <p className="text-sm text-muted-foreground">
                When someone shares a form with you, it will show up here.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
