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
 * Large widescreen television mockup with near-edge-to-edge display,
 * soft screen light bleed and optional slim stand.
 */
export function TvFrame({ children, className, stand = true }: TvFrameProps) {
  return (
    <div className={cn("relative w-full", className)}>
      {/* screen light bleeding into the room */}
      <div
        aria-hidden
        className="absolute -inset-x-10 -top-12 -bottom-6 -z-10 bg-[radial-gradient(ellipse_70%_55%_at_50%_50%,rgba(224,57,62,0.14),rgba(139,92,246,0.04)_50%,transparent_72%)] blur-2xl"
      />

      {/* bezel */}
      <div className="relative rounded-[10px] border border-white/10 bg-gradient-to-b from-[#15151a] to-[#0c0c10] p-[6px] shadow-[0_60px_140px_-20px_rgba(0,0,0,0.9)]">
        <div className="relative aspect-video overflow-hidden rounded-[6px] bg-black ring-1 ring-white/10">
          {children}
          {/* glass reflection */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.05)_0%,transparent_32%)]"
          />
        </div>
      </div>

      {stand && (
        <div className="absolute left-1/2 top-full -z-10 flex -translate-x-1/2 flex-col items-center" aria-hidden>
          <div className="h-10 w-[46px] rounded-t bg-gradient-to-b from-[#1a1a20] to-[#111116]" />
          <div className="h-[6px] w-[190px] rounded-full bg-gradient-to-b from-[#222228] to-[#141419] shadow-[0_12px_28px_rgba(0,0,0,0.75)]" />
        </div>
      )}

      {/* floor shadow */}
      <div
        aria-hidden
        className="absolute left-1/2 top-full mt-[58px] h-10 w-[75%] -translate-x-1/2 rounded-[100%] bg-black/70 blur-2xl"
      />
    </div>
  );
}
