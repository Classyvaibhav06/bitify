"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * macOS-style window chrome around app screenshots,
 * matching the platform the desktop captures were taken on.
 */
export function WindowFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-white/10 bg-[#101014] shadow-[0_40px_100px_-24px_rgba(0,0,0,0.85)]",
        className
      )}
    >
      {/* title bar */}
      <div className="flex items-center gap-2 border-b border-white/[0.07] bg-[#16161c] px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/80" />
        </span>
        <span className="mx-auto pr-10 font-mono text-[10px] uppercase tracking-[0.25em] text-white/35">
          Bitify Music
        </span>
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}
