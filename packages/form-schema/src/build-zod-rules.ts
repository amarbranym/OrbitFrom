import { z } from "zod";

import type { FieldSchema } from "./field-schema";
import { getMultiSelectSettings } from "./multi-select-settings";
import {
  fieldCheckboxMessage,
  fieldDateMessage,
  fieldEmailMessage,
  fieldMaxLengthMessage,
  fieldMinLengthMessage,
  fieldMultiSelectMaxMessage,
  fieldMultiSelectMinMessage,
  fieldMultiSelectMessage,
  fieldNumberMessage,
  fieldRatingMessage,
  fieldRequiredMessage,
  fieldSelectMessage,
} from "./validation-messages";

function validateStringField(value: string, field: FieldSchema, ctx: z.RefinementCtx) {
  const label = field.label;
  const trimmed = value.trim();
  const minLen = field.charLimit?.min;
  const maxLen = field.charLimit?.max;

  if (field.required && trimmed.length === 0) {
    ctx.addIssue({
      code: "custom",
      message: fieldRequiredMessage(label),
    });
    return;
  }

  if (!field.required && trimmed.length === 0) {
    return;
  }

  const length = value.length;

  if (minLen != null && length < minLen) {
    ctx.addIssue({
      code: "custom",
      message: fieldMinLengthMessage(label, minLen),
    });
  }

  if (maxLen != null && length > maxLen) {
    ctx.addIssue({
      code: "custom",
      message: fieldMaxLengthMessage(label, maxLen),
    });
  }
}

function buildTextRule(field: FieldSchema) {
  return z.string().superRefine((value, ctx) => {
    validateStringField(value, field, ctx);
  });
}

function buildEmailRule(field: FieldSchema) {
  return z.string().superRefine((value, ctx) => {
    const label = field.label;
    const trimmed = value.trim();

    if (field.required && trimmed.length === 0) {
      ctx.addIssue({ code: "custom", message: fieldRequiredMessage(label) });
      return;
    }

    if (!field.required && trimmed.length === 0) {
      return;
    }

    const emailCheck = z.email().safeParse(trimmed);
    if (!emailCheck.success) {
      ctx.addIssue({ code: "custom", message: fieldEmailMessage(label) });
    }
  });
}

export function buildZodRuleForField(field: FieldSchema): z.ZodTypeAny {
  const label = field.label;

  switch (field.type) {
    case "text":
    case "long_text":
      return buildTextRule(field);

    case "email":
      return buildEmailRule(field);

    case "number": {
      return z.union([z.string(), z.number()]).superRefine((value, ctx) => {
        const raw = String(value ?? "").trim();
        if (!field.required && raw === "") return;
        if (raw === "") {
          ctx.addIssue({ code: "custom", message: fieldRequiredMessage(label) });
          return;
        }
        if (Number.isNaN(Number(raw))) {
          ctx.addIssue({ code: "custom", message: fieldNumberMessage(label) });
        }
      });
    }

    case "single_select": {
      return z.string().superRefine((value, ctx) => {
        if (!field.required && value.trim() === "") return;
        if (value.trim().length === 0) {
          ctx.addIssue({ code: "custom", message: fieldSelectMessage(label) });
        }
      });
    }

    case "multi_select": {
      const settings = getMultiSelectSettings(field);
      const minPick = settings.minSelections ?? (field.required ? 1 : 0);

      return z.array(z.string()).superRefine((value, ctx) => {
        if (!field.required && value.length === 0) return;

        if (value.length === 0) {
          ctx.addIssue({ code: "custom", message: fieldMultiSelectMessage(label) });
          return;
        }

        if (minPick > 0 && value.length < minPick) {
          ctx.addIssue({
            code: "custom",
            message: fieldMultiSelectMinMessage(label, minPick),
          });
        }

        if (settings.maxSelections != null && value.length > settings.maxSelections) {
          ctx.addIssue({
            code: "custom",
            message: fieldMultiSelectMaxMessage(label, settings.maxSelections),
          });
        }

        if (field.noDuplicates) {
          const unique = new Set(value);
          if (unique.size !== value.length) {
            ctx.addIssue({
              code: "custom",
              message: `Duplicate selections are not allowed for ${label}`,
            });
          }
        }
      });
    }

    case "checkbox": {
      if (field.required) {
        return z.literal(true, { message: fieldCheckboxMessage(label) });
      }
      return z.boolean().optional();
    }

    case "rating": {
      const rule = z.coerce
        .number({ error: fieldRatingMessage(label) })
        .min(1, { message: fieldRatingMessage(label) })
        .max(5, { message: fieldRatingMessage(label) });
      return field.required ? rule : rule.optional();
    }

    case "date": {
      return z.string().superRefine((value, ctx) => {
        if (!field.required && value.trim() === "") return;
        if (value.trim().length === 0) {
          ctx.addIssue({ code: "custom", message: fieldDateMessage(label) });
        }
      });
    }

    default:
      return z.unknown();
  }
}
