"use client";

import { Github, Youtube } from "lucide-react";
import { BrandLogo } from "./brand-logo";
import { Equalizer } from "./equalizer";
import { LegalDialogs } from "./legal-dialogs";
import { Reveal } from "./reveal";
import { NAV_LINKS } from "@/lib/site-config";

const PRODUCT_LINKS = [
  { label: "Downloads", href: "#downloads" },
  { label: "FAQ", href: "#faq" },
  { label: "Features", href: "#features" },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      aria-label="Footer"
      className="relative mt-auto overflow-hidden border-t border-white/[0.05] bg-[#040405]"
    >
      {/* ambient — soft radial wash, no blur filter (cheaper on mobile) */}
      <div
        aria-hidden
        className="absolute left-1/2 top-0 -z-0 h-[300px] w-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(224,57,62,0.06),transparent_65%)]"
      />

      <div className="relative mx-auto max-w-[1200px] px-6 pb-12 pt-20 sm:pt-24">
        <Reveal>
          {/* brand row */}
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-md">
              <BrandLogo className="h-11" />
              <p className="mt-6 text-pretty text-sm leading-relaxed text-muted-warm">
                A modern music experience designed to work across screens —
                one seamless product for your desktop, your pocket, and your
                living room.
              </p>
              <Equalizer bars={6} className="mt-6 h-3 opacity-60" aria-label="Audio bars" />
            </div>

            {/* link columns */}
            <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">
                  Experience
                </p>
                <ul className="mt-5 space-y-3">
                  {NAV_LINKS.slice(1, 4).map((link) => (
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
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">
                  Product
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
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">
                  Support &amp; legal
                </p>
                <LegalDialogs />
              </div>
            </nav>
          </div>
        </Reveal>

        {/* giant wordmark reveal */}
        <Reveal delay={0.08} className="mt-20 select-none overflow-hidden sm:mt-24">
          <p
            aria-hidden
            className="text-outline whitespace-nowrap text-center font-display text-[15.5vw] font-bold leading-[0.85] tracking-[-0.02em] opacity-40 lg:text-[11.5rem]"
          >
            BITIFY
          </p>
        </Reveal>

        {/* credits — built on open ground */}
        <Reveal delay={0.1} className="mt-16 sm:mt-20">
          <div className="flex flex-col items-center justify-center gap-x-10 gap-y-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-6 text-center sm:flex-row sm:text-left">
            <p className="text-xs leading-relaxed text-muted-warm">
              Designed &amp; developed by{" "}
              <span className="font-semibold tracking-wide text-warm-white">
                Vishnu, Pratham &amp; Vaibhav
              </span>
            </p>
            <span aria-hidden className="hidden h-3.5 w-px bg-white/10 sm:block" />
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-muted-warm transition-colors hover:text-warm-white"
            >
              <Github className="h-3.5 w-3.5" aria-hidden />
              Built with open-source scripts &amp; data from GitHub
            </a>
            <span aria-hidden className="hidden h-3.5 w-px bg-white/10 sm:block" />
            <a
              href="https://music.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-muted-warm transition-colors hover:text-warm-white"
            >
              <Youtube className="h-3.5 w-3.5" aria-hidden />
              Design language inspired by YouTube Music
            </a>
          </div>
        </Reveal>

        {/* legal line */}
        <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 sm:flex-row">
          <p className="text-xs text-white/30">
            © {year} Bitify Music. All rights reserved.
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/25">
            Your music. Every screen.
          </p>
        </div>
      </div>
    </footer>
  );
}
