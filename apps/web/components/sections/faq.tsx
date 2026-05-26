import { Container } from "~/components/common/container";
import { SectionHeading } from "~/components/common/section-heading";
import { SectionWrapper } from "~/components/common/section-wrapper";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

const questions = [
  {
    question: "Do I need code to publish a form?",
    answer:
      "No. Use the visual builder to add fields, apply a theme, and publish. Developers can still use the API when they need programmatic control.",
  },
  {
    question: "Can I keep a form private or unlisted?",
    answer:
      "Yes. Control visibility per form — draft, published to Explore, or unlisted with a shareable link only your audience has.",
  },
  {
    question: "Where are responses stored?",
    answer:
      "Submissions live in Postgres via OrbitForm's API. View them in the dashboard, per-form entries, and export CSV anytime.",
  },
  {
    question: "How do themes work?",
    answer:
      "Choose a preset in the builder gallery, preview on desktop or mobile, then apply. Colors, headers, and buttons update instantly without rebuilding fields.",
  },
  {
    question: "Is there spam protection?",
    answer:
      "Forms include honeypot fields, rate limiting, and optional close dates or response caps for high-traffic campaigns.",
  },
  {
    question: "Can I try OrbitForm for free?",
    answer:
      "Yes. Sign up on the Starter plan, build forms, and upgrade when you need advanced analytics or team features.",
  },
] as const;

export function FaqSection() {
  return (
    <SectionWrapper id="faq" aria-labelledby="faq-heading" className="bg-muted/40">
      <Container >
        <SectionHeading
          id="faq-heading"
          eyebrow="FAQ"
          align="center"
          title="Frequently asked <span class='text-primary'>questions</span>"
          description="Quick answers about building, theming, and collecting responses with OrbitForm."
        />

        <Accordion
          type="single"
          collapsible
          className="mt-10 w-full overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm"
        >
          {questions.map((item, index) => (
            <AccordionItem
              key={item.question}
              value={`faq-${index + 1}`}
              className="border-b border-border/60 px-5 last:border-b-0 sm:px-6"
            >
              <AccordionTrigger className="py-5 text-left text-base font-medium hover:text-primary hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </SectionWrapper>
  );
}
