"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDownToLine, Clock3 } from "lucide-react";
import { Reveal } from "./reveal";
import {
  WindowsGlyph,
  AppleGlyph,
  LinuxGlyph,
  AndroidGlyph,
  TvGlyph,
} from "./platform-icons";
import {
  DOWNLOADS,
  OS_META,
  OS_STEPS,
  type DesktopOs,
  type OsBuild,
} from "@/lib/site-config";
import { desktopTabFor, useOs, type DetectedOs } from "@/hooks/use-os";
import { useToast } from "@/hooks/use-toast";
import { Spotlight } from "./spotlight";

/* ------------------------------------------------------------------ */
/*  Desktop card — OS tab switcher with auto-detect + arch chips      */
/* ------------------------------------------------------------------ */

const OS_ICONS: Record<DesktopOs, typeof WindowsGlyph> = {
  windows: WindowsGlyph,
  macos: AppleGlyph,
  linux: LinuxGlyph,
};

const OS_TEXT: Record<DesktopOs, string> = {
  windows:
    "A full studio for your library — persistent player bar, keyboard-first controls and a Now Playing view built for albums.",
  macos:
    "Native on Apple Silicon and Intel Macs — the full Bitify studio with a player bar and a Now Playing view built for albums.",
  linux:
    "The whole Bitify experience on your distro — lightweight, keyboard-first and right at home on the terminal.",
};

