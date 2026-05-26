import type { Icon } from "@tabler/icons-react";
import {
  Icon123,
  IconAlignLeft,
  IconAt,
  IconCalendar,
  IconCheckbox,
  IconChevronDown,
  IconCircleDot,
  IconForms,
  IconHash,
  IconListCheck,
  IconMail,
  IconMapPin,
  IconPhone,
  IconStar,
  IconTypography,
  IconWorld,
} from "@tabler/icons-react";

export type BuilderFieldItem = {
  id: string;
  label: string;
  icon: Icon;
};

export type BuilderFieldCategory = {
  id: string;
  label: string;
  items: BuilderFieldItem[];
};

export const builderFieldCategories: BuilderFieldCategory[] = [
  {
    id: "basic-info",
    label: "Basic Info",
    items: [
      { id: "name", label: "Name", icon: IconForms },
      { id: "address", label: "Address", icon: IconMapPin },
      { id: "phone", label: "Phone", icon: IconPhone },
      { id: "email", label: "Email", icon: IconMail },
      { id: "website", label: "Website", icon: IconWorld },
    ],
  },
  {
    id: "textbox",
    label: "Textbox",
    items: [
      { id: "single-line", label: "Single Line", icon: IconTypography },
      { id: "multi-line", label: "Multi Line", icon: IconAlignLeft },
    ],
  },
  {
    id: "number",
    label: "Number",
    items: [
      { id: "number", label: "Number", icon: Icon123 },
    ],
  },
  {
    id: "choices",
    label: "Choices",
    items: [
      { id: "dropdown", label: "Dropdown", icon: IconChevronDown },
      { id: "checkbox", label: "Checkbox", icon: IconCheckbox },
      { id: "multi-select", label: "Multi Select", icon: IconListCheck },
      { id: "rating", label: "Rating", icon: IconStar },
      { id: "date", label: "Date", icon: IconCalendar },
    ],
  },
];
