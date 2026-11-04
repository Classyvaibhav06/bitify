"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  BarChart3,
  Library,
  Repeat2,
  Search,
} from "lucide-react";
import { Reveal } from "./reveal";
import { WindowFrame } from "./devices/window-frame";
import { PhoneMockup } from "./devices/phone-mockup";
import { MOBILE_SCREENS, SCREENSHOTS, type MobileScreen } from "@/lib/site-config";

const TILES: {
  icon: typeof Library;
  title: string;
  text: string;
  screen: MobileScreen;
}[] = [
  {
    icon: Library,
    title: "A library that's yours",
    text: "Liked Music, playlists and collections — organized the way you listen, not the way an algorithm thinks.",
    screen: MOBILE_SCREENS.liked,
  },
  {
    icon: BarChart3,
    title: "Your listening, measured",
    text: "Minutes, plays, streaks and top artists — a dedicated panel tells the story of what your year sounded like.",
    screen: MOBILE_SCREENS.library,
  },
  {
    icon: Search,
    title: "Find any song, fast",
    text: "Search that gets you straight to the track — results, versions and remixes in one list.",
    screen: MOBILE_SCREENS.search,
  },
  {
    icon: Repeat2,
    title: "Playback, fully controlled",
    text: "Shuffle, repeat, queue and volume — every playback control stays within reach of the player bar.",
    screen: MOBILE_SCREENS.nowplaying,
  },
];

export function Features() {
  const reduce = useReducedMotion();
  const shotRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: shotRef,
    offset: ["start end", "end start"],
  });
  const shotY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section
      id="features"
      aria-label="Features"
      className="relative overflow-hidden border-t border-white/[0.05]"
    >
      {/* ambient — soft radial wash, no blur filter (cheaper on mobile) */}
      <div
        aria-hidden
        className="absolute right-[-8%] top-[30%] -z-10 h-[420px] w-[420px] rounded-full bg-[radial-gradient(ellipse,rgba(139,92,246,0.05),transparent_65%)]"
      />

      <div className="mx-auto max-w-[1200px] px-6 py-28 sm:py-36">
        {/* ---- header ---- */}
        <Reveal className="max-w-2xl">
          <p className="eyebrow flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-crimson/70" aria-hidden />
            Features
          </p>
          <h2 className="mt-5 font-display text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-warm-white sm:text-5xl">
            Designed around the way you listen.
          </h2>
          <p className="mt-6 text-pretty text-base leading-relaxed text-muted-warm sm:text-lg">
            Every part of Bitify Music exists for a listening moment — the
            deep album session, the quick save, the song you need to replay
            right now.
          </p>
        </Reveal>

        {/* ---- lyrics spotlight ---- */}
        <div className="mt-20 grid items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div>
            <Reveal>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-crimson">
                The centrepiece
              </p>
              <h3 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-warm-white sm:text-4xl">
                Lyrics that lead the song.
              </h3>
              <p className="mt-5 text-pretty leading-relaxed text-muted-warm">
                Open the Now Playing view and the interface steps aside:
                album art on one side, word-synced lyrics on the other. The
                current line glows; the rest waits its turn. It turns passive
                listening into something closer to reading the song.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <ul className="mt-8 space-y-3">
                {[
                  "Word-by-word highlighting in the desktop Now Playing view",
                  "Karaoke-style synced lyrics on mobile",
                  "One tap from the player bar — no digging through menus",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted-warm">
                    <span
                      className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-crimson"
                      aria-hidden
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={0.08}>
            <div ref={shotRef} className="relative">
              <motion.div style={reduce ? undefined : { y: shotY }}>
                <WindowFrame>
                  <div className="relative aspect-[1600/897]">
                    <Image
                      src={SCREENSHOTS.tv.spotlight}
                      alt="Bitify Music — Now Playing with word-synced lyrics, the current line glowing as the song plays"
                      fill
                      sizes="(max-width: 1024px) 92vw, 58vw"
                      className="object-cover"
                    />
                  </div>
                </WindowFrame>
              </motion.div>
            </div>
          </Reveal>
        </div>

        {/* ---- tiles with screenshots ---- */}
        <div className="mt-24 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TILES.map((tile, i) => (
            <Reveal key={tile.title} delay={i * 0.06}>
              <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] transition-all duration-500 hover:-translate-y-1 hover:border-crimson/25 hover:bg-white/[0.035]">
                {/* hover glow */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-crimson/0 blur-2xl transition-all duration-700 group-hover:bg-crimson/15"
                />
                {/* real app screen inside the CSS phone */}
                <div className="relative flex h-[330px] items-center justify-center overflow-hidden border-b border-white/[0.06] bg-[radial-gradient(ellipse_75%_65%_at_50%_42%,rgba(224,57,62,0.08),transparent_72%)] pt-6">
                  <div className="transition-transform duration-700 ease-out group-hover:-translate-y-2 group-hover:scale-[1.03] [--pw:158px]">
                    <PhoneMockup
                      screen={tile.screen}
                      sizes="(max-width: 640px) 45vw, 158px"
                    />
                  </div>
                </div>
                {/* text */}
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.09] bg-white/[0.04] transition-colors duration-500 group-hover:border-crimson/40">
                    <tile.icon className="h-[18px] w-[18px] text-warm-white" aria-hidden />
                  </div>
                  <h3 className="mt-5 text-[15px] font-semibold tracking-wide text-warm-white">
                    {tile.title}
                  </h3>
                  <p className="mt-2.5 text-[13px] leading-relaxed text-muted-warm">
                    {tile.text}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
