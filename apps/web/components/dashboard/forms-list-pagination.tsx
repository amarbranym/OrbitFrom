"use client";

import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

import { Button } from "~/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "~/components/ui/pagination";
import { cn } from "~/lib/utils";

const PAGE_SIBLINGS = 1;

function buildPageNumbers(current: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 1) return [];
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [1];
  const start = Math.max(2, current - PAGE_SIBLINGS);
  const end = Math.min(totalPages - 1, current + PAGE_SIBLINGS);

  if (start > 2) pages.push("ellipsis");
  for (let page = start; page <= end; page++) pages.push(page);
  if (end < totalPages - 1) pages.push("ellipsis");
  pages.push(totalPages);

  return pages;
}

type FormsListPaginationProps = {
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  className?: string;
};

export function FormsListPagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  className,
}: FormsListPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const end = Math.min(safePage * pageSize, totalItems);
  const pageNumbers = buildPageNumbers(safePage, totalPages);
  const showPageNumbers = totalPages > 1;

  return (
    <footer
      className={cn("flex w-full flex-col items-center justify-center gap-4", className)}
      aria-label="Forms pagination"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-10 rounded-full border-border/60 bg-background"
            disabled={safePage <= 1}
            aria-label="Previous page"
            onClick={() => onPageChange(safePage - 1)}
          >
            <IconChevronLeft className="size-4" />
          </Button>

          <p className="min-w-[140px] text-center text-sm text-muted-foreground tabular-nums">
            {totalItems === 0 ? (
              "No forms"
            ) : (
              <>
                <span className="font-semibold text-foreground">
                  {start} – {end}
                </span>{" "}
                of {totalItems} form{totalItems === 1 ? "" : "s"}
              </>
            )}
          </p>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-10 rounded-full border-border/60 bg-background"
            disabled={safePage >= totalPages}
            aria-label="Next page"
            onClick={() => onPageChange(safePage + 1)}
          >
            <IconChevronRight className="size-4" />
          </Button>
        </div>

        {showPageNumbers ? (
          <Pagination className="mx-auto w-auto justify-center">
            <PaginationContent className="gap-1">
              {pageNumbers.map((pageNumber, index) =>
                pageNumber === "ellipsis" ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis className="size-9" />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href="#"
                      isActive={pageNumber === safePage}
                      className={cn(
                        "size-9 rounded-full text-sm font-medium",
                        pageNumber === safePage && "border-primary bg-primary/10 text-primary",
                      )}
                      onClick={(event) => {
                        event.preventDefault();
                        onPageChange(pageNumber);
                      }}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}
            </PaginationContent>
          </Pagination>
        ) : null}
      </div>
    </footer>
  );
}
