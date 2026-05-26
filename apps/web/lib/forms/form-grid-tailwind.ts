/**
 * Tailwind v4 only emits utilities found in scanned source files.
 * Classes referenced from @repo/form-schema are not scanned — keep literals here.
 */
export const formGridTailwindSafelist = [
  "grid",
  "grid-cols-12",
  "col-span-1",
  "col-span-2",
  "col-span-3",
  "col-span-4",
  "col-span-5",
  "col-span-6",
  "col-span-7",
  "col-span-8",
  "col-span-9",
  "col-span-10",
  "col-span-11",
  "col-span-12",
] as const;
