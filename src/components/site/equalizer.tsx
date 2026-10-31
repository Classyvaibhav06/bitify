"use client";

import { useReducedMotion } from "framer-motion";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface EqualizerProps {
  /** number of bars */
  bars?: number;
  className?: string;
  /** bar color class */
  barClassName?: string;
  /** static (non-animated) variant */
  static?: boolean;
  "aria-label"?: string;
}

/**
 * Restrained animated audio equalizer motif.
 *
 * Each bar is driven purely by CSS (`--eq-i` sets its phase and tempo) so the
 * motion starts immediately, even before hydration, and never requires JS.
 * The pulse is deliberately pronounced — bars swing between ~22% and full
 * height with a spring-like rhythm — so it always reads as "music playing".
 * Falls back to a staggered static row of bars for reduced-motion users.
 */
export function Equalizer({
  bars = 5,
  className,
  barClassName = "bg-crimson",
  static: staticProp = false,
  "aria-label": ariaLabel = "Audio equalizer",
}: EqualizerProps) {
  const reduce = useReducedMotion();
  const isStatic = staticProp || !!reduce;

  // deterministic pseudo-random heights/weights per index
  const heights = [0.55, 1, 0.4, 0.8, 0.65, 0.9, 0.5, 0.75];

  return (
    <span
      role="img"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-end gap-[3px]",
        isStatic && "opacity-80",
        className
      )}
    >
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "w-[3px] rounded-full",
            barClassName,
            !isStatic && "eq-bar"
          )}
          style={
            {
              height: `${(heights[i % heights.length] * 100).toFixed(0)}%`,
              "--eq-i": i,
            } as CSSProperties
          }
        />
      ))}
    </span>
  );
}
