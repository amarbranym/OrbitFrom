import Link from "next/link";

import { PageHeader } from "~/components/dashboard/page-header";
import { ThemesGallery } from "~/components/themes/themes-gallery";
import { Button } from "~/components/ui/button";
import { FORM_THEME_PRESETS } from "~/lib/forms/themes/form-theme-presets";

export default function ThemesPage() {
  const themeCount = FORM_THEME_PRESETS.length;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 md:gap-8">
      <PageHeader
        title="Themes"
        description={`Browse ${themeCount} ready-made themes for your forms — corporate, playful, dark mode, and more. Apply any theme from the builder when editing a form.`}
        action={
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/forms">My forms</Link>
          </Button>
        }
      />

      <ThemesGallery />
    </div>
  );
}
