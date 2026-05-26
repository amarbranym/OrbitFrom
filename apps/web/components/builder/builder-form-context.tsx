"use client";

import { createContext, useContext, useMemo } from "react";
import { useSearchParams } from "next/navigation";

type BuilderFormContextValue = {
  formId: string;
  formTitle: string;
  queryString: string;
};

const BuilderFormContext = createContext<BuilderFormContextValue | null>(null);

type BuilderFormProviderProps = {
  formId: string;
  children: React.ReactNode;
};

export function BuilderFormProvider({ formId, children }: BuilderFormProviderProps) {
  const searchParams = useSearchParams();

  const value = useMemo(() => {
    const name = searchParams.get("name")?.trim();
    const template = searchParams.get("template");

    const formTitle =
      name ??
      (formId === "new" ? (template ? "Template form" : "Untitled form") : "Form");

    const params = new URLSearchParams();
    if (name) params.set("name", name);
    if (template) params.set("template", template);

    const queryString = params.toString();

    return { formId, formTitle, queryString };
  }, [formId, searchParams]);

  return (
    <BuilderFormContext.Provider value={value}>{children}</BuilderFormContext.Provider>
  );
}

export function useBuilderForm() {
  const context = useContext(BuilderFormContext);
  if (!context) {
    throw new Error("useBuilderForm must be used within BuilderFormProvider.");
  }
  return context;
}

export function useBuilderQuery() {
  const { queryString } = useBuilderForm();
  return queryString ? `?${queryString}` : "";
}
