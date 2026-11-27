import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * LogoMark — the Bitify Music waveform mark, recreated as an inline SVG from
 * the official 1254×1254 brand asset (five rounded capsules, symmetric
 * heights 274 / 505 / 694, centred on the same midline).
 *
 * Being vector, it stays crisp at every size and — better — it can *play*:
 * with `animated` the bars breathe on a staggered CSS loop like a live
 * equalizer (compositor-only transforms, essentially free), and the parent
 * `.logo-lockup` can tint the bars crimson on hover. Reduced-motion users
 * always get the static mark.
 */

interface LogoMarkProps {
  className?: string;
  /** animate the bars like a live equalizer (default true) */
  animated?: boolean;
  /** "light" = warm-white bars (default), "crimson" = brand red bars */
  tone?: "light" | "crimson";
}

/** bar geometry lifted from the official asset (1254×1254 canvas) */
const BARS = [
  { x: 246, h: 274 },
  { x: 407, h: 505 },
  { x: 568, h: 694 },
  { x: 729, h: 505 },
  { x: 890, h: 274 },
] as const;

const BAR_W = 118;
const MIDLINE = 618;

export function LogoMark({
  className,
  animated = true,
  tone = "light",
}: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 1254 1254"
      aria-hidden
      focusable="false"
      className={cn(
        "logo-mark",
        tone === "crimson" && "logo-mark-crimson",
        className
      )}
    >
      {BARS.map((bar, i) => (
        <rect
          key={bar.x}
          className={animated ? "logo-bar" : undefined}
          style={{ "--i": i } as CSSProperties}
          x={bar.x}
          y={MIDLINE - bar.h / 2}
          width={BAR_W}
          height={bar.h}
          rx={BAR_W / 2}
        />
      ))}
    </svg>
  );
}
