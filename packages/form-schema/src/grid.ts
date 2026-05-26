const COL_SPAN_CLASS: Record<number, string> = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  5: "col-span-5",
  6: "col-span-6",
  7: "col-span-7",
  8: "col-span-8",
  9: "col-span-9",
  10: "col-span-10",
  11: "col-span-11",
  12: "col-span-12",
};

export function clampColSpan(colSpan: number) {
  if (!Number.isFinite(colSpan)) return 12;
  return Math.min(12, Math.max(1, Math.round(colSpan)));
}

export function getColSpanClass(colSpan: number) {
  return COL_SPAN_CLASS[clampColSpan(colSpan)] ?? "col-span-12";
}

/** Reliable grid placement without depending on Tailwind scanning dynamic class strings. */
export function getColSpanStyle(colSpan: number): { gridColumn: string } {
  const span = clampColSpan(colSpan);
  return { gridColumn: `span ${span} / span ${span}` };
}
