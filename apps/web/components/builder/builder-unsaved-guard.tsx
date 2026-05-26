"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import { useBuilderEditor } from "~/components/builder/builder-editor-context";
import { UnsavedChangesDialog } from "~/components/builder/unsaved-changes-dialog";

type BuilderNavigationContextValue = {
  requestNavigation: (href: string) => void;
};

const BuilderNavigationContext = createContext<BuilderNavigationContextValue | null>(null);

export function useBuilderNavigation() {
  const context = useContext(BuilderNavigationContext);
  if (!context) {
    throw new Error("useBuilderNavigation must be used within BuilderUnsavedGuard.");
  }
  return context;
}

export function BuilderUnsavedGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isDirty, isSaving, saveDocumentNow } = useBuilderEditor();
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);

  const requestNavigation = useCallback(
    (href: string) => {
      if (!isDirty) {
        router.push(href);
        return;
      }
      setPendingHref(href);
      setDialogOpen(true);
    },
    [isDirty, router],
  );

  const handleDiscard = () => {
    const href = pendingHref;
    setDialogOpen(false);
    setPendingHref(null);
    if (href) router.push(href);
  };

  const handleSave = async () => {
    try {
      await saveDocumentNow();
      const href = pendingHref;
      setDialogOpen(false);
      setPendingHref(null);
      if (href) router.push(href);
    } catch {
      /* toast shown in saveDocumentNow */
    }
  };

  return (
    <BuilderNavigationContext.Provider value={{ requestNavigation }}>
      {children}
      <UnsavedChangesDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setDialogOpen(false);
            setPendingHref(null);
          }
        }}
        onDiscard={handleDiscard}
        onSave={() => void handleSave()}
        isSaving={isSaving}
      />
    </BuilderNavigationContext.Provider>
  );
}
