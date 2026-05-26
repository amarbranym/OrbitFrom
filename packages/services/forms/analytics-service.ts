import type { FieldSchema } from "@repo/form-schema";
import { and, db, eq, gte, sql } from "@repo/database";
import { formSubmissionsTable } from "@repo/database/schema";

import { FormService } from "./form-service";

export type FieldBreakdown = {
  fieldId: string;
  label: string;
  type: string;
  counts: Record<string, number>;
};

export type FormAnalytics = {
  totalResponses: number;
  responsesLast7Days: number;
  responsesLast30Days: number;
  dailyCounts: { date: string; count: number }[];
  fieldBreakdowns: FieldBreakdown[];
};

export class AnalyticsService {
  constructor(private readonly formService = new FormService()) {}

  async getForForm(userId: string, formId: string): Promise<FormAnalytics> {
    const document = await this.formService.getByIdForUser(userId, formId);
    const totalResponses = document
      ? (await this.formService.getResponseCount(formId))
      : 0;

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000);

    const [last7] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(formSubmissionsTable)
      .where(
        and(
          eq(formSubmissionsTable.formId, formId),
          gte(formSubmissionsTable.submittedAt, sevenDaysAgo),
        ),
      );

    const [last30] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(formSubmissionsTable)
      .where(
        and(
          eq(formSubmissionsTable.formId, formId),
          gte(formSubmissionsTable.submittedAt, thirtyDaysAgo),
        ),
      );

    const dailyRows = await db
      .select({
        date: sql<string>`to_char(${formSubmissionsTable.submittedAt}, 'YYYY-MM-DD')`,
        count: sql<number>`count(*)::int`,
      })
      .from(formSubmissionsTable)
      .where(
        and(
          eq(formSubmissionsTable.formId, formId),
          gte(formSubmissionsTable.submittedAt, thirtyDaysAgo),
        ),
      )
      .groupBy(sql`to_char(${formSubmissionsTable.submittedAt}, 'YYYY-MM-DD')`)
      .orderBy(sql`to_char(${formSubmissionsTable.submittedAt}, 'YYYY-MM-DD')`);

    const submissions = await db
      .select({ answers: formSubmissionsTable.answers })
      .from(formSubmissionsTable)
      .where(eq(formSubmissionsTable.formId, formId))
      .limit(5000);

    const fieldBreakdowns = this.buildFieldBreakdowns(document.fields, submissions);

    return {
      totalResponses,
      responsesLast7Days: last7?.count ?? 0,
      responsesLast30Days: last30?.count ?? 0,
      dailyCounts: dailyRows.map((r) => ({ date: r.date, count: r.count })),
      fieldBreakdowns,
    };
  }

  private buildFieldBreakdowns(
    fields: FieldSchema[],
    submissions: { answers: Record<string, unknown> }[],
  ): FieldBreakdown[] {
    const aggregatable = new Set([
      "single_select",
      "multi_select",
      "checkbox",
      "rating",
    ]);

    return fields
      .filter((f) => aggregatable.has(f.type))
      .map((field) => {
        const counts: Record<string, number> = {};

        for (const sub of submissions) {
          const raw = sub.answers[field.id];
          if (raw === undefined || raw === null) continue;

          if (Array.isArray(raw)) {
            for (const item of raw) {
              const key = String(item);
              counts[key] = (counts[key] ?? 0) + 1;
            }
          } else if (field.type === "checkbox") {
            const key = raw ? "Yes" : "No";
            counts[key] = (counts[key] ?? 0) + 1;
          } else {
            const key = String(raw);
            counts[key] = (counts[key] ?? 0) + 1;
          }
        }

        return {
          fieldId: field.id,
          label: field.label,
          type: field.type,
          counts,
        };
      });
  }
}
