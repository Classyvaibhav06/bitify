"use client";

import { useEffect, useRef } from "react";

/**
 * ScrollWaveform — the site is a music player, so scrolling *is* seeking.
 *
 * A fixed 26px waveform strip along the bottom edge of the viewport fills
 * with crimson as you scroll through the page, with a glowing playhead dot
 * at the boundary — exactly like scrubbing a track. Rendering is a single
 * canvas that only repaints when scroll progress actually changes (rAF
 * coalesced, a few dozen rounded rects per repaint), so it costs
 * essentially nothing even on weak mobile GPUs.
 */
export function ScrollWaveform() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const BAR_W = 5;
    const GAP = 5;
    const STEP = BAR_W + GAP;

    let W = 0;
    let H = 0;
    let heights: number[] = [];
    let raf = 0;
    let lastProgress = -1;

    /* accent colours, read from the theme CSS vars so the waveform
       follows the ThemeSwitcher (re-read on the `bitify-theme` event) */
    let acc = {
      played: "rgba(240, 50, 60, 0.92)",
      bright: "#ff4a52",
      halo: "rgba(255, 74, 82, 0.22)",
    };

    const readAccent = () => {
      const cs = getComputedStyle(document.documentElement);
      const triplet = cs.getPropertyValue("--acc-rgb").trim() || "240 50 60";
      const rgb = triplet.split(/\s+/).join(", ");
      acc = {
        played: `rgba(${rgb}, 0.92)`,
        bright: cs.getPropertyValue("--crimson-bright").trim() || "#ff4a52",
        halo: `rgba(${rgb}, 0.22)`,
      };
      lastProgress = -1; // force one repaint with the new palette
      draw();
    };

    /** deterministic pseudo-random in [0, 1) — no flicker between frames */
    const rand = (i: number) => {
      const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
      return x - Math.floor(x);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      if (W === 0 || H === 0) return;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const n = Math.max(24, Math.ceil(W / STEP));
      heights = Array.from({ length: n }, (_, i) => {
        // average with neighbours so the outline flows like a real waveform
        const base = 0.3 + 0.62 * rand(i);
        const prev = 0.3 + 0.62 * rand(i - 1);
        const next = 0.3 + 0.62 * rand(i + 1);
        return Math.min(1, (base * 2 + prev + next) / 4);
      });
      lastProgress = -1;
      draw();
    };

    const draw = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (Math.abs(p - lastProgress) < 0.0005) return;
      lastProgress = p;

      ctx.clearRect(0, 0, W, H);
      const cy = H / 2;
      const n = heights.length;
      const playedX = p * W;
      const canRound = typeof ctx.roundRect === "function";

      for (let i = 0; i < n; i++) {
        const x = i * STEP + GAP / 2;
        const h = Math.max(3, heights[i] * (H - 5));
        const played = x + BAR_W / 2 <= playedX;
        const lead = !played && (i === 0 || x - STEP + BAR_W / 2 <= playedX);

        ctx.beginPath();
        const y = cy - h / 2;
        if (canRound) {
          ctx.roundRect(x, y, BAR_W, h, BAR_W / 2);
        } else {
          ctx.rect(x, y, BAR_W, h);
        }
        ctx.fillStyle = played
          ? acc.played
          : lead
            ? acc.bright
            : "rgba(244, 241, 236, 0.14)";
        ctx.fill();
      }

      // playhead — a small glowing dot at the seek position
      const px = Math.min(Math.max(playedX, 3), W - 3);
      ctx.beginPath();
      ctx.arc(px, cy, 2.6, 0, Math.PI * 2);
      ctx.fillStyle = acc.bright;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(px, cy, 5.5, 0, Math.PI * 2);
      ctx.fillStyle = acc.halo;
      ctx.fill();
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(draw);
    };

    resize();
    readAccent();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resize);
    window.addEventListener("bitify-theme", readAccent);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
      window.removeEventListener("bitify-theme", readAccent);
    };
  }, []);

  return (
    <div className="wave-seekbar" aria-hidden>
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
