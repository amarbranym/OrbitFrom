import type { FormDocument } from "./form-document";

export type FormAccessReason =
  | "ok"
  | "not_found"
  | "draft"
  | "unpublished"
  | "not_published"
  | "closed"
  | "response_limit_reached";

export type FormAccessResult = {
  allowed: boolean;
  reason: FormAccessReason;
  canSubmit: boolean;
  showInExplore: boolean;
};

export function canAccessForm(
  document: FormDocument | null,
  options?: {
    requirePublished?: boolean;
    submissionCount?: number;
    now?: Date;
  },
): FormAccessResult {
  if (!document) {
    return {
      allowed: false,
      reason: "not_found",
      canSubmit: false,
      showInExplore: false,
    };
  }

  const { status, visibility } = document;
  const requirePublished = options?.requirePublished ?? true;

  if (status === "draft") {
    return {
      allowed: !requirePublished,
      reason: "draft",
      canSubmit: false,
      showInExplore: false,
    };
  }

  if (status === "unpublished") {
    return {
      allowed: false,
      reason: "unpublished",
      canSubmit: false,
      showInExplore: false,
    };
  }

  if (status === "published") {
    const now = options?.now ?? new Date();
    const submissionCount = options?.submissionCount ?? 0;
    const settings = document.settings;

    if (settings?.closeAt) {
      const closeAt = new Date(settings.closeAt);
      if (!Number.isNaN(closeAt.getTime()) && now > closeAt) {
        return {
          allowed: true,
          reason: "closed",
          canSubmit: false,
          showInExplore: visibility === "public",
        };
      }
    }

    if (
      settings?.responseLimit !== undefined &&
      submissionCount >= settings.responseLimit
    ) {
      return {
        allowed: true,
        reason: "response_limit_reached",
        canSubmit: false,
        showInExplore: visibility === "public",
      };
    }

    return {
      allowed: true,
      reason: "ok",
      canSubmit: true,
      showInExplore: visibility === "public",
    };
  }

  return {
    allowed: false,
    reason: "not_published",
    canSubmit: false,
    showInExplore: false,
  };
}

export function isExploreVisible(
  status: FormDocument["status"],
  visibility: FormDocument["visibility"],
) {
  return status === "published" && visibility === "public";
}
