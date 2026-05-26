"use client";

import type { ExploreListItem } from "@repo/form-schema";
import { IconForms, IconWorld } from "@tabler/icons-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { PageHeader } from "~/components/dashboard/page-header";
import { ExploreFormsGrid, ExploreFormsGridSkeleton } from "~/components/explore/explore-forms-grid";
import { ExploreSubhero } from "~/components/explore/explore-subhero";
import { type ExploreSort } from "~/components/explore/explore-toolbar";
import { Button } from "~/components/ui/button";
import { trpc } from "~/trpc/client";

function filterAndSortForms(
  forms: ExploreListItem[],
  query: string,
  sort: ExploreSort,
): ExploreListItem[] {
  const normalized = query.trim().toLowerCase();
  let result = forms;

  if (normalized) {
    result = result.filter(
      (form) =>
        form.title.toLowerCase().includes(normalized) ||
        form.creatorName.toLowerCase().includes(normalized),
    );
  }

  const sorted = [...result];
  sorted.sort((a, b) => {
    switch (sort) {
      case "responses":
        return b.responseCount - a.responseCount;
      case "title":
        return a.title.localeCompare(b.title);
      default:
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
  });
  return sorted;
}

export default function DashboardExplorePage() {
  const { data: forms = [], isLoading, error } = trpc.publicForms.listExplore.useQuery({});
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<ExploreSort>("newest");

  const filteredForms = useMemo(
    () => filterAndSortForms(forms, query, sort),
    [forms, query, sort],
  );

  const creatorCount = useMemo(
    () => new Set(forms.map((form) => form.creatorName)).size,
    [forms],
  );

  const totalResponses = useMemo(
    () => forms.reduce((sum, form) => sum + form.responseCount, 0),
    [forms],
  );

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 md:gap-8">
      <PageHeader
        title="Explore"
        description="Browse public forms published by the OrbitForm community. Open any form and respond without an account."
        action={
          <Button variant="outline" size="sm" className="gap-2" asChild>
            <Link href="/explore" target="_blank" rel="noopener noreferrer">
              <IconWorld className="size-4" />
              Public gallery
            </Link>
          </Button>
        }
      />

      {!isLoading && !error && forms.length > 0 ? (
        <ExploreSubhero
          formCount={forms.length}
          creatorCount={creatorCount}
          totalResponses={totalResponses}
        />
      ) : null}

      {isLoading ? (
        <ExploreFormsGridSkeleton />
      ) : error ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-16 text-center text-sm text-destructive">
          Could not load public forms. Please try again.
        </div>
      ) : forms.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border/60 px-6 py-20 text-center">
          <IconForms className="size-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No public forms yet.</p>
          <Button asChild>
            <Link href="/dashboard/forms">Publish a form</Link>
          </Button>
        </div>
      ) : filteredForms.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-muted/15 px-6 py-16 text-center text-sm text-muted-foreground">
          No forms match your search.
        </div>
      ) : (
        <ExploreFormsGrid
          forms={filteredForms}
          query={query}
          onQueryChange={setQuery}
          sort={sort}
          onSortChange={setSort}
          totalCount={forms.length}
        />
      )}
    </div>
  );
}
