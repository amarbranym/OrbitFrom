"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type FocusEvent,
} from "react";
import Image from "next/image";
import { AnimatePresence, motion, type Transition } from "motion/react";
import { Play, X } from "lucide-react";

import { cn } from "~/lib/utils";

export type VideoTestimonialCarouselItem = {
    thumbnail: string;
    clientName: string;
    clientRole: string;
    videoUrl?: string;
};

type Breakpoint = "sm" | "md" | "lg";

type SizeConfig = {
    /** Center card width/height — unchanged regardless of side scaling. */
    centerW: number;
    centerH: number;
    /** Gap between two adjacent card visual edges. */
    gap: number;
    /** Maximum number of side cards rendered per side. */
    sides: number;
    /**
     * Exponential decay base for side cards, 0 < decay < 1.
     * The nth side card from the center has visual size = center * decay^n.
     * Closer cards are slightly smaller than the center, each subsequent card
     * shrinks geometrically — producing a clear pyramid / depth effect.
     */
    decay: number;
    /**
     * Per-step opacity falloff base. nth side card opacity = opacityDecay^(n - 1).
     */
    opacityDecay: number;
};

const SIZE_CONFIGS: Record<Breakpoint, SizeConfig> = {
    sm: { centerW: 240, centerH: 320, gap: 8, sides: 2, decay: 0.55, opacityDecay: 0.78 },
    md: { centerW: 320, centerH: 420, gap: 10, sides: 2, decay: 0.58, opacityDecay: 0.8 },
    lg: { centerW: 380, centerH: 480, gap: 12, sides: 3, decay: 0.58, opacityDecay: 0.82 },
};

/** Visual size factor of the nth side card relative to the center card. */
function sideFactor(n: number, cfg: SizeConfig): number {
    return Math.pow(cfg.decay, n);
}

/**
 * Distance from carousel center to the visual center of the nth side card.
 * Cumulative because every preceding card has a different (geometric) width.
 */
function cumulativeSideCenter(n: number, cfg: SizeConfig): number {
    if (n <= 0) return 0;
    let pos = cfg.centerW / 2 + cfg.gap;
    for (let i = 1; i < n; i++) {
        pos += cfg.centerW * sideFactor(i, cfg) + cfg.gap;
    }
    pos += (cfg.centerW * sideFactor(n, cfg)) / 2;
    return pos;
}

/**
 * Returns true when the URL points to a third-party embed provider that
 * must be played through an iframe (YouTube / Vimeo). Direct media files
 * return false and are played via the native HTML5 `<video>` element.
 */
function isEmbedProvider(url: string | undefined): boolean {
    if (!url) return false;
    try {
        const u = new URL(url);
        return (
            u.hostname.includes("youtube.com") ||
            u.hostname.includes("youtu.be") ||
            u.hostname.includes("vimeo.com")
        );
    } catch {
        return false;
    }
}

/**
 * Convert a user-facing video URL into an embeddable URL with autoplay on.
 * Supports YouTube (`watch?v=`, `youtu.be/<id>`) and Vimeo. Any other URL is
 * passed through unchanged on the assumption it is already embed-compatible.
 */
