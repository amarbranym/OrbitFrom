import type { ComponentPropsWithoutRef } from "react"

import { cn } from "~/lib/utils"

type SectionWrapperProps = ComponentPropsWithoutRef<"section"> & {
    background?: boolean
}

export const SectionWrapper = ({
    children,
    className,
    ...props
}: SectionWrapperProps) => {
    return (
        <section className={cn("relative py-10 md:py-16", className)} {...props}>
            {children}
        </section>
    )
}
