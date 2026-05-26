import { Container } from "~/components/common/container";
import { SectionWrapper } from "~/components/common/section-wrapper";

const stats = [
  { value: "3 min", label: "Average setup time" },
  { value: "8+", label: "Ready-made themes" },
  { value: "100%", label: "Mobile-friendly forms" },
  { value: "API", label: "OpenAPI & tRPC ready" },
] as const;

export function StatsBarSection() {
  return (
    <SectionWrapper className="border-y border-primary/15 bg-primary py-10 md:py-12">
      <Container>
        <ul className="grid grid-cols-2 gap-8 md:grid-cols-4">
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
