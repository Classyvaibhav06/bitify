"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Spotlight — a cursor-tracked accent wash for premium cards.
 *
 * Wraps any card body and paints a soft radial glow that follows the
 * pointer (the .spot-overlay gradient reads --mx/--my). The handler is
 * a single passive mousemove writing two CSS variables — no rAF loop,
 * no state, no re-render. Touch visitors never fire it, and the
 * overlay only exists under :hover, so phones pay nothing.
 */
export function Spotlight({
  children,
  className,
  /** radius of the wash in px */
  radius = 280,
}: {
  children: ReactNode;
  className?: string;
  radius?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className={cn("spot-wrap h-full", className)}
      style={{ "--spot-r": `${radius}px` } as React.CSSProperties}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
    >
      {children}
      <span className="spot-overlay" aria-hidden />
    </div>
  );
}
