import type { FormDocument } from "@repo/form-schema";

/** Stable JSON for comparing whether the builder document has unsaved edits. */
export function serializeDocumentSnapshot(document: FormDocument): string {
  return JSON.stringify({
    title: document.title,
    description: document.description ?? null,
    slug: document.slug,
    visibility: document.visibility,
    presentationMode: document.presentationMode,
    theme: document.theme,
    settings: document.settings ?? null,
    fields: document.fields,
    logic: document.logic ?? null,
  });
}

export function documentsMatch(a: FormDocument, b: FormDocument): boolean {
  return serializeDocumentSnapshot(a) === serializeDocumentSnapshot(b);
}
