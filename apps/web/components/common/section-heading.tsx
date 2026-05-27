import type { ElementType, ReactNode } from "react";

import { cn } from "~/lib/utils";

type SectionHeadingAlign = "center" | "left" | "right";
type SectionHeadingBackground = "primary" | "default";

type SectionHeadingProps = {
  as?: ElementType;
  id?: string;
  title: string;
  description?: ReactNode;
  eyebrow?: ReactNode;
  align?: SectionHeadingAlign;
  background?: SectionHeadingBackground;
  className?: string;
};

const alignClasses: Record<
  SectionHeadingAlign,
  { container: string; text: string; description: string }
> = {
  center: {
    container: "mx-auto max-w-4xl",
    text: "text-center",
    description: "mx-auto",
  },
  left: {
    container: "max-w-2xl",
    text: "text-left",
    description: "",
  },
  right: {
    container: "ml-auto max-w-2xl",
    text: "text-right",
    description: "ml-auto",
  },
};

const backgroundClasses: Record<
  SectionHeadingBackground,
  { title: string; description: string; eyebrow: string }
> = {
  primary: {
    title: "text-primary-foreground",
    description: "text-primary-foreground/80",
    eyebrow:
      "border-primary-foreground/25 bg-primary-foreground/10 text-primary-foreground",
  },
  default: {
    title: "text-foreground",
    description: "text-muted-foreground",
    eyebrow: "border-primary/20 bg-primary/10 text-primary",
  },
};

export function SectionHeading({
  as: HeadingTag = "h2",
  id,
  title,
  description,
  eyebrow,
  align = "center",
  background = "default",
  className,
}: SectionHeadingProps) {
  const alignment = alignClasses[align];
  const colors = backgroundClasses[background];

  return (
    <div className={cn(alignment.container, alignment.text, className)}>
      {eyebrow ? (
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider",
            colors.eyebrow,
          )}
        >
          {eyebrow}
        </span>
      ) : null}
      <HeadingTag
        id={id}
        className={cn(
          "text-3xl   md:text-4xl lg:text-5xl tracking-tight ",
          colors.title,
        )}
        dangerouslySetInnerHTML={{ __html: title }}
      />

      {description ? (
        <p
          className={cn(
            "mt-4 max-w-2xl text-sm leading-relaxed md:text-base",
            alignment.description,
            colors.description,
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
