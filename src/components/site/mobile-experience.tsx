"use client";

import { ArrowRight, Heart, ListMusic, MicVocal, Play } from "lucide-react";
import { Reveal } from "./reveal";
import { DeviceCoverflow } from "./device-coverflow";
import { selectPlatform } from "@/lib/platform-events";

const MOBILE_FEATURES = [
  {
    icon: Play,
    title: "Listen Now",
    text: "Your picks and recents, right on the home screen.",
  },
  {
    icon: MicVocal,
    title: "Synced lyrics",
    text: "Karaoke-style highlighting that moves with the song.",
  },
  {
    icon: Heart,
    title: "One-tap like",
    text: "Save tracks to Liked Music the moment they land.",
  },
  {
    icon: ListMusic,
    title: "Made for pockets",
    text: "A focused player built for one-handed control.",
  },
] as const;

/**
 * Mobile experience — the interactive 3D coverflow of the real Bitify app
 * screens lives here: swipe, drag, use the arrow buttons or the dots to
 * travel through every view of the mobile app. Below it, a quiet feature
 * strip summarises what makes the pocket edition special.
 */
export function MobileExperience() {
  return (
    <section
      id="mobile"
      aria-label="Mobile experience"
      className="relative overflow-hidden border-t border-white/[0.05]"
    >
      {/* warm ambience for this section — soft radial wash, no blur
          filter (a 100px blur over a 760px box is very expensive
          on mobile GPUs) */}
      <div
        aria-hidden
        className="absolute left-1/2 top-[8%] -z-10 h-[520px] w-[760px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(224,57,62,0.07),transparent_65%)]"
      />

      <div className="mx-auto max-w-[1200px] px-6 py-24 sm:py-32">
        {/* ---- centered header ---- */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow inline-flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-crimson/70" aria-hidden />
            Mobile Experience
            <span className="inline-block h-px w-8 bg-crimson/70" aria-hidden />
          </p>
          <h2 className="mt-5 font-display text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-warm-white sm:text-5xl">
            Your music, in motion.
          </h2>
          <p className="mt-6 text-pretty text-base leading-relaxed text-muted-warm sm:text-lg">
            The same Bitify experience, reshaped for the device that travels
            with you — quick picks, synced lyrics, and a player that feels
            natural in one hand.
          </p>
        </Reveal>

        {/* ---- interactive 3D coverflow (all app screens) ---- */}
        <Reveal delay={0.08} y={36} className="mt-14 sm:mt-18">
          <DeviceCoverflow />
        </Reveal>

        {/* ---- feature strip ---- */}
        <div className="mx-auto mt-20 grid max-w-4xl grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {MOBILE_FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.06}>
              <div className="group border-t border-white/[0.09] pt-5">
                <f.icon
                  className="h-5 w-5 text-crimson transition-transform duration-300 group-hover:-translate-y-0.5"
                  aria-hidden
                />
                <h3 className="mt-4 text-sm font-semibold tracking-wide text-warm-white">
                  {f.title}
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-warm">
                  {f.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-12 text-center">
          <button
            type="button"
            onClick={() => selectPlatform("mobile")}
            className="group inline-flex cursor-pointer items-center gap-2.5 text-sm font-semibold tracking-wide text-crimson-bright transition-colors hover:text-warm-white"
          >
            Explore Mobile
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
