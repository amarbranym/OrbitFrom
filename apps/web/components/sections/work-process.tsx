import { Container } from "~/components/common/container";
import { SectionHeading } from "~/components/common/section-heading";
import WorkProcessCard from "~/components/cards/work-process-card";
import { SectionWrapper } from "~/components/common/section-wrapper";

const processPoints = [
  {
    title: "Create your form",
    icon: "FileEdit",
    description:
      "Start from a template or blank canvas. Add fields, validation, and reorder everything in the visual builder.",
  },
  {
    title: "Pick a theme",
    icon: "Palette",
    description:
      "Apply a preset or tune colors, headers, and typography. Preview on every device before you go live.",
  },
  {
    title: "Publish & share",
    icon: "Share2",
    description:
      "Launch with a public slug, list on Explore, or share an unlisted link — you control visibility.",
  },
  {
    title: "Analyze responses",
    icon: "BarChart3",
    description:
      "Review entries, track trends in analytics, and export CSV when your campaign wraps up.",
  },
] as const;

export function WorkProcessSection() {
  return (
    <SectionWrapper
      id="how-it-works"
      aria-labelledby="work-process-heading"
      className="bg-primary"
    >
      <Container>
        <SectionHeading
          id="work-process-heading"
          background="primary"
          eyebrow="How it works"
          title="From blank page to <span class='text-accent'>live form</span>"
          description="A focused four-step flow so you spend less time on tooling and more time on better questions."
          align="center"
        />

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {processPoints.map((item, index) => (
            <WorkProcessCard
              key={item.title}
              item={{ step: `0${index + 1}`, ...item }}
            />
          ))}
        </div>
      </Container>
    </SectionWrapper>
  );
}
