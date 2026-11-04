"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { PhoneMockup } from "./devices/phone-mockup";
import { HERO_CAROUSEL } from "@/lib/site-config";
import { cn } from "@/lib/utils";

/**
 * DeviceCoverflow — a genuine perspective-based 3D coverflow of the seven
 * Bitify app screens, each presented inside the CSS PhoneMockup.
 *
 * Positioning model
 * -----------------
 * Every slide lives at a *signed circular distance* `d` from the active
 * slide (d < 0 → left, d > 0 → right, |d| ≤ N/2). During a drag, `d` is
 * fractional so the whole coverflow tracks the pointer 1 : 1; on release
 * it snaps back to integers with a single eased transition.
 *
 * - translateX : d · --cf-gap            (responsive spacing)
 * - translateZ : −|d| · --cf-depth       (recession into depth)
 * - rotateY    : −sign(d) · capped angle (side screens angle toward centre)
 * - scale      : 1 − |d| · 0.165
 * - opacity    : falls off with distance, hits 0 before the wrap seam so
 *                looping from slide 7 → 1 is never visible as a jump.
 *
 * Stage lighting
 * --------------
 * Each slide also carries a `--halo` strength (1 at centre, fading with
 * |d|): a blurred crimson spotlight glows behind the phone and the phone
 * itself is brightened/desaturated proportionally, so the front device is
 * unmistakably the star of the composition.
 *
 * Auto-switch
 * -----------
 * The carousel advances by itself every few seconds while it is on screen,
 * pausing automatically while the visitor drags, swipes, navigates or tabs
 * (and whenever the tab is hidden). A small pause/play control next to the
 * dots lets the visitor stop it for good. It keeps running under
 * `prefers-reduced-motion` too — the CSS shortens every transition to a
 * quick, subtle change there, and the explicit pause control keeps the
 * carousel WCAG-compliant.
 *
 * Transitions are pure CSS transforms/opacity (GPU-friendly). The initial
 * render is fully positioned server-side, so the carousel is visible even
 * before hydration; its entrance is scrubbed by the visitor's scroll
 * (see `.cf-enter` in CSS).
 */

const N = HERO_CAROUSEL.length; // 7 unique screens
/** keep in sync with `--cf-gap` in globals.css (calc(var(--pw) * 0.66)) */
const GAP_FACTOR = 0.66;
/** auto-switch cadence, and how long any interaction pauses it */
const AUTOPLAY_MS = 4200;
const INTERACTION_PAUSE_MS = 5000;

