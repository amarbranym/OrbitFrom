import { z } from "zod";

import { createFieldId } from "./field-schema";
import type { FieldSchema } from "./field-schema";
import type { FormDocument } from "./form-document";

export const formPageSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
});

export type FormPage = z.infer<typeof formPageSchema>;

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isValidUuid(value: string): boolean {
  return UUID_RE.test(value);
}

function legacyDefaultPageId(document: FormDocument): string {
  return `page-${document.id}`;
}

export function getDefaultPageId(document: FormDocument): string {
  const pages = document.settings?.pages;
  if (pages?.[0]?.id) return pages[0].id;
  return document.id;
}

export function getFormPages(document: FormDocument): FormPage[] {
  const pages = document.settings?.pages;
  if (pages && pages.length > 0) return pages;
  return [{ id: document.id, title: "Page 1" }];
}

export function isMultiPageForm(document: FormDocument): boolean {
  return getFormPages(document).length > 1;
}

export function getFieldsForPage(document: FormDocument, pageId: string): FieldSchema[] {
  const defaultPageId = getDefaultPageId(document);
  return document.fields.filter((field) => (field.pageId ?? defaultPageId) === pageId);
}

export function ensureFormPages(document: FormDocument): FormDocument {
  const idRemap = new Map<string, string>();
  const legacyId = legacyDefaultPageId(document);

  const remap = (id: string): string => {
    if (isValidUuid(id)) return id;
    const cached = idRemap.get(id);
    if (cached) return cached;
    const next =
      id === legacyId || !document.settings?.pages?.length ? document.id : createFieldId();
    idRemap.set(id, next);
    return next;
  };

  const sourcePages = getFormPages(document);
  const pages = sourcePages.map((page) => ({
    ...page,
    id: remap(page.id),
  }));

  const defaultPageId = pages[0]?.id ?? document.id;

  const fields = document.fields.map((field) => ({
    ...field,
    pageId: remap(field.pageId ?? legacyId ?? defaultPageId),
  }));

  const uniquePages = pages.filter(
    (page, index, arr) => arr.findIndex((candidate) => candidate.id === page.id) === index,
  );

  const resolvedPages =
    uniquePages.length > 0 ? uniquePages : [{ id: document.id, title: "Page 1" }];

  const settings = {
    ...document.settings,
    pages: resolvedPages,
  };

  const presentationMode =
    resolvedPages.length > 1 ? ("stepper" as const) : ("classic" as const);

  return {
    ...document,
    fields,
    settings,
    presentationMode,
  };
}

export function createFormPage(title: string): FormPage {
  return {
    id: createFieldId(),
    title,
  };
}

export function addPageToDocument(document: FormDocument, title?: string): FormDocument {
  const pages = getFormPages(document);
  const nextPage = createFormPage(title ?? `Page ${pages.length + 1}`);
  const next = ensureFormPages({
    ...document,
    settings: {
      ...document.settings,
      pages: [...pages, nextPage],
    },
  });
  return { ...next, presentationMode: "stepper" };
}

export function updatePageTitle(
  document: FormDocument,
  pageId: string,
  title: string,
): FormDocument {
  const pages = getFormPages(document).map((page) =>
    page.id === pageId ? { ...page, title } : page,
  );
  return ensureFormPages({
    ...document,
    settings: { ...document.settings, pages },
  });
}

export function removePageFromDocument(document: FormDocument, pageId: string): FormDocument {
  const pages = getFormPages(document);
  if (pages.length <= 1) return document;

  const defaultPageId = pages.find((p) => p.id !== pageId)?.id ?? pages[0]!.id;
  const nextPages = pages.filter((p) => p.id !== pageId);

  const fields = document.fields
    .filter((field) => (field.pageId ?? getDefaultPageId(document)) !== pageId)
    .map((field) =>
      field.pageId === pageId ? { ...field, pageId: defaultPageId } : field,
    );

  const next = ensureFormPages({
    ...document,
    fields,
    settings: { ...document.settings, pages: nextPages },
  });

  return {
    ...next,
    presentationMode: nextPages.length > 1 ? "stepper" : "classic",
  };
}
