import type { FormDocument } from "@repo/form-schema";
import { db, eq } from "@repo/database";
import { usersTable } from "@repo/database/schema";

import { sendPlainEmail } from "./transport";

export class NotificationService {
  async notifyCreatorOfSubmission(params: {
    form: FormDocument;
    creatorUserId: string;
    submissionPreview: string;
  }): Promise<void> {
    const settings = params.form.settings as
      | { notifyCreator?: boolean; notifyCreatorEmail?: string }
      | undefined;

    if (settings?.notifyCreator === false) return;

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, params.creatorUserId))
      .limit(1);

    const to = settings?.notifyCreatorEmail ?? user?.email;
    if (!to) return;

    await sendPlainEmail({
      to,
      subject: `New response on "${params.form.title}"`,
      text: [
        `You received a new response on your form "${params.form.title}".`,
        "",
        `Preview: ${params.submissionPreview}`,
        "",
        "Open your OrbitForm dashboard to view all responses.",
      ].join("\n"),
      logTag: "forms:creator",
    });
  }

  async notifyRespondentConfirmation(params: {
    to: string;
    formTitle: string;
    thankYouMessage?: string;
  }): Promise<void> {
    await sendPlainEmail({
      to: params.to,
      subject: `Thanks for submitting "${params.formTitle}"`,
      text: [
        params.thankYouMessage ?? "Thank you for your submission.",
        "",
        `This confirms we received your response to "${params.formTitle}".`,
      ].join("\n"),
      logTag: "forms:respondent",
    });
  }
}
