"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface TvFrameProps {
  children: ReactNode;
  className?: string;
  /** show a slim center stand */
  stand?: boolean;
}

/**
 * Large widescreen television mockup with near-edge-to-edge display.
 * A breathing ambilight glows behind the panel and a light pool
 * settles on the floor beneath the slim center stand.
 */
export function TvFrame({ children, className, stand = true }: TvFrameProps) {
  return (
    <div className={cn("relative w-full", className)}>
      {/* ambilight — rear light strip */}
      <div aria-hidden className="amb-halo" />
      <div aria-hidden className="amb-edge" />

      {/* bezel */}
      <div className="relative rounded-[10px] border border-white/10 bg-gradient-to-b from-[#16161c] via-[#101015] to-[#0b0b0f] p-[6px] shadow-[0_60px_140px_-20px_rgba(0,0,0,0.9)]">
        {/* top rim highlight */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
        />
        <div className="relative aspect-video overflow-hidden rounded-[6px] bg-black ring-1 ring-white/10">
          {children}
          {/* glass reflection + faint inner glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 shadow-[inset_0_0_34px_rgba(224,57,62,0.07)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.06)_0%,transparent_32%)]"
          />
        </div>
        {/* chin LED */}
        <div className="absolute bottom-[3px] left-1/2 flex -translate-x-1/2 items-center">
          <span className="mf-led" aria-hidden />
        </div>
      </div>

      {stand && (
        <div className="absolute left-1/2 top-full -z-10 flex -translate-x-1/2 flex-col items-center" aria-hidden>
          <div className="h-10 w-[46px] rounded-t bg-gradient-to-b from-[#1a1a20] to-[#111116]" />
          <div className="h-[6px] w-[190px] rounded-full bg-gradient-to-b from-[#222228] to-[#141419] shadow-[0_12px_28px_rgba(0,0,0,0.75)]" />
        </div>
      )}

      {/* floor: contact shadow + light pool */}
      <div
        aria-hidden
        className="absolute left-1/2 top-full mt-[54px] h-11 w-[78%] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(224,57,62,0.16),rgba(0,0,0,0.55)_42%,transparent_70%)] blur-2xl"
      />
    </div>
  );
}
