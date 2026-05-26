import type { Icon } from "@tabler/icons-react";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import Link from "next/link";

import { Card, CardAction, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";

export type StatTrend = {
  value: string;
  direction: "up" | "down" | "neutral";
};

export type StatCard = {
  title: string;
  value: string;
  description: string;
  icon: Icon;
  href?: string;
  trend?: StatTrend;
};

type StatsGridProps = {
  stats: StatCard[];
  className?: string;
};

export function StatsGrid({ stats, className }: StatsGridProps) {
  return (
    <div
      className={cn("grid gap-4 sm:grid-cols-2 xl:grid-cols-4", className)}
      role="list"
    >
      {stats.map((stat) => (
        <StatCardItem key={stat.title} {...stat} />
      ))}
    </div>
  );
}

function StatCardItem({
  title,
  value,
  description,
  icon: IconComponent,
  href,
  trend,
}: StatCard) {
  const card = (
    <Card
      size="sm"
      className={cn(
        "relative overflow-hidden group transition-colors",
        href && "hover:border-ring/60 hover:bg-muted/30",
      )}
    >
      <CardHeader className="pb-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {title}
        </p>
        <CardTitle className="mt-2 text-3xl font-semibold tabular-nums tracking-tight">
          {value}
        </CardTitle>
        <CardAction>
          <div className={cn("flex size-9 items-center justify-center rounded-lg bg-muted text-primary ",
        href && " group-hover:bg-primary group-hover:text-primary-foreground",

           )}>
            <IconComponent className="size-4" aria-hidden />
          </div>
        </CardAction>
      </CardHeader>

      <div className="flex items-center justify-between gap-2 px-6 pb-4 pt-3 group-data-[size=sm]/card:px-4">
        <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
        {trend ? <StatTrendBadge trend={trend} /> : null}
      </div>
    </Card>
  );

  if (!href) {
    return (
      <div role="listitem" className="min-w-0">
        {card}
      </div>
    );
  }

  return (
    <Link
      href={href}
      role="listitem"
      className="min-w-0 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {card}
    </Link>
  );
}

function StatTrendBadge({ trend }: { trend: StatTrend }) {
  const TrendIcon =
    trend.direction === "up"
      ? IconTrendingUp
      : trend.direction === "down"
        ? IconTrendingDown
        : null;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium tabular-nums",
        trend.direction === "up" && "bg-accent text-accent-foreground",
        trend.direction === "down" && "bg-destructive/10 text-destructive",
        trend.direction === "neutral" && "bg-muted text-muted-foreground",
      )}
    >
      {TrendIcon ? <TrendIcon className="size-3" aria-hidden /> : null}
      {trend.value}
    </span>
  );
}
