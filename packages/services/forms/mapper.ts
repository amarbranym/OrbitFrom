import {
  ensureFormPages,
  formDocumentSchema,
  type FormDocument,
  type FormListItem,
} from "@repo/form-schema";
import type { SelectForm } from "@repo/database/schema";

export function rowToFormDocument(row: SelectForm): FormDocument {
  const document = {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description ?? undefined,
    status: row.status as FormDocument["status"],
    visibility: row.visibility as FormDocument["visibility"],
    presentationMode: row.presentationMode as FormDocument["presentationMode"],
    theme: row.theme as FormDocument["theme"],
    settings: (row.settings as FormDocument["settings"]) ?? undefined,
    fields: row.fields as FormDocument["fields"],
    logic: (row.logic as FormDocument["logic"]) ?? undefined,
    updatedAt: row.updatedAt.toISOString(),
  };

  return formDocumentSchema.parse(ensureFormPages(document));
}

export function rowToFormListItem(row: SelectForm): FormListItem {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    fieldCount: (row.fields as unknown[]).length,
    responseCount: row.responseCount,
    status: row.status as FormListItem["status"],
    visibility: row.visibility as FormListItem["visibility"],
    updatedAt: row.updatedAt.toISOString(),
  };
}
