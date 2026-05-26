import Link from "next/link";
import { IconArrowRight, IconCheck } from "@tabler/icons-react";

import { Container } from "~/components/common/container";
import { SectionHeading } from "~/components/common/section-heading";
import { SectionWrapper } from "~/components/common/section-wrapper";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "For solo creators getting started.",
    features: ["Up to 3 forms", "100 responses/month", "Public & unlisted visibility"],
    cta: "Start free",
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
  },
] as const;

export function PricingSection() {
  return (
    <SectionWrapper id="pricing" aria-labelledby="pricing-heading">
      <Container>
        <SectionHeading
          id="pricing-heading"
          eyebrow="Pricing"
          title="Plans for every <span class='text-primary'>stage</span>"
          description="Start free, upgrade when your response volume and workflow complexity grow."
          align="center"
        />

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={plan.highlighted ? "border-primary/35 shadow-md shadow-primary/10" : ""}
            >
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <p className="pt-2 text-3xl font-semibold tracking-tight">{plan.price}</p>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {plan.features.map((feature) => (
                  <p key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <IconCheck className="size-4 text-primary" />
                    <span>{feature}</span>
                  </p>
                ))}
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                  className="w-full gap-1.5"
                  variant={plan.highlighted ? "default" : "outline"}
                >
                  <Link href="/signup">
                    {plan.cta}
                    <IconArrowRight className="size-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </Container>
    </SectionWrapper>
  );
}
