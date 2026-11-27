"use client";

import { useEffect, useRef } from "react";

/**
 * CursorGlow — a soft crimson spotlight trailing the mouse.
 *
 * One fixed 520px radial-gradient div, moved with translate3d only and
 * lerped in a single rAF loop (the loop self-stops when idle). It only
 * mounts its listeners on pointer-fine, hover-capable devices and politely
 * steps aside while party mode owns the lights (see `.party .cursor-glow`
 * in globals.css).
 */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 3;
    let cx = tx;
    let cy = ty;
    let raf = 0;
    let idle = 0;

    const loop = () => {
      cx += (tx - cx) * 0.14;
      cy += (ty - cy) * 0.14;
      el.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0)`;

      // keep looping while the glow is still catching up, then park it
      if (Math.abs(tx - cx) > 0.4 || Math.abs(ty - cy) > 0.4 || idle < 90) {
        idle += 1;
        raf = requestAnimationFrame(loop);
      } else {
        raf = 0;
      }
    };

    const kick = () => {
      idle = 0;
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      el.style.opacity = "1";
      kick();
    };

    const onLeave = () => {
      el.style.opacity = "0";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} className="cursor-glow" aria-hidden />;
}
