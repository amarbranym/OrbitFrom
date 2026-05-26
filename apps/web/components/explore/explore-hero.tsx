import { MarketingHero } from "~/components/common/marketing-hero";

export function ExploreHero() {
  return (
    <MarketingHero
      title="Explore forms worth filling"
      description="Browse public surveys, registrations, and feedback forms from creators on OrbitForm. Open any form and respond — no account required."
      primaryCta={{
        text: "Publish your form",
        href: "/signup",
      }}
      secondaryCta={{
        text: "Browse the gallery",
        href: "#explore-gallery",
      }}
    />
  );
}
