"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Monitor, Smartphone, Tv, ArrowUpRight } from "lucide-react";
import { MonitorFrame } from "./devices/monitor-frame";
import { PhoneMockup } from "./devices/phone-mockup";
import { DeviceShotImage } from "./devices/device-shot";
import { Ambilight } from "./devices/ambilight";
import { Reveal } from "./reveal";
import { SCREENSHOTS, MOBILE_SCREENS, TV_SHOTS, type PlatformId } from "@/lib/site-config";
import { onPlatformSelect } from "@/lib/platform-events";
import { cn } from "@/lib/utils";

interface PlatformEntry {
  id: PlatformId;
  index: string;
  label: string;
  heading: string;
  description: string;
  href: string;
  icon: typeof Monitor;
}

const PLATFORMS: PlatformEntry[] = [
  {
    id: "desktop",
    index: "01",
    label: "Desktop",
    heading: "The full listening suite",
    description:
      "A complete library, persistent player controls and a full-screen Now Playing view — built for the way you work and listen.",
    href: "#desktop",
    icon: Monitor,
  },
  {
    id: "mobile",
    index: "02",
    label: "Mobile",
    heading: "Music that keeps up",
    description:
      "Listen Now picks, synced lyrics and one-tap likes — the essential Bitify experience, shaped for the phone in your pocket.",
    href: "#mobile",
    icon: Smartphone,
  },
  {
    id: "tv",
    index: "03",
    label: "TV",
    heading: "The living-room stage",
    description:
      "Your music, scaled up. The TV app brings Bitify's playback and library onto the biggest screen in your home.",
    href: "#tv",
    icon: Tv,
  },
];

export function Ecosystem() {
  const [active, setActive] = useState<PlatformId>("desktop");
  const reduce = useReducedMotion();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const current = PLATFORMS.find((p) => p.id === active)!;

  // external selection (Explore CTAs in other sections)
  useEffect(() => onPlatformSelect(setActive), []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, i: number) => {
      let next: number | null = null;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (i + 1) % PLATFORMS.length;
      if (e.key === "ArrowUp" || e.key === "ArrowLeft")
        next = (i - 1 + PLATFORMS.length) % PLATFORMS.length;
      if (e.key === "Home") next = 0;
      if (e.key === "End") next = PLATFORMS.length - 1;
      if (next !== null) {
        e.preventDefault();
        setActive(PLATFORMS[next].id);
        tabRefs.current[next]?.focus();
      }
    },
    []
  );

  return (
    <section
      id="ecosystem"
      aria-label="Cross-platform ecosystem"
      className="relative overflow-hidden border-t border-white/[0.05]"
    >
      <div
        aria-hidden
        className="absolute left-[-12%] bottom-[8%] -z-10 h-[420px] w-[420px] rounded-full bg-crimson/[0.05] blur-[110px]"
      />

      <div className="mx-auto max-w-[1200px] px-6 py-28 sm:py-36">
        <Reveal className="max-w-2xl">
          <p className="eyebrow flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-crimson/70" aria-hidden />
            The Ecosystem
          </p>
          <h2 className="mt-5 font-display text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-warm-white sm:text-5xl">
            One identity. Three experiences.
          </h2>
          <p className="mt-6 text-pretty text-base leading-relaxed text-muted-warm sm:text-lg">
            Select a screen to see how the same Bitify Music adapts to it.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          {/* ---- selector ---- */}
          <div
            role="tablist"
            aria-label="Choose a platform"
            aria-orientation="vertical"
            className="flex flex-col"
          >
            {PLATFORMS.map((p, i) => {
              const selected = active === p.id;
              return (
                <button
                  key={p.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  role="tab"
                  aria-selected={selected}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(p.id)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  className={cn(
                    "group relative border-t border-white/[0.08] py-6 text-left outline-offset-4 transition-colors duration-300 last:border-b sm:py-7",
                    selected ? "text-warm-white" : "text-muted-warm hover:text-warm-white"
                  )}
                >
                  {/* active indicator */}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-y-0 left-0 w-[3px] origin-top rounded-full bg-crimson transition-transform duration-500",
                      selected ? "scale-y-100" : "scale-y-0"
                    )}
                  />
                  <div className="flex items-center gap-4">
                    <p.icon
                      className={cn(
                        "h-5 w-5 transition-colors duration-300",
                        selected ? "text-crimson" : "text-white/30"
                      )}
                      aria-hidden
                    />
                    <span className="font-mono text-[10px] tracking-[0.3em] text-white/30">
                      {p.index}
                    </span>
                    <span className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                      {p.label}
                    </span>
                    <span
                      className={cn(
                        "ml-auto h-2 w-2 rounded-full transition-all duration-300",
                        selected
                          ? "bg-crimson shadow-[0_0_12px_rgba(224,57,62,0.9)]"
                          : "bg-white/15"
                      )}
                      aria-hidden
                    />
                  </div>

                  {/* accordion detail */}
                  <AnimatePresence initial={false}>
                    {selected && (
                      <motion.div
                        initial={reduce ? undefined : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduce ? undefined : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
                        className="overflow-hidden"
                      >
                        <h3 className="mt-4 pl-9 text-sm font-semibold tracking-wide text-warm-white">
                          {p.heading}
                        </h3>
                        <p className="mt-2 max-w-sm pl-9 text-[13px] leading-relaxed text-muted-warm">
                          {p.description}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-2 pl-9 text-[12px] font-semibold tracking-wide text-crimson-bright">
                          <a
                            href={p.href}
                            className="inline-flex items-center gap-1.5 underline-offset-4 hover:underline"
                            tabIndex={-1}
                          >
                            See the {p.label.toLowerCase()} experience
                            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                          </a>
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}
          </div>

          {/* ---- visual ---- */}
          <div
            className="relative flex min-h-[340px] items-center justify-center sm:min-h-[420px]"
            role="tabpanel"
            aria-label={`${current.label} preview`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={reduce ? undefined : { opacity: 0, y: 24, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, y: -16, scale: 0.99 }}
                transition={{ duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="w-full"
              >
                {active === "desktop" && (
                  <div className="mx-auto max-w-[560px]">
                    <MonitorFrame parallax={false}>
                      <Image
                        src={SCREENSHOTS.desktop.home}
                        alt="Bitify Music desktop application interface"
                        fill
                        sizes="(max-width: 1024px) 92vw, 560px"
                        className="object-cover object-top"
                      />
                    </MonitorFrame>
                    <div className="h-20" aria-hidden />
                  </div>
                )}

                {active === "mobile" && (
                  <div className="mx-auto flex h-[360px] items-center justify-center sm:h-[420px]">
                    {/* light pool behind the device */}
                    <div
                      aria-hidden
                      className="absolute left-1/2 top-1/2 -z-10 h-[60%] w-[55%] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-[radial-gradient(ellipse,rgba(224,57,62,0.12),transparent_70%)] blur-2xl"
                    />
                    <motion.div
                      animate={reduce ? undefined : { y: [0, -8, 0] }}
                      transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
                      className="[--pw:172px] sm:[--pw:198px]"
                    >
                      <PhoneMockup
                        screen={MOBILE_SCREENS.liked}
                        sizes="(max-width: 640px) 172px, 198px"
                      />
                    </motion.div>
                  </div>
                )}

                {active === "tv" && (
                  <div className="relative mx-auto w-full max-w-[620px]">
                    {/* ambilight — rear light strip behind the television */}
                    <Ambilight />
                    <DeviceShotImage
                      shot={TV_SHOTS.nowplaying}
                      fit="width"
                      sizes="(max-width: 1024px) 92vw, 620px"
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
