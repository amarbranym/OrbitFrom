import type { FormFieldType } from "@repo/form-schema";
import type { ComponentType } from "react";

import type { FieldComponentProps, FieldMeta } from "./types";

const fieldComponents = new Map<FormFieldType, ComponentType<FieldComponentProps>>();
const fieldMetas = new Map<FormFieldType, FieldMeta>();

export function registerField(
  meta: FieldMeta,
  component: ComponentType<FieldComponentProps>,
) {
  fieldMetas.set(meta.type, meta);
  fieldComponents.set(meta.type, component);
}

export function getFieldMeta(type: FormFieldType): FieldMeta | undefined {
  return fieldMetas.get(type);
}

export function getFieldComponent(type: FormFieldType) {
  return fieldComponents.get(type);
}

export function getAllFieldMetas() {
  return Array.from(fieldMetas.values());
}

export function getMetaByLibraryItemId(libraryItemId: string) {
  return getAllFieldMetas().find((meta) => meta.libraryItemId === libraryItemId);
}
