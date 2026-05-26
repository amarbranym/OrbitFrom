import Link from "next/link";
import { IconArrowRight, IconCheck } from "@tabler/icons-react";

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
    features: ["Up to 3 forms", "100 responses/month", "Public & unlisted forms"],
  },
  {
    name: "Pro",
    price: "$19",
    description: "For growing teams and campaigns.",
    features: ["Unlimited forms", "Analytics dashboard", "Email notifications", "Custom themes"],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For organizations at scale.",
    features: ["API access", "Priority support", "Advanced analytics", "SSO & admin tools"],
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-12 space-y-2 text-center">
          <h1 className="text-3xl font-bold">Simple pricing</h1>
          <p className="text-muted-foreground">No payment integration required for the demo.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.name} className={plan.highlighted ? "border-ring shadow-md" : undefined}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <p className="text-3xl font-bold">{plan.price}</p>
              </CardHeader>
              <CardContent className="space-y-2">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm">
                    <IconCheck className="size-4 text-sidebar-primary" />
                    {feature}
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={plan.highlighted ? "default" : "outline"} asChild>
                  <Link href="/dashboard">
                    Get started
                    <IconArrowRight className="size-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
