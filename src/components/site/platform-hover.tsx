"use client";

import { useCallback, useEffect, useRef } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { ArrowUpRight, Clock3 } from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem } from "./reveal";
import {
  WindowsGlyph,
  AppleGlyph,
  LinuxGlyph,
  AndroidGlyph,
  TvGlyph,
} from "./platform-icons";
import { LATEST_VERSIONS } from "@/lib/site-config";

/**
 * PlatformHover — the "pick your screen" wall near the bottom.
 *
 * Real platform glyphs, a cursor-following spotlight (--mx/--my), a
 * gentle 3D lean (--rx/--ry) and a five-bar equalizer that kicks in
 * underneath. Everything is tinted by the theme CSS vars, so the
 * ThemeSwitcher re-lights the wall instantly. Tilt is desktop-only
 * (fine pointers, motion allowed); on touch the cards tap straight
 * to Downloads.
 */

const CARDS = [
  {
    id: "desktop",
    Glyph: WindowsGlyph,
    subGlyphs: [AppleGlyph, LinuxGlyph],
    name: "PC / Desktop",
    tagline: "Windows · macOS · Linux",
    version: LATEST_VERSIONS.desktop,
    desc: "The full studio — persistent player bar, keyboard-first shortcuts and a fullscreen Now Playing built for losing yourself in an album.",
  },
  {
    id: "mobile",
    Glyph: AndroidGlyph,
    subGlyphs: [],
    name: "Mobile",
    tagline: "Android · ARM64",
    version: LATEST_VERSIONS.mobile,
    desc: "Pocket-sized player with one-handed controls, sing-along lyrics and Listen Together party queues that follow you anywhere.",
  },
  {
    id: "tv",
    Glyph: TvGlyph,
    subGlyphs: [],
    name: "TV",
    tagline: "Big screen · Remote-first",
    version: "Soon",
    desc: "Ten-foot design with huge artwork, an Up Next queue the whole room can see and karaoke nights on the biggest display you own.",
  },
] as const;

export function PlatformHover() {
  // tilt + spotlight only make sense with a real cursor
  const finePointer = useRef(false);
  useEffect(() => {
    finePointer.current = window.matchMedia("(pointer: fine)").matches;
  }, []);

  const onMove = useCallback((e: ReactPointerEvent<HTMLElement>) => {
    if (!finePointer.current) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
    el.style.setProperty("--ry", `${((px - 0.5) * 5).toFixed(2)}deg`);
    el.style.setProperty("--rx", `${((0.5 - py) * 5).toFixed(2)}deg`);
  }, []);

  const onLeave = useCallback((e: ReactPointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  }, []);

  return (
    <section
      id="everywhere"
      aria-label="Bitify Music on every screen — pick yours"
      className="relative overflow-hidden border-t border-white/[0.05]"
    >
      <div className="relative mx-auto max-w-[1200px] px-6 py-20 sm:py-24">
        {/* ---- header ---- */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">
            <span className="eyebrow-idx">08</span>
            Every Screen
          </p>
          <h2 className="mt-5 font-display text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-warm-white sm:text-5xl">
            Pick your <span className="text-crimson-bright">screen.</span>
          </h2>
          <p className="mt-6 text-pretty text-base leading-relaxed text-muted-warm sm:text-lg">
            One player, three stages. Run your cursor across them — each
            one lights up like its own rig.{" "}
            <span className="md:hidden">Tap a card to grab its build.</span>
          </p>
        </Reveal>

        {/* ---- the wall ---- */}
        <StaggerGroup className="mt-12 grid grid-cols-1 gap-4 sm:mt-14 md:grid-cols-3 md:gap-5">
          {CARDS.map((card) => {
            const Icon = card.Glyph;
            const soon = card.version === "Soon";
            return (
              <StaggerItem key={card.id} className="h-full">
                <a
                  href="#downloads"
                  aria-label={`Bitify Music for ${card.name} — jump to downloads`}
                  onPointerMove={onMove}
                  onPointerLeave={onLeave}
                  className="ph-card group relative flex h-full min-h-[300px] flex-col overflow-hidden rounded-[1.125rem] border border-white/[0.08] bg-white/[0.02] p-7 outline-offset-4 sm:p-8"
                >
                  {/* cursor spotlight */}
                  <span
                    aria-hidden
                    className="ph-spot pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />

                  {/* platform glyph — ignites on hover */}
                  <span
                    aria-hidden
                    className="flex items-center gap-2.5 text-warm-white"
                  >
                    <Icon className="size-7 transition-colors duration-300 group-hover:text-crimson-bright" />
                    {card.subGlyphs.map((G, i) => (
                      <G
                        key={i}
                        className="size-5 text-warm-white/50 transition-colors duration-300 group-hover:text-warm-white/80"
                      />
                    ))}
                  </span>

                  <h3 className="mt-6 font-display text-2xl font-semibold tracking-[-0.02em] text-warm-white">
                    {card.name}
                  </h3>
                  <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-warm">
                    {card.tagline}
                  </p>

                  <p className="mt-4 text-pretty text-sm leading-relaxed text-muted-warm">
                    {card.desc}
                  </p>

                  {/* equalizer — kicks in on hover */}
                  <span
                    aria-hidden
                    className="mt-5 flex h-4 items-end gap-[3px] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-active:opacity-100"
                  >
                    {[0, 1, 2, 3, 4].map((i) => (
                      <i
                        key={i}
                        className="eq-bar block h-full w-[3px] rounded-full bg-crimson-bright"
                        style={{ "--eq-i": i } as CSSProperties}
                      />
                    ))}
                  </span>

                  {/* footer row */}
                  <span className="mt-auto flex items-center justify-between pt-7">
                    {soon ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-crimson/35 bg-crimson/10 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-crimson-bright">
                        <Clock3 className="h-3 w-3" aria-hidden />
                        Coming soon
                      </span>
                    ) : (
                      <span className="rounded-full border border-white/[0.08] px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-warm">
                        {card.version}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-warm-white/80 transition-colors duration-300 group-hover:text-crimson-bright">
                      {soon ? "See status" : "Get it"}
                      <ArrowUpRight
                        className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </span>
                  </span>
                </a>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
