"use client";

import type { FormSubmission } from "@repo/form-schema";
import { IconDownload } from "@tabler/icons-react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { EntryDetailSheet } from "~/components/dashboard/entry-detail-sheet";
import { FormAnalyticsCharts } from "~/components/dashboard/form-analytics-charts";
import { FormEntriesTable } from "~/components/dashboard/form-entries-table";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { trpc } from "~/trpc/client";

export default function BuilderEntriesPage() {
  const params = useParams<{ formId: string }>();
  const formId = params.formId;

  const [cursor, setCursor] = useState<string | undefined>();
  const [allSubmissions, setAllSubmissions] = useState<FormSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const { data: document } = trpc.forms.getById.useQuery({ formId });
  const { data: submissionsData, isLoading: submissionsLoading, isFetching } =
    trpc.forms.listSubmissions.useQuery({ formId, limit: 50, cursor });
  const { data: analytics, isLoading: analyticsLoading } =
    trpc.forms.getAnalytics.useQuery({ formId });

  const exportQuery = trpc.forms.exportSubmissionsCsv.useQuery(
    { formId },
    { enabled: false },
  );

  useEffect(() => {
    if (!submissionsData) return;
    setAllSubmissions((prev) => {
      if (!cursor) return submissionsData.items;
      const existingIds = new Set(prev.map((item) => item.id));
      const merged = [...prev];
      for (const item of submissionsData.items) {
        if (!existingIds.has(item.id)) merged.push(item);
      }
      return merged;
    });
  }, [submissionsData, cursor]);

  useEffect(() => {
    setCursor(undefined);
    setAllSubmissions([]);
  }, [formId]);

  const nextCursor = submissionsData?.nextCursor ?? null;
  const totalCount = analytics?.totalResponses ?? allSubmissions.length;

  const handleExport = async () => {
    const result = await exportQuery.refetch();
    if (result.data?.csv) {
      const blob = new Blob([result.data.csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const anchor = globalThis.document.createElement("a");
      anchor.href = url;
      anchor.download = `${document?.slug ?? "form"}-responses.csv`;
      anchor.click();
      URL.revokeObjectURL(url);
      toast.success("CSV exported");
    }
  };

  const openEntry = useCallback((submission: FormSubmission) => {
    setSelectedSubmission(submission);
    setSheetOpen(true);
  }, []);

  return (
    <div className="flex-1 space-y-6 overflow-auto p-6">
      <FormAnalyticsCharts analytics={analytics} isLoading={analyticsLoading} />

      <Card className="overflow-hidden border-border/60">
        <CardHeader className="flex flex-row items-start justify-between gap-4 border-b border-border/50 bg-muted/15 pb-5">
          <div className="space-y-1">
            <CardTitle className="text-xl">All entries</CardTitle>
            <CardDescription>
              {totalCount} response{totalCount === 1 ? "" : "s"} collected
              {allSubmissions.length > 0 && allSubmissions.length < totalCount
                ? ` · ${allSubmissions.length} loaded`
                : null}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 rounded-lg"
            onClick={() => void handleExport()}
            disabled={exportQuery.isFetching || totalCount === 0}
          >
            <IconDownload className="size-4" />
            Export CSV
          </Button>
        </CardHeader>
        <CardContent className="p-0 pt-0">
          <div className="px-6 pb-6 pt-6">
          {submissionsLoading && allSubmissions.length === 0 ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full max-w-xs rounded-xl" />
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <FormEntriesTable
              submissions={allSubmissions}
              fields={document?.fields ?? []}
              onSelect={openEntry}
              hasMore={Boolean(nextCursor)}
              isLoadingMore={isFetching}
              onLoadMore={nextCursor ? () => setCursor(nextCursor) : undefined}
            />
          )}
          </div>
        </CardContent>
      </Card>

      <EntryDetailSheet
        submission={selectedSubmission}
        fields={document?.fields ?? []}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  );
}
