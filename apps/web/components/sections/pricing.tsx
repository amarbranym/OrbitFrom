import Link from "next/link";
import { IconCheck } from "@tabler/icons-react";

import { Container } from "~/components/common/container";
import { SectionHeading } from "~/components/common/section-heading";
import { SectionWrapper } from "~/components/common/section-wrapper";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "For solo creators getting started.",
    features: ["Up to 3 forms", "100 responses/month", "Public & unlisted visibility"],
    cta: "Start free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    description: "For growing teams and campaigns.",
    features: [
      "Unlimited forms",
      "Advanced analytics",
      "CSV export and integrations",
      "Priority support",
    ],
    cta: "Go Pro",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For organizations at scale.",
    features: ["SSO and admin controls", "Custom limits", "Dedicated support", "Security reviews"],
    cta: "Talk to sales",
    highlighted: false,
  },
];

export function PricingSection() {
  return (
    <SectionWrapper id="pricing" aria-labelledby="pricing-heading" >
      <Container>
        <SectionHeading
          id="pricing-heading"
          title="Pricing"
          description="Choose the plan that fits your needs. Start building for free."
          align="center"
        />

        <div className="mt-16 grid gap-8 md:grid-cols-3 max-w-5xl mx-auto px-4 select-none">
          {plans.map((plan) => {
            const isPro = plan.highlighted;
            const isStarter = plan.name === "Starter";

            return (
              <div
                key={plan.name}
                className={cn(
                  "relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300",
                  isPro
                    ? "bg-primary text-primary-foreground scale-105 z-10 shadow-2xl shadow-primary/20 border border-primary/20"
                    : cn(
                      "bg-white border-2 border-primary text-foreground ",
                      isStarter
                        ? "rotate-[-2deg] hover:rotate-0 md:translate-y-2"
                        : "rotate-[2deg] hover:rotate-0 md:translate-y-2"
                    )
                )}
              >
                {isPro && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-zinc-950 text-white border border-primary/20 text-[10px] font-extrabold tracking-wider px-3 py-1 rounded-full uppercase shadow-md">
                    Best Deal
                  </div>
                )}

                <div>
                  {/* Title */}
                  <h3 className={cn(
                    "text-sm font-bold tracking-wider uppercase",
                    isPro ? "text-primary-foreground/90" : "text-primary"
                  )}>
                    {plan.name}
                  </h3>

                  {/* Price */}
                  <p className="mt-4 text-4xl font-extrabold tracking-tight">
                    {plan.price === "Custom" || plan.price === "Free" ? plan.price : `${plan.price}/mo`}
                  </p>

                  {/* Features list */}
                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm font-medium">
                        <IconCheck className={cn(
                          "size-5 shrink-0",
                          isPro ? "text-primary-foreground" : "text-primary"
                        )} />
                        <span className={isPro ? "text-primary-foreground/90" : "text-foreground"}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action CTA Button */}
                <div className="mt-8">
                  <Button
                    asChild
                    className={cn(
                      "w-full rounded-xl py-6 font-bold text-sm shadow-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer border border-transparent",
                      isPro
                        ? "bg-zinc-950 text-white hover:bg-zinc-900"
                        : "bg-primary text-primary-foreground hover:bg-primary/95"
                    )}
                  >
                    <Link href="/signup">
                      {plan.cta}
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </SectionWrapper>
  );
}
