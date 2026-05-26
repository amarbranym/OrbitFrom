import {
  canAccessForm,
  createFieldId,
  createFormPage,
  ensureFormPages,
  formDocumentSchema,
  isExploreVisible,
  slugifyTitle,
  type FormAccessResult,
  type FormDocument,
  type ExploreListItem,
  type FormListItem,
  type FormVisibility,
} from "@repo/form-schema";
import { and, db, desc, eq, isNull, ne, sql } from "@repo/database";
import { formsTable, usersTable, type SelectForm } from "@repo/database/schema";

import { FormError } from "./errors";
import { rowToFormDocument, rowToFormListItem } from "./mapper";

function defaultTheme() {
  return { preset: "default" };
}

function defaultSettings() {
  return {
    thankYouMessage: "Thanks for your response!",
    submitButtonLabel: "Submit",
    pages: [createFormPage("Page 1")],
  };
}

export class FormService {
  private async findById(id: string): Promise<SelectForm | null> {
    const rows = await db.select().from(formsTable).where(eq(formsTable.id, id)).limit(1);
    return rows[0] ?? null;
  }

  private async findBySlug(slug: string): Promise<SelectForm | null> {
    const rows = await db
      .select()
      .from(formsTable)
      .where(eq(formsTable.slug, slug))
      .limit(1);
    return rows[0] ?? null;
  }

  private assertOwner(row: SelectForm, userId: string) {
    if (row.userId !== userId) {
      throw new FormError("FORBIDDEN", "You do not have access to this form");
    }
  }

  async ensureUniqueSlug(baseSlug: string, excludeFormId?: string): Promise<string> {
    let candidate = baseSlug;
    let suffix = 1;

    while (true) {
      const existing = await this.findBySlug(candidate);
      if (!existing || existing.id === excludeFormId) return candidate;
      suffix += 1;
      candidate = `${baseSlug}-${suffix}`;
    }
  }

  async listForUser(
    userId: string,
    filters?: { visibility?: FormVisibility; includeArchived?: boolean },
  ): Promise<FormListItem[]> {
    const conditions = [eq(formsTable.userId, userId)];

    if (!filters?.includeArchived) {
      conditions.push(isNull(formsTable.archivedAt));
    }

    if (filters?.visibility) {
      conditions.push(eq(formsTable.visibility, filters.visibility));
    }

    const rows = await db
      .select()
      .from(formsTable)
      .where(and(...conditions))
      .orderBy(desc(formsTable.updatedAt));

    return rows.map(rowToFormListItem);
  }

  async getByIdForUser(userId: string, formId: string): Promise<FormDocument> {
    const row = await this.findById(formId);
    if (!row) throw new FormError("NOT_FOUND", "Form not found");
    this.assertOwner(row, userId);
    return rowToFormDocument(row);
  }

  async getPublishedBySlug(slug: string): Promise<FormDocument> {
    const row = await this.findBySlug(slug);
    if (!row || row.status !== "published" || row.archivedAt) {
      throw new FormError("NOT_FOUND", "Form not found");
    }
    return rowToFormDocument(row);
  }

  async getPublicFormView(slug: string): Promise<{
    document: FormDocument | null;
    access: FormAccessResult;
  }> {
    const row = await this.findBySlug(slug);
    if (!row || row.archivedAt) {
      return { document: null, access: canAccessForm(null) };
    }

    const document = rowToFormDocument(row);
    const access = canAccessForm(document, {
      submissionCount: row.responseCount,
    });

    if (!access.allowed) {
      return { document: null, access };
    }

    return { document, access };
  }

  async listExplore(): Promise<ExploreListItem[]> {
    const rows = await db
      .select({
        form: formsTable,
        creatorName: usersTable.fullName,
      })
      .from(formsTable)
      .innerJoin(usersTable, eq(formsTable.userId, usersTable.id))
      .where(
        and(
          eq(formsTable.status, "published"),
          eq(formsTable.visibility, "public"),
          isNull(formsTable.archivedAt),
        ),
      )
      .orderBy(desc(formsTable.updatedAt));

    return rows
      .filter((row) =>
        isExploreVisible(
          row.form.status as "published",
          row.form.visibility as "public",
        ),
      )
      .map((row) => ({
        ...rowToFormListItem(row.form),
        creatorName: row.creatorName,
      }));
  }

  async create(
    userId: string,
    input: {
      title: string;
      description?: string;
      fields?: FormDocument["fields"];
      theme?: FormDocument["theme"];
      visibility?: FormDocument["visibility"];
      slug?: string;
    },
  ): Promise<FormDocument> {
    const title = input.title.trim() || "Untitled form";
    const baseSlug = slugifyTitle(input.slug ?? title);
    const slug = await this.ensureUniqueSlug(baseSlug);

    const draft: FormDocument = formDocumentSchema.parse({
      id: createFieldId(),
      slug,
      title,
      description: input.description,
      status: "draft",
      visibility: input.visibility ?? "unlisted",
      presentationMode: "classic",
      theme: input.theme ?? defaultTheme(),
      fields: input.fields ?? [],
      settings: defaultSettings(),
      updatedAt: new Date().toISOString(),
    });

    const [row] = await db
      .insert(formsTable)
      .values({
        id: draft.id,
        userId,
        slug: draft.slug,
        title: draft.title,
        description: draft.description ?? null,
        status: draft.status,
        visibility: draft.visibility,
        presentationMode: draft.presentationMode,
        theme: draft.theme,
        settings: draft.settings ?? null,
        fields: draft.fields,
        logic: draft.logic ?? null,
      })
      .returning();

    if (!row) throw new FormError("INVALID_DOCUMENT", "Failed to create form");
    return rowToFormDocument(row);
  }

