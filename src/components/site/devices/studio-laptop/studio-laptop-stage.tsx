"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { CameraConfig } from "./homography";
import { STAGE_HEIGHT, STAGE_WIDTH, StudioLaptopRender } from "./studio-laptop-render";

/**
 * Responsive scaler for the fixed 1440 x 960 studio laptop stage.
 *
 * The render is authored in absolute stage pixels (SVG paths +
 * homography-mapped surfaces), so the whole stage is uniformly
 * scaled to whatever width the wrapper receives. The scale is
 * measured synchronously in a layout effect (no flash of an
 * oversized laptop) and kept in sync through a ResizeObserver.
 *
 * The projected laptop occupies ~66% of the stage width and
 * ~80% of its height, centered — size the wrapper accordingly.
 * Pass `camera` (e.g. FRONT_CAMERA) for the dead-on product view,
 * and `children` to drive the laptop screen with your own content.
 */
export function StudioLaptopStage({
  className,
  camera,
  children,
}: {
  className?: string;
  /** Camera pose — defaults to the hero three-quarter view. */
  camera?: CameraConfig;
  /** Screen content; see StudioLaptopRender. When present the stage
   * is exposed to assistive tech so the media alts stay reachable. */
  children?: ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      if (w > 0) setScale(w / STAGE_WIDTH);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden={!children}
      className={cn("relative w-full", className)}
      style={{ aspectRatio: `${STAGE_WIDTH} / ${STAGE_HEIGHT}` }}
    >
      {scale !== null && (
        <div
          style={{
            width: STAGE_WIDTH,
            height: STAGE_HEIGHT,
            transform: `scale(${scale})`,
            transformOrigin: "0 0",
          }}
          className="absolute left-0 top-0"
        >
          <StudioLaptopRender camera={camera}>{children}</StudioLaptopRender>
        </div>
      )}
    </div>
  );
}
