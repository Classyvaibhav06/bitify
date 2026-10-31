"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./reveal";
import { SCREENSHOTS } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { selectPlatform } from "@/lib/platform-events";

const VIEWS = [
  {
    id: "nowplaying",
    label: "Now Playing",
    src: SCREENSHOTS.tv.nowplaying,
    alt: "Bitify Music on TV — Now Playing view with album art, synced lyrics and an Up Next queue",
  },
  {
    id: "fullscreen",
    label: "Fullscreen",
    src: SCREENSHOTS.tv.fullscreen,
    alt: "Bitify Music on TV — fullscreen Now Playing view with large album art and playback controls",
  },
] as const;

export function TvExperience() {
  const [active, setActive] = useState<(typeof VIEWS)[number]["id"]>("nowplaying");
  const reduce = useReducedMotion();
  const current = VIEWS.find((v) => v.id === active)!;

  return (
    <section
      id="tv"
      aria-label="TV experience"
      className="relative overflow-hidden border-t border-white/[0.05] bg-[#040405]"
    >
      {/* room darkness + light pool */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_46%,transparent_30%,rgba(0,0,0,0.6)_100%)]"
      />
      <div aria-hidden className="grain absolute inset-0" />

      <div className="relative mx-auto max-w-[1200px] px-6 py-28 sm:py-36">
        {/* ---- header ---- */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow inline-flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-crimson/70" aria-hidden />
            TV Experience
            <span className="inline-block h-px w-8 bg-crimson/70" aria-hidden />
          </p>
          <h2 className="mt-5 font-display text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-warm-white sm:text-5xl">
            Bring music into the room.
          </h2>
          <p className="mt-6 text-pretty text-base leading-relaxed text-muted-warm sm:text-lg">
            Bitify Music on television turns listening into a shared, cinematic
            moment — big artwork, big sound, and the same music you were
            playing everywhere else.
          </p>
        </Reveal>

        {/* ---- TV showcase (real captures, presented in-room) ---- */}
        <Reveal delay={0.12} className="mx-auto mt-16 max-w-[940px] sm:mt-20">
          <div className="relative">
            {/* screen light bleeding into the room */}
            <div
              aria-hidden
              className="absolute -inset-x-10 -top-12 -bottom-8 -z-10 bg-[radial-gradient(ellipse_70%_55%_at_50%_50%,rgba(224,57,62,0.16),rgba(139,92,246,0.05)_50%,transparent_72%)] blur-2xl"
            />

            {/* the television — the capture already carries its own bezel */}
            <div className="relative overflow-hidden rounded-[10px] bg-black shadow-[0_60px_140px_-20px_rgba(0,0,0,0.9)] ring-1 ring-white/10">
              <div className="relative aspect-video overflow-hidden rounded-[6px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={reduce ? undefined : { opacity: 0, scale: 1.012 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduce ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={current.src}
                      alt={current.alt}
                      fill
                      sizes="(max-width: 1024px) 92vw, 940px"
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>
                {/* glass reflection */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.05)_0%,transparent_32%)]"
                />
              </div>
            </div>

            {/* slim center stand */}
            <div
              aria-hidden
              className="absolute left-1/2 top-full -z-10 flex -translate-x-1/2 flex-col items-center"
            >
              <div className="h-10 w-[46px] rounded-t bg-gradient-to-b from-[#1a1a20] to-[#111116]" />
              <div className="h-[6px] w-[190px] rounded-full bg-gradient-to-b from-[#222228] to-[#141419] shadow-[0_12px_28px_rgba(0,0,0,0.75)]" />
            </div>
            {/* floor shadow */}
            <div
              aria-hidden
              className="absolute left-1/2 top-full mt-[58px] h-10 w-[75%] -translate-x-1/2 rounded-[100%] bg-black/70 blur-2xl"
            />
          </div>

          {/* view switcher */}
          <div
            role="tablist"
            aria-label="TV app views"
            className="mt-24 flex flex-wrap items-center justify-center gap-2 sm:mt-28"
          >
            {VIEWS.map((view) => (
              <button
                key={view.id}
                role="tab"
                aria-selected={active === view.id}
                onClick={() => setActive(view.id)}
                className={cn(
                  "rounded-full px-4 py-2 text-[12px] font-semibold tracking-wide transition-all duration-300",
                  active === view.id
                    ? "bg-crimson text-white shadow-[0_8px_24px_-6px_rgba(224,57,62,0.55)]"
                    : "border border-white/[0.09] text-muted-warm hover:border-white/25 hover:text-warm-white"
                )}
              >
                {view.label}
              </button>
            ))}
            <span className="ml-2 hidden font-mono text-[10px] uppercase tracking-[0.25em] text-white/25 sm:block">
              Actual TV interface
            </span>
          </div>
        </Reveal>

        {/* ---- feature row ---- */}
        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-8 text-center sm:mt-20 sm:grid-cols-3 sm:text-left">
          {[
            {
              title: "Built for the big screen",
              text: "An interface designed to read from across the room.",
            },
            {
              title: "One continuous library",
              text: "The Bitify experience you already know, scaled for TV.",
            },
            {
              title: "Made for together",
              text: "Press play and let the living room listen along.",
            },
          ].map((f, i) => (
            <Reveal key={f.title} delay={i * 0.07}>
              <div className="border-t border-white/[0.09] pt-5 sm:border-0 sm:px-6">
                <h3 className="text-sm font-semibold tracking-wide text-warm-white">
                  {f.title}
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-warm">
                  {f.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-14 text-center">
          <button
            type="button"
            onClick={() => selectPlatform("tv")}
            className="group inline-flex items-center gap-2.5 text-sm font-semibold tracking-wide text-crimson-bright transition-colors hover:text-warm-white"
          >
            Explore TV
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden
            />
          </button>
        </Reveal>
      </div>
    </section>
  );
}
