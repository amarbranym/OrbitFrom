import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Glow } from "~/components/ui/glow";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export type MarketingHeroCta = {
  text: string;
  href: string;
  icon?: ReactNode;
};

type MarketingHeroProps = {
  title: string;
  description: string;
  primaryCta: MarketingHeroCta;
  secondaryCta?: MarketingHeroCta;
  className?: string;
  id?: string;
};

function isExternalHref(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

function CtaLink({
  cta,
  children,
  className,
}: {
  cta: MarketingHeroCta;
  children: ReactNode;
  className?: string;
}) {
  if (isExternalHref(cta.href)) {
    return (
      <a href={cta.href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={cta.href} className={className}>
      {children}
    </Link>
  );
}

export function MarketingHero({
  title,
  description,
  primaryCta,
  secondaryCta,
  className,
  id,
}: MarketingHeroProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative overflow-hidden bg-background pt-28 pb-16 text-foreground md:pt-32 md:pb-20 lg:pb-24",
        className,
      )}
    >
      <div className="relative mx-auto flex max-w-[1280px] flex-col px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-6 pt-6 text-center md:pt-10 lg:gap-8">
          <h1
            className={cn(
              "inline-block animate-appear text-balance",
              "bg-linear-to-b from-foreground via-foreground/90 to-muted-foreground",
              "bg-clip-text text-transparent",
              "text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl",
            )}
          >
            {title}
          </h1>

          <p
            className={cn(
              "max-w-[550px] animate-appear text-base font-medium text-muted-foreground opacity-0 [animation-delay:150ms] sm:text-lg md:text-xl",
            )}
          >
            {description}
          </p>

          <div className="relative z-10 flex animate-appear flex-wrap justify-center gap-4 opacity-0 [animation-delay:300ms]">
            <Button
              asChild
              size="lg"
              className={cn(
                "bg-linear-to-b from-primary to-primary/90 text-primary-foreground shadow-lg",
                "hover:from-primary/95 hover:to-primary/80",
                "transition-all duration-300",
              )}
            >
              <CtaLink cta={primaryCta}>{primaryCta.text}</CtaLink>
            </Button>

            {secondaryCta ? (
              <Button asChild size="lg" variant="ghost">
                <CtaLink cta={secondaryCta} className="inline-flex items-center gap-2">
                  {secondaryCta.text}
                  {secondaryCta.icon ?? <ArrowRight className="size-4" />}
                </CtaLink>
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Glow
          variant="above"
          className="animate-appear-zoom opacity-0 [animation-delay:500ms]"
        />
      </div>
    </section>
  );
}
