"use client";

import type { FieldSchema, FormDocument, FormPage } from "@repo/form-schema";
import {
  addPageToDocument,
  createFieldId,
  getDefaultPageId,
  getFieldsForPage,
  getFormPages,
  slugifyTitle,
  updatePageTitle,
} from "@repo/form-schema";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { useBuilderForm } from "~/components/builder/builder-form-context";
import { createFieldFromLibraryItem } from "~/lib/forms/create-field-from-library";
import { createEmptyDocument } from "~/lib/forms/create-document";
import { normalizeDocument } from "~/lib/forms/normalize-document";
import { serializeDocumentSnapshot } from "~/lib/forms/document-snapshot";
import { insertFieldOnPage, insertPageAfter } from "~/lib/forms/field-page-order";
import { saveDocument as persistDocumentLocally } from "~/lib/forms/storage";
import { getTemplateDefinition } from "~/lib/forms/template-fields";
import {
  getThemePreset,
  themePresetToDocumentTheme,
} from "~/lib/forms/themes/form-theme-presets";
import { trpc } from "~/trpc/client";

type BuilderEditorContextValue = {
  storageId: string;
  document: FormDocument;
  fields: FieldSchema[];
  pages: FormPage[];
  selectedFieldId: string | null;
  selectedField: FieldSchema | null;
  isLoaded: boolean;
  isDirty: boolean;
  isSaving: boolean;
  isPropertiesOpen: boolean;
  isFormPropertiesOpen: boolean;
  openFormProperties: () => void;
  closeFormProperties: () => void;
  isThemePreviewOpen: boolean;
  themePreviewPresetId: string | null;
  openThemePreview: (presetId?: string) => void;
  closeThemePreview: () => void;
  addFieldFromLibrary: (libraryItemId: string, pageId?: string) => void;
  addPage: (afterPageId?: string) => void;
  updatePageTitle: (pageId: string, title: string) => void;
  selectField: (fieldId: string | null) => void;
  openProperties: (fieldId: string) => void;
  closeProperties: () => void;
  saveDocumentNow: () => Promise<void>;
  /** Applies a theme preset and persists to the database (required for shared links). */
  applyTheme: (presetId: string) => Promise<void>;
  updateField: (fieldId: string, patch: Partial<FieldSchema>) => void;
  updateDocument: (patch: Partial<FormDocument>) => void;
  removeField: (fieldId: string) => void;
  duplicateField: (fieldId: string) => void;
  moveField: (fromIndex: number, toIndex: number, pageId?: string) => void;
  publishForm: () => void;
  unpublishForm: () => void;
};

const BuilderEditorContext = createContext<BuilderEditorContextValue | null>(null);

