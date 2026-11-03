"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { StudioLaptopStage } from "./devices/studio-laptop/studio-laptop-stage";
import { FRONT_CAMERA } from "./devices/studio-laptop/studio-laptop-render";
import { Reveal } from "./reveal";
import { DESKTOP_NAV_ITEMS, SCREENSHOTS } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { selectPlatform } from "@/lib/platform-events";
import { useHydrated } from "@/lib/use-hydrated";

const LIVE = {
  id: "live",
  label: "Live",
  video: "/assets/desktop/desktop-nowplaying-live.mp4",
  poster: "/assets/desktop/desktop-nowplaying-live.webp",
  alt: "Bitify Music desktop app — live recording of the full-screen Now Playing view with synced lyrics",
} as const;

const VIEWS = [
  {
    id: "home",
    label: "Home",
    src: SCREENSHOTS.desktop.home,
    alt: "Bitify Music desktop app — home view with the sidebar, player bar and browse grid",
  },
  {
    id: "library",
    label: "Library",
    src: SCREENSHOTS.desktop.library,
    alt: "Bitify Music desktop app — library view with playlists and listening stats",
  },
  {
    id: "lyrics",
    label: "Now Playing",
    src: SCREENSHOTS.desktop.lyrics,
    alt: "Bitify Music desktop app — expanded Now Playing view with album art and synced lyrics",
  },
] as const;

type ViewId = (typeof VIEWS)[number]["id"] | (typeof LIVE)["id"];

/**
 * Real-time screen recording of the desktop app, looping silently.
 * Pauses whenever the laptop screen leaves the viewport or the tab
 * is hidden, so it never burns CPU/bandwidth in the background.
 *
 * Lives inside the laptop's 1403x930 projected screen surface, which
 * the browser renders at ~45% scale — so badge metrics are authored
 * in screen pixels (~2.15x) to land at the same visual size they had
 * on the old monitor mockup.
 */
function LiveNowPlayingVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let inView = true;

    const sync = () => {
      if (inView && !document.hidden) {
        video.play().catch(() => {
          /* autoplay refused — the poster frame stays until user interacts */
        });
      } else {
        video.pause();
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? true;
        sync();
      },
      { threshold: 0.25 }
    );
    io.observe(video);

    const onVisibility = () => sync();
    document.addEventListener("visibilitychange", onVisibility);

    sync();

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className="absolute inset-0 bg-black">
      <video
        ref={videoRef}
        src={LIVE.video}
        className="h-full w-full select-none object-cover object-center"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={LIVE.poster}
        disablePictureInPicture
        controlsList="nodownload"
        draggable={false}
        aria-label={LIVE.alt}
      />
      {/* live badge — authored in laptop-screen pixels (1403px surface,
          rendered ~45% — matches the old monitor badge visually) */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-8 top-8 z-10 flex items-center gap-3 rounded-full border border-crimson/40 bg-black/55 px-6 py-3 backdrop-blur-sm"
      >
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-crimson-bright opacity-70" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-crimson-bright" />
        </span>
        <span className="font-mono text-[19px] font-medium uppercase tracking-[0.28em] text-white/85">
          Live recording
        </span>
      </div>
    </div>
  );
}

