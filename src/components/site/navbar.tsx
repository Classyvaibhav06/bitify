"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowDownToLine } from "lucide-react";
import { NAV_LINKS } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { BrandLogo } from "./brand-logo";
import { ThemeSwitcher } from "./theme-switcher";
import { resolvePrimaryDownload, useOs } from "@/hooks/use-os";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const os = useOs();
  const download = resolvePrimaryDownload(os);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // lock scroll when mobile menu is open
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  // close menu on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-crimson focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to content
      </a>

      <header className="fixed inset-x-0 top-0 z-50">
        <nav
          aria-label="Primary"
          className={cn(
            "nav-bar flex h-16 items-center",
            scrolled && "nav-bar-scrolled"
          )}
        >
          <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-6 px-6">
            <a
              href="#top"
              aria-label="Bitify Music — home"
              onClick={() => setOpen(false)}
              className="shrink-0 rounded-md py-1"
            >
              <BrandLogo size="md" />
            </a>

            {/* desktop links */}
            <ul className="hidden items-center gap-7 lg:flex">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-[13px] font-medium text-warm-white/60 transition-colors duration-200 hover:text-warm-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3">
              <ThemeSwitcher />

              <a
                href={download.url}
                className="btn-primary hidden px-4 py-2 text-[13px] sm:inline-flex"
              >
                <ArrowDownToLine className="h-3.5 w-3.5" aria-hidden />
                Get Bitify
              </a>

              {/* mobile toggle */}
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Close menu" : "Open menu"}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-warm-white transition-colors hover:bg-white/[0.06] lg:hidden"
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 flex flex-col bg-background/[0.985] lg:hidden"
          >
            {/* mobile menu brand row */}
            <div className="flex h-16 items-center justify-between px-6">
              <BrandLogo size="sm" />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-warm-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav aria-label="Mobile" className="flex flex-1 flex-col justify-center px-8">
              <ul className="space-y-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i + 0.08, duration: 0.35 }}
                  >
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="group flex items-baseline gap-4 border-b border-white/[0.06] py-4"
                    >
                      <span className="font-serif-accent text-base text-crimson-bright">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-display text-2xl font-semibold tracking-tight text-warm-white transition-colors group-hover:text-crimson-bright">
                        {link.label}
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ul>

              <motion.a
                href={download.url}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38, duration: 0.35 }}
                className="btn-primary inline-flex mt-8 px-6 py-4 text-sm"
              >
                <ArrowDownToLine className="h-4 w-4" aria-hidden />
                {download.label}
              </motion.a>
            </nav>

            <p className="px-8 pb-10 text-xs text-white/30">
              Bitify Music — Your music. Every screen.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
