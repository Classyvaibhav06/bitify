"use client";

import { ArrowRight } from "lucide-react";
import { TvFrame } from "./devices/tv-frame";
import { TvScreenPlate } from "./devices/tv-screen-plate";
import { Reveal } from "./reveal";
import { selectPlatform } from "@/lib/platform-events";

export function TvExperience() {
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
      <div
        aria-hidden
        className="grain absolute inset-0"
      />

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

        {/* ---- TV showcase ---- */}
        <Reveal delay={0.12} className="mx-auto mt-16 max-w-[920px] sm:mt-20">
          <TvFrame>
            <TvScreenPlate variant="rich" />
          </TvFrame>

          <p className="mx-auto mt-24 max-w-md text-center font-mono text-[10px] uppercase leading-relaxed tracking-[0.22em] text-white/30 sm:mt-28">
            Brand plate shown — actual TV interface
            <br className="sm:hidden" /> screenshots coming soon
          </p>
        </Reveal>

        {/* ---- feature row ---- */}
        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-8 text-center sm:grid-cols-3 sm:text-left">
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
