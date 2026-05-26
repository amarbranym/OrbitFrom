import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";

import { Container } from "~/components/common/container";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type ExploreCtaProps = {
  className?: string;
};

export function ExploreCta({ className }: ExploreCtaProps) {
  return (
    <section className={cn("py-12 md:py-16", className)}>
      <Container>
        <div
          className={cn(
            "relative overflow-hidden rounded-3xl border border-primary/20 px-6 py-10 text-center md:px-12 md:py-14",
            "bg-linear-to-br from-primary via-primary/95 to-primary/80 text-primary-foreground",
            "shadow-xl shadow-primary/15",
          )}
        >
          <div
            className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-white/10 blur-2xl"
            aria-hidden
          />
          <h2 className="relative text-2xl font-semibold tracking-tight md:text-3xl">
            Want your form on Explore?
          </h2>
          <p className="relative mx-auto mt-3 max-w-lg text-sm text-primary-foreground/85 md:text-base">
            Build with OrbitForm, set visibility to Public, and publish — your form will appear
            here for anyone to fill.
          </p>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="relative mt-6 gap-2 bg-white text-primary hover:bg-white/90"
          >
            <Link href="/signup">
              Create your form
              <IconArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
