"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Check, Monitor, Smartphone, Tv } from "lucide-react";
import { Reveal } from "./reveal";
import { WindowFrame } from "./devices/window-frame";
import { PhoneMockup } from "./devices/phone-mockup";
import { DeviceShotImage } from "./devices/device-shot";
import { LiveVideo } from "./devices/live-video";
import {
  DESKTOP_SHOTS,
  LIVE_VIDEOS,
  MOBILE_SCREENS,
  TV_SHOTS,
  type MobileScreen,
} from "@/lib/site-config";
import { cn } from "@/lib/utils";

type Platform = "desktop" | "mobile" | "tv";

const PLATFORMS: {
  id: Platform;
  label: string;
  icon: typeof Monitor;
  title: string;
  text: string;
  bullets: string[];
}[] = [
  {
    id: "desktop",
    label: "Desktop",
    icon: Monitor,
    title: "A studio for your library",
    text: "The desktop app is where Bitify breathes — a persistent player bar, keyboard-first shortcuts and a full-screen Now Playing built for losing yourself in an album.",
    bullets: [
      "Persistent player bar with queue and history",
      "Keyboard shortcuts for every control",
      "Fullscreen Now Playing with synced lyrics",
    ],
  },
  {
    id: "mobile",
    label: "Mobile",
    icon: Smartphone,
    title: "Your music, in your pocket",
    text: "Quick picks, one-handed controls and a party mode that keeps everyone in the room in sync — the phone app goes wherever you do.",
    bullets: [
      "One-handed Now Playing and mini player",
      "Synced lyrics with Sing Along mode",
      "Listen Together party queues",
    ],
  },
  {
    id: "tv",
    label: "TV",
    icon: Tv,
    title: "Built for the big screen",
    text: "Ten-foot design with huge artwork, a queue the whole room can see and navigation made for a remote — press play from the couch.",
    bullets: [
      "Now Playing with word-synced lyrics",
      "Up Next queue with shuffle and autoplay",
      "Sing Along karaoke mode",
    ],
  },
];

const MOBILE_TAB: MobileScreen[] = [
  MOBILE_SCREENS.home,
  MOBILE_SCREENS.nowplaying,
  MOBILE_SCREENS.lyrics,
  MOBILE_SCREENS.singalong,
  MOBILE_SCREENS.explore,
  MOBILE_SCREENS.search,
];

const TV_TAB = [
  TV_SHOTS.nowplaying,
  TV_SHOTS.lyrics,
  TV_SHOTS.singalong,
  TV_SHOTS.upnext,
];

/* ---------------------------------------------------------------- */

