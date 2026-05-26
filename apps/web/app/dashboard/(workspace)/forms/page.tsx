"use client";

import {
  IconChartBar,
  IconCheck,
  IconForms,
  IconWorld,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";

import { FormsListPagination } from "~/components/dashboard/forms-list-pagination";
import { FormsListTable } from "~/components/dashboard/forms-list-table";
import {
  FormsListToolbar,
  type FormsFilter,
  type FormsSort,
} from "~/components/dashboard/forms-list-toolbar";
import { PageHeader } from "~/components/dashboard/page-header";
import { StatsGrid } from "~/components/dashboard/stats-grid";
import { CreateFormButton } from "~/components/forms/create-form-dialog";
import { Skeleton } from "~/components/ui/skeleton";
import type { FormListItem } from "@repo/form-schema";
import { trpc } from "~/trpc/client";

const PAGE_SIZE = 8;

function filterForms(forms: FormListItem[], filter: FormsFilter, search: string) {
  const query = search.trim().toLowerCase();
  return forms.filter((form) => {
    if (filter === "published" && form.status !== "published") return false;
    if (filter === "draft" && form.status !== "draft") return false;
    if (filter === "unlisted" && form.visibility !== "unlisted") return false;
    if (query && !form.title.toLowerCase().includes(query)) return false;
    return true;
  });
}

function sortForms(forms: FormListItem[], sort: FormsSort) {
  const sorted = [...forms];
  sorted.sort((a, b) => {
    switch (sort) {
      case "updated-asc":
        return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      case "title-asc":
        return a.title.localeCompare(b.title);
      case "title-desc":
        return b.title.localeCompare(a.title);
      default:
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
  });
  return sorted;
}

function FormsListSkeleton() {
  return (
    <div className="space-y-0 px-6 py-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="mb-3 h-12 w-full rounded-lg" />
      ))}
    </div>
  );
}

export default function MyFormsPage() {
  const utils = trpc.useUtils();
  const { data: forms = [], isLoading } = trpc.forms.list.useQuery({});
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<FormsFilter>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<FormsSort>("updated-desc");

  const filteredForms = useMemo(
    () => sortForms(filterForms(forms, filter, search), sort),
    [forms, filter, search, sort],
  );

  const stats = useMemo(() => {
    const published = forms.filter((f) => f.status === "published").length;
    const drafts = forms.filter((f) => f.status === "draft").length;
    const responses = forms.reduce((sum, f) => sum + f.responseCount, 0);
    const publicCount = forms.filter((f) => f.visibility === "public").length;

    return [
      {
        title: "Total forms",
        value: String(forms.length),
        description: "In your workspace",
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
        value: String(responses),
        description: "All-time submissions",
        icon: IconChartBar,
        href: "/dashboard/entries",
      },
      {
        title: "On explore",
        value: String(publicCount),
        description: "Public discovery",
        icon: IconWorld,
        href: "/explore",
      },
    ];
  }, [forms]);

  const totalPages = Math.max(1, Math.ceil(filteredForms.length / PAGE_SIZE));

  const paginatedForms = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredForms.slice(start, start + PAGE_SIZE);
  }, [filteredForms, page]);

  const handleDeleted = () => {
    void utils.forms.list.invalidate();
  };

  const cycleSort = () => {
    setSort((current) => {
      const order: FormsSort[] = [
        "updated-desc",
        "updated-asc",
        "title-asc",
        "title-desc",
      ];
      const index = order.indexOf(current);
      return order[(index + 1) % order.length] ?? "updated-desc";
    });
  };

  const showPagination = !isLoading && filteredForms.length > 0;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 md:gap-8">
      <PageHeader
        title="My Forms"
        description="Create, publish, and manage every form in your workspace."
        action={<CreateFormButton />}
      />

      {!isLoading && forms.length > 0 ? (
        <StatsGrid stats={stats} className="sm:grid-cols-2 lg:grid-cols-4" />
      ) : null}

      <section className="overflow-hidden rounded-2xl border border-border/60 bg-card">
        <FormsListToolbar
          filter={filter}
          onFilterChange={(value) => {
            setFilter(value);
            setPage(1);
          }}
          search={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          sort={sort}
          onSortToggle={cycleSort}
          totalCount={filteredForms.length}
        />

        {isLoading ? (
          <FormsListSkeleton />
        ) : !forms.length ? (
          <div className="flex flex-col items-center justify-center gap-4 px-6 py-24 text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <IconForms className="size-8" stroke={1.5} />
            </div>
            <div className="max-w-md space-y-2">
              <p className="text-xl font-semibold tracking-tight">
                Create your first form
              </p>
              <p className="text-sm text-muted-foreground">
                Build beautiful forms, share a link, and collect responses in one
                place.
              </p>
            </div>
            <CreateFormButton size="lg" className="mt-2 rounded-lg px-6">
              New Form
            </CreateFormButton>
          </div>
        ) : filteredForms.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 px-6 py-24 text-center">
            <p className="text-lg font-semibold">No matching forms</p>
            <p className="text-sm text-muted-foreground">
              Try another search term or change the filter.
            </p>
          </div>
        ) : (
          <FormsListTable forms={paginatedForms} onDeleted={handleDeleted} />
        )}
      </section>

      {showPagination ? (
        <FormsListPagination
          page={page}
          pageSize={PAGE_SIZE}
          totalItems={filteredForms.length}
          onPageChange={setPage}
          className="pb-2"
        />
      ) : null}
    </div>
  );
}
