"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { Github } from "lucide-react";
import { BrandLogo } from "./brand-logo";
import { Equalizer } from "./equalizer";
import { LegalDialogs } from "./legal-dialogs";
import { Reveal } from "./reveal";

const PRODUCT_LINKS = [
  { label: "Showcase", href: "#showcase" },
  { label: "Screens", href: "#screens" },
  { label: "Features", href: "#features" },
  { label: "Integrations", href: "#integrations" },
  { label: "Crew", href: "#crew" },
] as const;

const GITHUB_REPO = "https://github.com/vishnu893-maker/bitify-updates";

export function Footer() {
  const year = new Date().getFullYear();
  const wordmarkRef = useRef<HTMLParagraphElement>(null);

  /* the gold hotspot chases the cursor through the glyphs — a couple of
     CSS custom properties, updated at most once per frame, nothing more */
  useEffect(() => {
    const el = wordmarkRef.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;

    let raf = 0;
    let mx = 0;
    let my = 0;
    const apply = () => {
      raf = 0;
      el.style.setProperty("--mx", `${mx.toFixed(1)}px`);
      el.style.setProperty("--my", `${my.toFixed(1)}px`);
    };
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
      el.classList.add("is-hot");
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onLeave = () => el.classList.remove("is-hot");

    el.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <footer
      aria-label="Footer"
      className="relative mt-auto overflow-hidden border-t border-white/[0.05] bg-[#050506]"
    >
      {/* ambient — soft radial wash, no blur filter (cheaper on mobile) */}
      <div
        aria-hidden
        className="absolute left-1/2 top-0 -z-0 h-[300px] w-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgb(var(--acc-rgb)/0.06),transparent_65%)]"
      />

      <div className="relative mx-auto max-w-[1200px] px-6 pb-28 pt-20 sm:pt-24 sm:pb-32">
        <Reveal>
          {/* brand row */}
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-md">
              <BrandLogo />
              <p className="mt-6 text-pretty text-sm leading-relaxed text-muted-warm">
                A modern music experience designed to work across screens — one
                seamless product for your desktop, your pocket, and your living
                room.
              </p>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                Windows · macOS · Linux · Android · TV
              </p>
              <Equalizer
                bars={7}
                className="mt-5 h-3.5 opacity-60"
                aria-label="Audio bars"
              />
            </div>

            {/* link columns */}
            <nav
              aria-label="Footer"
              className="grid grid-cols-2 gap-10 sm:grid-cols-3"
            >
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/30">
                  Explore
                </p>
                <ul className="mt-5 space-y-3">
                  {PRODUCT_LINKS.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="text-sm text-muted-warm transition-colors hover:text-warm-white"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/30">
                  Get the app
                </p>
                <ul className="mt-5 space-y-3">
                  <li>
                    <a
                      href="#downloads"
                      className="text-sm text-muted-warm transition-colors hover:text-warm-white"
                    >
                      Downloads
                    </a>
                  </li>
                  <li>
                    <a
                      href="#faq"
                      className="text-sm text-muted-warm transition-colors hover:text-warm-white"
                    >
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/30">
                  Support &amp; legal
                </p>
                <LegalDialogs />
              </div>
            </nav>
          </div>
        </Reveal>

        {/* giant wordmark — letters that wake up under the cursor:
            a gold spotlight chases the pointer through the glyph cuts
            while the letters levitate in a slow equalizer wave */}
        <Reveal
          delay={0.08}
          className="mt-20 select-none sm:mt-24"
        >
          <p
            aria-hidden
            ref={wordmarkRef}
            data-wordmark
            className="wordmark whitespace-nowrap text-center font-display text-[15.5vw] font-bold leading-[0.85] tracking-[-0.02em] lg:text-[11.5rem]"
          >
            <span className="wm-track">
              {"BITIFY".split("").map((ch, i) => (
                <span key={i} className="wm-letter" style={{ "--i": i } as CSSProperties}>
                  {ch}
                </span>
              ))}
            </span>
            {/* cursor-chasing gold hotspot, clipped to the same glyphs */}
            <span className="wm-hot" aria-hidden>
              <span className="wm-track">
                {"BITIFY".split("").map((ch, i) => (
                  <span key={i} className="wm-hot-letter" style={{ "--i": i } as CSSProperties}>
                    {ch}
                  </span>
                ))}
              </span>
            </span>
          </p>
        </Reveal>

        {/* credits — built on open ground */}
        <Reveal delay={0.1} className="mt-16 sm:mt-20">
          <div className="flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 text-center sm:flex-row sm:text-left">
            <p className="text-xs leading-relaxed text-muted-warm">
              Designed &amp; developed by{" "}
              <span className="font-semibold tracking-wide text-warm-white">
                Vishnu, Pratham &amp; Vaibhav
              </span>{" "}
              <span className="text-warm-white/40">— founded by Vishnu</span>
            </p>
            <a
              href={GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-muted-warm transition-colors hover:text-warm-white"
            >
              <Github className="h-3.5 w-3.5" aria-hidden />
              Releases live on GitHub
            </a>
          </div>
        </Reveal>

        {/* legal line */}
        <div className="mt-6 flex flex-col items-center justify-between gap-4 pt-2 sm:flex-row">
          <p className="text-xs text-white/30">
            © {year} Bitify Music. All rights reserved.
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/25">
            Your music. Every screen.
          </p>
        </div>
      </div>
    </footer>
  );
}
