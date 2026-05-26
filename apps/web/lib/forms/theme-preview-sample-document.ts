import type { FormDocument } from "@repo/form-schema";

import { createEmptyDocument } from "~/lib/forms/create-document";
import { getTemplateFields } from "~/lib/forms/template-fields";

/** Stable sample form used in theme gallery / marketing previews. */
export const THEME_PREVIEW_SAMPLE_DOCUMENT: FormDocument = {
  ...createEmptyDocument("Registration Form", "theme-preview-sample"),
  description: "Join our community — fill out the form below.",
  fields: getTemplateFields("event-registration"),
};
