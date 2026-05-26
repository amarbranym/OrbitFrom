"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { getTemplateDefinition } from "~/lib/forms/template-fields";
import {
  getThemePreset,
  themePresetToDocumentTheme,
} from "~/lib/forms/themes/form-theme-presets";
import { trpc } from "~/trpc/client";

type UseCreateFormFromTemplateOptions = {
  onSuccess?: () => void;
};

export function useCreateFormFromTemplate(options?: UseCreateFormFromTemplateOptions) {
  const router = useRouter();
  const utils = trpc.useUtils();

  const mutation = trpc.forms.create.useMutation({
    onSuccess: (doc) => {
      void utils.forms.list.invalidate();
      options?.onSuccess?.();
      router.push(`/dashboard/builder/${doc.id}`);
    },
    onError: (err) => toast.error(err.message),
  });

  const createFromTemplate = (templateId: string, themePresetId?: string) => {
    const definition = getTemplateDefinition(templateId);
    const theme = themePresetId
      ? themePresetToDocumentTheme(getThemePreset(themePresetId))
      : undefined;

    mutation.mutate({
      title: definition.title,
      description: definition.description,
      fields: definition.fields,
      theme,
    });
  };

  return {
    createFromTemplate,
    isPending: mutation.isPending,
  };
}
