import {
  IconChartBar,
  IconForms,
  IconPalette,
  IconRocket,
  IconShieldCheck,
  IconWorld,
} from "@tabler/icons-react";
import type { TablerIcon } from "@tabler/icons-react";

import { Container } from "~/components/common/container";
import { SectionHeading } from "~/components/common/section-heading";
import { SectionWrapper } from "~/components/common/section-wrapper";
import { cn } from "~/lib/utils";

type Feature = {
  icon: TablerIcon;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: IconForms,
    title: "Visual form builder",
    description:
      "Drag fields, reorder sections, and publish without touching code. Every form stays fast and accessible.",
  },
  {
    icon: IconPalette,
    title: "Branded themes",
    description:
      "Apply polished presets in one click — colors, typography, headers, and backgrounds tuned for conversion.",
  },
  {
    icon: IconChartBar,
    title: "Responses & analytics",
    description:
      "Track submissions, export CSV, and open per-form analytics from a single workspace dashboard.",
  },
  {
    icon: IconWorld,
    title: "Explore & share",
    description:
      "Publish public forms to Explore, share unlisted links, or keep drafts private until you are ready.",
  },
  {
    icon: IconShieldCheck,
    title: "Built-in protection",
    description:
      "Rate limits, honeypot fields, and access rules help keep spam down and forms available when you need them.",
  },
  {
    icon: IconRocket,
    title: "Production API",
    description:
      "Postgres-backed storage with tRPC and OpenAPI docs — ready for demos, hackathons, and real deployments.",
  },
];

export function FeaturesSection() {
  return (
    <SectionWrapper id="features" aria-labelledby="features-heading">
      <Container>
        <SectionHeading
          id="features-heading"
          eyebrow="Features"
          title="Everything you need to <span class='text-primary'>ship forms</span>"
          description="OrbitForm combines a Typeform-style experience with the controls product teams expect."
          align="center"
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className={cn(
                  "group rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all",
                  "hover:border-primary/30 hover:shadow-md hover:shadow-primary/5",
                )}
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-5" stroke={1.75} />
                </span>
                <h3 className="mt-4 text-lg font-semibold tracking-tight">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </Container>
    </SectionWrapper>
  );
}
