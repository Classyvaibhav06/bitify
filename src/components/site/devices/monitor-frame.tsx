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
 * Slim bezel, aluminium-look stand, screen glow and grounded shadow.
 */
export function MonitorFrame({ children, className, parallax = true }: MonitorFrameProps) {
  const reduce = useReducedMotion();

  const content = (
    <div className={cn("relative w-full", className)}>
      {/* ambient screen light */}
      <div
        aria-hidden
        className="absolute -inset-x-16 -top-20 bottom-0 -z-10 bg-[radial-gradient(ellipse_75%_60%_at_50%_35%,rgba(224,57,62,0.13),transparent_70%)] blur-2xl"
      />

      {/* bezel */}
      <div className="relative rounded-[18px] border border-white/10 bg-gradient-to-b from-[#1a1a20] to-[#101014] p-[10px] pb-[20px] shadow-[0_50px_120px_-20px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.04)_inset]">
        {/* screen */}
        <div className="relative aspect-[16/10] overflow-hidden rounded-[10px] bg-black ring-1 ring-white/10">
          {children}
          {/* glass reflection */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.07)_0%,transparent_28%)]"
          />
        </div>
        {/* chin */}
        <div className="absolute bottom-[6px] left-1/2 flex -translate-x-1/2 items-center gap-2">
          <span className="h-1 w-1 rounded-full bg-white/25" aria-hidden />
          <span className="font-mono text-[7px] uppercase tracking-[0.3em] text-white/25">
            bitify
          </span>
        </div>
      </div>

      {/* stand */}
      <div className="absolute left-1/2 top-full -z-10 flex -translate-x-1/2 flex-col items-center" aria-hidden>
        <div className="h-14 w-[70px] rounded-t-md bg-gradient-to-b from-[#1c1c22] to-[#131318] shadow-[0_0_0_1px_rgba(255,255,255,0.05)]" />
        <div className="h-[7px] w-[220px] rounded-full bg-gradient-to-b from-[#26262d] to-[#15151a] shadow-[0_10px_30px_rgba(0,0,0,0.7)]" />
      </div>

      {/* floor shadow */}
      <div
        aria-hidden
        className="absolute left-1/2 top-full mt-[76px] h-10 w-[70%] -translate-x-1/2 rounded-[100%] bg-black/70 blur-2xl"
      />
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
