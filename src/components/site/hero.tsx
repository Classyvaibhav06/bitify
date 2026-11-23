"use client";

import { useRef, type CSSProperties } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Apple, ChevronDown, Monitor, Smartphone, MonitorSmartphone, Terminal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Equalizer } from "./equalizer";
import { LaptopPhoto } from "./devices/laptop-photo";
import { DeviceShotImage } from "./devices/device-shot";
import { PhoneMockup } from "./devices/phone-mockup";
import { MOBILE_SCREENS, TV_SHOTS, DOWNLOADS } from "@/lib/site-config";

/** the hero's "Download for PC" CTA opens a chooser for the three desktop builds */
const DESKTOP_PLATFORMS = (["desktop", "macos", "linux"] as const)
  .map((id) => DOWNLOADS.find((d) => d.id === id))
  .filter((d): d is (typeof DOWNLOADS)[number] => Boolean(d?.downloadUrl));

const DESKTOP_ICONS: Record<string, typeof Monitor> = {
  desktop: Monitor,
  macos: Apple,
  linux: Terminal,
};
const DESKTOP_LABELS: Record<string, string> = {
  desktop: "Windows",
  macos: "macOS",
  linux: "Linux",
};
/** the hero's primary CTA downloads the Android APK from the real release URL */
const MOBILE_DOWNLOAD =
  DOWNLOADS.find((d) => d.id === "mobile")?.downloadUrl ?? "#downloads";

/**
 * Hero — a cinematic product shoot in CSS.
 *
 * One near-black stage, three real devices and a restrained lighting
 * rig. The laptop is the star of the composition: a photoreal,
 * camera-projected studio render (Gemini-authored chassis carrying the
 * real Bitify desktop screenshot) placed front-right, angled to face
 * the headline. The TV sits behind it, slightly left of center, adding
 * depth without competing; the phone stands to the left at a
 * believable size. The whole rig fades in on load (`.hero-fade`); only
 * the device backlights breathe afterwards, and three parallax layers
 * drift gently on scroll. Entrance animations stay pure CSS
 * (`.hero-rise*`) so the hero renders before hydration; framer-motion
 * only adds the parallax and idle floats.
 */