function getEmbedUrl(url: string | undefined): string | null {
    if (!url) return null;
    try {
        const u = new URL(url);
        if (u.hostname.includes("youtube.com")) {
            const id = u.searchParams.get("v");
            if (id) {
                return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
            }
        }
        if (u.hostname.includes("youtu.be")) {
            const id = u.pathname.replace(/^\//, "");
            if (id) {
                return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
            }
        }
        if (u.hostname.includes("vimeo.com")) {
            const id = u.pathname.replace(/^\//, "");
            if (id) {
                return `https://player.vimeo.com/video/${id}?autoplay=1`;
            }
        }
        return url;
    } catch {
        return null;
    }
}

/** Total stage width that fully contains the center + all visible side cards. */
function computeStageWidth(cfg: SizeConfig): number {
    if (cfg.sides === 0) return cfg.centerW;
    const farCenter = cumulativeSideCenter(cfg.sides, cfg);
    const farHalfWidth = (cfg.centerW * sideFactor(cfg.sides, cfg)) / 2;
    return 2 * (farCenter + farHalfWidth);
}

const SPRING: Transition = {
    type: "spring",
    stiffness: 240,
    damping: 32,
    mass: 0.9,
};

function getBreakpoint(width: number): Breakpoint {
    if (width < 640) return "sm";
    if (width < 1024) return "md";
    return "lg";
}

function useBreakpoint(): Breakpoint {
    const [bp, setBp] = useState<Breakpoint>("lg");

    useEffect(() => {
        const update = () => setBp(getBreakpoint(window.innerWidth));
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    return bp;
}

function getRelativeOffset(index: number, active: number, total: number) {
    if (total === 0) return 0;
    let diff = index - active;
    const half = total / 2;
    if (diff > half) diff -= total;
    if (diff < -half) diff += total;
    return diff;
}

type CardLayout = {
    x: number;
    y: number;
    width: number;
    height: number;
    scale: number;
    opacity: number;
    zIndex: number;
    isCenter: boolean;
    isVisible: boolean;
};

function getCardLayout(offset: number, cfg: SizeConfig): CardLayout {
    // Every card uses the SAME layout box (center dimensions). All visual
    // sizing is done via the `scale` transform, which keeps animations on the
    // GPU and lets a side card morph into the center (and vice versa) by
    // animating scale + x only.
    const baseW = cfg.centerW;
    const baseH = cfg.centerH;

    if (offset === 0) {
        return {
            x: -baseW / 2,
            y: -baseH / 2,
            width: baseW,
            height: baseH,
            scale: 1,
            opacity: 1,
            zIndex: 40,
            isCenter: true,
            isVisible: true,
        };
    }

    const sign = offset > 0 ? 1 : -1;
    const abs = Math.abs(offset);
    const isVisible = abs <= cfg.sides;

    // Exponential size falloff: nth side card visual size = center * decay^n.
    const scale = sideFactor(abs, cfg);

    // Cumulative visual center for this card; collapses to a no-op when hidden.
    const centerDistance = cumulativeSideCenter(
        Math.min(abs, cfg.sides),
        cfg
    );
    // Off-stage cards continue along the same vector so they animate gracefully
    // when they re-enter, but with zero opacity.
    const overflowDistance = isVisible
        ? 0
        : (abs - cfg.sides) * (cfg.centerW * sideFactor(cfg.sides, cfg) + cfg.gap);

    return {
        x: sign * (centerDistance + overflowDistance) - baseW / 2,
        y: -baseH / 2,
        width: baseW,
        height: baseH,
        scale,
        opacity: isVisible ? Math.max(0.4, Math.pow(cfg.opacityDecay, abs - 1)) : 0,
        zIndex: 30 - abs,
        isCenter: false,
        isVisible,
    };
}

/**
 * Reusable autoplay loop. Holds the latest `onTick` in a ref so the timer
 * survives prop/identity churn, and restarts cleanly whenever `resetKey`
 * changes (so a manual selection guarantees a full fresh interval).
 */
function useAutoplay({
    enabled,
    interval,
    paused,
    count,
    resetKey,
    onTick,
}: {
    enabled: boolean;
    interval: number;
    paused: boolean;
    count: number;
    resetKey: unknown;
    onTick: () => void;
}) {
    const onTickRef = useRef(onTick);
    useEffect(() => {
        onTickRef.current = onTick;
    }, [onTick]);

    useEffect(() => {
        if (!enabled || paused || count <= 1) return;
        const id = window.setInterval(() => {
            onTickRef.current();
        }, interval);
        return () => window.clearInterval(id);
    }, [enabled, paused, interval, count, resetKey]);
}

interface VideoTestimonialCarouselProps {
    testimonials: VideoTestimonialCarouselItem[];
    initialIndex?: number;
    className?: string;
    onPlay?: (item: VideoTestimonialCarouselItem, index: number) => void;
    /** Auto-advance to the next testimonial after `autoPlayInterval` ms. */
    autoPlay?: boolean;
    /** Delay between auto-advances in milliseconds. */
    autoPlayInterval?: number;
}

export function VideoTestimonialCarousel({
    testimonials,
    initialIndex = 0,
    className,
    onPlay,
    autoPlay = true,
    autoPlayInterval = 2000,
}: VideoTestimonialCarouselProps) {
    const total = testimonials.length;
    const safeInitial = Math.min(Math.max(0, initialIndex), Math.max(0, total - 1));
    const [activeIndex, setActiveIndex] = useState(safeInitial);

    const bp = useBreakpoint();
    const cfg = useMemo(() => {
        const base = SIZE_CONFIGS[bp];
        const maxSides = Math.max(0, Math.floor((total - 1) / 2));
        return { ...base, sides: Math.min(base.sides, maxSides) };
    }, [bp, total]);

    const stageWidth = computeStageWidth(cfg);
    const stageHeight = cfg.centerH + 40;

    // Autoplay pause sources — any one of these going true stops autoplay.
    // All four must clear for it to resume.
    const [isHovered, setIsHovered] = useState(false);
    const [isPointerActive, setIsPointerActive] = useState(false);
    const [isKeyboardFocused, setIsKeyboardFocused] = useState(false);
    // Inline playback flips on when the user starts the center card's video.
    // It also pauses autoplay so the user can watch uninterrupted.
    const [isPlaying, setIsPlaying] = useState(false);
    const isPaused =
        isHovered || isPointerActive || isKeyboardFocused || isPlaying;

    const advance = useCallback(() => {
        setActiveIndex((current) => (current + 1) % total);
    }, [total]);

    useAutoplay({
        enabled: autoPlay,
        interval: autoPlayInterval,
        paused: isPaused,
        count: total,
        resetKey: activeIndex,
        onTick: advance,
    });

    // Global pointerup/cancel safety net: if the user presses inside the
    // carousel and releases outside (e.g. drags away), the local onPointerUp
    // would never fire. This guarantees the flag clears.
    useEffect(() => {
        if (!isPointerActive) return;
        const reset = () => setIsPointerActive(false);
        window.addEventListener("pointerup", reset);
        window.addEventListener("pointercancel", reset);
        return () => {
            window.removeEventListener("pointerup", reset);
            window.removeEventListener("pointercancel", reset);
        };
    }, [isPointerActive]);

    const handleFocusCapture = useCallback((event: FocusEvent<HTMLDivElement>) => {
        const target = event.target as HTMLElement | null;
        if (!target) return;
        // Only count *keyboard* focus as a pause source. `:focus-visible` is
        // false for click / touch focus, so tapping a card no longer keeps
        // autoplay paused after the cursor leaves the carousel.
        try {
            if (target.matches(":focus-visible")) {
                setIsKeyboardFocused(true);
            }
        } catch {
            // `:focus-visible` not supported in this engine — skip the pause.
        }
    }, []);

    const handleBlurCapture = useCallback(
        (event: FocusEvent<HTMLDivElement>) => {
            const next = event.relatedTarget as Node | null;
            if (!next || !event.currentTarget.contains(next)) {
                setIsKeyboardFocused(false);
            }
        },
        []
    );

    const startPlayback = useCallback(
        (item: VideoTestimonialCarouselItem, index: number) => {
            if (!item.videoUrl) return;
            setIsPlaying(true);
            onPlay?.(item, index);
        },
        [onPlay]
    );

    const stopPlayback = useCallback(() => setIsPlaying(false), []);

    // Switch to a specific testimonial — always stops any in-progress playback
    // so the new center card opens to its thumbnail state.
    const goTo = useCallback((index: number) => {
        setActiveIndex(index);
        setIsPlaying(false);
    }, []);

    if (total === 0) return null;

    return (
        <div
            className={cn(
                "relative isolate w-full overflow-hidden mt-4 ",
                className
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onPointerDown={() => setIsPointerActive(true)}
            onPointerUp={() => setIsPointerActive(false)}
            onPointerCancel={() => setIsPointerActive(false)}
            onFocusCapture={handleFocusCapture}
            onBlurCapture={handleBlurCapture}
        >

            <div
                className="relative mx-auto flex w-full items-center justify-center "
            // style={{ height: stageHeight + 60 }}
            >
                <div
                    className="relative "
                    style={{ width: stageWidth, height: stageHeight }}
                >
                    {testimonials.map((item, i) => {
                        const offset = getRelativeOffset(i, activeIndex, total);
                        const layout = getCardLayout(offset, cfg);
                        const isThisPlaying = isPlaying && layout.isCenter;
                        return (
                            <CarouselCard
                                key={i}
                                item={item}
                                layout={layout}
                                isPlaying={isThisPlaying}
                                onSelect={() => {
                                    if (layout.isCenter) {
                                        startPlayback(item, i);
                                    } else {
                                        goTo(i);
                                    }
                                }}
                                onStop={stopPlayback}
                            />
                        );
                    })}
                </div>
            </div>

            <CarouselPagination
                total={total}
                activeIndex={activeIndex}
                onSelect={goTo}
            />
        </div>
    );
}

interface CarouselCardProps {
    item: VideoTestimonialCarouselItem;
    layout: CardLayout;
    isPlaying: boolean;
    onSelect: () => void;
    onStop: () => void;
}

function CarouselCard({
    item,
    layout,
    isPlaying,
    onSelect,
    onStop,
}: CarouselCardProps) {
    const { isCenter, isVisible } = layout;
    // While the video is playing inside the center card, the outer wrapper
    // becomes inert — the native video controls own all interaction inside.
    const interactive = isVisible && !isPlaying;

    const handleKeyDown = useCallback(
        (event: React.KeyboardEvent<HTMLDivElement>) => {
            if (!interactive) return;
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect();
            }
        },
        [interactive, onSelect]
    );

    return (
        <motion.div
            role="button"
            tabIndex={interactive ? 0 : -1}
            aria-label={
                isCenter
                    ? isPlaying
                        ? `Playing video testimonial from ${item.clientName}`
                        : `Play video testimonial from ${item.clientName}`
                    : `Show testimonial from ${item.clientName}`
            }
            onClick={interactive ? onSelect : undefined}
            onKeyDown={handleKeyDown}
            className={cn(
                "absolute left-1/2 top-1/2 overflow-hidden rounded-2xl outline-none",
                interactive && "cursor-pointer",
                "focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            )}
            initial={false}
            animate={{
                x: layout.x,
                y: layout.y,
                width: layout.width,
                height: layout.height,
                scale: layout.scale,
                opacity: layout.opacity,
                zIndex: layout.zIndex,
            }}
            transition={SPRING}
            whileHover={
                !interactive
                    ? undefined
                    : isCenter
                        ? { scale: 1.01 }
                        : { scale: layout.scale * 1.04, zIndex: 35 }
            }
            whileTap={!interactive ? undefined : { scale: layout.scale * 0.97 }}
            style={{
                pointerEvents: isVisible ? "auto" : "none",
                transformOrigin: "center center",
            }}
        >
            <Image
                src={item?.thumbnail || ""}
                alt={item?.clientName || ""}
                fill
                sizes={isCenter ? "(min-width: 1024px) 400px, 60vw" : "120px"}
                className={cn(
                    "object-cover transition-[filter] duration-500",
                    !isCenter && "brightness-90 saturate-[1.05]"
                )}
                priority={isCenter}
                draggable={false}
            />

            {!isPlaying ? (
                <div
                    aria-hidden
                    className={cn(
                        "absolute inset-0",
                        isCenter
                            ? "bg-linear-to-t from-black/65 via-black/5 to-black/20"
                            : "bg-linear-to-b from-black/40 via-black/15 to-black/55"
                    )}
                />
            ) : null}

            <AnimatePresence mode="wait" initial={false}>
                {isCenter ? (
                    <CenterOverlay
                        key="center"
                        item={item}
                        isPlaying={isPlaying}
                        onStop={onStop}
                    />
                ) : (
                    <SideOverlay key="side" name={item.clientName} />
                )}
            </AnimatePresence>
        </motion.div>
    );
}

interface CenterOverlayProps {
    item: VideoTestimonialCarouselItem;
    isPlaying: boolean;
    onStop: () => void;
}

function CenterOverlay({ item, isPlaying, onStop }: CenterOverlayProps) {
    if (isPlaying && item.videoUrl) {
        return (
            <motion.div
                key="player"
                className="absolute inset-0 bg-black"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
            >
                <InlineVideoPlayer
                    src={item.videoUrl}
                    poster={item.thumbnail}
                    title={`${item.clientName} — ${item.clientRole}`}
                />
                <button
                    type="button"
                    onClick={(event) => {
                        event.stopPropagation();
                        onStop();
                    }}
                    aria-label="Stop video"
                    className={cn(
                        "absolute right-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full",
                        "bg-black/55 text-white backdrop-blur-sm transition-colors",
                        "hover:bg-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                    )}
                >
                    <X className="h-4 w-4" />
                </button>
            </motion.div>
        );
    }

    return (
        <motion.div
            key="poster"
            className="absolute inset-0 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
        >
            <div className="relative flex flex-1 items-center justify-center">
                <motion.div
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.08, type: "spring", stiffness: 280, damping: 22 }}
                    whileHover={{
                        scale: 1.12,
                        boxShadow: "0 14px 36px rgba(0,0,0,0.32)",
                    }}
                    whileTap={{ scale: 0.94 }}
                >
                    <Play className="h-5 w-5 translate-x-[1.5px] fill-current text-neutral-900" />
                </motion.div>
                <motion.div
                    className="absolute bottom-0 w-full p-6 text-left"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ delay: 0.14, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="text-base font-bold uppercase tracking-[0.18em] text-white">
                        {item.clientName}
                    </div>
                    <div className="mt-1 text-[10.5px] font-medium uppercase tracking-[0.32em] text-white/75">
                        {item.clientRole}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

interface InlineVideoPlayerProps {
    src: string;
    title: string;
    poster?: string;
}

/**
 * Picks the right player primitive for the source URL:
 *  - YouTube / Vimeo -> iframe with autoplay query param
 *  - Anything else (local files, signed URLs, CDN-hosted mp4/webm) -> native
 *    HTML5 `<video controls autoPlay>`.
 *
 * Adding more providers later only requires extending `isEmbedProvider` and
 * `getEmbedUrl` — no consumer changes.
 */
function InlineVideoPlayer({ src, title, poster }: InlineVideoPlayerProps) {
    const isEmbed = isEmbedProvider(src);
    const embedUrl = isEmbed ? getEmbedUrl(src) : null;

    if (isEmbed && embedUrl) {
        return (
            <iframe
                key={embedUrl}
                src={embedUrl}
                title={title}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
            />
        );
    }

    return (
        <video
            key={src}
            src={src}
            poster={poster}
            title={title}
            controls
            autoPlay
            playsInline
            controlsList="nodownload"
            className="absolute inset-0 h-full w-full object-contain bg-black"
        />
    );
}

function SideOverlay({ name }: { name: string }) {
    return (
        <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
        >
            <span
                className="select-none font-mono text-2xl font-semibold tracking-[0.3em] text-white/95"
                style={{
                    writingMode: "vertical-rl",
                    textOrientation: "upright",
                }}
            >
                {name.split(" ")[0]?.toUpperCase()}
            </span>
        </motion.div>
    );
}

interface CarouselPaginationProps {
    total: number;
    activeIndex: number;
    onSelect: (index: number) => void;
}

function CarouselPagination({
    total,
    activeIndex,
    onSelect,
}: CarouselPaginationProps) {
    if (total <= 1) return null;
    return (
        <div className="relative z-10 flex items-center justify-center gap-2 py-2 ">
            {Array.from({ length: total }).map((_, i) => {
                const isActive = i === activeIndex;
                return (
                    <button
                        key={i}
                        type="button"
                        onClick={() => onSelect(i)}
                        aria-label={`Go to testimonial ${i + 1}`}
                        className="group relative flex h-3 items-center justify-center"
                    >
                        <motion.span
                            className={cn(
                                "block rounded-full",
                                isActive ? "bg-primary" : "bg-foreground/30"
                            )}
                            animate={{
                                width: isActive ? 22 : 6,
                                height: 6,
                            }}
                            transition={{ type: "spring", stiffness: 320, damping: 28 }}
                        />
                    </button>
                );
            })}
        </div>
    );
}

