"use client";

import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LaptopMockupProps {
  children: ReactNode;
  className?: string;
}

/**
 * Photoreal laptop mockup — hybrid construction.
 *
 * The lid is a real (AI-generated, studio-shot) aluminium chassis whose
 * screen area was measured pixel-exactly, so the app screenshot drops
 * into it with zero crop or distortion — the panel ratio matches the
 * screenshot ratio precisely. Under the lid sits a minimal, Apple-
 * marketing-style base: a hinge recess, a thin keyboard-deck sliver
 * with a whisper of key rows and screen-light spill, and a slim front
 * lip with the thumb notch. The same lighting rig as the rest of the
 * stage: breathing ambilight halo, warm rim, contact shadow + crimson
 * pool on the desk.
 */
export function LaptopMockup({ children, className }: LaptopMockupProps) {
  return (
    <div className={cn("lt-scene relative", className)}>
      {/* ambilight — breathing crimson wash behind the chassis */}
      <div aria-hidden className="lt-halo" />
      <div aria-hidden className="lt-edge" />

      {/* lid — photoreal chassis cutout, screen area pixel-mapped */}
      <div className="lt-lid">
        <Image
          src="/assets/desktop/laptop-lid.webp"
          alt=""
          width={886}
          height={643}
          priority
          draggable={false}
          className="h-auto w-full select-none"
        />
        <div className="lt-screen" style={SCREEN_RECT as CSSProperties}>
          {children}
          {/* glass sheen over the panel */}
          <span aria-hidden className="lt-glass" />
        </div>
      </div>

      {/* minimal base — hinge, deck sliver, front lip (decorative) */}
      <div aria-hidden className="lt-base">
        <span className="lt-hinge" />
        <span className="lt-deck">
          <span className="lt-deck-keys" />
          <span className="lt-deck-glow" />
        </span>
        <span className="lt-lip">
          <span className="lt-notch" />
        </span>
      </div>

      {/* desk below: contact shadow + crimson light pool */}
      <div aria-hidden className="lt-floor" />
    </div>
  );
}

/**
 * Screen rectangle measured from the generated lid asset (886×643):
 * screen is 801×531 px at offset (42, 44) — ratio 1.5085, matching the
 * desktop screenshot ratio (1403×930 = 1.5086) exactly.
 */
const SCREEN_RECT = {
  left: "4.74%",
  top: "6.84%",
  width: "90.41%",
  height: "82.58%",
} as const;