type BuilderEditorProviderProps = {
  children: React.ReactNode;
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function BuilderEditorProvider({ children }: BuilderEditorProviderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { formId, formTitle, queryString } = useBuilderForm();
  const templateId = searchParams.get("template");
  const utils = trpc.useUtils();

  const isNew = formId === "new";
  const canFetch = !isNew && UUID_RE.test(formId);

  const [document, setDocument] = useState<FormDocument>(() =>
    createEmptyDocument(formTitle),
  );
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);
  const [isFormPropertiesOpen, setIsFormPropertiesOpen] = useState(false);
  const [isThemePreviewOpen, setIsThemePreviewOpen] = useState(false);
  const [themePreviewPresetId, setThemePreviewPresetId] = useState<string | null>(
    null,
  );
  const [isLoaded, setIsLoaded] = useState(isNew);
  const [savedSnapshot, setSavedSnapshot] = useState<string | null>(null);
  const documentRef = useRef(document);
  documentRef.current = document;

  const markDocumentSaved = useCallback((doc: FormDocument) => {
    const normalized = normalizeDocument(doc);
    setDocument(normalized);
    setSavedSnapshot(serializeDocumentSnapshot(normalized));
    persistDocumentLocally(normalized);
  }, []);

  const createMutation = trpc.forms.create.useMutation({
    onSuccess: (doc) => {
      void utils.forms.list.invalidate();
      const qs = queryString ? `?${queryString}` : "";
      router.replace(`/dashboard/builder/${doc.id}${qs}`);
      markDocumentSaved(doc);
      setIsLoaded(true);
    },
    onError: (err) => toast.error(err.message),
  });

  const { data: fetchedDoc, isLoading: isFetching } = trpc.forms.getById.useQuery(
    { formId },
    { enabled: canFetch },
  );

  const updateMutation = trpc.forms.update.useMutation();

  const publishMutation = trpc.forms.publish.useMutation({
    onSuccess: (doc) => {
      markDocumentSaved(doc);
      void utils.forms.list.invalidate();
      void utils.publicForms.listExplore.invalidate();
      toast.success("Form published");
    },
    onError: (err) => toast.error(err.message),
  });

  const unpublishMutation = trpc.forms.unpublish.useMutation({
    onSuccess: (doc) => {
      markDocumentSaved(doc);
      void utils.forms.list.invalidate();
      void utils.publicForms.listExplore.invalidate();
      toast.success("Form unpublished");
    },
    onError: (err) => toast.error(err.message),
  });

  const createStartedRef = useRef(false);
  useEffect(() => {
    if (isNew && !createStartedRef.current) {
      createStartedRef.current = true;
      const templateDef = templateId ? getTemplateDefinition(templateId) : null;

      createMutation.mutate({
        title: formTitle,
        description: templateDef?.description,
        fields: templateDef?.fields,
      });
    }
  }, [isNew, formTitle, templateId, createMutation.mutate]);

  useEffect(() => {
    if (fetchedDoc) {
      markDocumentSaved(fetchedDoc);
      setIsLoaded(true);
    }
  }, [fetchedDoc, markDocumentSaved]);

  useEffect(() => {
    if (!isLoaded || !isNew) return;
    setDocument((current) =>
      current.title === formTitle ? current : { ...current, title: formTitle },
    );
  }, [formTitle, isLoaded, isNew]);

  const isDirty = useMemo(() => {
    if (!isLoaded || isNew || !savedSnapshot) return false;
    return serializeDocumentSnapshot(document) !== savedSnapshot;
  }, [document, isLoaded, isNew, savedSnapshot]);

  const fields = document.fields;
  const pages = useMemo(() => getFormPages(document), [document]);
  const storageId = document.id;

  const updateDocument = useCallback((patch: Partial<FormDocument>) => {
    setDocument((current) => {
      const next = { ...current, ...patch };
      if (patch.title && !patch.slug && current.status !== "published") {
        next.slug = slugifyTitle(patch.title);
      }
      return next;
    });
  }, []);

  const addFieldFromLibrary = useCallback((libraryItemId: string, pageId?: string) => {
    const field = createFieldFromLibraryItem(libraryItemId);
    setDocument((current) => {
      const targetPageId = pageId ?? getFormPages(current).at(-1)?.id ?? getDefaultPageId(current);
      return {
        ...current,
        fields: insertFieldOnPage(current, field, targetPageId),
      };
    });
    setSelectedFieldId(field.id);
    setIsFormPropertiesOpen(false);
    setIsPropertiesOpen(true);
  }, []);

  const addPage = useCallback((afterPageId?: string) => {
    setDocument((current) => {
      if (!afterPageId) return addPageToDocument(current);
      return insertPageAfter(current, afterPageId);
    });
  }, []);

  const updatePageTitleHandler = useCallback((pageId: string, title: string) => {
    setDocument((current) => updatePageTitle(current, pageId, title));
  }, []);

  const selectField = useCallback((fieldId: string | null) => {
    setSelectedFieldId(fieldId);
    if (!fieldId) setIsPropertiesOpen(false);
  }, []);

  const openProperties = useCallback((fieldId: string) => {
    setSelectedFieldId(fieldId);
    setIsFormPropertiesOpen(false);
    setIsPropertiesOpen(true);
  }, []);

  const closeProperties = useCallback(() => {
    setIsPropertiesOpen(false);
  }, []);

  const openFormProperties = useCallback(() => {
    setIsPropertiesOpen(false);
    setIsFormPropertiesOpen(true);
  }, []);

  const closeFormProperties = useCallback(() => {
    setIsFormPropertiesOpen(false);
  }, []);

  const persistDocumentToServer = useCallback(
    (doc: FormDocument, successMessage?: string): Promise<FormDocument> => {
      const normalized = normalizeDocument(doc);
      if (isNew || !UUID_RE.test(normalized.id)) {
        return Promise.resolve(normalized);
      }

      return new Promise((resolve, reject) => {
        updateMutation.mutate(
          {
            formId: normalized.id,
            title: normalized.title,
            description: normalized.description,
            slug: normalized.slug,
            visibility: normalized.visibility,
            presentationMode: normalized.presentationMode,
            theme: normalized.theme,
            settings: normalized.settings,
            fields: normalized.fields,
            logic: normalized.logic,
          },
          {
            onSuccess: (saved) => {
              markDocumentSaved(saved);
              void utils.forms.list.invalidate();
              void utils.publicForms.getBySlug.invalidate({ slug: saved.slug });
              if (saved.status === "published") {
                void utils.publicForms.listExplore.invalidate();
              }
              if (successMessage) {
                toast.success(successMessage);
              }
              resolve(saved);
            },
            onError: (err) => {
              toast.error(err.message);
              reject(err);
            },
          },
        );
      });
    },
    [isNew, markDocumentSaved, updateMutation, utils],
  );

  const saveDocumentNow = useCallback((): Promise<void> => {
    return persistDocumentToServer(documentRef.current, "Form saved").then(() => undefined);
  }, [persistDocumentToServer]);

  const applyTheme = useCallback(
    async (presetId: string) => {
      const preset = getThemePreset(presetId);
      const next = normalizeDocument({
        ...documentRef.current,
        theme: themePresetToDocumentTheme(preset),
      });

      setDocument(next);
      documentRef.current = next;
      persistDocumentLocally(next);

      await persistDocumentToServer(next, `${preset.name} theme applied`);
    },
    [persistDocumentToServer],
  );

  const openThemePreview = useCallback((presetId?: string) => {
    setThemePreviewPresetId(presetId ?? null);
    setIsThemePreviewOpen(true);
  }, []);

  const closeThemePreview = useCallback(() => {
    setIsThemePreviewOpen(false);
    setThemePreviewPresetId(null);
  }, []);

  const updateField = useCallback((fieldId: string, patch: Partial<FieldSchema>) => {
    setDocument((current) => ({
      ...current,
      fields: current.fields.map((field) => {
        if (field.id !== fieldId) return field;
        const next = { ...field, ...patch };
        if (patch.colSpan !== undefined) {
          next.colSpan = Math.min(12, Math.max(1, Math.round(patch.colSpan)));
        }
        return next;
      }),
    }));
  }, []);

  const removeField = useCallback((fieldId: string) => {
    setDocument((current) => ({
      ...current,
      fields: current.fields.filter((field) => field.id !== fieldId),
    }));
    setSelectedFieldId((current) => (current === fieldId ? null : current));
    setIsPropertiesOpen(false);
  }, []);

  const duplicateField = useCallback((fieldId: string) => {
    setDocument((current) => {
      const source = current.fields.find((f) => f.id === fieldId);
      if (!source) return current;
      const copy: FieldSchema = {
        ...source,
        id: createFieldId(),
        label: `${source.label} (copy)`,
      };
      const index = current.fields.findIndex((f) => f.id === fieldId);
      const fields = [...current.fields];
      fields.splice(index + 1, 0, copy);
      return { ...current, fields };
    });
  }, []);

  const moveField = useCallback(
    (fromIndex: number, toIndex: number, pageId?: string) => {
      setDocument((current) => {
        if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return current;
        if (fromIndex >= current.fields.length || toIndex >= current.fields.length) {
          return current;
        }

        const defaultPageId = getDefaultPageId(current);
        const movedField = current.fields[fromIndex];
        const targetPageId =
          pageId ?? movedField?.pageId ?? defaultPageId;

        if ((movedField?.pageId ?? defaultPageId) !== targetPageId) {
          return current;
        }

        const pageFields = getFieldsForPage(current, targetPageId);
        const fromField = current.fields[fromIndex];
        const toField = current.fields[toIndex];
        if (
          !fromField ||
          !toField ||
          (fromField.pageId ?? defaultPageId) !== targetPageId ||
          (toField.pageId ?? defaultPageId) !== targetPageId
        ) {
          return current;
        }

        if (pageFields.length <= 1) return current;

        const pageIndices = current.fields
          .map((field, index) => ({ field, index }))
          .filter(({ field }) => (field.pageId ?? defaultPageId) === targetPageId)
          .map(({ index }) => index);

        const fromLocal = pageIndices.indexOf(fromIndex);
        const toLocal = pageIndices.indexOf(toIndex);
        if (fromLocal < 0 || toLocal < 0 || fromLocal === toLocal) return current;

        const next = [...current.fields];
        const [moved] = next.splice(fromIndex, 1);
        if (!moved) return current;
        const adjustedTo = fromIndex < toIndex ? toIndex - 1 : toIndex;
        next.splice(adjustedTo, 0, moved);
        return { ...current, fields: next };
      });
    },
    [],
  );

  const publishForm = useCallback(async () => {
    if (!UUID_RE.test(document.id)) return;
    if (isDirty) {
      try {
        await saveDocumentNow();
      } catch {
        return;
      }
    }
    publishMutation.mutate({ formId: document.id });
  }, [document.id, isDirty, publishMutation, saveDocumentNow]);

  const unpublishForm = useCallback(() => {
    if (!UUID_RE.test(document.id)) return;
    unpublishMutation.mutate({ formId: document.id });
  }, [document.id, unpublishMutation]);

  const selectedField = useMemo(
    () => fields.find((field) => field.id === selectedFieldId) ?? null,
    [fields, selectedFieldId],
  );

  const value = useMemo(
    () => ({
      storageId,
      document,
      fields,
      pages,
      selectedFieldId,
      selectedField,
      isLoaded: isLoaded && !isFetching && !createMutation.isPending,
      isDirty,
      isSaving: updateMutation.isPending,
      isPropertiesOpen,
      isFormPropertiesOpen,
      openFormProperties,
      closeFormProperties,
      isThemePreviewOpen,
      themePreviewPresetId,
      openThemePreview,
      closeThemePreview,
      addFieldFromLibrary,
      addPage,
      updatePageTitle: updatePageTitleHandler,
      selectField,
      openProperties,
      closeProperties,
      saveDocumentNow,
      applyTheme,
      updateField,
      updateDocument,
      removeField,
      duplicateField,
      moveField,
      publishForm,
      unpublishForm,
    }),
    [
      storageId,
      document,
      fields,
      pages,
      selectedFieldId,
      selectedField,
      isLoaded,
      isDirty,
      isFetching,
      createMutation.isPending,
      updateMutation.isPending,
      isPropertiesOpen,
      isFormPropertiesOpen,
      openFormProperties,
      closeFormProperties,
      isThemePreviewOpen,
      themePreviewPresetId,
      openThemePreview,
      closeThemePreview,
      addFieldFromLibrary,
      addPage,
      updatePageTitleHandler,
      selectField,
      openProperties,
      closeProperties,
      saveDocumentNow,
      applyTheme,
      updateField,
      updateDocument,
      removeField,
      duplicateField,
      moveField,
      publishForm,
      unpublishForm,
    ],
  );

  return (
    <BuilderEditorContext.Provider value={value}>{children}</BuilderEditorContext.Provider>
  );
}

export function useBuilderEditor() {
  const context = useContext(BuilderEditorContext);
  if (!context) {
    throw new Error("useBuilderEditor must be used within BuilderEditorProvider.");
  }
  return context;
}
