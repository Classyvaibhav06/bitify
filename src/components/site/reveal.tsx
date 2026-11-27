import type { CSSProperties, ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** entrance delay in seconds (applied as transition-delay) */
  delay?: number;
  /** distance in px the element travels up */
  y?: number;
  className?: string;
  /** kept for API compatibility — reveals are one-shot by design */
  once?: boolean;
}

/**
 * Scroll-triggered reveal wrapper.
 *
 * The server renders fully-visible HTML; a tiny inline script in
 * <head> (see layout.tsx) adds `.rjs` to <html> before paint and
 * observes every `.reveal` / `.reveal-stagger` with a vanilla
 * IntersectionObserver, adding `.in` as they enter the viewport.
 *
 * Why vanilla instead of framer-motion `whileInView`?
 * - Works in every browser/engine (not just scroll-driven-anim ones).
 * - Zero dependency on React hydration — even a hydration failure
 *   can't leave content stuck invisible (2.5s safety net force-shows
 *   anything on screen).
 * - Reduced-motion / no-JS visitors simply see the content.
 */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  once = true,
}: RevealProps) {
  void once; // reveals are one-shot by design
  const style = {
    "--reveal-y": `${y}px`,
    transitionDelay: delay > 0 ? `${delay}s` : undefined,
  } as CSSProperties;

  return (
    // suppressHydrationWarning: the inline head script may have marked
    // this element with `data-rv` before React hydrated — that's the
    // feature (element already revealed), not a bug to warn about.
    <div
      className={`reveal ${className ?? ""}`.trim()}
      style={style}
      suppressHydrationWarning
    >
      {children}
    </div>
  );
}

interface StaggerProps {
  children: ReactNode;
  className?: string;
  /** kept for API compatibility — stagger comes from nth-child delays */
  interval?: number;
}

/**
 * Container whose direct children reveal in a staggered cascade.
 * The observer marks the container with `data-rv`; CSS then transitions
 * the children with per-index `transition-delay` (see globals.css).
 */
export function StaggerGroup({ children, className, interval = 0.09 }: StaggerProps) {
  void interval;
  return (
    <div className={`reveal-stagger ${className ?? ""}`.trim()} suppressHydrationWarning>
      {children}
    </div>
  );
}

export function StaggerItem({
  children,
  className,
  y = 24,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  const style = { "--reveal-y": `${y}px` } as CSSProperties;
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}
