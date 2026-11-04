"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./reveal";
import { DeviceShotImage } from "./devices/device-shot";
import { Ambilight } from "./devices/ambilight";
import { TV_SHOTS, type DeviceShot } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { useHydrated } from "@/lib/use-hydrated";
import { selectPlatform } from "@/lib/platform-events";

/** the five real TV app views, ordered as a guided tour of the screen */
const VIEWS: DeviceShot[] = [
  TV_SHOTS.nowplaying,
  TV_SHOTS.lyrics,
  TV_SHOTS.singalong,
  TV_SHOTS.upnext,
  TV_SHOTS.fullscreen,
];

const easeOut = [0.21, 0.47, 0.32, 0.98] as const;

export function TvExperience() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  // SSR-safe: the first view renders fully visible; only tab switches animate.
  const mounted = useHydrated();
  const current = VIEWS[active];

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

        {/* ---- TV showcase — the real set, presented in-room ---- */}
        <Reveal delay={0.12} className="mx-auto mt-16 max-w-[980px] sm:mt-20">
          <div className="relative">
            {/* ambilight — rear light strip behind the television */}
            <Ambilight />

            {/* the television — a real capture carrying its own bezel */}
            <div className="relative">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={current.src}
                  initial={
                    mounted && !reduce
                      ? { opacity: 0, scale: 0.975, y: 14 }
                      : false
                  }
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={mounted && !reduce ? { opacity: 0, scale: 0.99, y: -10 } : { opacity: 0 }}
                  transition={{ duration: 0.55, ease: easeOut }}
                >
                  <DeviceShotImage
                    shot={current}
                    fit="width"
                    sizes="(max-width: 1024px) 92vw, 980px"
                  />
                </motion.div>
              </AnimatePresence>

              {/* floor reflection hint under the set */}
              <div
                aria-hidden
                className="absolute left-1/2 top-full mt-3 h-14 w-[72%] -translate-x-1/2 rounded-[100%] bg-black/75 blur-2xl"
              />
            </div>
          </div>

          {/* view switcher */}
          <div
            role="tablist"
            aria-label="TV app views"
            className="mt-14 flex flex-wrap items-center justify-center gap-2 sm:mt-16"
          >
            {VIEWS.map((view, i) => (
              <button
                key={view.src}
                role="tab"
                aria-selected={active === i}
                onClick={() => setActive(i)}
                className={cn(
                  "cursor-pointer rounded-full px-4 py-2 text-[12px] font-semibold tracking-wide transition-all duration-300",
                  active === i
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
            className="group inline-flex cursor-pointer items-center gap-2.5 text-sm font-semibold tracking-wide text-crimson-bright transition-colors hover:text-warm-white"
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
