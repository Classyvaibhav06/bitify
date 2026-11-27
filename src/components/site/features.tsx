import Image from "next/image";
import {
  BarChart3,
  Cast,
  RefreshCw,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "./reveal";
import { Spotlight } from "./spotlight";

/**
 * Features — the album spread.
 *
 * The flagship lyrics centrepiece (the real desktop Now Playing capture,
 * aspect-locked so nothing is cropped) sits left like the album art; the
 * capabilities run down the right as a set list — one surface, five
 * tracks, hairline dividers that sweep crimson on hover. No grid of
 * identical tiles: the composition reads like a vinyl back-cover, not a
 * template. Pure CSS hover states; no scroll-linked animation so the
 * panel stays cheap on mobile.
 */
const CELLS: {
  icon: LucideIcon;
  title: string;
  text: string;
  tag: string;
  live?: boolean;
}[] = [
  {
    icon: Users,
    title: "Listen Together",
    text: "One queue for the whole room — friends join your party and the music stays in sync for everyone.",
    tag: "Party queue",
    live: true,
  },
  {
    icon: BarChart3,
    title: "Stats that matter",
    text: "Scrobbles to Last.fm and ListenBrainz, streaks, and listening insights you'll actually revisit.",
    tag: "Last.fm · ListenBrainz",
  },
  {
    icon: RefreshCw,
    title: "One library everywhere",
    text: "Your playlists, likes and history follow you — from the desk, to the couch, to the commute.",
    tag: "Cloud sync",
  },
  {
    icon: Cast,
    title: "Cast & car ready",
    text: "Throw music to Chromecast speakers, or take it on the road with Android Auto built in.",
    tag: "Cast · Android Auto",
  },
  {
    icon: ShieldCheck,
    title: "Free & private",
    text: "No account walls, no trackers, no ads. Your listening history stays on your devices.",
    tag: "No account needed",
  },
];

export function Features() {
  return (
    <section
      id="features"
      aria-label="Features"
      className="relative border-t border-white/[0.05]"
    >
      <div aria-hidden className="ambient-top" />
      <div className="relative mx-auto max-w-[1200px] px-6 py-24 sm:py-32">
        {/* ---- header ---- */}
        <Reveal className="max-w-2xl">
          <p className="eyebrow">
            <span className="eyebrow-idx">03</span>
            Features
          </p>
          <h2 className="mt-5 font-display text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-warm-white sm:text-5xl">
            Built for people who{" "}
            <span className="text-crimson-bright">live</span> in their music.
          </h2>
          <p className="mt-6 text-pretty text-base leading-relaxed text-muted-warm sm:text-lg">
            Every feature is already in the box — no plugins, no pro tier, no
            setup guides.
          </p>
        </Reveal>

        {/* ---- the album spread ---- */}
        <div className="mt-14 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-12">
          {/* lyrics centrepiece — the album art. Aspect-locked to the real
              capture so the full screen is always visible; a gold-foil
              hairline crowns the flagship card. */}
          <Reveal className="lg:col-span-7" y={20}>
            <Spotlight className="h-full rounded-[1.125rem]" radius={420}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.125rem] border border-white/[0.09] bg-[#0b0b0e]">
                {/* faint accent underglow so the panel sits on light, not floats */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_60%_80%_at_50%_0%,rgb(var(--acc-rgb)/0.06),transparent_70%)]"
                />
                {/* gold-foil crown — the flagship edge */}
                <span
                  aria-hidden
                  className="gold-rule absolute inset-x-8 top-0 z-[2]"
                />
                <div className="relative aspect-[1497/968] overflow-hidden">
                  <Image
                    src="/assets/desktop/desktop-lyrics.webp"
                    alt="Bitify Music desktop app — Now Playing with word-synced karaoke lyrics"
                    fill
                    sizes="(max-width: 1024px) 92vw, 680px"
                    className="select-none object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-7 sm:p-9">
                  <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-crimson-bright">
                    Now Playing
                  </p>
                  <h3 className="mt-4 max-w-md font-display text-balance text-2xl font-semibold leading-tight tracking-[-0.02em] text-warm-white sm:text-3xl">
                    Lyrics that move with the music
                  </h3>
                  <p className="mt-3 max-w-md text-pretty text-sm leading-relaxed text-muted-warm sm:text-[15px]">
                    Word-by-word synced lyrics on every screen — translate them
                    on the fly, or switch to Sing Along and let the room take
                    the chorus.
                  </p>
                </div>
              </article>
            </Spotlight>
          </Reveal>

          {/* the set list — five tracks on one surface */}
          <Reveal className="lg:col-span-5" delay={0.08} y={20}>
            <div className="flex h-full flex-col rounded-[1.125rem] border border-white/[0.07] bg-[linear-gradient(180deg,rgba(244,241,236,0.024),rgba(244,241,236,0.006))] p-2 sm:p-3">
              {/* list header — reads like a record label */}
              <div className="flex items-baseline justify-between px-4 pb-1 pt-3.5">
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.28em] text-white/35">
                  The set list
                </p>
                <p className="font-mono text-[10px] tabular-nums text-white/25">
                  {String(CELLS.length).padStart(2, "0")} tracks
                </p>
              </div>

              <ul className="flex flex-1 flex-col">
                {CELLS.map((cell, i) => {
                  const Icon = cell.icon;
                  return (
                    <li key={cell.title} className="feat-row group">
                      <span className="feat-idx" aria-hidden>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-display text-[15px] font-semibold tracking-[-0.01em] text-warm-white">
                          {cell.title}
                          {cell.live && (
                            <span className="feat-live">
                              <i aria-hidden />
                              Live
                            </span>
                          )}
                        </h3>
                        <p className="mt-1.5 text-pretty text-[13px] leading-relaxed text-muted-warm">
                          {cell.text}
                        </p>
                        <p className="feat-tag mt-2">{cell.tag}</p>
                      </div>
                      <span className="feat-ic" aria-hidden>
                        <Icon className="h-[17px] w-[17px]" />
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
