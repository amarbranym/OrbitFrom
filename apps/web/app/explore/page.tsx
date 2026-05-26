"use client";

import type { ExploreListItem } from "@repo/form-schema";
import { IconForms } from "@tabler/icons-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Container } from "~/components/common/container";
import { ExploreCta } from "~/components/explore/explore-cta";
import { ExploreFormsGrid, ExploreFormsGridSkeleton } from "~/components/explore/explore-forms-grid";
import { ExploreHero } from "~/components/explore/explore-hero";
import { ExploreSubhero } from "~/components/explore/explore-subhero";
import { type ExploreSort } from "~/components/explore/explore-toolbar";
import { Footer } from "~/components/layouts/footer";
import { Header } from "~/components/layouts/header";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
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

export default function ExplorePage() {
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
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <ExploreHero />

        {!isLoading && !error ? (
          <ExploreSubhero
            formCount={forms.length}
            creatorCount={creatorCount}
            totalResponses={totalResponses}
          />
        ) : isLoading ? (
          <section className="border-y border-primary/15 bg-primary py-10 md:py-12">
            <Container>
              <div className="grid grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="mx-auto h-10 w-16 bg-primary-foreground/20" />
                ))}
              </div>
            </Container>
          </section>
        ) : null}

        <div id="explore-gallery" className="scroll-mt-24">
          <Container className="py-12 md:py-16">
            {isLoading ? (
              <ExploreFormsGridSkeleton />
            ) : error ? (
              <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-16 text-center">
                <p className="text-sm font-medium text-destructive">Could not load public forms</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Please refresh the page or try again later.
                </p>
              </div>
            ) : forms.length === 0 ? (
              <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl border border-dashed border-primary/25 bg-primary/5 px-6 py-16 text-center">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <IconForms className="size-7" aria-hidden />
                </span>
                <div className="space-y-2">
                  <p className="text-lg font-semibold">No public forms yet</p>
                  <p className="text-sm text-muted-foreground">
                    When creators publish forms with public visibility, they will appear here.
                  </p>
                </div>
                <Button asChild>
                  <Link href="/signup">Be the first to publish</Link>
                </Button>
              </div>
            ) : filteredForms.length === 0 ? (
              <div className="rounded-2xl border border-border/60 bg-muted/15 px-6 py-16 text-center">
                <p className="text-sm font-medium">No matches found</p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4"
                  onClick={() => setQuery("")}
                >
                  Clear search
                </Button>
              </div>
            ) : (
              <ExploreFormsGrid
                forms={filteredForms}
                query={query}
                onQueryChange={setQuery}
                sort={sort}
                onSortChange={setSort}
                totalCount={forms.length}
                title="Public forms"
              />
            )}
          </Container>
        </div>

        {!isLoading && !error && forms.length > 0 ? <ExploreCta /> : null}
      </main>
      <Footer />
    </div>
  );
}
