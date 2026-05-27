import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Glow } from "~/components/ui/glow";
import { Mockup } from "~/components/ui/mockup";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { SectionWrapper } from "../common/section-wrapper";

interface HeroWithMockupProps {
    title: string;
    description: string;
    primaryCta?: {
        text: string;
        href: string;
    };
    secondaryCta?: {
        text: string;
        href: string;
        icon?: ReactNode;
    };
    mockupImage: {
        src: string;
        alt: string;
        width: number;
        height: number;
    };
    className?: string;
}

function isExternalHref(href: string) {
    return href.startsWith("http://") || href.startsWith("https://");
}

export function HeroWithMockup({
    title,
    description,
    primaryCta = {
        text: "Get started",
        href: "/signup",
    },
    secondaryCta = {
        text: "Explore forms",
        href: "/explore",
    },
    mockupImage,
    className,
}: HeroWithMockupProps) {
    return (
        <SectionWrapper
            id="home"
        // className={cn(
        //     "relative overflow-hidden bg-background px-4 py-12 text-foreground md:py-24 ",
        //     className,
        // )}
        >
            <div className="relative mx-auto flex max-w-[1280px] flex-col gap-12 lg:gap-24 pt-32">
                <div className="relative z-10 flex max-w-6xl mx-auto flex-col items-center gap-6 pt-8 text-center md:pt-16 lg:gap-12">
                    <h1
                        className={cn(
                            "inline-block animate-appear",
                            "bg-gradient-to-b from-foreground via-foreground/90 to-muted-foreground",
                            "bg-clip-text text-transparent",
                            "text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl",
                        )}
                    >
                        {title}
                    </h1>

                    <p
                        className={cn(
                            "max-w-[550px] animate-appear text-base font-medium text-muted-foreground opacity-0 [animation-delay:150ms] sm:text-lg md:text-xl",
                        )}
                    >
                        {description}
                    </p>

                    <div className="relative z-10 flex animate-appear flex-wrap justify-center gap-4 opacity-0 [animation-delay:300ms]">
                        <Button
                            asChild
                            size="lg"
                            className="px-4"
                        >
                            {isExternalHref(primaryCta.href) ? (
                                <a href={primaryCta.href} target="_blank" rel="noopener noreferrer">
                                    {primaryCta.text}
                                </a>
                            ) : (
                                <Link href={primaryCta.href}>{primaryCta.text}</Link>
                            )}
                        </Button>

                        <Button
                            asChild
                            size="lg"
                            variant="ghost"
                            className="group px-4"
                        >
                            {isExternalHref(secondaryCta.href) ? (
                                <a
                                    href={secondaryCta.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center"
                                >
                                    {secondaryCta.icon}
                                    {secondaryCta.text}
                                </a>
                            ) : (
                                <Link href={secondaryCta.href} className="inline-flex items-center gap-2">
                                    {secondaryCta.text}
                                    {secondaryCta.icon ?? <ArrowRight className="size-4 group-hover:translate-x-2 transition-all duration-500" />}
                                </Link>
                            )}
                        </Button>
                    </div>

                    <div className="relative w-full px-4 pt-12 sm:px-6 lg:px-8">
                        <Mockup
                            className={cn(
                                "animate-appear border-primary/15 opacity-0 [animation-delay:700ms]",
                                "shadow-[0_0_50px_-12px_color-mix(in_oklch,var(--primary)_30%,transparent)]",
                            )}
                        >
                            <img
                                src={mockupImage.src}
                                alt={mockupImage.alt}
                                width={mockupImage.width}
                                height={mockupImage.height}
                                className="h-auto w-full"
                                loading="lazy"
                                decoding="async"
                            />
                        </Mockup>
                    </div>
                </div>
            </div>

            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <Glow
                    variant="above"
                    className="animate-appear-zoom opacity-0 [animation-delay:1000ms]"
                />
            </div>
        </SectionWrapper>
    );
}
