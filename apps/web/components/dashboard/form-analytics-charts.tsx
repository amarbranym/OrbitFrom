"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import { Skeleton } from "~/components/ui/skeleton";
import type { RouterOutputs } from "@repo/trpc/client";

type Analytics = RouterOutputs["forms"]["getAnalytics"];

type FormAnalyticsChartsProps = {
  analytics: Analytics | undefined;
  isLoading: boolean;
};

export function FormAnalyticsCharts({ analytics, isLoading }: FormAnalyticsChartsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  if (!analytics) return null;

  const dailyData = analytics.dailyCounts.map((d) => ({
    date: d.date.slice(5),
    count: d.count,
  }));

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-base">Overview</CardTitle>
          <CardDescription>Response totals</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-2xl font-semibold">{analytics.totalResponses}</p>
            <p className="text-xs text-muted-foreground">All time</p>
          </div>
          <div>
            <p className="text-2xl font-semibold">{analytics.responsesLast7Days}</p>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </div>
          <div>
            <p className="text-2xl font-semibold">{analytics.responsesLast30Days}</p>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Responses over time</CardTitle>
          <CardDescription>Last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          {dailyData.length === 0 ? (
            <p className="text-sm text-muted-foreground">No responses yet.</p>
          ) : (
            <ChartContainer
              config={{ count: { label: "Responses", color: "var(--chart-1)" } }}
              className="h-[220px] w-full"
            >
              <BarChart data={dailyData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={4} />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      {analytics.fieldBreakdowns.map((field) => {
        const chartData = Object.entries(field.counts).map(([name, count]) => ({
          name,
          count,
        }));

        if (chartData.length === 0) return null;

        return (
          <Card key={field.fieldId} className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-base">{field.label}</CardTitle>
              <CardDescription className="capitalize">{field.type} breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{ count: { label: "Count", color: "var(--chart-2)" } }}
                className="h-[200px] w-full"
              >
                <BarChart data={chartData} layout="vertical">
                  <CartesianGrid horizontal={false} />
                  <XAxis type="number" allowDecimals={false} hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={80}
                    tickLine={false}
                    axisLine={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
