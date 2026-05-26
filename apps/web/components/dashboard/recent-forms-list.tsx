import Link from "next/link";
import { IconArrowRight, IconForms } from "@tabler/icons-react";

import { CreateFormButton } from "~/components/forms/create-form-dialog";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export type RecentForm = {
  id: string;
  title: string;
  status: "published" | "draft" | "unlisted";
  responses: number;
  updatedAt: string;
};

type RecentFormsListProps = {
  forms: RecentForm[];
};

const statusLabels: Record<RecentForm["status"], string> = {
  published: "Public",
  unlisted: "Unlisted",
  draft: "Draft",
};

const statusVariants: Record<RecentForm["status"], "default" | "secondary" | "outline"> = {
  published: "default",
  unlisted: "secondary",
  draft: "outline",
};

export function RecentFormsList({ forms }: RecentFormsListProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent forms</CardTitle>
          <CardDescription>Your latest form activity</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/forms">
            View all
            <IconArrowRight className="size-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {forms.length === 0 ? (
          <EmptyFormsState />
        ) : (
          forms.map((form) => (
            <Link
              key={form.id}
              href={`/dashboard/builder/${form.id}`}
              className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
            >
              <div className="space-y-1">
                <p className="font-medium">{form.title}</p>
                <p className="text-xs text-muted-foreground">
                  {form.responses} responses · Updated {form.updatedAt}
                </p>
              </div>
              <Badge variant={statusVariants[form.status]}>{statusLabels[form.status]}</Badge>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
}

function EmptyFormsState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-10 text-center">
      <IconForms className="size-8 text-muted-foreground" />
      <div>
        <p className="font-medium">No forms yet</p>
        <p className="text-sm text-muted-foreground">Create your first form to start collecting responses.</p>
      </div>
      <CreateFormButton size="sm">Create form</CreateFormButton>
    </div>
  );
}
