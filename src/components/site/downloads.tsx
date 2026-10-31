"use client";

import Image from "next/image";
import { ArrowDownToLine, Clock, Monitor, Smartphone, Tv } from "lucide-react";
import { Reveal } from "./reveal";
import { PhoneMockup } from "./devices/phone-mockup";
import { DeviceShotImage } from "./devices/device-shot";
import { Ambilight } from "./devices/ambilight";
import { MonitorFrame } from "./devices/monitor-frame";
import {
  DOWNLOADS,
  MOBILE_SCREENS,
  SCREENSHOTS,
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
    note: "Installer for your computer",
    tagline: "For Windows & macOS",
    title: "Bitify for Desktop",
    text: "A full studio for your library — a persistent player bar, keyboard-first controls, and a Now Playing view built for losing yourself in an album.",
  },
  mobile: {
    icon: Smartphone,
    note: "App for your phone",
    tagline: "For Android & iOS",
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
      <div className="relative mx-auto w-full max-w-[560px]">
        <MonitorFrame parallax={false}>
          <Image
            src={SCREENSHOTS.desktop.home}
            alt="Bitify Music desktop interface — home view with the sidebar, player bar and browse grid"
            fill
            sizes="(max-width: 1023px) 88vw, 560px"
            className="object-cover object-top"
          />
        </MonitorFrame>
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
      <div
        aria-hidden
        className="absolute left-1/2 top-0 -z-10 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(224,57,62,0.07),transparent_65%)] blur-[110px]"
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

        {/* ---- one platform per row: visual on one side, download on the other ---- */}
        {DOWNLOADS.map((dl, i) => {
          const meta = PLATFORM_META[dl.id];
          const flip = i % 2 === 1; // alternate the visual side
          return (
            <div
              key={dl.id}
              aria-label={`Download Bitify Music for ${dl.platform}`}
              className={cn(
                "grid items-center gap-12 border-t border-white/[0.05] py-16 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:py-24",
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
                        className="group inline-flex items-center gap-2.5 rounded-full bg-crimson px-7 py-3.5 text-sm font-semibold tracking-wide text-white shadow-[0_12px_40px_-8px_rgba(224,57,62,0.6)] transition-all duration-300 hover:scale-[1.02] hover:bg-crimson-bright hover:shadow-[0_16px_52px_-8px_rgba(224,57,62,0.75)]"
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
