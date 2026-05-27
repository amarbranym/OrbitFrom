import {
  BarChart3,
  FileEdit,
  Palette,
  Share2,
  type LucideIcon,
} from "lucide-react";

import { cn } from "~/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  FileEdit,
  Palette,
  Share2,
  BarChart3,
};

type ProcessStep = {
  step: string;
  title: string;
  description: string;
  icon: string;
};

export default function WorkProcessCard({ item }: { item: ProcessStep }) {
  const Icon = iconMap[item.icon] ?? FileEdit;

  return (
    <article
      className={cn(
        "group relative rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-6",
        "backdrop-blur-sm transition-colors ",
      )}
    >
      <div className="mb-5 flex items-center justify-between">
        <span className="font-mono text-xs font-semibold tracking-widest text-primary-foreground/70 uppercase">
          {item.step}
        </span>
        <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary-foreground/15 text-primary-foreground transition-colors ">
          <Icon className="size-4" strokeWidth={1.75} />
        </span>
      </div>

      <h3 className="text-lg font-semibold text-primary-foreground">{item.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-primary-foreground/70">
        {item.description}
      </p>
    </article>
  );
}
