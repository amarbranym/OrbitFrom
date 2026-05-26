import "dotenv/config";

import { createFieldId } from "@repo/form-schema";
import { db, eq } from "@repo/database";
import {
  formSubmissionsTable,
  formsTable,
  usersTable,
} from "@repo/database/schema";

const DEMO_USER_ID = "00000000-0000-4000-8000-000000000099";
const DEMO_EMAIL = "demo@orbitform.app";

const FORM_IDS = {
  anime: "00000000-0000-4000-8000-000000000001",
  startup: "00000000-0000-4000-8000-000000000002",
  game: "00000000-0000-4000-8000-000000000003",
  os: "00000000-0000-4000-8000-000000000004",
} as const;

async function seed() {
  console.log("Seeding OrbitForm demo data…");

  const existingForm = await db
    .select()
    .from(formsTable)
    .where(eq(formsTable.slug, "anime-fan-survey"))
    .limit(1);

  if (existingForm.length > 0) {
    console.log("Demo data already present — skipping seed.");
    return;
  }

  const existingUser = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, DEMO_EMAIL))
    .limit(1);

  if (existingUser.length === 0) {
    await db.insert(usersTable).values({
      id: DEMO_USER_ID,
      fullName: "Demo Creator",
      email: DEMO_EMAIL,
      emailVerified: true,
    });
    console.log(`Created demo user: ${DEMO_EMAIL}`);
  }

  const userId = existingUser[0]?.id ?? DEMO_USER_ID;

  const animeNameId = createFieldId();
  const animeEmailId = createFieldId();
  const animeGenreId = createFieldId();
  const animeRatingId = createFieldId();
  const animeWhyId = createFieldId();

  const forms = [
    {
      id: FORM_IDS.anime,
      userId,
      slug: "anime-fan-survey",
      title: "Anime Fan Survey",
      description: "Tell us about your favorite series and conventions.",
      status: "published",
      visibility: "public",
      presentationMode: "classic",
      theme: { preset: "anime-neon", primaryColor: "#7c3aed" },
      settings: {
        thankYouMessage: "Arigato! Your otaku data helps us plan events.",
        notifyCreator: true,
      },
      fields: [
        {
          id: animeNameId,
          ref: "your-name",
          type: "text",
          label: "Your name",
          colSpan: 6,
          required: true,
          visibility: "show",
        },
        {
          id: animeEmailId,
          ref: "email",
          type: "email",
          label: "Email",
          colSpan: 6,
          required: true,
          visibility: "show",
        },
        {
          id: animeGenreId,
          ref: "favorite-genre",
          type: "single_select",
          label: "Favorite genre",
          colSpan: 12,
          required: true,
          visibility: "show",
          options: [
            { id: createFieldId(), label: "Shonen" },
            { id: createFieldId(), label: "Seinen" },
            { id: createFieldId(), label: "Slice of life" },
          ],
        },
        {
          id: animeRatingId,
          ref: "rating",
          type: "rating",
          label: "Rate your latest watch",
          colSpan: 12,
          required: true,
          visibility: "show",
        },
        {
          id: animeWhyId,
          ref: "why-recommend",
          type: "long_text",
          label: "Why do you recommend it?",
          colSpan: 12,
          required: false,
          visibility: "show",
        },
      ],
      responseCount: 12,
    },
    {
      id: FORM_IDS.startup,
      userId,
      slug: "startup-waitlist",
      title: "Startup Waitlist",
      description: "Join the beta for our AI form analytics platform.",
      status: "published",
      visibility: "public",
      presentationMode: "classic",
      theme: { preset: "startup-minimal", primaryColor: "#0f766e" },
      settings: {
        thankYouMessage: "You're on the list — we'll email you when invites open.",
      },
      fields: [
        {
          id: createFieldId(),
          ref: "company",
          type: "text",
          label: "Company name",
          colSpan: 12,
          required: true,
          visibility: "show",
        },
        {
          id: createFieldId(),
          ref: "work-email",
          type: "email",
          label: "Work email",
          colSpan: 6,
          required: true,
          visibility: "show",
        },
        {
          id: createFieldId(),
          ref: "team-size",
          type: "number",
          label: "Team size",
          colSpan: 6,
          required: false,
          visibility: "show",
        },
      ],
      responseCount: 10,
    },
    {
      id: FORM_IDS.game,
      userId,
      slug: "game-night-rsvp",
      title: "Game Night RSVP",
      description: "Unlisted link for our community game night.",
      status: "published",
      visibility: "unlisted",
      presentationMode: "classic",
      theme: { preset: "retro-game", primaryColor: "#dc2626" },
      settings: { thankYouMessage: "See you at game night!" },
      fields: [
        {
          id: createFieldId(),
          ref: "gamertag",
          type: "text",
          label: "Gamertag",
          colSpan: 12,
          required: true,
          visibility: "show",
        },
        {
          id: createFieldId(),
          ref: "platform",
          type: "single_select",
          label: "Platform",
          colSpan: 12,
          required: true,
          visibility: "show",
          options: [
            { id: createFieldId(), label: "PC" },
            { id: createFieldId(), label: "Console" },
            { id: createFieldId(), label: "Mobile" },
          ],
        },
      ],
      responseCount: 8,
    }
  ];

  for (const form of forms) {
    await db
      .insert(formsTable)
      .values({
        id: form.id,
        userId: form.userId,
        slug: form.slug,
        title: form.title,
        description: form.description,
        status: form.status,
        visibility: form.visibility,
        presentationMode: form.presentationMode,
        theme: form.theme,
        settings: form.settings,
        fields: form.fields,
        responseCount: form.responseCount,
      })
      .onConflictDoNothing();

    const firstFieldId = (form.fields[0] as { id: string }).id;

    for (let i = 0; i < form.responseCount; i++) {
      const daysAgo = Math.floor(Math.random() * 14);
      const submittedAt = new Date(Date.now() - daysAgo * 86400000);

      await db.insert(formSubmissionsTable).values({
        id: createFieldId(),
        formId: form.id,
        answers: {
          [firstFieldId]: `Respondent ${i + 1}`,
        },
        submittedAt,
      });
    }

    console.log(`Seeded form: ${form.slug} (${form.responseCount} responses)`);
  }

  console.log("Seed complete.");
  console.log(`Demo login: ${DEMO_EMAIL} with OTP from DEMO_OTP_CODE (default 000000 in README)`);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
