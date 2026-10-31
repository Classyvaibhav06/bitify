"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface PhoneFrameProps {
  children: ReactNode;
  className?: string;
  /** scale of the bezel ring (px) */
  bezel?: number;
  /** show the punch-hole camera dot */
  camera?: boolean;
}

/**
 * Modern smartphone mockup — slim uniform bezel, punch-hole camera,
 * rounded screen corners. Presents clean app screenshots edge-to-edge.
 */
export function PhoneFrame({
  children,
  className,
  bezel = 8,
  camera = true,
}: PhoneFrameProps) {
  return (
    <div
      className={cn(
        "relative rounded-[38px] bg-gradient-to-b from-[#1c1c22] to-[#101015] shadow-[0_40px_90px_-18px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.07)_inset]",
        className
      )}
      style={{ padding: bezel }}
    >
      {/* side buttons */}
      <span
        aria-hidden
        className="absolute -left-[2px] top-[18%] h-10 w-[3px] rounded-l bg-[#2a2a31]"
      />
      <span
        aria-hidden
        className="absolute -left-[2px] top-[26%] h-14 w-[3px] rounded-l bg-[#2a2a31]"
      />
      <span
        aria-hidden
        className="absolute -right-[2px] top-[22%] h-16 w-[3px] rounded-r bg-[#2a2a31]"
      />
      {/* screen */}
      <div className="relative aspect-[768/1344] overflow-hidden rounded-[30px] bg-black ring-1 ring-white/10">
        {children}
        {/* punch-hole camera */}
        {camera && (
          <span
            aria-hidden
            className="absolute left-1/2 top-[10px] z-10 h-[9px] w-[9px] -translate-x-1/2 rounded-full bg-black ring-1 ring-white/20"
          />
        )}
        {/* glass reflection */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.07)_0%,transparent_24%)]"
        />
      </div>
    </div>
  );
}