function DesktopCard({ detected }: { detected: DetectedOs }) {
  const desktop = DOWNLOADS.find((d) => d.id === "desktop")!;
  const detectedTab = desktopTabFor(detected);
  const [os, setOs] = useState<DesktopOs>("windows");
  const [arch, setArch] = useState<string>("");

  // once the client resolves the visitor's OS, auto-select that tab
  useEffect(() => {
    setOs(detectedTab);
  }, [detectedTab]);

  const osBuilds = useMemo(
    () => desktop.builds.filter((b) => b.os === os),
    [desktop.builds, os],
  );

  // keep a valid arch selection whenever the OS tab changes
  useEffect(() => {
    setArch((current) =>
      osBuilds.some((b) => b.arch === current)
        ? current
        : (osBuilds[0]?.arch ?? ""),
    );
  }, [osBuilds]);

  const build: OsBuild | undefined =
    osBuilds.find((b) => b.arch === arch) ?? osBuilds[0];

  return (
    <Spotlight className="rounded-[1.125rem]">
      <article className="glass-card flex h-full flex-col p-6 sm:p-7">
        {/* head — the tile mirrors the selected OS as you switch tabs */}
        <div className="flex items-start justify-between gap-3">
          <span className="icon-tile">
            <OsIcon os={os} className="h-5 w-5" aria-hidden />
          </span>
          <span className="premium-chip rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em]">
            {desktop.version}
          </span>
        </div>

        <h3 className="mt-5 font-display text-xl font-semibold tracking-[-0.02em] text-warm-white">
          Bitify for Desktop
        </h3>

        {/* ---- OS tabs ---- */}
        <div
          role="tablist"
          aria-label="Choose your operating system"
          className="mt-4 grid grid-cols-3 gap-1.5 rounded-2xl border border-white/[0.07] bg-black/25 p-1.5"
        >
          {(Object.keys(OS_META) as DesktopOs[]).map((tabOs) => {
            const TabIcon = OS_ICONS[tabOs];
            const selected = os === tabOs;
            return (
              <button
                key={tabOs}
                type="button"
                role="tab"
                aria-selected={selected}
                data-detected={tabOs === detectedTab ? "true" : "false"}
                onClick={() => setOs(tabOs)}
                className="os-tab"
              >
                <TabIcon className="hidden h-4 w-4 sm:block" aria-hidden />
                {/* short label below sm so nothing ever truncates */}
                <span className="sm:hidden">{OS_META[tabOs].short}</span>
                <span className="hidden sm:inline">{OS_META[tabOs].label}</span>
                <span className="os-dot" aria-hidden />
              </button>
            );
          })}
        </div>

        <p className="mt-4 text-pretty text-sm leading-relaxed text-muted-warm">
          {OS_TEXT[os]}
        </p>

        {/* ---- arch chips (only when an OS has multiple builds) ---- */}
        {osBuilds.length > 1 && (
          <div
            role="group"
            aria-label={`Choose your ${OS_META[os].label} chip`}
            className="mt-4 flex flex-wrap gap-2"
          >
            {osBuilds.map((b) => (
              <button
                key={b.arch}
                type="button"
                aria-pressed={b.arch === build?.arch}
                onClick={() => setArch(b.arch)}
                className="arch-chip"
              >
                {b.arch}
              </button>
            ))}
          </div>
        )}

        {/* ---- install steps (per OS) ---- */}
        <ol className="mt-5 space-y-2.5 border-t border-white/[0.07] pt-5">
          {OS_STEPS[os].map((step, si) => (
            <li
              key={step}
              className="flex items-start gap-3 text-[13px] leading-relaxed text-muted-warm"
            >
              <span className="mt-px inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/[0.06] font-mono text-[10px] font-semibold text-warm-white/70">
                {si + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>

        {/* ---- action ---- */}
        <div className="mt-auto pt-6">
          <a
            href={build?.url ?? desktop.downloadUrl ?? "#downloads"}
            className="btn-primary flex w-full px-6 py-3.5 text-sm"
          >
            <ArrowDownToLine className="h-4 w-4" aria-hidden />
            Download for {OS_META[os].label}
            {osBuilds.length > 1 && build ? ` · ${build.arch}` : ""}
          </a>
          <p className="mt-3.5 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-white/30">
            {build
              ? `${OS_META[os].note} · ${build.format} · ${build.size}`
              : desktop.requirements}
          </p>
        </div>
      </article>
    </Spotlight>
  );
}

/* head icon — mirrors whichever OS tab is active */
function OsIcon({ os, className }: { os: DesktopOs; className?: string }) {
  const Icon = OS_ICONS[os];
  return <Icon className={className} />;
}

/* ------------------------------------------------------------------ */
/*  Mobile + TV cards                                                 */
/* ------------------------------------------------------------------ */

function MobileCard() {
  const mobile = DOWNLOADS.find((d) => d.id === "mobile")!;
  const build = mobile.builds[0];

  return (
    <Spotlight className="rounded-[1.125rem]">
      <article className="glass-card flex h-full flex-col p-6 sm:p-7">
        {/* head */}
        <div className="flex items-start justify-between gap-3">
          <span className="icon-tile">
            <AndroidGlyph className="h-5 w-5" aria-hidden />
          </span>
          <span className="premium-chip rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em]">
            {mobile.version}
          </span>
        </div>

        <h3 className="mt-5 font-display text-xl font-semibold tracking-[-0.02em] text-warm-white">
          Bitify for Mobile
        </h3>
        <p className="mt-2.5 text-pretty text-sm leading-relaxed text-muted-warm">
          Your music in your pocket — quick picks, synced lyrics and a
          one-handed player that goes wherever you do.
        </p>

        <ol className="mt-6 space-y-2.5 border-t border-white/[0.07] pt-5">
          {mobile.installSteps.map((step, si) => (
            <li
              key={step}
              className="flex items-start gap-3 text-[13px] leading-relaxed text-muted-warm"
            >
              <span className="mt-px inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/[0.06] font-mono text-[10px] font-semibold text-warm-white/70">
                {si + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>

        <div className="mt-auto pt-7">
          <a
            href={mobile.downloadUrl ?? "#downloads"}
            className="btn-ghost flex w-full px-6 py-3.5 text-sm"
          >
            <ArrowDownToLine className="h-4 w-4" aria-hidden />
            Download APK
          </a>
          <p className="mt-3.5 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-white/30">
            {build
              ? `Android · ${build.arch} · ${build.format} · ${build.size}`
              : mobile.requirements}
          </p>
        </div>
      </article>
    </Spotlight>
  );
}

function TvCard({ notifyPending }: { notifyPending: () => void }) {
  const tv = DOWNLOADS.find((d) => d.id === "tv")!;

  return (
    <Spotlight className="rounded-[1.125rem]">
      <article className="glass-card flex h-full flex-col p-6 sm:p-7">
        {/* head */}
        <div className="flex items-start justify-between gap-3">
          <span className="icon-tile">
            <TvGlyph className="h-5 w-5" aria-hidden />
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-crimson/35 bg-crimson/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-crimson-bright">
            <Clock3 className="h-3 w-3" aria-hidden />
            Coming soon
          </span>
        </div>

        <h3 className="mt-5 font-display text-xl font-semibold tracking-[-0.02em] text-warm-white">
          Bitify for TV
        </h3>
        <p className="mt-2.5 text-pretty text-sm leading-relaxed text-muted-warm">
          Bring the music to the biggest screen in the house — large artwork, a
          queue for the whole room and remote-first navigation.
        </p>

        <ol className="mt-6 space-y-2.5 border-t border-white/[0.07] pt-5">
          {tv.installSteps.map((step, si) => (
            <li
              key={step}
              className="flex items-start gap-3 text-[13px] leading-relaxed text-muted-warm"
            >
              <span className="mt-px inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/[0.06] font-mono text-[10px] font-semibold text-warm-white/70">
                {si + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>

        <div className="mt-auto pt-7">
          <button
            type="button"
            onClick={notifyPending}
            className="btn-ghost flex w-full px-6 py-3.5 text-sm"
          >
            Notify me later
          </button>
          <p className="mt-3.5 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-white/30">
            Android TV · Fire TV &amp; more
          </p>
        </div>
      </article>
    </Spotlight>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                           */
/* ------------------------------------------------------------------ */

export function Downloads() {
  const { toast } = useToast();
  const os = useOs();

  const notifyPending = () => {
    toast({
      title: "Bitify for TV is coming soon",
      description:
        "The TV app's store listing will be published here at release. Check back shortly — the rest of the page shows what's waiting for you.",
    });
  };

  return (
    <section
      id="downloads"
      aria-label="Downloads"
      className="relative overflow-hidden border-t border-white/[0.05]"
    >
      <div aria-hidden className="ambient-top" />
      <div className="relative mx-auto max-w-[1200px] px-6 py-24 sm:py-32">
        {/* ---- header ---- */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">
            <span className="eyebrow-idx">06</span>
            Downloads
          </p>
          <h2 className="mt-5 font-display text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-warm-white sm:text-5xl">
            Get Bitify Music.
          </h2>
          <p className="mt-6 text-pretty text-base leading-relaxed text-muted-warm sm:text-lg">
            Free forever, on every screen you own — Windows, macOS, Linux and
            Android, with TV on the way. We&apos;ve highlighted your system
            automatically.
          </p>
        </Reveal>

        {/* ---- cards ---- */}
        <div className="mt-14 grid gap-5 sm:mt-16 lg:grid-cols-3">
          <Reveal delay={0.05} y={22} className="h-full">
            <DesktopCard detected={os} />
          </Reveal>
          <Reveal delay={0.11} y={22} className="h-full">
            <MobileCard />
          </Reveal>
          <Reveal delay={0.17} y={22} className="h-full">
            <TvCard notifyPending={notifyPending} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
