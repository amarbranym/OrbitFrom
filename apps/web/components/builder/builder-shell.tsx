"use client";

import { Suspense } from "react";

import { BuilderEditorProvider } from "~/components/builder/builder-editor-context";
import { BuilderFormProvider } from "~/components/builder/builder-form-context";
import { BuilderNavSidebar } from "~/components/builder/builder-nav-sidebar";
import { BuilderUnsavedGuard } from "~/components/builder/builder-unsaved-guard";
import { FieldPropertiesDrawer } from "~/components/builder/properties/field-properties-drawer";
import { FormPropertiesDrawer } from "~/components/builder/properties/form-properties-drawer";
import { ThemePreviewDialog } from "~/components/builder/theme-preview/theme-preview-dialog";
import { BuilderTopbar } from "~/components/builder/builder-topbar";

type BuilderShellProps = {
  formId: string;
  children: React.ReactNode;
};

function BuilderShellContent({ formId, children }: BuilderShellProps) {
  return (
    <BuilderFormProvider formId={formId}>
      <BuilderEditorProvider>
        <BuilderUnsavedGuard>
          <div className="flex h-dvh flex-col overflow-hidden bg-background">
            <BuilderTopbar />
            <div className="flex min-h-0 flex-1">
              <BuilderNavSidebar />
              <div className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</div>
            </div>
            <FieldPropertiesDrawer />
            <FormPropertiesDrawer />
            <ThemePreviewDialog />
          </div>
        </BuilderUnsavedGuard>
      </BuilderEditorProvider>
    </BuilderFormProvider>
  );
}

export function BuilderShell({ formId, children }: BuilderShellProps) {
  return (
    <Suspense fallback={<div className="flex h-dvh items-center justify-center">Loading…</div>}>
      <BuilderShellContent formId={formId}>{children}</BuilderShellContent>
    </Suspense>
  );
}
