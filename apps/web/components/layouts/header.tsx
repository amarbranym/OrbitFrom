"use client";

import { useState, useEffect, useRef, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Button, buttonVariants } from "~/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "~/lib/utils";
import { Container } from "../common/container";

const navLinks = [
  { name: "Home", href: "/#home" },
  { name: "Themes", href: "/#themes" },
  { name: "Pricing", href: "/#pricing" },
  { name: "Explore", href: "/explore" },
  { name: "API Docs", href: "/docs" },
];

export function Header() {
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("");
  const [isDesktop, setIsDesktop] = useState(false);
  const [bgRect, setBgRect] = useState({ top: 0, left: 0, width: 100, height: 100 });
  const navRef = useRef<HTMLElement>(null);
  const desktopNavRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isElevated = isScrolled || isMobileMenuOpen;

  const isActiveLink = (href: string) => {
    if (href.startsWith("/#")) {
      const targetHash = href.slice(1);
      return pathname === "/" && activeHash === targetHash;
    }
    if (href === "/") {
      return pathname === "/" && !activeHash;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  useEffect(() => {
    let previous = false;
    const handleScroll = () => {
      const next = window.scrollY > 20;
      if (next !== previous) {
        previous = next;
        setIsScrolled(next);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const syncHash = () => setActiveHash(window.location.hash);
    syncHash();
    window.addEventListener("hashchange", syncHash);
    window.addEventListener("popstate", syncHash);
    return () => {
      window.removeEventListener("hashchange", syncHash);
      window.removeEventListener("popstate", syncHash);
    };
  }, [pathname]);

  useEffect(() => {
    const updateBgRect = () => {
      const navEl = navRef.current;
      const desktopNavEl = desktopNavRef.current;
      if (!navEl || !desktopNavEl) return;

      const navRect = navEl.getBoundingClientRect();
      const desktopRect = desktopNavEl.getBoundingClientRect();
      if (navRect.width === 0 || navRect.height === 0 || desktopRect.width === 0 || desktopRect.height === 0) return;

      setBgRect({
        top: ((desktopRect.top - navRect.top) / navRect.height) * 100,
        left: ((desktopRect.left - navRect.left) / navRect.width) * 100,
        width: (desktopRect.width / navRect.width) * 100,
        height: (desktopRect.height / navRect.height) * 100,
      });
    };

    updateBgRect();
    window.addEventListener("resize", updateBgRect);
    return () => window.removeEventListener("resize", updateBgRect);
  }, []);

  const scrollToHash = (hash: string) => {
    const id = decodeURIComponent(hash.replace(/^#/, ""));
    if (!id) return;
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleHashNavClick = (
    e: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (!href.startsWith("/#")) return;
    const hash = href.slice(1);
    if (pathname !== "/") return;
    e.preventDefault();
    scrollToHash(hash);
    window.history.replaceState(null, "", href);
    setActiveHash(hash);
    setIsMobileMenuOpen(false);
  };
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header
      className={cn(
        "fixed left-0 right-0 z-50 transition-all duration-500  ",
        isElevated ? "top-2  sm:top-3  md:top-4" : "top-3  sm:top-5  md:top-7",
      )}
    >
      <Container className=" " >
        <nav
          ref={navRef}
          className={cn(
            "relative isolate w-full overflow-hidden rounded-full px-4 transition-colors duration-300 sm:px-6 lg:px-8",
            isElevated && "backdrop-blur-xl ",
            isElevated && !isDesktop && "bg-background/50",
          )}
        >
          {isDesktop && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute z-0 bg-background border border-primary/10 shadow-sm"
              initial={false}
              animate={
                isElevated
                  ? { top: "0%", left: "0%", width: "100%", height: "100%", borderRadius: 9999 }
                  : {
                    top: `${bgRect.top}%`,
                    left: `${bgRect.left}%`,
                    width: `${bgRect.width}%`,
                    height: `${bgRect.height}%`,
                    borderRadius: 9999,
                  }
              }
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            />
          )}
          <div className="relative z-10 flex h-16 items-center justify-between sm:h-[72px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <span
                className={cn(
                  "text-lg font-bold tracking-tight sm:text-xl lg:text-2xl",
                  "text-primary"
                )}
              >
                OrbitForm
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div
              ref={desktopNavRef}
              className={cn(
                "relative z-10 hidden items-center gap-1 px-1 py-1 lg:flex",
                !isElevated && "rounded-full  bg-background",
              )}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleHashNavClick(e, link.href)}
                  className={cn(
                    "rounded-full px-3 py-2 text-sm transition-colors duration-200 xl:px-4",
                    isActiveLink(link.href)
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <Button variant={"default"} className="relative hidden md:block z-10  rounded-full" size={"lg"}>
              <Link href="/signup" >Get Started</Link>
            </Button>


            <Button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              variant={isScrolled || isMobileMenuOpen ? "default" : "secondary"}
              size="icon"
              aria-label="Toggle menu"
              className="md:hidden"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation-menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence >
          {isMobileMenuOpen && (
            <>
              <motion.div
                id="mobile-navigation-menu"
                className="relative z-50 overflow-hidden pb-3 lg:hidden "
                initial={{ opacity: 0, y: -14, scale: 0.98 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14, scale: 0.98 }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="mt-1 space-y-3 rounded-3xl border border-border/70 bg-background/95 p-3 shadow-soft backdrop-blur-md">
                  <div className="px-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Menu
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    {navLinks.map((link, index) => (
                      <motion.div
                        key={link.name}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.18, delay: index * 0.02 }}
                      >
                        <Link
                          href={link.href}
                          onClick={(e) => {
                            handleHashNavClick(e, link.href);
                            closeMobileMenu();
                          }}
                          className={cn(
                            "flex items-center justify-between rounded-2xl px-4 py-3 text-[15px] font-medium transition-all",
                            isActiveLink(link.href)
                              ? "bg-primary text-primary-foreground shadow-soft"
                              : "text-foreground/90 hover:bg-secondary hover:text-foreground",
                          )}
                        >
                          <span>{link.name}</span>
                          <span
                            className={cn(
                              "h-2 w-2 rounded-full transition-colors",
                              isActiveLink(link.href) ? "bg-primary-foreground/80" : "bg-border",
                            )}
                          />
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                  <div className="border-t border-border/70 pt-2">
                    <Link
                      href="/signup"
                      className={cn(buttonVariants({ variant: "default" }), "h-11 w-full rounded-2xl text-sm font-semibold")}
                      onClick={closeMobileMenu}
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </Container>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                key="mobile-menu-overlay"
                role="presentation"
                aria-hidden
                className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px] lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                onClick={closeMobileMenu}
              />
            )}
          </AnimatePresence>,
          document.body,
        )}
    </header>
  );
}
