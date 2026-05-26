/** Re-exports from shared form schema package */
export type {
  FieldSchema,
  FieldOption,
  FormFieldType,
  FormDocument,
  FormListItem,
  FormStatus,
  FormVisibility,
  FieldVisibility,
} from "@repo/form-schema";

/** @deprecated Use FieldSchema */
export type FormField = import("@repo/form-schema").FieldSchema;

/** @deprecated Use FormDocument */
export type StoredForm = import("@repo/form-schema").FormDocument;
