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
    <SectionWrapper >
      <Container >
        <ul className="grid grid-cols-2  md:grid-cols-4 bg-primary rounded-2xl py-20 divide-x divide-primary-foreground/50 ">
          {stats.map((stat) => (
            <li key={stat.label} className="text-center">
              <p className=" text-2xl md:text-3xl font-semibold tracking-tight text-primary-foreground lg:text-5xl">
                {stat.value}
              </p>
              <p className="mt-4 text-sm text-primary-foreground/75">{stat.label}</p>
            </li>
          ))}
        </ul>
      </Container>
    </SectionWrapper>
  );
}
