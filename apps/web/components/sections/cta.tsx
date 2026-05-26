import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";

import { Container } from "~/components/common/container";
import { SectionWrapper } from "~/components/common/section-wrapper";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export function CtaSection() {
  return (
    <SectionWrapper className="pb-16 md:pb-24">
      <Container>
        <div
          className={cn(
            "relative overflow-hidden rounded-3xl border border-primary/20 px-6 py-12 text-center md:px-12 md:py-16",
            "bg-linear-to-br from-primary via-primary/95 to-primary/80 text-primary-foreground",
            "shadow-xl shadow-primary/20",
          )}
        >
          <div
            className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-white/10 blur-2xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-20 -left-10 size-72 rounded-full bg-white/10 blur-3xl"
            aria-hidden
          />

          <p className="relative text-sm font-semibold uppercase tracking-wider text-primary-foreground/80">
            Start today
          </p>
          <h2 className="relative mt-3 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Ready to launch your next form?
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-base text-primary-foreground/85">
            Join OrbitForm and ship beautiful, themed forms with analytics, explore, and a
            production-ready stack behind you.
          </p>

          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="gap-2 bg-white text-primary hover:bg-white/90"
            >
              <Link href="/signup">
                Create free account
                <IconArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 bg-transparent text-primary-foreground hover:bg-white/10"
            >
              <Link href="/#pricing">View pricing</Link>
            </Button>
          </div>
        </div>
      </Container>
    </SectionWrapper>
  );
}
