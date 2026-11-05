"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Lightweight pre-rendered studio laptop.
 *
 * The photoreal vector render (`devices/studio-laptop/`) costs ~420 DOM
 * nodes, four SVG layers with feGaussianBlur filters and a full geometry
 * solve per instance — with three instances on the page that was 64% of
 * the whole document and a serious rasterization cost on phones. This
 * component replaces it with bitmaps captured from the exact production
 * render (live stage cloned at 1440x960, transparent screenshot), so
 * the visual is identical while open-time work drops to a single
 * responsive <img>.
 *
 * The front "blank" pose keeps live screen content: the 1403x930 surface
 * is homography-mapped onto the display aperture with the same solved
 * matrix3d the vector render uses (FRONT_CAMERA is a constant pose), so
 * videos / screenshots still inherit the laptop's perspective exactly.
 */

type Pose = "hero" | "front-home" | "front-blank";

/** stage geometry (1440x960 stage, 1403x930 screen surface) */
const STAGE_W = 1440;
const STAGE_H = 960;
const SCREEN_W = 1403;
const SCREEN_H = 930;

/** front-pose bitmaps carry ~24px of contact-shadow spill below the
 * stage box (the vector render paints it outside the stage too) */
const BITMAP_H: Record<Pose, number> = {
  hero: 960,
  "front-home": 984,
  "front-blank": 984,
};

const WIDTHS: Record<Pose, number[]> = {
  hero: [2160, 1440, 720],
  "front-home": [1440, 720],
  "front-blank": [1440, 720],
};

/** solved homography for the front-pose display aperture — maps the
 * flat 1403x930 surface (0,0)-(1403,930) onto the projected screen quad
 * in stage coordinates. Constant: FRONT_CAMERA never changes. */
const FRONT_SCREEN_3D =
  "matrix3d(0.604563161,0.000000000,0.000000000,0.000000000,0.009403734,0.610797195,0.000000000,0.000013061,0.000000000,0.000000000,1.000000000,0.000000000,295.898942571,59.169680461,0.000000000,1.000000000)";

export function LaptopPhoto({
  pose,
  className,
  children,
  priority = false,
  sizes = "100vw",
  alt,
}: {
  /** Which pre-rendered bitmap to use (hero pose bakes the hero
   * screenshot; front poses are dead-on product views). */
  pose: Pose;
  className?: string;
  /** Live screen content for the front-blank pose — fills the projected
   * display aperture and inherits the laptop's perspective. */
  children?: ReactNode;
  /** Hero usage should pass priority — the bitmap is the LCP element. */
  priority?: boolean;
  sizes?: string;
  /** Alt text for the baked screen content (ignored when children
   * supply their own accessible names). */
  alt: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);

  /* the screen overlay is authored in stage pixels (the matrix3d maps
   * 1403x930 -> stage quad), so it needs the stage's uniform scale —
   * measured synchronously before paint, like the vector stage did */
  useLayoutEffect(() => {
    if (!children) return;
    const el = wrapRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      if (w > 0) setScale(w / STAGE_W);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [children]);

  const widths = WIDTHS[pose];
  const defaultWidth = widths.includes(1440) ? 1440 : widths[0];

  return (
    <div
      ref={wrapRef}
      className={cn("relative w-full", className)}
      style={{ aspectRatio: `${STAGE_W} / ${BITMAP_H[pose]}` }}
    >
      <img
        src={`/assets/laptop/laptop-${pose}-${defaultWidth}.webp`}
        srcSet={widths
          .map((w) => `/assets/laptop/laptop-${pose}-${w}.webp ${w}w`)
          .join(", ")}
        sizes={sizes}
        alt={children ? "" : alt}
        aria-hidden={children ? true : undefined}
        width={STAGE_W}
        height={BITMAP_H[pose]}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        draggable={false}
        className="absolute inset-0 h-full w-full select-none"
      />

      {children && scale !== null && (
        <div
          style={{
            width: STAGE_W,
            height: STAGE_H,
            transform: `scale(${scale})`,
            transformOrigin: "0 0",
          }}
          className="absolute left-0 top-0"
        >
          <div
            style={{
              width: SCREEN_W,
              height: SCREEN_H,
              transformOrigin: "0 0",
              transform: FRONT_SCREEN_3D,
              borderRadius: "9px 9px 2px 2px",
              boxShadow: "0 0 0 1px rgba(255,255,255,0.07)",
              overflow: "hidden",
            }}
            className="absolute left-0 top-0"
          >
            {children}
            {/* subtle studio display glass diagonal reflection — same
                overlay as the vector render, above the live content */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-30"
              style={{
                background:
                  "linear-gradient(122deg, rgba(255, 250, 244, 0.048) 0%, rgba(255, 255, 255, 0.015) 34%, transparent 34.5%, transparent 100%)",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
