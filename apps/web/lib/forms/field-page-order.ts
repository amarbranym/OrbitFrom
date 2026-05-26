import {
  createFormPage,
  ensureFormPages,
  getDefaultPageId,
  getFormPages,
  type FieldSchema,
  type FormDocument,
} from "@repo/form-schema";

export function getFieldGlobalIndex(fields: FieldSchema[], fieldId: string): number {
  return fields.findIndex((field) => field.id === fieldId);
}

export function insertFieldOnPage(
  document: FormDocument,
  field: FieldSchema,
  pageId: string,
): FieldSchema[] {
  const pages = getFormPages(document);
  const defaultPageId = getDefaultPageId(document);
  const targetPageId = pageId || defaultPageId;

  const fieldWithPage: FieldSchema = { ...field, pageId: targetPageId };
  const fields = document.fields;

  const pageIndex = pages.findIndex((page) => page.id === targetPageId);
  let insertAt = 0;
  for (let i = 0; i < pageIndex; i++) {
    const pid = pages[i]!.id;
    insertAt += fields.filter((f) => (f.pageId ?? defaultPageId) === pid).length;
  }
  insertAt += fields.filter((f) => (f.pageId ?? defaultPageId) === targetPageId).length;

  const next = [...fields];
  next.splice(insertAt, 0, fieldWithPage);
  return next;
}

export function moveFieldOnPage(
  fields: FieldSchema[],
  fromIndex: number,
  toIndex: number,
  pageId: string,
  defaultPageId: string,
): FieldSchema[] {
  const pageFields = fields
    .map((field, index) => ({ field, index }))
    .filter(({ field }) => (field.pageId ?? defaultPageId) === pageId);

  const fromLocal = pageFields.findIndex(({ index }) => index === fromIndex);
  const toLocal = pageFields.findIndex(({ index }) => index === toIndex);

  if (fromLocal < 0 || toLocal < 0 || fromLocal === toLocal) return fields;

  const fromGlobal = pageFields[fromLocal]!.index;
  const toGlobal = pageFields[toLocal]!.index;

  const next = [...fields];
  const [moved] = next.splice(fromGlobal, 1);
  if (!moved) return fields;
  next.splice(toGlobal, 0, moved);
  return next;
}

export function insertPageAfter(
  document: FormDocument,
  afterPageId: string,
  title?: string,
): FormDocument {
  const pages = getFormPages(document);
  const insertIndex = pages.findIndex((page) => page.id === afterPageId);
  const newPage = createFormPage(title ?? `Page ${pages.length + 1}`);
  const nextPages =
    insertIndex < 0
      ? [...pages, newPage]
      : [...pages.slice(0, insertIndex + 1), newPage, ...pages.slice(insertIndex + 1)];

  return ensureFormPages({
    ...document,
    settings: { ...document.settings, pages: nextPages },
    presentationMode: "stepper",
  });
}
