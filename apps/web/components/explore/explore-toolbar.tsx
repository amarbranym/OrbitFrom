"use client";

import { IconSearch, IconSortDescending } from "@tabler/icons-react";

import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export type ExploreSort = "newest" | "responses" | "title";

type ExploreToolbarProps = {
  query: string;
  onQueryChange: (value: string) => void;
  sort: ExploreSort;
  onSortChange: (value: ExploreSort) => void;
  resultCount: number;
  totalCount: number;
};

export function ExploreToolbar({
  query,
  onQueryChange,
  sort,
  onSortChange,
  resultCount,
  totalCount,
}: ExploreToolbarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">All public forms</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {resultCount === totalCount
            ? `${totalCount} form${totalCount === 1 ? "" : "s"} available`
            : `Showing ${resultCount} of ${totalCount} forms`}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-[220px] sm:w-64">
          <IconSearch
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            placeholder="Search by title or creator…"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            className="h-10 bg-background pl-9"
            aria-label="Search public forms"
          />
        </div>
        <Select value={sort} onValueChange={(value) => onSortChange(value as ExploreSort)}>
          <SelectTrigger className="h-10 w-full sm:w-[160px]">
            <IconSortDescending className="mr-1 size-4 text-muted-foreground" aria-hidden />
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
  );
}
