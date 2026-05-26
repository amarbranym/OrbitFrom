import { ThemeShowcaseCard } from "~/components/cards/theme-showcase-card";
import { Container } from "~/components/common/container";
import { SectionHeading } from "~/components/common/section-heading";
import { SectionWrapper } from "~/components/common/section-wrapper";
import { FORM_THEME_PRESETS } from "~/lib/forms/themes/form-theme-presets";

const featuredTheme =
  FORM_THEME_PRESETS.find((theme) => theme.id === "nebula") ?? FORM_THEME_PRESETS[0]!;
const galleryThemes = FORM_THEME_PRESETS.filter(
  (theme) => theme.id !== featuredTheme.id,
);

export function ThemesShowcaseSection() {
  return (
    <SectionWrapper id="themes" aria-labelledby="themes-heading" className="bg-muted/30">
      <Container>
        <SectionHeading
          id="themes-heading"
          eyebrow="Themes"
          align="center"
          title="Choose a clean, modern <span class='text-primary'>form theme</span>"
          description="Pick a style that fits your brand and apply it instantly."
        />

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          <ThemeShowcaseCard
            theme={featuredTheme}
            featured
            className="col-span-2 row-span-2 sm:col-span-2 sm:row-span-2"
          />
          {galleryThemes.slice(0, 7).map((theme) => (
            <ThemeShowcaseCard key={theme.id} theme={theme} />
          ))}
        </div>
      </Container>
    </SectionWrapper>
  );
}
