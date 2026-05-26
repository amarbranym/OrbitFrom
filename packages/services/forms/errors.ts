export type FormErrorCode =
  | "NOT_FOUND"
  | "FORBIDDEN"
  | "SLUG_TAKEN"
  | "INVALID_DOCUMENT"
  | "NOT_PUBLISHED"
  | "SUBMIT_FORBIDDEN"
  | "VALIDATION_FAILED"
  | "HONEYPOT"
  | "RATE_LIMITED";

export class FormError extends Error {
  constructor(
    public readonly code: FormErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "FormError";
  }
}
