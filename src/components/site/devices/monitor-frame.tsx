"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface MonitorFrameProps {
  children: ReactNode;
  className?: string;
  /** enable subtle scroll parallax on the whole monitor */
  parallax?: boolean;
}

/**
 * Premium desktop monitor mockup.
 * Slim bezel with a lit top rim, aluminium stand, a breathing
 * ambilight (rear light strip) behind the panel, a pulsing power
 * LED in the chin and a crimson light pool on the desk below.
 */
export function MonitorFrame({ children, className, parallax = true }: MonitorFrameProps) {
  const reduce = useReducedMotion();

  const content = (
    <div className={cn("relative w-full", className)}>
      {/* ambilight — light strip breathing behind the panel */}
      <div aria-hidden className="mf-halo" />
      <div aria-hidden className="mf-edge" />

      {/* bezel */}
      <div className="relative rounded-[18px] border border-white/10 bg-gradient-to-b from-[#1b1b21] via-[#131318] to-[#0e0e12] p-[10px] pb-[22px] shadow-[0_50px_120px_-20px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.04)_inset]">
        {/* top rim catching the room light */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
        />
        {/* screen */}
        <div className="relative aspect-[16/10] overflow-hidden rounded-[10px] bg-black ring-1 ring-white/10">
          {children}
          {/* screen ambience — faint crimson inner glow + glass reflection */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 shadow-[inset_0_0_38px_rgba(224,57,62,0.08)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.08)_0%,transparent_30%)]"
          />
        </div>
        {/* chin — brand mark + pulsing power LED */}
        <div className="absolute bottom-[7px] left-1/2 flex -translate-x-1/2 items-center gap-2">
          <span className="mf-led" aria-hidden />
          <span className="font-mono text-[7px] uppercase tracking-[0.3em] text-white/30">
            bitify
          </span>
        </div>
      </div>

      {/* stand — tapered neck on a slim base */}
      <div className="absolute left-1/2 top-full -z-10 flex -translate-x-1/2 flex-col items-center" aria-hidden>
        <div className="mf-neck" />
        <div className="mf-base" />
      </div>

      {/* desk below: contact shadow + crimson light pool */}
      <div aria-hidden className="mf-floor" />
    </div>
  );

  if (parallax && !reduce) {
    return (
      <motion.div
        style={{ y: 0 }}
        whileInView={{ y: [-10, 0] }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
}
