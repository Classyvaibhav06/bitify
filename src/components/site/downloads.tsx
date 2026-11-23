"use client";

import { useEffect, useState } from "react";
import { Apple, ArrowDownToLine, Clock, Monitor, Smartphone, Terminal, Tv } from "lucide-react";
import { Reveal } from "./reveal";
import { PhoneMockup } from "./devices/phone-mockup";
import { DeviceShotImage } from "./devices/device-shot";
import { Ambilight } from "./devices/ambilight";
import { LaptopPhoto } from "./devices/laptop-photo";
import {
  DOWNLOADS,
  MOBILE_SCREENS,
  TV_SHOTS,
  type PlatformId,
} from "@/lib/site-config";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const PLATFORM_META: Record<
  PlatformId,
  {
    icon: typeof Monitor;
    note: string;
    tagline: string;
    title: string;
    text: string;
  }
> = {
  desktop: {
    icon: Monitor,
    note: "Windows portable · 64-bit",
    tagline: "For Windows",
    title: "Bitify for Desktop",
    text: "A full studio for your library — a persistent player bar, keyboard-first controls, and a Now Playing view built for losing yourself in an album.",
  },
  macos: {
    icon: Apple,
    note: "macOS · Apple Silicon (ARM64) · DMG",
    tagline: "For macOS",
    title: "Bitify for Mac",
    text: "Your library on Apple Silicon — the same synced lyrics, playlists and full-screen player, in a native macOS installer.",
  },
  linux: {
    icon: Terminal,
    note: "Linux x86_64 · tar.gz archive",
    tagline: "For Linux",
    title: "Bitify for Linux",
    text: "A standalone tarball for x86_64 Linux desktops — extract it and run Bitify with no package manager or install step.",
  },
  mobile: {
    icon: Smartphone,
    note: "Android APK · ARM64",
    tagline: "For Android",
    title: "Bitify for Mobile",
    text: "Your music in your pocket — quick picks, synced lyrics and a one-handed player that goes wherever you do.",
  },
  tv: {
    icon: Tv,
    note: "App for your television",
    tagline: "For Android TV & smart TVs",
    title: "Bitify for TV",
    text: "Bring the music to the biggest screen in the house — large artwork, a queue for the whole room, and navigation made for a remote.",
  },
};

