import { z } from "zod";

export const formSubmissionSchema = z.object({
  id: z.string().uuid(),
  formId: z.string().uuid(),
  submittedAt: z.string().datetime(),
  answers: z.record(z.string(), z.unknown()),
});

export type FormSubmission = z.infer<typeof formSubmissionSchema>;

export const submitResponseInputSchema = z.object({
  formId: z.string().uuid(),
  answers: z.record(z.string(), z.unknown()),
});

export type SubmitResponseInput = z.infer<typeof submitResponseInputSchema>;
