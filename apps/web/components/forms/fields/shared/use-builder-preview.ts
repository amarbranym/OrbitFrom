import type { FieldRenderMode } from "~/lib/forms/registry/types";

export function useBuilderPreview(mode: FieldRenderMode) {
  return mode === "builder";
}
