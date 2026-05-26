export function fieldRequiredMessage(label: string) {
  return `${label} is required.`;
}

export function fieldMinLengthMessage(label: string, min: number) {
  if (min <= 1) return fieldRequiredMessage(label);
  return `${label} must be at least ${min} characters.`;
}

export function fieldMaxLengthMessage(label: string, max: number) {
  return `${label} must be at most ${max} characters.`;
}

export function fieldEmailMessage(label: string) {
  return `Enter a valid email address for ${label}.`;
}

export function fieldNumberMessage(label: string) {
  return `Enter a valid number for ${label}.`;
}

export function fieldSelectMessage(label: string) {
  return `Select an option for ${label}.`;
}

export function fieldMultiSelectMessage(label: string) {
  return `Select at least one option for ${label}.`;
}

export function fieldMultiSelectMinMessage(label: string, min: number) {
  return `Select at least ${min} option${min === 1 ? "" : "s"} for ${label}.`;
}

export function fieldMultiSelectMaxMessage(label: string, max: number) {
  return `Select at most ${max} option${max === 1 ? "" : "s"} for ${label}.`;
}

export function fieldDateMessage(label: string) {
  return `Select a date for ${label}.`;
}

export function fieldCheckboxMessage(label: string) {
  return `${label} must be checked.`;
}

export function fieldRatingMessage(label: string) {
  return `Select a rating for ${label}.`;
}
