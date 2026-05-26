import { Container } from "~/components/common/container";
import { SectionWrapper } from "~/components/common/section-wrapper";

type ExploreSubheroProps = {
  formCount: number;
  creatorCount: number;
  totalResponses: number;
  className?: string;
};

export function ExploreSubhero({
  formCount,
  creatorCount,
  totalResponses,
  className,
}: ExploreSubheroProps) {
  const stats = [
    { value: String(formCount), label: formCount === 1 ? "Live form" : "Live forms" },
    { value: String(creatorCount), label: creatorCount === 1 ? "Creator" : "Creators" },
    {
      value: totalResponses.toLocaleString(),
      label: totalResponses === 1 ? "Response" : "Responses",
    },
  ];

  return (
    <SectionWrapper className={className ?? "border-y border-primary/15 bg-primary py-10 md:py-12"}>
      <Container>
        <ul className="grid grid-cols-3 gap-6 md:gap-8">
          {stats.map((stat) => (
            <li key={stat.label} className="text-center">
              <p className="text-2xl font-semibold tracking-tight text-primary-foreground md:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1.5 text-sm text-primary-foreground/75">{stat.label}</p>
            </li>
          ))}
        </ul>
      </Container>
    </SectionWrapper>
  );
}
