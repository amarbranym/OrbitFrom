import { Footer } from "~/components/layouts/footer";
import { Header } from "~/components/layouts/header";
import { CtaSection } from "~/components/sections/cta";
import { FaqSection } from "~/components/sections/faq";
import { FeaturesSection } from "~/components/sections/features";
import { HeroWithMockup } from "~/components/sections/hero";
import { PricingSection } from "~/components/sections/pricing";
import { StatsBarSection } from "~/components/sections/stats-bar";
import { ThemesShowcaseSection } from "~/components/sections/themes-showcase";
import { VideoTestimonialSection } from "~/components/sections/video-testimonials";
import { WorkProcessSection } from "~/components/sections/work-process";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroWithMockup
          title="Beautiful forms that convert"
          description="Build, theme, and publish Typeform-style forms in minutes. Collect responses with analytics, explore, and a production-ready API."
          primaryCta={{
            text: "Start building",
            href: "/signup",
          }}
          secondaryCta={{
            text: "Explore public forms",
            href: "/explore",
          }}
          mockupImage={{
            alt: "OrbitForm builder preview",
            width: 1248,
            height: 765,
            src: "banner.png",
          }}
        />
        <StatsBarSection />
        <FeaturesSection />
        <WorkProcessSection />
        <ThemesShowcaseSection />
        <VideoTestimonialSection />
        <PricingSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