  async update(userId: string, formId: string, patch: Partial<FormDocument>): Promise<FormDocument> {
    const row = await this.findById(formId);
    if (!row) throw new FormError("NOT_FOUND", "Form not found");
    this.assertOwner(row, userId);

    const current = rowToFormDocument(row);
    let nextSlug = patch.slug ?? current.slug;

    if (patch.slug && patch.slug !== current.slug) {
      nextSlug = await this.ensureUniqueSlug(slugifyTitle(patch.slug), formId);
    } else if (patch.title && !patch.slug && current.status !== "published") {
      nextSlug = await this.ensureUniqueSlug(slugifyTitle(patch.title), formId);
    }

    const merged = formDocumentSchema.parse(
      ensureFormPages({
        ...current,
        ...patch,
        id: current.id,
        slug: nextSlug,
        updatedAt: new Date().toISOString(),
      }),
    );

    const [updated] = await db
      .update(formsTable)
      .set({
        slug: merged.slug,
        title: merged.title,
        description: merged.description ?? null,
        status: merged.status,
        visibility: merged.visibility,
        presentationMode: merged.presentationMode,
        theme: merged.theme,
        settings: merged.settings ?? null,
        fields: merged.fields,
        logic: merged.logic ?? null,
        updatedAt: new Date(),
      })
      .where(eq(formsTable.id, formId))
      .returning();

    if (!updated) throw new FormError("NOT_FOUND", "Form not found");
    return rowToFormDocument(updated);
  }

  async publish(userId: string, formId: string): Promise<FormDocument> {
    const row = await this.findById(formId);
    if (!row) throw new FormError("NOT_FOUND", "Form not found");
    this.assertOwner(row, userId);

    const slug = await this.ensureUniqueSlug(row.slug, formId);

    const [updated] = await db
      .update(formsTable)
      .set({ status: "published", slug, updatedAt: new Date() })
      .where(eq(formsTable.id, formId))
      .returning();

    if (!updated) throw new FormError("NOT_FOUND", "Form not found");
    return rowToFormDocument(updated);
  }

  async unpublish(userId: string, formId: string): Promise<FormDocument> {
    const row = await this.findById(formId);
    if (!row) throw new FormError("NOT_FOUND", "Form not found");
    this.assertOwner(row, userId);

    const [updated] = await db
      .update(formsTable)
      .set({ status: "unpublished", updatedAt: new Date() })
      .where(eq(formsTable.id, formId))
      .returning();

    if (!updated) throw new FormError("NOT_FOUND", "Form not found");
    return rowToFormDocument(updated);
  }

  async delete(userId: string, formId: string): Promise<void> {
    const row = await this.findById(formId);
    if (!row) throw new FormError("NOT_FOUND", "Form not found");
    this.assertOwner(row, userId);
    await db.delete(formsTable).where(eq(formsTable.id, formId));
  }

  async archive(userId: string, formId: string): Promise<FormDocument> {
    const row = await this.findById(formId);
    if (!row) throw new FormError("NOT_FOUND", "Form not found");
    this.assertOwner(row, userId);

    const [updated] = await db
      .update(formsTable)
      .set({ archivedAt: new Date(), status: "unpublished", updatedAt: new Date() })
      .where(eq(formsTable.id, formId))
      .returning();

    if (!updated) throw new FormError("NOT_FOUND", "Form not found");
    return rowToFormDocument(updated);
  }

  async duplicate(userId: string, formId: string): Promise<FormDocument> {
    const source = await this.getByIdForUser(userId, formId);
    const slug = await this.ensureUniqueSlug(`${source.slug}-copy`);

    return this.create(userId, {
      title: `${source.title} (copy)`,
      description: source.description,
      fields: source.fields,
      theme: source.theme,
      visibility: source.visibility,
      slug,
    });
  }

  async getResponseCount(formId: string): Promise<number> {
    const row = await this.findById(formId);
    return row?.responseCount ?? 0;
  }

  async incrementResponseCount(formId: string): Promise<void> {
    await db
      .update(formsTable)
      .set({
        responseCount: sql`${formsTable.responseCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(formsTable.id, formId));
  }

  async getNotificationContext(slug: string) {
    const row = await this.findBySlug(slug);
    if (!row) return null;
    return {
      userId: row.userId,
      document: rowToFormDocument(row),
    };
  }

  async slugAvailable(slug: string, excludeFormId?: string): Promise<boolean> {
    const conditions = [eq(formsTable.slug, slug)];
    if (excludeFormId) {
      conditions.push(ne(formsTable.id, excludeFormId));
    }
    const rows = await db
      .select({ id: formsTable.id })
      .from(formsTable)
      .where(and(...conditions))
      .limit(1);
    return rows.length === 0;
  }
}
