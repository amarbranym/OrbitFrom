"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { getSubmitButtonLabel } from "@repo/form-schema";

import { useBuilderForm } from "~/components/builder/builder-form-context";
import { DynamicForm } from "~/components/forms/dynamic-form";
import { Button } from "~/components/ui/button";
import { getDocument } from "~/lib/forms/storage";

export default function BuilderPreviewPage() {
  const params = useParams<{ formId: string }>();
  const { formTitle } = useBuilderForm();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const document = mounted ? getDocument(params.formId) : null;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-auto bg-muted/20 p-6">
      <div className="mx-auto mb-6 flex w-full max-w-2xl items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Preview
          </p>
          <h1 className="text-lg font-semibold">{formTitle}</h1>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/builder/${params.formId}`}>Back to editor</Link>
        </Button>
      </div>
      {document ? (
        <div className="mx-auto w-full max-w-2xl rounded-xl border bg-card p-8 shadow-sm">
          <DynamicForm
            document={document}
            submitLabel={getSubmitButtonLabel(document)}
            onSubmit={() => {
              alert("Preview mode — submission not saved.");
            }}
          />
        </div>
      ) : (
        <p className="text-center text-sm text-muted-foreground">Form not found.</p>
      )}
    </div>
  );
}
