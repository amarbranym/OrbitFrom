"use client";

import type { FieldSchema } from "@repo/form-schema";
import type { ComponentType } from "react";

import { PropertyCharLimit } from "~/components/builder/properties/controls/property-char-limit";
import { PropertyColumnPicker } from "~/components/builder/properties/controls/property-column-picker";
import { PropertyInitialValue } from "~/components/builder/properties/controls/property-initial-value";
import { PropertyInstructions } from "~/components/builder/properties/controls/property-instructions";
import { PropertyLabel } from "~/components/builder/properties/controls/property-label";
import { PropertyMultiSelectSettings } from "~/components/builder/properties/controls/property-multi-select-settings";
import { PropertyChoicePresentation } from "~/components/builder/properties/controls/property-choice-presentation";
import { PropertyOptions } from "~/components/builder/properties/controls/property-options";
import { PropertyPlaceholder } from "~/components/builder/properties/controls/property-placeholder";
import { PropertyRequired } from "~/components/builder/properties/controls/property-required";
import { PropertyVisibility } from "~/components/builder/properties/controls/property-visibility";
import type { PropertyKey } from "~/lib/forms/registry/types";

export type PropertyControlProps = {
  field: FieldSchema;
  onChange: (patch: Partial<FieldSchema>) => void;
  propertyKey: PropertyKey;
};

const propertyControls: Partial<
  Record<PropertyKey, ComponentType<PropertyControlProps>>
> = {
  label: PropertyLabel,
  hideLabel: PropertyLabel,
  instructions: PropertyInstructions,
  colSpan: PropertyColumnPicker,
  placeholder: PropertyPlaceholder,
  hoverText: PropertyPlaceholder,
  initialValue: PropertyInitialValue,
  charLimit: PropertyCharLimit,
  required: PropertyRequired,
  noDuplicates: PropertyRequired,
  visibility: PropertyVisibility,
  options: PropertyOptions,
  choicePresentation: PropertyChoicePresentation,
  multiSelectSettings: PropertyMultiSelectSettings,
};

export function RenderPropertyControl(props: PropertyControlProps) {
  const Control = propertyControls[props.propertyKey];
  if (!Control) return null;
  return <Control {...props} />;
}
