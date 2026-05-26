import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/lib/utils";

const glowVariants = cva("absolute w-full", {
  variants: {
    variant: {
      top: "top-0",
      above: "-top-[128px]",
      bottom: "bottom-0",
      below: "-bottom-[128px]",
      center: "top-[50%]",
    },
  },
  defaultVariants: {
    variant: "top",
  },
});

const glowOuterClass =
  "absolute left-1/2 h-[256px] w-[60%] -translate-x-1/2 scale-[2.5] rounded-[50%] sm:h-[512px] bg-[radial-gradient(ellipse_at_center,color-mix(in_oklch,var(--primary)_38%,transparent)_0%,transparent_70%)]";

const glowInnerClass =
  "absolute left-1/2 h-[128px] w-[40%] -translate-x-1/2 scale-[2] rounded-[50%] sm:h-[256px] bg-[radial-gradient(ellipse_at_center,color-mix(in_oklch,var(--primary)_55%,transparent)_0%,transparent_65%)]";

const Glow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof glowVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(glowVariants({ variant }), className)}
    {...props}
  >
    <div
      className={cn(glowOuterClass, variant === "center" && "-translate-y-1/2")}
    />
    <div
      className={cn(glowInnerClass, variant === "center" && "-translate-y-1/2")}
    />
  </div>
));
Glow.displayName = "Glow";

export { Glow };
