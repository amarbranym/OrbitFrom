import type { FormAccessReason } from "@repo/form-schema";

import { Button } from "~/components/ui/button";
import Link from "next/link";

const messages: Record<FormAccessReason, { title: string; description: string }> = {
  ok: { title: "Form available", description: "" },
  not_found: {
    title: "Form not found",
    description: "This link may be incorrect or the form was removed.",
  },
  draft: {
    title: "Form not published",
    description: "This form is still a draft and cannot accept responses.",
  },
  unpublished: {
    title: "Form unavailable",
    description: "This form has been unpublished and is no longer accepting responses.",
  },
  not_published: {
    title: "Form unavailable",
    description: "This form is not available right now.",
  },
  closed: {
    title: "Form closed",
    description: "This form is no longer accepting responses.",
  },
  response_limit_reached: {
    title: "Response limit reached",
    description: "This form has reached its maximum number of responses.",
  },
};

type FormUnavailableProps = {
  reason: FormAccessReason;
};

export function FormUnavailable({ reason }: FormUnavailableProps) {
  const copy = messages[reason];

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-semibold">{copy.title}</h1>
      <p className="text-sm text-muted-foreground">{copy.description}</p>
      <Button variant="outline" asChild>
        <Link href="/explore">Browse public forms</Link>
      </Button>
    </div>
  );
}
