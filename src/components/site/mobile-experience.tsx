"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Heart, ListMusic, MicVocal, Play } from "lucide-react";
import { Reveal } from "./reveal";
import { SCREENSHOTS } from "@/lib/site-config";
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

export function MobileExperience() {
  const reduce = useReducedMotion();
  const bannerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: bannerRef,
    offset: ["start end", "end start"],
  });
  const bannerY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section
      id="mobile"
      aria-label="Mobile experience"
      className="relative overflow-hidden border-t border-white/[0.05]"
    >
      {/* warm ambience for this section */}
      <div
        aria-hidden
        className="absolute left-1/2 top-[16%] -z-10 h-[560px] w-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(224,57,62,0.07),transparent_65%)] blur-[100px]"
      />

      <div className="mx-auto max-w-[1200px] px-6 py-28 sm:py-36">
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

        {/* ---- phone composition ---- */}
        <div className="relative mx-auto mt-20 flex h-[440px] max-w-[760px] items-center justify-center sm:h-[520px]">
          {/* lyrics phone — behind, tilted */}
          <Reveal
            delay={0.15}
            className="absolute left-1/2 top-1/2 w-[44%] max-w-[240px] -translate-x-[118%] -translate-y-[38%] rotate-[-8deg] sm:w-[38%]"
          >
            <div className="device-shadow relative aspect-[960/1341] overflow-hidden rounded-[22px] ring-1 ring-white/10 [mask-image:linear-gradient(to_bottom,black_78%,transparent_98%)]">
              <Image
                src={SCREENSHOTS.mobile.lyricsWarm}
                alt="Bitify Music mobile app — synced lyrics view on a warm ambient render"
                fill
                sizes="(max-width: 640px) 44vw, 240px"
                className="object-cover object-top"
              />
            </div>
          </Reveal>

          {/* primary phone — front */}
          <Reveal delay={0.05} className="relative w-[54%] max-w-[300px] sm:w-[46%]">
            <motion.div
              animate={reduce ? undefined : { y: [0, -8, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="device-shadow relative aspect-[674/1396] overflow-hidden rounded-[30px] ring-1 ring-white/15"
            >
              <Image
                src={SCREENSHOTS.mobile.home}
                alt="Bitify Music mobile app — Listen Now home screen on a modern smartphone"
                fill
                sizes="(max-width: 640px) 54vw, 300px"
                className="object-cover"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-[30px] bg-[linear-gradient(115deg,rgba(255,255,255,0.09)_0%,transparent_20%)]"
              />
            </motion.div>
          </Reveal>

          {/* soft light under phones */}
          <div
            aria-hidden
            className="absolute bottom-4 left-1/2 h-24 w-[70%] -translate-x-1/2 rounded-[100%] bg-black/60 blur-2xl"
          />
        </div>

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

        <Reveal delay={0.1} className="mt-14 text-center">
          <button
            type="button"
            onClick={() => selectPlatform("mobile")}
            className="group inline-flex items-center gap-2.5 text-sm font-semibold tracking-wide text-crimson-bright transition-colors hover:text-warm-white"
          >
            Explore Mobile
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden
            />
          </button>
        </Reveal>
      </div>

      {/* ---- full-bleed lifestyle banner ---- */}
      <div
        ref={bannerRef}
        className="relative h-[62vh] min-h-[420px] w-full overflow-hidden"
      >
        <motion.div
          style={reduce ? undefined : { y: bannerY }}
          className="absolute -inset-y-[14%] inset-x-0"
        >
          <Image
            src={SCREENSHOTS.promo.lifestyle}
            alt="Bitify Music playing on a phone held in hand, with a desk setup in the background"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
        {/* cinematic grade */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/70"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[#060607]/25"
        />
        <p className="absolute bottom-10 left-1/2 w-full -translate-x-1/2 px-6 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
          Bitify Music — in the wild
        </p>
      </div>
    </section>
  );
}