/** Large device visual for each platform row. */
function PlatformVisual({ id }: { id: PlatformId }) {
  if (id === "desktop") {
    return (
      <div className="relative mx-auto w-full max-w-[640px]">
        {/* ambient pool — grounds the laptop on the dark stage */}
        <div aria-hidden className="dl-amb" />
        {/* the same photoreal studio laptop as the hero + desktop
            showcase (dead-on product pose), pre-rendered as a bitmap
            with the home screenshot baked onto the screen — one
            responsive image instead of the ~420-node vector render */}
        <LaptopPhoto
          pose="front-home"
          sizes="(max-width: 1023px) 88vw, 640px"
          alt="Bitify Music desktop interface — home view with the sidebar, player bar and browse grid"
        />
      </div>
    );
  }
  if (id === "mobile") {
    return (
      <div className="relative mx-auto flex h-[480px] items-center justify-center sm:h-[520px]">
        {/* light pool behind the phone */}
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 -z-10 h-[64%] w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-[radial-gradient(ellipse,rgba(224,57,62,0.16),rgba(139,92,246,0.05)_52%,transparent_74%)] blur-2xl"
        />
        {/* faint second phone behind for depth */}
        <div
          aria-hidden
          className="absolute right-[16%] top-[6%] rotate-[8deg] opacity-40 [--pw:118px] sm:right-[20%]"
        >
          <PhoneMockup screen={MOBILE_SCREENS.explore} glare={false} sizes="118px" />
        </div>
        <div className="relative rotate-[-2deg] [--pw:min(52vw,236px)]">
          <PhoneMockup
            screen={MOBILE_SCREENS.nowplaying}
            sizes="(max-width: 639px) 52vw, 236px"
          />
        </div>
      </div>
    );
  }
  if (id === "macos" || id === "linux") {
    const Icon = id === "macos" ? Apple : Terminal;
    const label = id === "macos" ? "macOS" : "Linux";
    const version = DOWNLOADS.find((d) => d.id === id)?.version ?? "Latest";
    return (
      <div className="relative mx-auto flex min-h-[320px] w-full max-w-[520px] items-center justify-center sm:min-h-[380px]">
        <div
          aria-hidden
          className="absolute inset-x-[12%] top-1/2 -z-10 h-[70%] -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(224,57,62,0.14),transparent_70%)] blur-2xl"
        />
        <div className="relative w-full overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.06] to-white/[0.015] p-8 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]">
          <div className="flex items-start justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/35">
              Bitify Music
            </span>
            <span className="rounded-full bg-crimson/15 px-2.5 py-1 font-mono text-[10px] text-crimson-bright">
              {version}
            </span>
          </div>
          <div className="mt-12 flex items-center gap-5">
            <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
              <Icon className="h-10 w-10 text-warm-white" aria-hidden />
            </span>
            <div>
              <p className="font-display text-4xl font-semibold text-warm-white">{label}</p>
              <p className="mt-1 text-sm text-muted-warm">
                {id === "macos" ? "Apple Silicon · DMG" : "x86_64 · tar.gz"}
              </p>
            </div>
          </div>
          <div className="mt-12 flex items-end gap-1.5" aria-hidden>
            {[28, 44, 64, 44, 28].map((h, i) => (
              <span key={i} className="w-1.5 rounded-full bg-crimson/60" style={{ height: h }} />
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="relative mx-auto w-full max-w-[620px]">
      {/* ambilight — rear light strip behind the television */}
      <Ambilight />
      <DeviceShotImage
        shot={TV_SHOTS.nowplaying}
        fit="width"
        sizes="(max-width: 1023px) 88vw, 620px"
      />
    </div>
  );
}

export function Downloads() {
  const { toast } = useToast();
  const [userOS, setUserOS] = useState<PlatformId | null>(null);

  // highlight the visitor's own platform — makes the right download obvious
  useEffect(() => {
    const ua = navigator.userAgent;
    if (/Android/i.test(ua)) setUserOS("mobile");
    else if (/Windows/i.test(ua)) setUserOS("desktop");
    else if (/Macintosh|Mac OS X/i.test(ua)) setUserOS("macos");
    else if (/Linux/i.test(ua)) setUserOS("linux");
  }, []);

  const notifyPending = (platform: string) => {
    toast({
      title: `${platform} download is coming soon`,
      description:
        "Official links will be published here at release. Check back shortly — the rest of the page shows what's waiting for you.",
    });
  };

  return (
    <section
      id="downloads"
      aria-label="Downloads"
      className="relative overflow-hidden border-t border-white/[0.05]"
    >
      {/* ambient — soft radial wash, no blur filter (cheaper on mobile) */}
      <div
        aria-hidden
        className="absolute left-1/2 top-0 -z-10 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(224,57,62,0.07),transparent_65%)]"
      />

      <div className="mx-auto max-w-[1200px] px-6 py-28 sm:py-36">
        {/* ---- header ---- */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow inline-flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-crimson/70" aria-hidden />
            Downloads
            <span className="inline-block h-px w-8 bg-crimson/70" aria-hidden />
          </p>
          <h2 className="mt-5 font-display text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-warm-white sm:text-5xl">
            Your next listening experience starts here.
          </h2>
          <p className="mt-6 text-pretty text-base leading-relaxed text-muted-warm sm:text-lg">
            Bitify Music is ready for every screen you own. Pick your platform
            below — each download installs the same Bitify experience, tuned
            for its device.
          </p>
        </Reveal>

        {/* ---- quick jump: keyboard/screen-reader friendly platform nav ---- */}
        <Reveal className="mt-12">
          <nav aria-label="Jump to a platform download" className="flex flex-wrap justify-center gap-2">
            {DOWNLOADS.map((dl) => {
              const Icon = PLATFORM_META[dl.id].icon;
              const recommended = dl.id === userOS;
              return (
                <a
                  key={dl.id}
                  href={`#download-${dl.id}`}
                  aria-label={`Jump to the ${dl.platform} download${recommended ? " (recommended for your device)" : ""}`}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson",
                    recommended
                      ? "border-crimson/50 bg-crimson/10 text-warm-white"
                      : "border-white/10 bg-white/[0.03] text-muted-warm hover:border-white/25 hover:text-warm-white"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden />
                  {dl.platform}
                  {recommended && (
                    <span className="rounded-full bg-crimson/20 px-1.5 py-0.5 font-mono text-[9px] uppercase text-crimson-bright">
                      Yours
                    </span>
                  )}
                </a>
              );
            })}
          </nav>
        </Reveal>

        {/* ---- one platform per row: visual on one side, download on the other ---- */}
        {DOWNLOADS.map((dl, i) => {
          const meta = PLATFORM_META[dl.id];
          const flip = i % 2 === 1; // alternate the visual side
          return (
            <div
              key={dl.id}
              id={`download-${dl.id}`}
              aria-label={`Download Bitify Music for ${dl.platform}`}
              className={cn(
                "scroll-mt-28 grid items-center gap-12 border-t border-white/[0.05] py-16 sm:py-20 lg:gap-16 lg:py-24",
                // desktop row: extra-wide visual column so the laptop
                // render reads large; other rows stay 50/50
                i === 0
                  ? "lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]"
                  : "lg:grid-cols-2",
                i === 0 && "border-t-0"
              )}
            >
              {/* visual column */}
              <Reveal
                y={40}
                className={cn("order-1", flip && "lg:order-2")}
              >
                <PlatformVisual id={dl.id} />
              </Reveal>

              {/* content column */}
              <Reveal
                delay={0.1}
                y={32}
                className={cn("order-2", flip && "lg:order-1")}
              >
                <div className="mx-auto max-w-[520px] lg:mx-0 lg:text-left">
                  <p className="eyebrow flex items-center gap-3">
                    <meta.icon className="h-4 w-4 text-crimson" aria-hidden />
                    {meta.tagline}
                  </p>

                  <h3 className="mt-4 font-display text-3xl font-semibold tracking-tight text-warm-white sm:text-4xl">
                    {meta.title}
                  </h3>

                  {dl.id === userOS && (
                    <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-crimson/40 bg-crimson/10 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-crimson-bright">
                      <span className="h-1.5 w-1.5 rounded-full bg-crimson" aria-hidden />
                      Recommended for your device
                    </p>
                  )}

                  <p className="mt-4 text-pretty text-base leading-relaxed text-muted-warm">
                    {meta.text}
                  </p>

                  {/* install steps */}
                  <ol
                    className="mt-8 space-y-3"
                    aria-label={`How to install on ${dl.platform}`}
                  >
                    {dl.installSteps.map((step, si) => (
                      <li
                        key={si}
                        className="flex items-start gap-3 text-[13px] leading-relaxed text-muted-warm"
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/[0.12] font-mono text-[10px] text-white/50">
                          {si + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>

                  {/* action + status */}
                  <div className="mt-9 flex flex-wrap items-center gap-4">
                    {dl.downloadUrl ? (
                      <a
                        href={dl.downloadUrl}
                        aria-label={`Download Bitify Music for ${dl.platform}, ${dl.version || "latest"}`}
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2.5 rounded-full bg-crimson px-7 py-3.5 text-sm font-semibold tracking-wide text-white shadow-[0_12px_40px_-8px_rgba(224,57,62,0.6)] transition-all duration-300 hover:scale-[1.02] hover:bg-crimson-bright hover:shadow-[0_16px_52px_-8px_rgba(224,57,62,0.75)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-crimson"
                      >
                        <ArrowDownToLine
                          className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5"
                          aria-hidden
                        />
                        Download for {dl.platform.split(" ")[0]}
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => notifyPending(dl.platform)}
                        className="group inline-flex cursor-pointer items-center gap-2.5 rounded-full bg-crimson px-7 py-3.5 text-sm font-semibold tracking-wide text-white shadow-[0_12px_40px_-8px_rgba(224,57,62,0.6)] transition-all duration-300 hover:scale-[1.02] hover:bg-crimson-bright hover:shadow-[0_16px_52px_-8px_rgba(224,57,62,0.75)]"
                      >
                        <Clock
                          className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12"
                          aria-hidden
                        />
                        Download coming soon
                      </button>
                    )}

                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em]",
                        dl.downloadUrl
                          ? "bg-crimson/15 text-crimson-bright"
                          : "border border-white/[0.08] bg-white/[0.03] text-white/40"
                      )}
                    >
                      {dl.downloadUrl ? (
                        dl.version || "Latest"
                      ) : (
                        <>
                          <Clock className="h-3 w-3" aria-hidden />
                          Link pending
                        </>
                      )}
                    </span>
                  </div>

                  <p className="mt-4 text-[12px] text-muted-warm/80">
                    {dl.requirements || meta.note}
                  </p>
                </div>
              </Reveal>
            </div>
          );
        })}

        <Reveal delay={0.15} className="mt-6 text-center">
          <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.22em] text-white/25">
            Download links are configured in one place —
            <span className="text-white/40"> src/lib/site-config.ts</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
