"use client";

import { IconChartBar, IconForms, IconWorld, IconCheck } from "@tabler/icons-react";
import { useMemo } from "react";

import { CreateFormButton } from "~/components/forms/create-form-dialog";
import { PageHeader } from "~/components/dashboard/page-header";
import { RecentFormsList } from "~/components/dashboard/recent-forms-list";
import { StatsGrid } from "~/components/dashboard/stats-grid";
import { trpc } from "~/trpc/client";

export default function DashboardPage() {
  const { data: forms = [] } = trpc.forms.list.useQuery({});

  const stats = useMemo(() => {
    const totalForms = forms.length;
    const published = forms.filter((f) => f.status === "published").length;
    const totalResponses = forms.reduce((sum, f) => sum + f.responseCount, 0);
    const publicForms = forms.filter((f) => f.visibility === "public").length;

    return [
      {
        title: "Total forms",
        value: String(totalForms),
        description: "Forms in your workspace",
        icon: IconForms,
      },
      {
        title: "Published",
        value: String(published),
        description: "Live and accepting responses",
        icon: IconCheck,
      },
      {
        title: "Responses",
        value: String(totalResponses),
        description: "All submissions collected",
        icon: IconChartBar,
      },
      {
        title: "Public",
        value: String(publicForms),
        description: "Visible on explore",
        icon: IconWorld,
        href: "/explore",
      },
    ];
  }, [forms]);

  const recent = forms.slice(0, 5).map((f) => ({
    id: f.id,
    title: f.title,
    status:
      f.status === "published"
        ? ("published" as const)
        : f.visibility === "unlisted"
          ? ("unlisted" as const)
          : ("draft" as const),
    responses: f.responseCount,
    updatedAt: new Date(f.updatedAt).toLocaleDateString(),
  }));

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 md:gap-8">
      <PageHeader
        title="Overview"
        description="Track your forms, responses, and publishing activity."
        action={<CreateFormButton className="shadow-sm" />}
      />

      <StatsGrid stats={stats} />
      <RecentFormsList forms={recent} />
    </div>
  );
}
