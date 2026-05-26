import type { ExploreListItem } from "@repo/form-schema";
import { IconArrowRight, IconForms, IconUser } from "@tabler/icons-react";
import Link from "next/link";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type ExploreFormCardProps = {
  form: ExploreListItem;
  className?: string;
};

function formatUpdatedAt(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function ExploreFormCard({ form, className }: ExploreFormCardProps) {
  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card",
        "transition-colors hover:border-primary/35 hover:bg-muted/15",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3 border-b border-border/50 bg-muted/20 px-5 py-4">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <IconForms className="size-5" stroke={1.75} aria-hidden />
        </div>
        <div className="flex flex-nowrap items-center gap-1.5">
          <Badge
            variant="outline"
            className="h-6 shrink-0 rounded-md border-primary/30 px-2 text-[10px] font-medium whitespace-nowrap text-primary"
          >
            Public
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-5 py-5">
        <h3 className="line-clamp-2 text-base font-semibold leading-snug tracking-tight text-foreground group-hover:text-primary">
          {form.title}
        </h3>

        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
          <IconUser className="size-3.5 shrink-0" aria-hidden />
          <span className="truncate">{form.creatorName}</span>
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl border border-border/50 bg-muted/15 p-3 text-center">
          <div>
            <p className="text-lg font-semibold tabular-nums text-foreground">{form.fieldCount}</p>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              {form.fieldCount === 1 ? "Field" : "Fields"}
            </p>
          </div>
          <div>
            <p className="text-lg font-semibold tabular-nums text-foreground">
              {form.responseCount.toLocaleString()}
            </p>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              {form.responseCount === 1 ? "Response" : "Responses"}
            </p>
          </div>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">Updated {formatUpdatedAt(form.updatedAt)}</p>

        <div className="mt-auto pt-5">
          <Button asChild className="h-10 w-full gap-2 rounded-xl">
            <Link href={`/f/${form.slug}`}>
              Fill form
              <IconArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
