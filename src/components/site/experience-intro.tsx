"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./reveal";

const PLATFORMS = [
  {
    index: "01",
    name: "Desktop",
    href: "#desktop",
    tag: "The deep-dive listening session",
  },
  {
    index: "02",
    name: "Mobile",
    href: "#mobile",
    tag: "Your pocket-sized player",
  },
  {
    index: "03",
    name: "TV",
    href: "#tv",
    tag: "Music made for the big screen",
  },
] as const;

/**
 * Experience index — editorial opening to the three platform showcases.
 */
export function ExperienceIntro() {
  const reduce = useReducedMotion();

  return (
    <section
      id="experience"
      aria-label="Experience"
      className="relative border-t border-white/[0.05]"
    >
      <div className="mx-auto max-w-[1200px] px-6 py-28 sm:py-36">
        <Reveal className="max-w-3xl">
          <p className="eyebrow flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-crimson/70" aria-hidden />
            The Experience
          </p>
          <h2 className="mt-5 font-display text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-warm-white sm:text-6xl">
            Music should move with you.
          </h2>
          <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-warm sm:text-lg">
            From your personal workspace to your pocket and your living room,
            discover Bitify Music across your screens.
          </p>
        </Reveal>

        {/* platform index */}
        <div className="mt-16 sm:mt-20">
          {PLATFORMS.map((p, i) => (
            <Reveal key={p.index} delay={i * 0.08}>
              <a
                href={p.href}
                className="group relative grid grid-cols-[auto_1fr_auto] items-center gap-x-5 border-t border-white/[0.07] py-7 transition-colors duration-500 last:border-b hover:bg-white/[0.02] sm:grid-cols-[90px_1fr_1fr_auto] sm:gap-x-8 sm:py-9"
              >
                <span className="font-mono text-xs tracking-widest text-crimson/90 sm:text-sm">
                  {p.index}
                </span>
                <span className="font-display text-3xl font-semibold tracking-tight text-warm-white transition-all duration-500 group-hover:translate-x-2 group-hover:text-crimson-bright sm:text-5xl">
                  {p.name}
                </span>
                <span className="hidden text-sm text-muted-warm sm:block">
                  {p.tag}
                </span>
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-muted-warm transition-all duration-500 group-hover:border-crimson group-hover:bg-crimson group-hover:text-white">
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </span>
                {/* hover sweep */}
                <span
                  aria-hidden
                  className={
                    reduce
                      ? "hidden"
                      : "pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-crimson to-transparent transition-transform duration-700 group-hover:scale-x-100"
                  }
                />
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
