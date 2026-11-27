"use client";

import { useCallback, useEffect, useState } from "react";
import { Disc3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "bitify-party-mode";

/**
 * PartyMode — the red button of the website.
 *
 * A floating pill (or the "p" key) flips `html.party` on and the whole
 * site hits the dance floor: four drifting disco blobs wash over the
 * page, equalizers go hyperspeed, the marquee sprints. Everything is
 * compositor-only animation, so even mid-party the page stays smooth.
 * Choice is remembered in localStorage and never fires for
 * reduced-motion visitors (CSS keeps the lights off for them).
 */
export function PartyMode() {
  const [on, setOn] = useState(false);
  const { toast } = useToast();

  // restore a previous session's choice once on mount
  // (state flips in a rAF callback so the effect body itself stays
  //  free of synchronous setState — no cascading renders)
  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") {
        document.documentElement.classList.add("party");
        const raf = requestAnimationFrame(() => setOn(true));
        return () => cancelAnimationFrame(raf);
      }
    } catch {
      /* private mode etc. — party on without memory */
    }
  }, []);

  const toggle = useCallback(() => {
    const next = !on;
    setOn(next);
    document.documentElement.classList.toggle("party", next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    } catch {
      /* ignore */
    }
    toast({
      title: next ? "Party mode: ON" : "Party mode: off",
      description: next
        ? "Bass boosted. The website is now dancing with you."
        : "Back to the chill lounge vibe.",
    });
  }, [on, toast]);

  // "p" toggles the party (ignored while typing)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "p" && e.key !== "P") return;
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.tagName === "SELECT" ||
          t.isContentEditable)
      ) {
        return;
      }
      toggle();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  return (
    <>
      {/* disco blobs — pure ambience, never interactive */}
      <div className="party-lights" aria-hidden>
        <i className="pl pl-1" />
        <i className="pl pl-2" />
        <i className="pl pl-3" />
        <i className="pl pl-4" />
      </div>

      <button
        type="button"
        onClick={toggle}
        aria-pressed={on}
        aria-label={
          on
            ? "Turn off party mode"
            : "Turn on party mode — disco lights across the site"
        }
        title={on ? "Party mode is on (press P)" : "Party mode (press P)"}
        className="party-btn"
      >
        <Disc3
          className={cn(
            "party-icon h-4 w-4",
            on ? "text-crimson-bright" : "text-crimson",
          )}
          aria-hidden
        />
        <span className="hidden sm:inline">
          {on ? "Party on" : "Party mode"}
        </span>
      </button>
    </>
  );
}
