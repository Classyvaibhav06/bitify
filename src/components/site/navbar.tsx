"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { NAV_LINKS } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { BrandLogo } from "./brand-logo";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
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
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-crimson focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to content
      </a>

      <header
        className={cn(
          "site-nav fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled
            ? "site-nav-scrolled border-b border-white/[0.08] shadow-[0_12px_44px_-24px_rgba(0,0,0,0.95)]"
            : "site-nav-top border-b border-white/[0.05]"
        )}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between px-6"
        >
          <a
            href="#top"
            aria-label="Bitify Music — home"
            className="group relative rounded-md"
            onClick={() => setOpen(false)}
          >
            <BrandLogo priority withWordmark className="h-9 gap-2 sm:h-12 sm:gap-2.5" />
          </a>

          {/* desktop links */}
          <ul className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="group relative text-[13px] font-medium tracking-wide text-muted-warm transition-colors duration-300 hover:text-warm-white"
                >
                  {link.label}
                  <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-crimson transition-all duration-300 group-hover:w-full" />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <a
              href="#downloads"
              className="group hidden items-center gap-2 rounded-full bg-crimson px-5 py-2.5 text-[13px] font-semibold tracking-wide text-white shadow-[0_8px_30px_-6px_rgba(224,57,62,0.55)] transition-all duration-300 hover:bg-crimson-bright hover:shadow-[0_10px_38px_-6px_rgba(224,57,62,0.7)] sm:inline-flex"
            >
              Get Bitify
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden
              />
            </a>

            {/* mobile toggle */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-warm-white transition-colors hover:bg-white/5 lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
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
            transition={{ duration: reduce ? 0 : 0.3 }}
            className="fixed inset-0 z-40 flex flex-col bg-[#060607]/[0.985] lg:hidden"
          >
            <div className="flex h-[72px] items-center justify-between px-6">
              <span className="text-sm font-medium text-muted-warm">Menu</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-warm-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav aria-label="Mobile" className="flex flex-1 flex-col justify-center px-8">
              <ul className="space-y-2">
                {NAV_LINKS.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={reduce ? false : { opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 * i + 0.1, duration: 0.45 }}
                  >
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="group flex items-baseline gap-4 border-b border-white/[0.06] py-5"
                    >
                      <span className="font-mono text-xs text-crimson/80">
                        0{i + 1}
                      </span>
                      <span className="font-display text-3xl font-semibold tracking-tight text-warm-white transition-colors group-hover:text-crimson-bright">
                        {link.label}
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ul>

              <motion.a
                href="#downloads"
                onClick={() => setOpen(false)}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.45 }}
                className="mt-10 inline-flex items-center justify-center gap-2 rounded-full bg-crimson px-6 py-4 text-sm font-semibold text-white"
              >
                Get Bitify
                <ArrowRight className="h-4 w-4" aria-hidden />
              </motion.a>
            </nav>

            <p className="px-8 pb-10 font-mono text-[10px] uppercase tracking-[0.3em] text-white/25">
              Bitify Music — Your music. Every screen.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