export function Hero() {
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start end", "end start"],
  });

  // layered parallax rates — minimal and restrained; the further
  // forward the layer, the gentle faster drift
  const tvY = useTransform(scrollYProgress, [0, 1], [-12, 26]);
  const laptopY = useTransform(scrollYProgress, [0, 1], [2, -16]);
  const phoneY = useTransform(scrollYProgress, [0, 1], [8, -28]);

  return (
    <section
      id="top"
      aria-label="Bitify Music — Your Music. Every Screen."
      className="grain relative overflow-hidden bg-[#080808]"
    >
      {/* ---- lighting rig: layered washes, fading in on load ---- */}
      <div
        aria-hidden
        className="hero-shell hero-fade absolute inset-0"
        style={{ "--d": "0.1s" } as CSSProperties}
      />
      <div
        aria-hidden
        className="hero-fade hairline-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_72%_60%_at_50%_36%,black,transparent)]"
        style={{ "--d": "0.35s", "--hero-fade-to": "0.4" } as CSSProperties}
      />
      {/* thin red light trails near the bottom edges */}
      <div
        aria-hidden
        className="hero-trail hero-trail-l hero-fade"
        style={{ "--d": "1.1s", "--hero-fade-to": "0.55" } as CSSProperties}
      />
      <div
        aria-hidden
        className="hero-trail hero-trail-r hero-fade"
        style={{ "--d": "1.25s", "--hero-fade-to": "0.55" } as CSSProperties}
      />

      <div className="relative z-10 mx-auto flex min-h-svh max-w-[1200px] flex-col items-center px-6 pb-16 pt-24 sm:pt-28">
        {/* ---- copy ---- */}
        <p
          className="hero-badge eyebrow flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-2"
          style={{ "--d": "0.05s" } as CSSProperties}
        >
          <Equalizer bars={5} className="h-4" />
          Introducing Bitify Music
        </p>

        <h1
          className="hero-rise mt-6 text-center font-display text-[clamp(2.9rem,7.5vw,5.75rem)] font-bold leading-[0.98] tracking-[-0.03em]"
          style={{ "--d": "0.16s" } as CSSProperties}
        >
          <span className="block text-warm-white">Your Music.</span>
          <span className="hero-outline block" aria-hidden>
            Every Screen.
          </span>
          <span className="sr-only">Every Screen.</span>
        </h1>

        <p
          className="hero-rise mt-5 max-w-xl text-pretty text-center text-base leading-relaxed text-muted-warm sm:text-lg"
          style={{ "--d": "0.3s" } as CSSProperties}
        >
          One seamless music experience across your desktop, mobile, and TV.
        </p>

        <div
          className="hero-rise mt-8 flex flex-col items-center gap-4 sm:flex-row"
          style={{ "--d": "0.44s" } as CSSProperties}
        >
          <a
            href={MOBILE_DOWNLOAD}
            className="group inline-flex items-center gap-2.5 rounded-full bg-crimson px-7 py-3.5 text-sm font-semibold tracking-wide text-white shadow-[0_12px_40px_-8px_rgba(240,50,60,0.6)] transition-all duration-300 hover:scale-[1.02] hover:bg-crimson-bright hover:shadow-[0_16px_52px_-8px_rgba(240,50,60,0.75)]"
          >
            <Smartphone className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" aria-hidden />
            Download for Android
          </a>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="group inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.04] px-7 py-3.5 text-sm font-semibold tracking-wide text-warm-white transition-all duration-300 hover:border-white/30 hover:bg-white/[0.07] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-crimson"
              >
                <MonitorSmartphone
                  className="h-4 w-4 text-muted-warm transition-colors group-hover:text-warm-white"
                  aria-hidden
                />
                Download for PC
                <ChevronDown className="h-3.5 w-3.5 text-muted-warm transition-transform duration-300 group-data-[state=open]:rotate-180" aria-hidden />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              sideOffset={10}
              className="w-[272px] rounded-2xl border border-white/10 bg-[#101013]/95 p-2 shadow-[0_20px_60px_-12px_rgba(0,0,0,0.9)] backdrop-blur-md"
            >
              <DropdownMenuLabel className="px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                Choose your desktop
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              {DESKTOP_PLATFORMS.map((dl) => {
                const Icon = DESKTOP_ICONS[dl.id] ?? Monitor;
                return (
                  <DropdownMenuItem key={dl.id} asChild>
                    <a
                      href={dl.downloadUrl ?? "#downloads"}
                      rel="noopener noreferrer"
                      aria-label={`Download Bitify Music for ${DESKTOP_LABELS[dl.id] ?? dl.platform}, ${dl.version}`}
                      className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 outline-none transition-colors focus:bg-white/[0.08] data-[highlighted]:bg-white/[0.08]"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                        <Icon className="h-4 w-4 text-crimson-bright" aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-warm-white">
                          {DESKTOP_LABELS[dl.id] ?? dl.platform}
                        </span>
                        <span className="block truncate text-[11px] text-muted-warm">
                          {dl.requirements}
                        </span>
                      </span>
                      <span className="font-mono text-[10px] text-white/40">{dl.version}</span>
                    </a>
                  </DropdownMenuItem>
                );
              })}
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem asChild>
                <a
                  href="#downloads"
                  className="flex cursor-pointer items-center justify-center rounded-xl px-3 py-2 text-xs font-medium text-muted-warm outline-none transition-colors hover:text-warm-white focus:bg-white/[0.08] data-[highlighted]:bg-white/[0.08]"
                >
                  See all downloads
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* ---- device stage — the laptop leads from the right, the TV
              adds depth behind-left, the phone stands clear to the left ---- */}
        <div
          ref={stageRef}
          className="relative mt-12 h-[440px] w-full max-w-[1040px] sm:h-[520px] lg:h-[550px]"
          aria-label="Bitify Music running on a TV, laptop and smartphone"
        >
          {/* TV — real photo cutout, rearmost layer, lit from behind */}
          <motion.div
            style={reduce ? undefined : { y: tvY }}
            className="absolute left-[42%] top-0 w-[80%] -translate-x-1/2 sm:w-[64%] lg:w-[58%]"
          >
            <div
              className="hero-rise-stage relative"
              style={{ "--d": "0.5s" } as CSSProperties}
            >
              {/* backlight — warm key light + crimson wash behind the panel */}
              <div aria-hidden className="hero-tv-backlight" />
              {/* warm-white rim + crimson glow tracing the real bezel */}
              <div className="hero-tv-light">
                <DeviceShotImage
                  shot={TV_SHOTS.nowplaying}
                  priority
                  fit="width"
                  sizes="(max-width: 640px) 80vw, 62vw"
                />
              </div>
              {/* contact shadow + light pool under the stand */}
              <div aria-hidden className="hero-tv-floor" />
            </div>
          </motion.div>

          {/* laptop — the hero device: the same photoreal studio render
              as a pre-rendered bitmap (pixel-identical to the vector
              version, but a single responsive image instead of ~420 DOM
              nodes + SVG filters), front-right, angled to face the
              headline. Fills ~66% of the wrapper's width, ~80% height. */}
          <motion.div
            style={reduce ? undefined : { y: laptopY }}
            className="pointer-events-none absolute bottom-[-6%] right-[-8%] w-[100%] sm:bottom-[-6%] sm:right-[-4%] sm:w-[88%] lg:bottom-[-8%] lg:right-[-2%] lg:w-[84%]"
          >
            <div
              className="hero-rise-stage"
              style={{ "--d": "0.64s" } as CSSProperties}
            >
              <motion.div
                animate={reduce ? undefined : { y: [0, -4, 0] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                {/* ambient pool — grounds the render, separates it
                    from the TV artwork behind */}
                <div aria-hidden className="hero-laptop-amb" />
                <LaptopPhoto
                  pose="hero"
                  priority
                  sizes="(max-width: 640px) 90vw, 1080px"
                  alt="Bitify Music desktop application — home view with library and player"
                />
              </motion.div>
            </div>
          </motion.div>

          {/* phone — front-left, realistic size, clear of the laptop */}
          <motion.div
            style={reduce ? undefined : { y: phoneY }}
            className="absolute bottom-[1%] left-[1%] sm:bottom-[2%] sm:left-[5%] lg:bottom-[2%] lg:left-[4%]"
          >
            <div
              className="hero-rise-stage hero-rise-rotate relative"
              style={{ "--d": "0.78s" } as CSSProperties}
            >
              <motion.div
                animate={reduce ? undefined : { y: [0, -8, 0] }}
                transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
                className="rotate-[-3deg] [--pw:100px] sm:[--pw:160px] lg:[--pw:190px]"
              >
                <div className="relative">
                  {/* controlled red glow hugging the phone */}
                  <div aria-hidden className="phone-glow" />
                  {/* delicate warm-white rim on the body */}
                  <div className="hero-phone-rim">
                    <PhoneMockup
                      screen={MOBILE_SCREENS.nowplaying}
                      priority
                      sizes="(max-width: 640px) 100px, 190px"
                    />
                  </div>
                  {/* contact shadow + red pool on the floor */}
                  <div aria-hidden className="hero-phone-shadow" />
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* stage floor — muted red & warm-white reflections under the devices */}
          <div aria-hidden className="hero-floor" />
        </div>
      </div>

      {/* fade into next section */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background"
      />
    </section>
  );
}
