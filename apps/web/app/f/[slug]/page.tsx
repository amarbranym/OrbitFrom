"use client";

import { getSubmitButtonLabel, type FormAccessReason } from "@repo/form-schema";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { FormUnavailable } from "~/components/forms/form-unavailable";
import { ThemedLiveForm } from "~/components/forms/themed-live-form";
import { Skeleton } from "~/components/ui/skeleton";
import { trpc } from "~/trpc/client";

export default function PublicFormPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isLoading, error } = trpc.publicForms.getBySlug.useQuery({
    slug: params.slug,
  });

  const submitMutation = trpc.publicForms.submit.useMutation({
    onSuccess: () => {
      router.push(`/f/${params.slug}/thank-you`);
    },
    onError: (err) => toast.error(err.message),
    onSettled: () => setIsSubmitting(false),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Skeleton className="h-64 w-full max-w-2xl rounded-xl" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-muted/20 py-16">
        <FormUnavailable reason="not_found" />
      </div>
    );
  }

  const { document, access } = data;

  if (!document || !access.allowed || !access.canSubmit) {
    return (
      <div className="min-h-screen bg-muted/20 py-16">
        <FormUnavailable reason={access.reason as FormAccessReason} />
      </div>
    );
  }

  return (
    <ThemedLiveForm
      key={`${document.id}-${document.theme.preset}-${document.updatedAt}`}
      document={document}
      showHoneypot
      submitLabel={isSubmitting ? "Submitting…" : getSubmitButtonLabel(document)}
      onSubmit={async (values, meta) => {
        setIsSubmitting(true);
        submitMutation.mutate({
          slug: params.slug,
          answers: values,
          honeypot: meta?.honeypot,
        });
      }}
    />
  );
}
