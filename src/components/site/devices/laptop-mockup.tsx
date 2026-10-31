"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface LaptopMockupProps {
  children: ReactNode;
  className?: string;
}

/**
 * Premium 3D laptop mockup — a real CSS clamshell, not a flat cutout.
 *
 * One perspective stage; the body turns to the camera like the
 * reference shoot: left edge slightly forward (rotateY) and a hint
 * of a downward camera (rotateX). The lid opens just past vertical,
 * the keyboard deck folds toward the viewer around the hinge line
 * (rotateX ≈ 76°) and the front lip folds down from the deck's front
 * edge — so the base reads as a solid wedge with real thickness.
 * The screenshot lives inside the lid, so it follows the screen
 * plane and picks up the same perspective as a real product photo.
 *
 * Lighting matches the site rig: a breathing crimson ambilight
 * behind the chassis, a warm-white specular chamfer along the lid's
 * top edge, screen light spilling onto the deck, a metallic
 * highlight on the front lip and a crimson pool on the desk.
 */
export function LaptopMockup({ children, className }: LaptopMockupProps) {
  return (
    <div className={cn("lt3d-scene relative", className)}>
      {/* ambilight — breathing crimson wash behind the chassis */}
      <div aria-hidden className="lt-halo" />
      <div aria-hidden className="lt-edge" />

      <div className="lt3d-stage">
        <div className="lt3d-body">
          {/* lid — aluminium shell, thin bezels, camera dot */}
          <div className="lt3d-lid">
            <span aria-hidden className="lt3d-camera" />
            <div className="lt3d-screen">
              {children}
              <span aria-hidden className="lt3d-glass" />
            </div>
          </div>

          {/* deck — keyboard surface foreshortened toward the viewer */}
          <div aria-hidden className="lt3d-deck">
            <span className="lt3d-kb" />
            <span className="lt3d-pad" />
            {/* front lip — folds down from the deck's front edge */}
            <span className="lt3d-lip">
              <span className="lt3d-notch" />
            </span>
          </div>
        </div>
      </div>

      {/* desk below: contact shadow + crimson light pool */}
      <div aria-hidden className="lt-floor" />
    </div>
  );
}
