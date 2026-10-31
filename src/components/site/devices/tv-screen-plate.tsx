"use client";

import { cn } from "@/lib/utils";
import { Equalizer } from "../equalizer";

interface TvScreenPlateProps {
  className?: string;
  /** rich = tagline + equalizer (large showcase), minimal = lockup only (hero) */
  variant?: "rich" | "minimal";
}

/**
 * Branded on-screen plate for the Bitify TV mockups.
 *
 * NOTE: This is intentionally a *brand plate*, not an imitation of the TV
 * app interface — real TV screenshots have not been captured yet. Replace
 * by dropping a real 16:9 capture into the TV mockups when available
 * (see src/lib/site-config.ts).
 */
export function TvScreenPlate({ className, variant = "rich" }: TvScreenPlateProps) {
  return (
    <div
      role="img"
      aria-label="Bitify Music on TV — brand artwork awaiting interface screenshots"
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden bg-[#08080a] [container-type:inline-size]",
        className
      )}
    >
      {/* ambient lighting inside the screen */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_55%_60%_at_50%_55%,rgba(224,57,62,0.22),rgba(139,92,246,0.05)_55%,transparent_75%)]"
      />
      {/* subtle vignette */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_120%_120%_at_50%_50%,transparent_55%,rgba(0,0,0,0.55))]"
      />

      <div className="relative flex flex-col items-center gap-[2.5cqw] px-6 text-center">
        {/* wordmark */}
        <span className="font-display text-[7cqw] font-bold leading-none tracking-tight text-warm-white">
          BITIFY
          <span className="ml-[0.4em] align-middle font-mono text-[0.3em] font-normal uppercase tracking-[0.45em] text-white/50">
            music
          </span>
        </span>

        {variant === "rich" && (
          <>
            <span className="text-[2.6cqw] font-light leading-snug text-white/70">
              Your music. Every screen.
            </span>
            <Equalizer bars={9} className="h-[3cqw] gap-[0.8cqw]" />
          </>
        )}

        {variant === "minimal" && (
          <Equalizer bars={7} className="h-[2cqw] gap-[0.6cqw]" />
        )}
      </div>
    </div>
  );
}
