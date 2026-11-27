import type { CSSProperties } from "react";
import { Play } from "lucide-react";
import { OsDownloadButton } from "./os-download-button";
import { HeroStage } from "./hero-stage";
import { KineticWord } from "./kinetic-word";
import { PlatformGlyphRow } from "./platform-icons";
import { LATEST_VERSIONS } from "@/lib/site-config";

/**
 * Hero — the living product stage.
 *
 * Editorial, centered once and only once: a tight grotesque headline
 * with one italic serif accent word, a single specific sentence, two
 * precise CTAs and a muted glyph row of every platform. Below it, the
 * real app window (HeroStage) cycles the latest desktop captures with
 * a phone tucked into the corner. No orbiting callout chips, no
 * made-up stats — the product does the talking.
 */
export function Hero() {
  return (
    <section
      id="top"
      aria-label="Bitify Music — Your Music. Every Screen."
      className="relative overflow-hidden bg-background"
    >
      {/* ---- ambience: drifting aurora washes (crimson / gold / violet),
           a restrained dot grid and one crimson stage wash further down ---- */}
      <div className="aurora-hero" aria-hidden>
        <i className="aurora-blob aurora-1" />
        <i className="aurora-blob aurora-2" />
        <i className="aurora-blob aurora-3" />
      </div>
      <div
        aria-hidden
        className="dot-grid absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_70%_55%_at_50%_36%,black,transparent)]"
      />
      <div aria-hidden className="hero-top-glow" />
      <div aria-hidden className="hero-stage-glow" />

      <div className="relative z-10 mx-auto flex max-w-[1200px] flex-col items-center px-6 pb-24 pt-28 sm:pt-44">
        {/* ---- version note ---- */}
        <p
          className="hin inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.02] px-4 py-1.5 text-[12px] font-medium tracking-wide text-warm-white/70"
          style={{ "--d": "0.05s" } as CSSProperties}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-crimson-bright opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-crimson-bright" />
          </span>
          {LATEST_VERSIONS.desktop} — Windows · Mac · Linux
        </p>

        {/* ---- headline — the accent word flips through every screen ---- */}
        <h1
          aria-label="Your music, every screen."
          className="hin mt-8 text-center font-display text-[clamp(3rem,8.4vw,6.25rem)] font-bold leading-[0.98] tracking-[-0.045em]"
          style={{ "--d": "0.16s" } as CSSProperties}
        >
          <span className="block text-warm-white">Your music,</span>
          <span className="block text-warm-white">
            every <KineticWord />
            <span className="sr-only">screen.</span>
          </span>
        </h1>

        <p
          className="hin mt-7 max-w-[30rem] text-pretty text-center text-base leading-relaxed text-muted-warm sm:text-lg"
          style={{ "--d": "0.28s" } as CSSProperties}
        >
          The same library, the same queue, the same synced lyrics — on your PC,
          your phone and your TV. Pick up any screen and press play.
        </p>

        {/* ---- CTAs ---- */}
        <div
          className="hin mt-10 flex flex-col items-center gap-3.5 sm:flex-row"
          style={{ "--d": "0.4s" } as CSSProperties}
        >
          <OsDownloadButton />
          <a
            href="#showcase"
            className="btn-ghost inline-flex px-7 py-3.5 text-sm"
          >
            <Play className="h-4 w-4 text-crimson-bright" aria-hidden />
            See it in action
          </a>
        </div>

        {/* ---- platform row — real glyphs, quiet ink ---- */}
        <div
          className="hin mt-9 flex justify-center"
          style={{ "--d": "0.5s" } as CSSProperties}
        >
          <PlatformGlyphRow />
        </div>

        {/* ---- product stage ---- */}
        <div
          className="hin relative mt-20 w-full max-w-[900px]"
          style={{ "--d": "0.6s" } as CSSProperties}
          aria-label="Bitify Music running on desktop and phone"
        >
          <HeroStage />
        </div>
      </div>

      {/* fade into next section */}
      <div aria-hidden className="hero-floor-fade" />
    </section>
  );
}