function DesktopVisual() {
  const [active, setActive] = useState(0);
  const shot = DESKTOP_SHOTS[active];

  return (
    <div>
      <div className="relative">
        <WindowFrame key={shot.src}>
          <div className="shot-in">
            <Image
              src={shot.src}
              alt={shot.alt}
              width={shot.width}
              height={shot.height}
              sizes="(max-width: 1024px) 92vw, 620px"
              className="h-auto w-full select-none"
            />
          </div>
        </WindowFrame>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {DESKTOP_SHOTS.map((s, i) => (
          <button
            key={s.src}
            type="button"
            onClick={() => setActive(i)}
            aria-pressed={i === active}
            className="sc-thumb group"
          >
            <Image
              src={s.src}
              alt=""
              width={s.width}
              height={s.height}
              sizes="120px"
              className="h-11 w-auto object-cover"
            />
            <span className="sr-only">{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function MobileVisual() {
  const [active, setActive] = useState(0);
  const screen = MOBILE_TAB[active];

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div key={screen.src} className="shot-in [--pw:min(58vw,270px)]">
          <PhoneMockup
            screen={screen}
            sizes="(max-width: 1024px) 58vw, 270px"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
        {MOBILE_TAB.map((s, i) => (
          <button
            key={s.src}
            type="button"
            onClick={() => setActive(i)}
            aria-pressed={i === active}
            className="sc-thumb"
          >
            <Image
              src={s.src}
              alt=""
              width={720}
              height={1474}
              sizes="44px"
              placeholder="blur"
              blurDataURL={s.blur}
              className="h-14 w-auto object-cover"
            />
            <span className="sr-only">{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function TvVisual() {
  const [active, setActive] = useState(0);
  const [videoFailed, setVideoFailed] = useState(false);

  /* the live recording leads; if it can't load the stills take over */
  const items = useMemo<
    Array<
      | { kind: "live"; key: string }
      | { kind: "shot"; key: string; shot: (typeof TV_TAB)[number] }
    >
  >(() => {
    const list: Array<
      | { kind: "live"; key: string }
      | { kind: "shot"; key: string; shot: (typeof TV_TAB)[number] }
    > = [];
    if (!videoFailed) list.push({ kind: "live", key: "live" });
    TV_TAB.forEach((s) => list.push({ kind: "shot", key: s.src, shot: s }));
    return list;
  }, [videoFailed]);

  const current = items[Math.min(active, items.length - 1)];

  return (
    <div>
      <div className="relative">
        {current.kind === "live" ? (
          <div className="shot-in tv-live">
            <div className="tv-live-bezel">
              <LiveVideo
                src={LIVE_VIDEOS.tv.src}
                poster={LIVE_VIDEOS.tv.poster}
                alt={LIVE_VIDEOS.tv.alt}
                onError={() => setVideoFailed(true)}
              />
            </div>
            {/* pedestal — grounds the set on the desk */}
            <span className="tv-live-stand" aria-hidden />
          </div>
        ) : (
          <div key={current.shot.src} className="shot-in">
            <DeviceShotImage
              shot={current.shot}
              fit="width"
              sizes="(max-width: 1024px) 92vw, 620px"
            />
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {items.map((it, i) => (
          <button
            key={it.key}
            type="button"
            onClick={() => setActive(i)}
            aria-pressed={i === active}
            className={cn("sc-thumb", it.kind === "live" && "sc-thumb-live")}
          >
            {it.kind === "live" ? (
              <Image
                src={LIVE_VIDEOS.tv.poster}
                alt=""
                width={1280}
                height={820}
                sizes="110px"
                className="h-10 w-auto object-cover"
              />
            ) : (
              <Image
                src={it.shot.src}
                alt=""
                width={1600}
                height={912}
                sizes="110px"
                className="h-10 w-auto object-cover"
              />
            )}
            <span className="sr-only">
              {it.kind === "live" ? "Live recording" : it.shot.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */

export function Platforms() {
  const [tab, setTab] = useState<Platform>("desktop");
  const platform = PLATFORMS.find((p) => p.id === tab)!;

  return (
    <section
      id="screens"
      aria-label="Bitify Music on every screen"
      className="relative overflow-hidden"
    >
      <div className="mx-auto max-w-[1200px] px-6 py-24 sm:py-32">
        {/* ---- header: left-anchored, tabs ride along on desktop ---- */}
        <Reveal className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="eyebrow">
              <span className="eyebrow-idx">02</span>
              The Experience
            </p>
            <h2 className="mt-5 font-display text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-warm-white sm:text-5xl">
              One app. Three screens.
            </h2>
            <p className="mt-6 text-pretty text-base leading-relaxed text-muted-warm sm:text-lg">
              The same library, the same queue, the same lyrics — tuned for
              each screen it lands on. Pick one and look around.
            </p>
          </div>

          {/* ---- segmented tab control ---- */}
          <div
            role="tablist"
            aria-label="Choose a platform"
            className="flex w-max items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.03] p-1.5"
          >
            {PLATFORMS.map((p) => {
              const Icon = p.icon;
              const selected = tab === p.id;
              return (
                <button
                  key={p.id}
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`panel-${p.id}`}
                  id={`tab-${p.id}`}
                  type="button"
                  onClick={() => setTab(p.id)}
                  className="sc-tab"
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {p.label}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* ---- active panel ---- */}
        <div className="mt-14 sm:mt-16">
          <div
            role="tabpanel"
            id={`panel-${tab}`}
            aria-labelledby={`tab-${tab}`}
            className="grid items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16"
          >
            {/* copy */}
            <div className="order-2 lg:order-1">
              <h3 className="font-display text-balance text-3xl font-semibold leading-tight tracking-[-0.02em] text-warm-white sm:text-4xl">
                {platform.title}
              </h3>
              <p className="mt-5 text-pretty text-base leading-relaxed text-muted-warm">
                {platform.text}
              </p>
              <ul className="mt-7 space-y-3.5">
                {platform.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm text-warm-white/90 sm:text-[15px]">
                    <span
                      className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-crimson/30 bg-crimson/10"
                      aria-hidden
                    >
                      <Check className="h-3 w-3 text-crimson-bright" />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>

              <div className="mt-9 flex items-center gap-3">
                <a
                  href="#downloads"
                  className="btn-ghost inline-flex px-5 py-2.5 text-[13px]"
                >
                  Get Bitify for {platform.label}
                </a>
              </div>
            </div>

            {/* visual */}
            <div className="order-1 lg:order-2">
              {tab === "desktop" && <DesktopVisual />}
              {tab === "mobile" && <MobileVisual />}
              {tab === "tv" && <TvVisual />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
