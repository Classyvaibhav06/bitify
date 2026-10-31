"use client";

import { ArrowUpRight } from "lucide-react";
import { BrandLogo } from "./brand-logo";
import { Equalizer } from "./equalizer";
import { Reveal } from "./reveal";
import { NAV_LINKS } from "@/lib/site-config";

const PRODUCT_LINKS = [
  { label: "Downloads", href: "#downloads" },
  { label: "FAQ", href: "#faq" },
  { label: "Features", href: "#features" },
] as const;

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: null },
  { label: "Terms of Service", href: null },
  { label: "Support", href: null },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      aria-label="Footer"
      className="relative mt-auto overflow-hidden border-t border-white/[0.05] bg-[#040405]"
    >
      {/* ambient */}
      <div
        aria-hidden
        className="absolute left-1/2 top-0 -z-0 h-[300px] w-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(224,57,62,0.06),transparent_65%)] blur-[100px]"
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
                  Support
                </p>
                <ul className="mt-5 space-y-3">
                  {LEGAL_LINKS.map((link) => (
                    <li key={link.label}>
                      {link.href ? (
                        <a
                          href={link.href}
                          className="inline-flex items-center gap-1 text-sm text-muted-warm transition-colors hover:text-warm-white"
                        >
                          {link.label}
                          <ArrowUpRight className="h-3 w-3" aria-hidden />
                        </a>
                      ) : (
                        <span
                          className="inline-flex items-center gap-1.5 text-sm text-white/25"
                          title="Link will be added when available"
                        >
                          {link.label}
                          <span className="rounded-full bg-white/[0.05] px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.14em]">
                            soon
                          </span>
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
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
