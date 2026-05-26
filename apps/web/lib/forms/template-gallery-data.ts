import type { Icon } from "@tabler/icons-react";
import {
  IconBriefcase,
  IconCategory,
  IconClipboardList,
  IconForms,
  IconMagnet,
  IconMail,
  IconMessageCircle,
  IconShoppingCart,
  IconUserPlus,
} from "@tabler/icons-react";

export type TemplateCategoryId =
  | "all"
  | "business"
  | "lead-generation"
  | "e-commerce"
  | "feedback"
  | "contact"
  | "registration";

export type TemplatePreviewVariant =
  | "primary"
  | "accent"
  | "chart-1"
  | "chart-2"
  | "chart-3"
  | "muted";

export type FormTemplate = {
  id: string;
  name: string;
  category: Exclude<TemplateCategoryId, "all">;
  description: string;
  previewVariant: TemplatePreviewVariant;
  darkPreview?: boolean;
};

export type TemplateCategory = {
  id: TemplateCategoryId;
  label: string;
  icon: Icon;
};

export const templateCategories: TemplateCategory[] = [
  { id: "all", label: "All", icon: IconCategory },
  { id: "business", label: "Business", icon: IconBriefcase },
  { id: "lead-generation", label: "Lead generation", icon: IconMagnet },
  { id: "e-commerce", label: "E-commerce", icon: IconShoppingCart },
  { id: "feedback", label: "Feedback", icon: IconMessageCircle },
  { id: "contact", label: "Contact us", icon: IconMail },
  { id: "registration", label: "Registration", icon: IconUserPlus },
];

export const formTemplates: FormTemplate[] = [
  {
    id: "contact-us",
    name: "Contact Us",
    category: "contact",
    description: "Collect name, email and message from visitors.",
    previewVariant: "chart-3",
    darkPreview: true,
  },
  {
    id: "client-details",
    name: "Client Details",
    category: "business",
    description: "Capture client profile and company information.",
    previewVariant: "chart-2",
  },
  {
    id: "email-subscription",
    name: "Email Subscription",
    category: "lead-generation",
    description: "Grow your mailing list with a simple signup form.",
    previewVariant: "chart-1",
    darkPreview: true,
  },
  {
    id: "software-evaluation",
    name: "Software Evaluation",
    category: "business",
    description: "Gather product feedback from trial users.",
    previewVariant: "primary",
  },
  {
    id: "complaints",
    name: "Complaints",
    category: "feedback",
    description: "Help customers report issues and suggestions.",
    previewVariant: "accent",
  },
  {
    id: "bug-tracker",
    name: "Bug Tracker",
    category: "feedback",
    description: "Structured bug reports with severity and steps.",
    previewVariant: "chart-3",
  },
  {
    id: "order-form",
    name: "Order Form",
    category: "e-commerce",
    description: "Take product orders with quantity and notes.",
    previewVariant: "primary",
  },
  {
    id: "event-rsvp",
    name: "Event RSVP",
    category: "registration",
    description: "Confirm attendance and dietary preferences.",
    previewVariant: "chart-2",
  },
  {
    id: "lead-capture",
    name: "Lead Capture",
    category: "lead-generation",
    description: "Qualify leads with role and company size.",
    previewVariant: "chart-1",
  },
  {
    id: "support-request",
    name: "Support Request",
    category: "business",
    description: "Route support tickets with priority levels.",
    previewVariant: "muted",
  },
  {
    id: "membership-signup",
    name: "Membership Signup",
    category: "registration",
    description: "Onboard new members with plan selection.",
    previewVariant: "accent",
  },
  {
    id: "product-feedback",
    name: "Product Feedback",
    category: "feedback",
    description: "Short NPS-style satisfaction survey.",
    previewVariant: "primary",
  },
];

export const templateCategoryLabels: Record<Exclude<TemplateCategoryId, "all">, string> = {
  business: "Business",
  "lead-generation": "Lead generation",
  "e-commerce": "E-commerce",
  feedback: "Feedback",
  contact: "Contact us",
  registration: "Registration",
};

export function filterTemplates(
  templates: FormTemplate[],
  category: TemplateCategoryId,
  query: string,
) {
  const normalizedQuery = query.trim().toLowerCase();

  return templates.filter((template) => {
    const matchesCategory = category === "all" || template.category === category;
    const matchesQuery =
      !normalizedQuery ||
      template.name.toLowerCase().includes(normalizedQuery) ||
      template.description.toLowerCase().includes(normalizedQuery) ||
      templateCategoryLabels[template.category].toLowerCase().includes(normalizedQuery);

    return matchesCategory && matchesQuery;
  });
}

export function groupTemplatesByCategory(templates: FormTemplate[]) {
  const groups = new Map<string, FormTemplate[]>();

  for (const template of templates) {
    const label = templateCategoryLabels[template.category];
    groups.set(label, [...(groups.get(label) ?? []), template]);
  }

  return Array.from(groups.entries());
}
