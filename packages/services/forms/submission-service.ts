import {
  buildZodSchema,
  canAccessForm,
  createFieldId,
  type FormSubmission,
} from "@repo/form-schema";
import { and, db, desc, eq, lt } from "@repo/database";
import { formSubmissionsTable, formsTable } from "@repo/database/schema";

import { hashToken } from "../auth/crypto";
import { FormError } from "./errors";
import { FormService } from "./form-service";
import { rowToFormDocument } from "./mapper";

const SUBMIT_WINDOW_MS = 60_000;
const SUBMIT_MAX_PER_WINDOW = 5;
const submitHits = new Map<string, { count: number; resetAt: number }>();

function checkSubmitRate(ip: string | undefined, slug: string) {
  const key = `${ip ?? "anonymous"}:${slug}`;
  const now = Date.now();
  const entry = submitHits.get(key);

  if (!entry || now > entry.resetAt) {
    submitHits.set(key, { count: 1, resetAt: now + SUBMIT_WINDOW_MS });
    return;
  }

  if (entry.count >= SUBMIT_MAX_PER_WINDOW) {
    throw new FormError("RATE_LIMITED", "Too many submissions. Please try again later.");
  }

  entry.count += 1;
}

export type SubmitMeta = {
  ip?: string;
  userAgent?: string;
  honeypot?: string;
};

export class SubmissionService {
  constructor(private readonly formService = new FormService()) {}

  async submitBySlug(
    slug: string,
    answers: Record<string, unknown>,
    meta: SubmitMeta = {},
  ): Promise<FormSubmission> {
    if (meta.honeypot && String(meta.honeypot).trim().length > 0) {
      throw new FormError("HONEYPOT", "Submission rejected");
    }

    checkSubmitRate(meta.ip, slug);

    const rows = await db
      .select()
      .from(formsTable)
      .where(eq(formsTable.slug, slug))
      .limit(1);

    const row = rows[0];
    if (!row || row.status !== "published" || row.archivedAt) {
      throw new FormError("NOT_FOUND", "Form not found");
    }

    const document = rowToFormDocument(row);
    const access = canAccessForm(document, {
      submissionCount: row.responseCount,
    });

    if (!access.canSubmit) {
      const message =
        access.reason === "closed"
          ? "This form is no longer accepting responses"
          : access.reason === "response_limit_reached"
            ? "This form has reached its response limit"
            : "This form is not accepting responses";
      throw new FormError("SUBMIT_FORBIDDEN", message);
    }

    const schema = buildZodSchema(document.fields);
    const parsed = schema.safeParse(answers);
    if (!parsed.success) {
      throw new FormError(
        "VALIDATION_FAILED",
        parsed.error.issues.map((i) => i.message).join("; ") || "Invalid answers",
      );
    }

    const submissionId = createFieldId();
    const submittedAt = new Date();

    await db.insert(formSubmissionsTable).values({
      id: submissionId,
      formId: row.id,
      answers: parsed.data as Record<string, unknown>,
      submittedAt,
      ipHash: meta.ip ? hashToken(meta.ip) : null,
      userAgent: meta.userAgent ?? null,
    });

    await this.formService.incrementResponseCount(row.id);

    return {
      id: submissionId,
      formId: row.id,
      submittedAt: submittedAt.toISOString(),
      answers: parsed.data as Record<string, unknown>,
    };
  }

  async listForForm(
    userId: string,
    formId: string,
    options?: { cursor?: string; limit?: number },
  ): Promise<{ items: FormSubmission[]; nextCursor: string | null }> {
    await this.formService.getByIdForUser(userId, formId);

    const limit = Math.min(options?.limit ?? 50, 100);
    const conditions = [eq(formSubmissionsTable.formId, formId)];

    if (options?.cursor) {
      conditions.push(lt(formSubmissionsTable.submittedAt, new Date(options.cursor)));
    }

    const rows = await db
      .select()
      .from(formSubmissionsTable)
      .where(and(...conditions))
      .orderBy(desc(formSubmissionsTable.submittedAt))
      .limit(limit + 1);

    const hasMore = rows.length > limit;
    const page = hasMore ? rows.slice(0, limit) : rows;

    const items: FormSubmission[] = page.map((r) => ({
      id: r.id,
      formId: r.formId,
      submittedAt: r.submittedAt.toISOString(),
      answers: r.answers,
    }));

    const nextCursor = hasMore
      ? page[page.length - 1]?.submittedAt.toISOString() ?? null
      : null;

    return { items, nextCursor };
  }

  async exportCsv(userId: string, formId: string): Promise<string> {
    const document = await this.formService.getByIdForUser(userId, formId);
    const { items } = await this.listForForm(userId, formId, { limit: 10000 });

    const fieldHeaders = document.fields.map((f) => f.label);
    const header = ["submitted_at", ...fieldHeaders].join(",");

    const escape = (value: unknown) => {
      const str = value === null || value === undefined ? "" : String(value);
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const lines = items.map((submission) => {
      const cells = document.fields.map((field) => {
        const val = submission.answers[field.id];
        if (Array.isArray(val)) return escape(val.join("; "));
        return escape(val);
      });
      return [escape(submission.submittedAt), ...cells].join(",");
    });

    return [header, ...lines].join("\n");
  }
}
