import {
  createFieldId,
  createFieldRef,
  type FormDocument,
  type FormSubmission,
} from "@repo/form-schema";

import { saveDocument, appendSubmission } from "../storage";

function field(
  type: FormDocument["fields"][0]["type"],
  label: string,
  overrides?: Partial<FormDocument["fields"][0]>,
): FormDocument["fields"][0] {
  return {
    id: createFieldId(),
    ref: createFieldRef(label),
    type,
    label,
    colSpan: 12,
    required: false,
    visibility: "show",
    ...overrides,
  };
}

export const demoForms: FormDocument[] = [
  {
    id: "00000000-0000-4000-8000-000000000001",
    slug: "anime-fan-survey",
    title: "Anime Fan Survey",
    description: "Tell us about your favorite series and conventions.",
    status: "published",
    visibility: "public",
    presentationMode: "classic",
    theme: { preset: "anime-neon", primaryColor: "#7c3aed" },
    fields: [
      field("text", "Your name", { required: true, colSpan: 6 }),
      field("email", "Email", { required: true, colSpan: 6 }),
      field("single_select", "Favorite genre", {
        required: true,
        options: [
          { id: createFieldId(), label: "Shonen" },
          { id: createFieldId(), label: "Seinen" },
          { id: createFieldId(), label: "Slice of life" },
        ],
      }),
      field("rating", "Rate your latest watch", { required: true }),
      field("long_text", "Why do you recommend it?"),
    ],
    settings: { thankYouMessage: "Arigato! Your otaku data helps us plan events." },
    updatedAt: new Date().toISOString(),
  },
  {
    id: "00000000-0000-4000-8000-000000000002",
    slug: "startup-waitlist",
    title: "Startup Waitlist",
    description: "Join the beta for our AI form analytics platform.",
    status: "published",
    visibility: "public",
    presentationMode: "classic",
    theme: { preset: "startup-minimal", primaryColor: "#0f766e" },
    fields: [
      field("text", "Company name", { required: true }),
      field("email", "Work email", { required: true, colSpan: 6 }),
      field("number", "Team size", { colSpan: 6 }),
      field("multi_select", "Interests", {
        options: [
          { id: createFieldId(), label: "Analytics" },
          { id: createFieldId(), label: "Integrations" },
          { id: createFieldId(), label: "White-label" },
        ],
      }),
    ],
    settings: { thankYouMessage: "You're on the list — we'll email you when invites open." },
    updatedAt: new Date().toISOString(),
  },
  {
    id: "00000000-0000-4000-8000-000000000003",
    slug: "game-night-rsvp",
    title: "Game Night RSVP",
    description: "Unlisted link for our community game night.",
    status: "published",
    visibility: "unlisted",
    presentationMode: "classic",
    theme: { preset: "retro-game", primaryColor: "#dc2626" },
    fields: [
      field("text", "Gamertag", { required: true }),
      field("single_select", "Platform", {
        required: true,
        options: [
          { id: createFieldId(), label: "PC" },
          { id: createFieldId(), label: "Console" },
          { id: createFieldId(), label: "Mobile" },
        ],
      }),
      field("date", "Preferred date", { required: true, colSpan: 6 }),
      field("checkbox", "Agree to code of conduct", {
        required: true,
        placeholder: "I will be respectful to all players",
      }),
    ],
    settings: { thankYouMessage: "See you at game night!" },
    updatedAt: new Date().toISOString(),
  },
];

function mockSubmission(formId: string, answers: Record<string, string>): FormSubmission {
  return {
    id: createFieldId(),
    formId,
    submittedAt: new Date(Date.now() - Math.random() * 7 * 86400000).toISOString(),
    answers,
  };
}

export function seedDemoDataIfEmpty() {
  if (typeof window === "undefined") return;

  const flag = localStorage.getItem("orbitform:v1:seeded");
  if (flag === "true") return;

  for (const doc of demoForms) {
    saveDocument(doc);
    const firstField = doc.fields[0];
    if (firstField) {
      for (let i = 0; i < 8; i++) {
        appendSubmission(
          doc.id,
          mockSubmission(doc.id, {
            [firstField.id]: `Respondent ${i + 1}`,
          }),
        );
      }
    }
  }

  localStorage.setItem("orbitform:v1:seeded", "true");
}
