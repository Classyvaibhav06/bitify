"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { MacBookPro } from "./devices/macbook-pro";
import { PhoneMockup } from "./devices/phone-mockup";
import { LiveVideo } from "./devices/live-video";
import {
  DESKTOP_SHOTS,
  LIVE_VIDEOS,
  MOBILE_SCREENS,
  type DesktopShot,
} from "@/lib/site-config";
import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";

const AUTO_MS = 5200;
/** how long a manual pick freezes the auto-advance */
const HOLD_MS = 10000;

/** the spectrum mirage — 26 bars, each with its own peak/tempo/phase so
 *  the field never looks like one loop (deterministic, SSR-stable) */
const SPECTRUM = Array.from({ length: 26 }, (_, i) => ({
  peak: 0.34 + ((i * 37) % 13) / 21,
  dur: 1.15 + ((i * 29) % 7) * 0.17,
  delay: -(((i * 53) % 11) / 10),
}));

/** a view the MacBook panel can show: the live recording or a still shot */
type StageView =
  | { kind: "live"; key: "live"; label: string }
  | { kind: "shot"; key: string; label: string; shot: DesktopShot };

/**
 * HeroStage — the hero product stage as one living composition.
 *
 * A real MacBook Pro chassis (thin bezels, camera notch, aluminium deck)
 * plays the actual desktop app as a live, muted screen recording with a
 * sound toggle; the still captures (Home, Explore) sit beside it as views,
 * auto-advancing between themselves once the visitor picks one. If the
 * recording can't load, the panel silently falls back to the three stills
 * exactly as before. Behind it an audio-spectrum mirage rises off the desk
 * between two drifting vinyls. The lid carries a specular sheen that
 * follows the cursor while the whole chassis leans into it. The phone
 * tucks against the deck and the live now-playing chip hangs off the
 * bottom-left corner, off the panel.
 *
 * Everything animates with opacity/transform only — no layout thrash, so it
 * stays buttery on phones.
 */
