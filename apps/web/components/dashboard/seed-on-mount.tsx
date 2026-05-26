"use client";

import { useEffect } from "react";

import { seedDemoDataIfEmpty } from "~/lib/forms/seed/demo-forms";

export function SeedOnMount() {
  useEffect(() => {
    seedDemoDataIfEmpty();
  }, []);

  return null;
}
