import type { CSSProperties, ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** visual stagger hint in seconds (mapped to a small timeline-range shift) */
  delay?: number;
  /** distance in px the element travels up */
  y?: number;
  className?: string;
  /** kept for API compatibility — CSS scroll reveals are naturally reversible */
  once?: boolean;
}

/**
 * Scroll-triggered reveal wrapper — 100% CSS (scroll-driven animations).
 *
 * Why not framer-motion `whileInView` / `useInView` here?
 * In sandboxed preview iframes the IntersectionObserver callbacks can be
 * unreliable, and if the client JS is stale or hydration fails, content
 * wrapped in `initial={{ opacity: 0 }}` stays invisible forever (black
 * sections). This implementation renders fully-visible server HTML and only
 * *enhances* it with a native CSS `animation-timeline: view()` reveal.
 *
 * - Browsers without scroll-driven animations: content is simply always visible.
 * - Users preferring reduced motion: animation disabled, content visible.
 * - No JS, no hydration, no flash, no way to get stuck at opacity 0.
 */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  once = true,
}: RevealProps) {
  // Map the delay hint to a shift of the view-timeline entry range so
  // sibling reveals feel staggered. Ranges are wide (the animation glides
  // through most of the element's entry) for an ultra-smooth, scroll-bound
  // feel — see `.reveal` in globals.css.
  const shift = Math.round(Math.min(Math.max(delay, 0), 0.6) * 60);
  const start = Math.min(shift, 36);
  const end = Math.min(start + 76, 100);

  const style = {
    "--reveal-y": `${y}px`,
    animationRange: `entry ${start}% entry ${end}%`,
  } as CSSProperties;

  return (
    <div className={`reveal ${className ?? ""}`.trim()} style={style}>
      {children}
    </div>
  );
}

interface StaggerProps {
  children: ReactNode;
  className?: string;
  /** kept for API compatibility — stagger is handled via nth-child ranges */
  interval?: number;
}

/** Container whose direct children reveal in a staggered sequence (CSS only). */
export function StaggerGroup({ children, className, interval = 0.09 }: StaggerProps) {
  return (
    <div className={`reveal-stagger ${className ?? ""}`.trim()}>{children}</div>
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
