"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  ArrowDownToLine,
  BarChart3,
  Library,
  Repeat2,
} from "lucide-react";
import { Reveal } from "./reveal";
import { WindowFrame } from "./devices/window-frame";
import { SCREENSHOTS } from "@/lib/site-config";

const TILES = [
  {
    icon: Library,
    title: "A library that's yours",
    text: "Liked Music, playlists and collections — organized the way you listen, not the way an algorithm thinks.",
  },
  {
    icon: ArrowDownToLine,
    title: "Offline & local files",
    text: "Downloads and Local Music are first-class citizens in the sidebar. Your files, your library, one place.",
  },
  {
    icon: BarChart3,
    title: "Your listening, measured",
    text: "A dedicated panel turns minutes, plays and top artists into a story of what your year sounded like.",
  },
  {
    icon: Repeat2,
    title: "Playback, fully controlled",
    text: "Shuffle, repeat, queue and volume — every playback control stays within reach of the player bar.",
  },
] as const;

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
      <div
        aria-hidden
        className="absolute right-[-8%] top-[30%] -z-10 h-[420px] w-[420px] rounded-full bg-violet-glow/[0.05] blur-[110px]"
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
                  <div className="relative aspect-[1405/931]">
                    <Image
                      src={SCREENSHOTS.desktop.lyrics}
                      alt="Bitify Music — Now Playing view with album artwork and word-synced lyrics"
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

        {/* ---- tiles ---- */}
        <div className="mt-24 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TILES.map((tile, i) => (
            <Reveal key={tile.title} delay={i * 0.06}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] p-7 transition-all duration-500 hover:-translate-y-1 hover:border-crimson/25 hover:bg-white/[0.035]">
                {/* hover glow */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-crimson/0 blur-2xl transition-all duration-700 group-hover:bg-crimson/15"
                />
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.09] bg-white/[0.04] transition-colors duration-500 group-hover:border-crimson/40">
                  <tile.icon className="h-5 w-5 text-warm-white" aria-hidden />
                </div>
                <h3 className="mt-6 text-[15px] font-semibold tracking-wide text-warm-white">
                  {tile.title}
                </h3>
                <p className="mt-2.5 text-[13px] leading-relaxed text-muted-warm">
                  {tile.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
