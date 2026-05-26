"use client";

import { useParams } from "next/navigation";

import { FormThankYou } from "~/components/forms/form-thank-you";
import { FormUnavailable } from "~/components/forms/form-unavailable";
import { Skeleton } from "~/components/ui/skeleton";
import { trpc } from "~/trpc/client";

export default function ThankYouPage() {
  const params = useParams<{ slug: string }>();
  const { data, isLoading, error } = trpc.publicForms.getBySlug.useQuery({
    slug: params.slug,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Skeleton className="h-72 w-full max-w-2xl rounded-xl" />
      </div>
    );
  }

  if (error || !data?.document) {
    return (
      <div className="min-h-screen bg-muted/20 py-16">
        <FormUnavailable reason="not_found" />
      </div>
    );
  }

  return <FormThankYou document={data.document} />;
}
