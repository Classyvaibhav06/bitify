"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * MacBookPro — a photoreal space-black MacBook chassis built in pure CSS.
 *
 * The screenshots (1497×967 ≈ 1.55:1) are almost exactly the panel ratio of a
 * real 14" MacBook Pro, so the app sits edge-to-edge behind a true-to-life
 * lid: thin uniform bezels, a camera notch, machined hairline edges (a masked
 * gradient rim, not a flat border), an inner glass shadow and a cursor-fed
 * specular sheen. Below the lid, an aluminium deck with a hinge line and a
 * thumb scoop grounds the whole thing. Every length is derived from the
 * container width, so it scales from a 320px phone to a 900px stage.
 */
export function MacBookPro({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mbp", className)}>
      {/* ---- lid ---- */}
      <div className="mbp-lid">
        {/* camera notch — sits over the screen, above the app's own header */}
        <span className="mbp-notch" aria-hidden>
          <span className="mbp-cam" />
        </span>

        {/* the panel */}
        <div className="mbp-screen">{children}</div>

        {/* glass: cursor-fed specular highlight (driven by --gx/--gy) */}
        <span className="mbp-gloss" aria-hidden />
      </div>

      {/* ---- deck ---- */}
      <div className="mbp-deck" aria-hidden>
        <span className="mbp-hinge" />
        <span className="mbp-scoop" />
      </div>

      {/* ambient crimson bounce + contact shadow under the chassis */}
      <span className="mbp-underglow" aria-hidden />
    </div>
  );
}
