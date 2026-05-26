import { z } from "zod";

import type { FieldSchema } from "./field-schema";
import { buildZodRuleForField } from "./build-zod-rules";

export function buildZodSchema(fields: FieldSchema[]) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of fields) {
    if (field.visibility === "hide") continue;
    shape[field.id] = buildZodRuleForField(field);
  }

  return z.object(shape);
}

export type DynamicFormValues = z.infer<ReturnType<typeof buildZodSchema>>;
