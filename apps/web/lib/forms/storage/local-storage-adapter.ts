import type {
  FormDocument,
  FormListItem,
  FormSubmission,
} from "@repo/form-schema";
import { isExploreVisible } from "@repo/form-schema";

import { normalizeDocument } from "../normalize-document";

const INDEX_KEY = "orbitform:v1:forms-index";

function formKey(id: string) {
  return `orbitform:v1:form:${id}`;
}

function submissionsKey(formId: string) {
  return `orbitform:v1:submissions:${formId}`;
}

function readIndex(): FormListItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(INDEX_KEY);
    return raw ? (JSON.parse(raw) as FormListItem[]) : [];
  } catch {
    return [];
  }
}

function writeIndex(forms: FormListItem[]) {
  localStorage.setItem(INDEX_KEY, JSON.stringify(forms));
}

export function getDocument(id: string): FormDocument | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(formKey(id));
    return raw ? normalizeDocument(JSON.parse(raw) as FormDocument) : null;
  } catch {
    return null;
  }
}

export function saveDocument(document: FormDocument) {
  localStorage.setItem(formKey(document.id), JSON.stringify(document));

  const index = readIndex();
  const existing = index.find((item) => item.id === document.id);
  const listItem: FormListItem = {
    id: document.id,
    slug: document.slug,
    title: document.title,
    fieldCount: document.fields.length,
    responseCount: existing?.responseCount ?? 0,
    status: document.status,
    visibility: document.visibility,
    updatedAt: document.updatedAt,
  };

  const next = existing
    ? index.map((item) => (item.id === document.id ? listItem : item))
    : [listItem, ...index];

  writeIndex(next);
}

export function deleteDocument(id: string) {
  localStorage.removeItem(formKey(id));
  localStorage.removeItem(submissionsKey(id));
  writeIndex(readIndex().filter((item) => item.id !== id));
}

export function listIndex(): FormListItem[] {
  return readIndex().sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export function getBySlug(slug: string): FormDocument | null {
  const normalized = slug.toLowerCase();
  for (const item of listIndex()) {
    const doc = getDocument(item.id);
    if (doc?.slug.toLowerCase() === normalized) return doc;
  }
  return null;
}

export function listExploreForms(): FormListItem[] {
  return listIndex().filter((item) =>
    isExploreVisible(item.status, item.visibility),
  );
}

export function appendSubmission(formId: string, submission: FormSubmission) {
  const key = submissionsKey(formId);
  const existing = listSubmissions(formId);
  localStorage.setItem(key, JSON.stringify([submission, ...existing]));

  const index = readIndex();
  writeIndex(
    index.map((item) =>
      item.id === formId
        ? { ...item, responseCount: item.responseCount + 1 }
        : item,
    ),
  );
}

export function listSubmissions(formId: string): FormSubmission[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(submissionsKey(formId));
    return raw ? (JSON.parse(raw) as FormSubmission[]) : [];
  } catch {
    return [];
  }
}

export function ensureUniqueSlug(baseSlug: string, excludeId?: string) {
  const items = listIndex();
  let slug = baseSlug;
  let counter = 1;

  while (
    items.some(
      (item) => item.slug === slug && (excludeId ? item.id !== excludeId : true),
    )
  ) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return slug;
}