export function HeroStage() {
  const [active, setActive] = useState(0);
  const [videoFailed, setVideoFailed] = useState(false);
  const holdUntil = useRef(0);

  /* ---- the views: live recording first, then the still captures.
          If the video can't load, the stills take over completely
 *        (including the Now Playing capture the recording replaces). ---- */
  const views = useMemo<StageView[]>(() => {
    const list: StageView[] = [];
    if (!videoFailed) {
      list.push({
        kind: "live",
        key: "live",
        label: LIVE_VIDEOS.desktop.label,
      });
    }
    DESKTOP_SHOTS.forEach((s) => list.push({
      kind: "shot",
      key: s.src,
      label: s.label,
      shot: s,
    }));
    return list;
  }, [videoFailed]);

  /* ---- desktop 3D tilt + specular gloss: the MacBook leans into the
          cursor and the screen catches the light ---- */
  const stageRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const tilt = tiltRef.current;
    if (!stage || !tilt) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let raf = 0;
    let tx = 0;
    let ty = 0; // targets in deg
    let cx = 0;
    let cy = 0; // current in deg

    const loop = () => {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      tilt.style.setProperty("--tilt-x", `${cx.toFixed(2)}deg`);
      tilt.style.setProperty("--tilt-y", `${cy.toFixed(2)}deg`);
      if (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = 0;
      }
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const onMove = (e: MouseEvent) => {
      const r = stage.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width; // 0..1
      const py = (e.clientY - r.top) / r.height;
      ty = (px - 0.5) * 10; // rotateY follows x
      tx = -(py - 0.5) * 8; // rotateX counters y
      // specular highlight tracks the pointer across the glass
      // (gy mapped into the panel so the hotspot stays readable)
      tilt.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
      tilt.style.setProperty("--gy", `${(py * 74 - 6).toFixed(1)}%`);
      tilt.classList.add("is-tilting");
      kick();
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
      tilt.style.setProperty("--gx", "72%");
      tilt.style.setProperty("--gy", "-14%");
      tilt.classList.remove("is-tilting");
      kick();
    };

    stage.addEventListener("mousemove", onMove, { passive: true });
    stage.addEventListener("mouseleave", onLeave);
    return () => {
      stage.removeEventListener("mousemove", onMove);
      stage.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const select = useCallback((i: number) => {
    setActive(i);
    holdUntil.current = Date.now() + HOLD_MS;
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      if (Date.now() < holdUntil.current) return;
      setActive((a) => {
        const cur = views[a];
        /* the live recording owns the stage until the visitor asks for a
           still — no auto-advance away from it */
        if (!cur || cur.kind === "live") return a;
        const stills = views
          .map((v, i) => (v.kind === "shot" ? i : -1))
          .filter((i) => i >= 0);
        const pos = stills.indexOf(a);
        return stills[(pos + 1) % stills.length];
      });
    }, AUTO_MS);
    return () => clearInterval(t);
  }, [views]);

  return (
    <div className="relative w-full" ref={stageRef}>
      {/* ---- spectrum mirage rising behind the laptop ---- */}
      <div className="hero-spectrum" aria-hidden>
        {SPECTRUM.map((b, i) => (
          <i
            key={i}
            className="sp-bar"
            style={
              {
                "--peak": b.peak,
                animationDuration: `${b.dur}s`,
                animationDelay: `${b.delay}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>

      {/* ---- drifting vinyls at the stage edges ---- */}
      <span className="hero-vinyl hero-vinyl-a" aria-hidden>
        <i className="vinyl-disc" />
      </span>
      <span className="hero-vinyl hero-vinyl-b" aria-hidden>
        <i className="vinyl-disc" />
      </span>

      {/* ---- the MacBook + phone ---- */}
      <div className="relative z-10">
        <div className="hero-stage-tilt" ref={tiltRef}>
          <MacBookPro>
            <div className="relative aspect-[1497/967] w-full overflow-hidden rounded-[inherit] bg-black">
              {views.map((v, i) =>
                v.kind === "live" ? (
                  <div
                    key={v.key}
                    className={cn(
                      "absolute inset-0 transition-opacity duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                      i === active
                        ? "opacity-100"
                        : "pointer-events-none opacity-0"
                    )}
                  >
                    <LiveVideo
                      src={LIVE_VIDEOS.desktop.src}
                      poster={LIVE_VIDEOS.desktop.poster}
                      alt={LIVE_VIDEOS.desktop.alt}
                      paused={i !== active}
                      onError={() => setVideoFailed(true)}
                    />
                  </div>
                ) : (
                  <Image
                    key={v.key}
                    src={v.shot.src}
                    alt={v.shot.alt}
                    fill
                    priority={i === 0}
                    sizes="(max-width: 1024px) 92vw, 900px"
                    className={cn(
                      "select-none object-cover transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                      i === active
                        ? "opacity-100 [transform:scale(1)]"
                        : "pointer-events-none opacity-0 [transform:scale(1.025)]"
                    )}
                  />
                )
              )}
            </div>
          </MacBookPro>
        </div>

        {/* phone — leaning against the deck's corner
            (on phones it stays inside the chassis edge so it never
             collides with the view pills below) */}
        <div className="absolute -bottom-3 -right-1 rotate-[6deg] [--pw:clamp(72px,15vw,140px)] sm:-bottom-14 sm:-right-12 [filter:drop-shadow(0_28px_36px_rgba(0,0,0,0.6))]">
          <PhoneMockup
            screen={MOBILE_SCREENS.nowplaying}
            priority
            sizes="(max-width: 640px) 76px, 148px"
          />
        </div>

        {/* live now-playing chip — hangs off the chassis's bottom-left
            corner, over the desk, never over the panel */}
        <div
          className="np-chip absolute -bottom-6 left-2 z-20 sm:-bottom-8 sm:left-7"
          aria-hidden
        >
          <span className="np-eq">
            {[0, 1, 2].map((i) => (
              <i key={i} style={{ "--eq-i": i } as CSSProperties} />
            ))}
          </span>
          <span className="flex flex-col gap-1">
            <span className="flex items-baseline gap-1.5">
              <span className="text-[12px] font-semibold leading-none text-warm-white">
                Pal Pal
              </span>
              <span className="hidden text-[10px] leading-none text-muted-warm sm:inline">
                Talwiinder · playing now
              </span>
            </span>
            <span className="np-bar">
              <span className="np-fill" />
            </span>
          </span>
        </div>
      </div>

      {/* ---- view switcher pills ---- */}
      <div
        role="tablist"
        aria-label="Bitify desktop views"
        className="relative z-10 mx-auto mt-8 flex w-max items-center gap-1 rounded-full border border-white/10 bg-[#0b0b0e]/90 p-1 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.9)] backdrop-blur-md sm:mt-12"
      >
        {views.map((v, i) => (
          <button
            key={v.key}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => select(i)}
            className="hs-tab"
          >
            {v.kind === "live" && (
              <i className="hs-live-dot" aria-hidden>
                <i className="hs-live-core" />
              </i>
            )}
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
}
