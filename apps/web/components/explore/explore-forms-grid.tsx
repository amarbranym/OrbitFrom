"use client";

import type { ExploreListItem } from "@repo/form-schema";
import { IconSearch } from "@tabler/icons-react";

import { ExploreFormCard } from "~/components/explore/explore-form-card";
import type { ExploreSort } from "~/components/explore/explore-toolbar";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";

type ExploreFormsGridProps = {
  forms: ExploreListItem[];
  query: string;
  onQueryChange: (value: string) => void;
  sort: ExploreSort;
  onSortChange: (value: ExploreSort) => void;
  totalCount: number;
  className?: string;
  title?: string;
};

export function ExploreFormsGrid({
  forms,
  query,
  onQueryChange,
  sort,
  onSortChange,
  totalCount,
  className,
  title = "All public forms",
}: ExploreFormsGridProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-0.5">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">
            {forms.length} of {totalCount} form{totalCount === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-64">
            <IconSearch
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              type="search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search by title or creator…"
              className="h-10 rounded-lg border-border/60 bg-background pl-9"
              aria-label="Search public forms"
            />
          </div>
          <Select value={sort} onValueChange={(value) => onSortChange(value as ExploreSort)}>
            <SelectTrigger className="h-10 w-full rounded-lg border-border/60 bg-background sm:w-[160px]">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="responses">Most responses</SelectItem>
              <SelectItem value="title">Title A–Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {forms.map((form) => (
          <ExploreFormCard key={form.id} form={form} />
        ))}
      </div>
    </div>
  );
}

export function ExploreFormsGridSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} className="h-[280px] rounded-2xl" />
      ))}
    </div>
  );
}