/** shortest signed circular distance, mapped to [-N/2, N/2) */
function circDist(offset: number): number {
  const half = N / 2;
  return (((offset % N) + N + half) % N) - half;
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** visual metrics for a slide at (possibly fractional) signed distance `d` */
function metrics(d: number) {
  const a = Math.abs(d);
  const sign = d < 0 ? -1 : 1;
  return {
    a,
    rotate: -sign * Math.min(a, 1.75) * 14.5,
    scale: Math.max(0.42, 1 - a * 0.165),
    opacity: clamp(1 - a * 0.24 - Math.max(0, a - 3) * 1.6, 0, 1),
    z: 40 - Math.round(Math.min(a, 3.49) * 10),
    /** spotlight strength — full on the front phone, quickly fading */
    halo: clamp(1 - a * 0.85, 0, 1),
  };
}

interface DragState {
  startX: number;
  gap: number;
  moved: number;
  slide: number;
  hist: { x: number; t: number }[];
}

export function DeviceCoverflow({ className }: { className?: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [dragF, setDragF] = useState(0);
  const [dragging, setDragging] = useState(false); // class/cursor only
  const [autoOn, setAutoOn] = useState(true); // pause/play control state
  /**
   * Synchronous source of truth for a live drag session. The React state
   * above only styles the stage; pointermove/pointerup must never depend on
   * a re-render having happened in between (fast swipes fire move events in
   * the same tick as pointerdown).
   */
  const dragActive = useRef(false);
  const drag = useRef<DragState>({
    startX: 0,
    gap: 200,
    moved: 0,
    slide: -1,
    hist: [],
  });
  /** auto-switch settings, read synchronously by the timer */
  const auto = useRef({ on: true, until: 0 });

  /** any visitor interaction pauses auto-switching for a short while */
  const pauseAuto = useCallback(() => {
    auto.current.until = Date.now() + INTERACTION_PAUSE_MS;
  }, []);

  const goTo = useCallback((i: number) => {
    setActive(((i % N) + N) % N);
  }, []);

  const step = useCallback((dir: number) => {
    setActive((a) => (((a + dir) % N) + N) % N);
  }, []);

  /* ---------- auto-switch (runs even under reduced motion — see the CSS
     block that shortens the transitions there; the pause button stays
     available for anyone who wants it stopped) ---------- */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || typeof IntersectionObserver === "undefined") return;

    let visible = false;
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? false;
      },
      // generous threshold — even a partly visible stage (short viewports,
      // embedded preview panes) keeps the carousel alive
      { threshold: 0.12 }
    );
    io.observe(stage);

    const id = window.setInterval(() => {
      if (!auto.current.on || dragActive.current) return;
      if (document.hidden || !visible) return;
      if (Date.now() < auto.current.until) return;
      step(1);
    }, AUTOPLAY_MS);

    return () => {
      io.disconnect();
      window.clearInterval(id);
    };
  }, [step]);

  const toggleAuto = () => {
    const next = !auto.current.on;
    auto.current.on = next;
    if (next) auto.current.until = 0; // resume immediately
    setAutoOn(next);
  };

  /* ---------- keyboard ---------- */
  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      pauseAuto();
      step(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      pauseAuto();
      step(-1);
    } else if (e.key === "Home") {
      e.preventDefault();
      pauseAuto();
      goTo(0);
    } else if (e.key === "End") {
      e.preventDefault();
      pauseAuto();
      goTo(N - 1);
    }
  };

  /* ---------- pointer: swipe / drag / tap-to-focus ---------- */
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    // nav buttons (and anything focusable) keep their normal click behaviour
    if ((e.target as HTMLElement).closest("button, a")) return;
    pauseAuto();
    const phone = stageRef.current?.querySelector<HTMLElement>(".phone-mockup");
    drag.current = {
      startX: e.clientX,
      gap: Math.max(60, (phone?.offsetWidth ?? 300) * GAP_FACTOR),
      moved: 0,
      slide: Number(
        (e.target as HTMLElement).closest<HTMLElement>(".cf-slide")?.dataset.i ?? -1
      ),
      hist: [{ x: e.clientX, t: performance.now() }],
    };
    setDragging(true);
    dragActive.current = true;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // synthetic / non-active pointers — drag still works via move/up below
    }
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragActive.current) return;
    const d = drag.current;
    d.moved = Math.max(d.moved, Math.abs(e.clientX - d.startX));
    d.hist.push({ x: e.clientX, t: performance.now() });
    if (d.hist.length > 10) d.hist.shift();
    // swiping left (x decreases) advances → positive fractional offset
    setDragF(clamp((d.startX - e.clientX) / d.gap, -3.45, 3.45));
  };

  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragActive.current) return;
    dragActive.current = false;
    const d = drag.current;
    setDragging(false);
    pauseAuto();

    // tap (not drag) on a side screen → bring that screen into focus
    if (d.moved < 8) {
      setDragF(0);
      if (d.slide >= 0 && d.slide !== active) goTo(d.slide);
      return;
    }

    // release velocity over the last ~90 ms, measured in slides/second
    const now = performance.now();
    const old = d.hist.find((h) => now - h.t <= 90) ?? d.hist[0] ?? { x: d.startX, t: now };
    const dt = Math.max(16, now - old.t);
    const v = ((old.x - e.clientX) / dt) * 1000 / d.gap; // > 0 → flick toward next

    const f = (d.startX - e.clientX) / d.gap;
    let delta = 0;
    if (Math.abs(f) >= 0.25) delta = f > 0 ? Math.ceil(f - 0.24) : Math.floor(f + 0.24);
    if (delta === 0 && Math.abs(v) > 0.45) delta = v > 0 ? 1 : -1;
    delta = clamp(delta, -3, 3);

    setDragF(0);
    if (delta !== 0) setActive((a) => (((a + delta) % N) + N) % N);
  };

  const cancelDrag = () => {
    if (!dragActive.current) return;
    dragActive.current = false;
    setDragging(false);
    setDragF(0);
  };

  return (
    <div className={cn("cf-root", className)}>
      <div
        ref={stageRef}
        className={cn("cf-stage", dragging && "is-dragging")}
        role="region"
        aria-roledescription="carousel"
        aria-label="Bitify Music app screens"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={cancelDrag}
        onLostPointerCapture={cancelDrag}
      >
        {/* ambient light behind the devices — crimson core, violet rim */}
        <div aria-hidden className="cf-glow" />
        <div aria-hidden className="cf-floor" />

        <div className="cf-track">
          {HERO_CAROUSEL.map((screen, i) => {
            const d = circDist(i - active - dragF);
            const m = metrics(d);
            return (
              <div
                key={screen.src}
                data-i={i}
                className="cf-slide"
                aria-hidden={i !== active}
                aria-roledescription="slide"
                aria-label={`${screen.label} — screen ${i + 1} of ${N}`}
                style={
                  {
                    "--sd": d,
                    "--saz": m.a,
                    "--halo": m.halo,
                    zIndex: m.z,
                    opacity: m.opacity,
                    transform:
                      "translateX(calc(var(--sd) * var(--cf-gap))) " +
                      "translateZ(calc(var(--saz) * var(--cf-depth) * -1)) " +
                      `rotateY(${m.rotate}deg) scale(${m.scale})`,
                  } as CSSProperties
                }
              >
                {/* spotlight behind this phone — strongest at the front.
                    Only slides with a visible halo strength render one,
                    so a hop composites ~3 blurred layers instead of 7. */}
                {m.halo > 0.02 && <div aria-hidden className="cf-halo" />}
                <div className="cf-enter">
                  <PhoneMockup
                    screen={screen}
                    priority={Math.abs(circDist(i)) <= 1}
                    sizes="(max-width: 639px) 52vw, (max-width: 1100px) 44vw, 300px"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          className="cf-nav cf-nav-prev"
          onClick={() => {
            pauseAuto();
            step(-1);
          }}
          aria-label="Previous screen"
        >
          <ChevronLeft aria-hidden />
        </button>
        <button
          type="button"
          className="cf-nav cf-nav-next"
          onClick={() => {
            pauseAuto();
            step(1);
          }}
          aria-label="Next screen"
        >
          <ChevronRight aria-hidden />
        </button>
      </div>

      {/* active screen label + position + direct-access dots + auto-switch */}
      <div className="cf-meta">
        <p className="cf-label" aria-live="polite">
          <span key={active} className="cf-label-swap">
            {HERO_CAROUSEL[active].label}
          </span>
          <span className="cf-count">
            {String(active + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
          </span>
        </p>
        <div className="cf-controls">
          <div className="cf-dots" role="tablist" aria-label="Choose a screen">
            {HERO_CAROUSEL.map((screen, i) => (
              <button
                key={screen.src}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`Show ${screen.label}`}
                onClick={() => {
                  pauseAuto();
                  goTo(i);
                }}
                className={cn("cf-dot", i === active && "is-active")}
              />
            ))}
          </div>
          <span aria-hidden className="cf-controls-divider" />
          <button
            type="button"
            className="cf-autoplay"
            onClick={toggleAuto}
            aria-pressed={autoOn}
            aria-label={autoOn ? "Pause auto-switch" : "Resume auto-switch"}
            title={autoOn ? "Pause auto-switch" : "Resume auto-switch"}
          >
            {autoOn ? <Pause aria-hidden /> : <Play aria-hidden />}
          </button>
        </div>
      </div>
    </div>
  );
}
