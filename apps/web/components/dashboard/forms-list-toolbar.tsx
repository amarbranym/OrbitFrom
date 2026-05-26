"use client";

import { IconArrowsSort, IconSearch } from "@tabler/icons-react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";

export type FormsFilter = "all" | "published" | "draft" | "unlisted";
export type FormsSort = "updated-desc" | "updated-asc" | "title-asc" | "title-desc";

type FormsListToolbarProps = {
  filter: FormsFilter;
  onFilterChange: (filter: FormsFilter) => void;
  search: string;
  onSearchChange: (value: string) => void;
  sort: FormsSort;
  onSortToggle: () => void;
  totalCount?: number;
};

const filterLabels: Record<FormsFilter, string> = {
  all: "All forms",
  published: "Published",
  draft: "Draft",
  unlisted: "Unlisted",
};

const sortLabels: Record<FormsSort, string> = {
  "updated-desc": "Recently updated",
  "updated-asc": "Oldest updated",
  "title-asc": "Title A–Z",
  "title-desc": "Title Z–A",
};

export function FormsListToolbar({
  filter,
  onFilterChange,
  search,
  onSearchChange,
  sort,
  onSortToggle,
  totalCount,
}: FormsListToolbarProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-border/50 bg-muted/15 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
      <div className="flex flex-wrap items-center gap-3">
        <Select value={filter} onValueChange={(v) => onFilterChange(v as FormsFilter)}>
          <SelectTrigger
            className={cn(
              "h-10 min-w-[148px] rounded-lg border-border/50 bg-background font-medium shadow-none",
            )}
          >
            <SelectValue>{filterLabels[filter]}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(filterLabels) as FormsFilter[]).map((key) => (
              <SelectItem key={key} value={key}>
                {filterLabels[key]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {totalCount != null ? (
          <Badge
            variant="secondary"
            className="h-7 rounded-md px-2.5 font-normal tabular-nums"
          >
            {totalCount} form{totalCount === 1 ? "" : "s"}
          </Badge>
        ) : null}
      </div>

      <div className="flex flex-1 flex-wrap items-center gap-2 md:max-w-xl md:justify-end">
        <div className="relative min-w-0 flex-1 md:max-w-xs">
          <IconSearch className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search forms…"
            className="h-10 rounded-lg border-border/50 bg-background pl-9 shadow-none"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-10 shrink-0 gap-2 rounded-lg border-border/50 bg-background px-3 shadow-none"
          onClick={onSortToggle}
          title={sortLabels[sort]}
        >
          <IconArrowsSort className="size-4 shrink-0" />
          <span className="hidden text-xs sm:inline">{sortLabels[sort]}</span>
        </Button>
      </div>
    </div>
  );
}
