"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

/** every surface Bitify runs on — the accent word flips through them */
const WORDS = ["screen", "phone", "TV", "desktop"] as const;

/**
 * KineticWord — the headline's gold-foil accent flipping through every
 * screen Bitify runs on. The slot's width eases to the live word's own
 * width (measured after each flip), so "every ___." always reads as one
 * tight sentence while the line glides back to center — no phantom gaps,
 * no reflow jumps. The word itself rises out of a blur on each change.
 */
export function KineticWord({ intervalMs = 2600 }: { intervalMs?: number }) {
  const [wi, setWi] = useState(0);
  const slotRef = useRef<HTMLSpanElement>(null);
  const wordRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const t = setInterval(
      () => setWi((w) => (w + 1) % WORDS.length),
      intervalMs
    );
    return () => clearInterval(t);
  }, [intervalMs]);

  /* ease the slot to the live word's exact width before paint */
  useLayoutEffect(() => {
    const w = wordRef.current?.offsetWidth;
    if (w && slotRef.current) slotRef.current.style.width = `${w}px`;
  }, [wi]);

  const shown = wi;

  return (
    <span className="hero-word-slot" ref={slotRef} aria-hidden>
      <i key={shown} ref={wordRef} className="hero-word">
        <span className="font-serif-accent gold-foil">{WORDS[shown]}.</span>
      </i>
    </span>
  );
}
