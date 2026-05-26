"use client";

import { IconPalette } from "@tabler/icons-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { BuilderThemesWorkspace } from "~/components/builder/theme-preview/builder-themes-workspace";
import { Button } from "~/components/ui/button";

export default function BuilderThemesPage() {
  const params = useParams<{ formId: string }>();

  if (params.formId === "new") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
          <IconPalette className="size-7 text-muted-foreground" stroke={1.5} />
        </div>
        <div className="max-w-sm space-y-2">
          <p className="font-semibold">Save your form first</p>
          <p className="text-sm text-muted-foreground">
            Create and save your form in the builder before customizing themes for the
            public page.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/builder/new">Back to builder</Link>
        </Button>
      </div>
    );
  }

  return <BuilderThemesWorkspace />;
}
