"use client";

import Link from "next/link";
import { IconSearch, IconTable } from "@tabler/icons-react";
import { useMemo, useState } from "react";

import { PageHeader } from "~/components/dashboard/page-header";
import { WorkspaceFormsEntriesTable } from "~/components/dashboard/workspace-forms-entries-table";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";
import { trpc } from "~/trpc/client";

export default function GlobalEntriesPage() {
  const { data: forms = [], isLoading } = trpc.forms.list.useQuery({});
  const [search, setSearch] = useState("");

  const filteredForms = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return forms;
    return forms.filter((form) => form.title.toLowerCase().includes(query));
  }, [forms, search]);

  const sortedForms = useMemo(
    () =>
      [...filteredForms].sort((a, b) => {
        if (b.responseCount !== a.responseCount) {
          return b.responseCount - a.responseCount;
        }
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }),
    [filteredForms],
  );

  const totalResponses = useMemo(
    () => forms.reduce((sum, form) => sum + form.responseCount, 0),
    [forms],
  );

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 md:gap-8">
      <PageHeader
        title="All entries"
        description="Open a form to view submissions, analytics, and CSV export."
      />

      <section className="overflow-hidden rounded-2xl border border-border/60 bg-card">
        {!isLoading && forms.length > 0 ? (
          <div className="flex flex-col gap-3 border-b border-border/50 bg-muted/15 px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
            <div className="relative w-full sm:max-w-xs">
              <IconSearch
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search forms…"
                className="h-10 rounded-lg border-border/60 bg-background pl-9"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {sortedForms.length} form{sortedForms.length === 1 ? "" : "s"} ·{" "}
              {totalResponses} total response{totalResponses === 1 ? "" : "s"}
            </p>
          </div>
        ) : null}

        {isLoading ? (
          <div className="space-y-0 px-6 py-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="mb-3 h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : forms.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-20 text-center">
            <IconTable className="size-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No forms yet.</p>
            <Button asChild>
              <Link href="/dashboard/forms">Create a form</Link>
            </Button>
          </div>
        ) : sortedForms.length === 0 ? (
          <div className="px-6 py-20 text-center text-sm text-muted-foreground">
            No forms match your search.
          </div>
        ) : (
          <WorkspaceFormsEntriesTable forms={sortedForms} />
        )}
      </section>
    </div>
  );
}