export function DesktopExperience() {
  const [active, setActive] = useState<ViewId>("live");
  const reduce = useReducedMotion();
  // SSR-safe: first view renders visible; only tab switches animate in.
  const mounted = useHydrated();
  const current = VIEWS.find((v) => v.id === active);

  return (
    <section
      id="desktop"
      aria-label="Desktop experience"
      className="relative overflow-hidden border-t border-white/[0.05]"
    >
      {/* ambient */}
      <div
        aria-hidden
        className="absolute right-[-10%] top-[10%] -z-10 h-[480px] w-[480px] rounded-full bg-crimson/[0.05] blur-[120px]"
      />

      <div className="mx-auto grid max-w-[1200px] gap-16 px-6 py-28 sm:py-36 lg:grid-cols-[minmax(0,4.6fr)_minmax(0,7.4fr)] lg:gap-12">
        {/* ---- editorial column ---- */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <p className="eyebrow flex items-center gap-3">
              <span className="inline-block h-px w-8 bg-crimson/70" aria-hidden />
              Desktop Experience
            </p>
            <h2 className="mt-5 font-display text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-warm-white sm:text-5xl">
              Your desktop. Your soundtrack.
            </h2>
            <p className="mt-6 text-pretty text-base leading-relaxed text-muted-warm sm:text-lg">
              The desktop app is where deep listening lives — a full library,
              a persistent player bar, and a Now Playing view built for losing
              yourself in an album.
            </p>
          </Reveal>

          {/* real sidebar navigation, mirrored from the app */}
          <Reveal delay={0.1} className="mt-9">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">
              Always one click away
            </p>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Bitify Music sidebar sections">
              {DESKTOP_NAV_ITEMS.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-white/[0.09] bg-white/[0.03] px-3.5 py-1.5 text-[12px] font-medium text-muted-warm transition-colors duration-300 hover:border-crimson/40 hover:text-warm-white"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.16} className="mt-10">
            <button
              type="button"
              onClick={() => selectPlatform("desktop")}
              className="group inline-flex items-center gap-2.5 text-sm font-semibold tracking-wide text-crimson-bright transition-colors hover:text-warm-white"
            >
              Explore Desktop
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              />
            </button>
          </Reveal>
        </div>

        {/* ---- laptop showcase — the same photoreal studio render as
              the hero, posed dead-on (FRONT_CAMERA); the view switcher
              drives its screen: live recording + real app views ---- */}
        <div className="relative">
          {/* ambient pool — grounds the render on the dark stage */}
          <div aria-hidden className="dl-amb" />
          <Reveal delay={0.05}>
            <StudioLaptopStage camera={FRONT_CAMERA} className="w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={mounted && !reduce ? { opacity: 0, scale: 1.015 } : false}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  {active === "live" ? (
                    <LiveNowPlayingVideo />
                  ) : (
                    current && (
                      <Image
                        src={current.src}
                        alt={current.alt}
                        fill
                        sizes="(max-width: 1024px) 190px, 380px"
                        className="object-cover object-center"
                      />
                    )
                  )}
                </motion.div>
              </AnimatePresence>
            </StudioLaptopStage>
          </Reveal>

          {/* view switcher */}
          <Reveal delay={0.12} className="mt-6 sm:mt-8">
            <div
              role="tablist"
              aria-label="Desktop app views"
              className="flex flex-wrap items-center gap-2"
            >
              {[LIVE, ...VIEWS].map((view) => (
                <button
                  key={view.id}
                  role="tab"
                  aria-selected={active === view.id}
                  onClick={() => setActive(view.id)}
                  className={cn(
                    "rounded-full px-4 py-2 text-[12px] font-semibold tracking-wide transition-all duration-300",
                    active === view.id
                      ? "bg-crimson text-white shadow-[0_8px_24px_-6px_rgba(224,57,62,0.55)]"
                      : "border border-white/[0.09] text-muted-warm hover:border-white/25 hover:text-warm-white"
                  )}
                >
                  <span className="inline-flex items-center gap-2">
                    {view.id === "live" && (
                      <span className="relative flex h-1.5 w-1.5" aria-hidden>
                        <span
                          className={cn(
                            "absolute inline-flex h-full w-full animate-ping rounded-full opacity-60",
                            active === "live" ? "bg-white" : "bg-crimson-bright"
                          )}
                        />
                        <span
                          className={cn(
                            "relative inline-flex h-1.5 w-1.5 rounded-full",
                            active === "live" ? "bg-white" : "bg-crimson-bright"
                          )}
                        />
                      </span>
                    )}
                    {view.label}
                  </span>
                </button>
              ))}
              <span
                className={cn(
                  "ml-auto hidden font-mono text-[10px] uppercase tracking-[0.25em] sm:block",
                  active === "live" ? "text-crimson-bright/70" : "text-white/25"
                )}
              >
                {active === "live" ? "Real-time app recording" : "Actual app interface"}
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
