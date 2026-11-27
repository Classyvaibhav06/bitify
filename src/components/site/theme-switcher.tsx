"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

/**
 * ThemeSwitcher — the site's colour dial.
 *
 * Every accent on the page (buttons, glows, gradients, the seekbar
 * waveform, the hover cards) is wired to the `--crimson*` CSS vars,
 * so swapping `<html data-theme="…">` re-skins the whole site in one
 * paint. The choice is persisted to localStorage, restored before
 * first paint by the head script (no crimson flash), and broadcast
 * via a `bitify-theme` CustomEvent so canvas-based bits (the scroll
 * waveform) can re-read their colours.
 */

export const THEME_IDS = ["crimson", "violet", "amber", "emerald", "cyan"] as const;
export type ThemeId = (typeof THEME_IDS)[number];

const THEMES: { id: ThemeId; label: string; swatch: string }[] = [
  { id: "crimson", label: "Crimson", swatch: "#f0323c" },
  { id: "violet", label: "Violet", swatch: "#8b5cf6" },
  { id: "amber", label: "Amber", swatch: "#f59e0b" },
  { id: "emerald", label: "Emerald", swatch: "#10b981" },
  { id: "cyan", label: "Cyan", swatch: "#06b6d4" },
];

const STORAGE_KEY = "bitify-theme";
export const THEME_EVENT = "bitify-theme";

function applyTheme(id: ThemeId) {
  const root = document.documentElement;
  if (id === "crimson") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", id);
  }
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    /* private mode — theme just won't persist */
  }
  window.dispatchEvent(new CustomEvent<ThemeId>(THEME_EVENT, { detail: id }));
}

export function ThemeSwitcher({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  // null until the popover first opens — the active swatch is read
  // from the DOM at that point (the head script owns the truth)
  const [theme, setTheme] = useState<ThemeId | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();

  const toggle = () => {
    if (!open && theme === null) {
      const attr = document.documentElement.getAttribute("data-theme");
      setTheme(
        THEME_IDS.includes(attr as ThemeId) ? (attr as ThemeId) : "crimson"
      );
    }
    setOpen(!open);
  };

  // close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pick = useCallback(
    (id: ThemeId) => {
      setTheme(id);
      applyTheme(id);
      setOpen(false);
      toast({
        description: `${THEMES.find((t) => t.id === id)?.label} theme on — whole site re-lit.`,
        duration: 2200,
      });
    },
    [toast]
  );

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Change colour theme"
        title="Colour theme"
        className={cn(
          "inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-warm-white transition-all duration-300 hover:border-white/25 hover:bg-white/[0.08]",
          open && "border-white/25 bg-white/[0.08]"
        )}
      >
        <Palette className="h-[18px] w-[18px]" aria-hidden />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            role="radiogroup"
            aria-label="Colour theme"
            className="absolute right-0 top-[calc(100%+0.625rem)] z-50 w-[248px] rounded-2xl border border-white/10 bg-[#0d0d11]/95 p-4 shadow-[0_24px_70px_-18px_rgba(0,0,0,0.9)] backdrop-blur-xl"
          >
            <p className="px-0.5 font-mono text-[10px] uppercase tracking-[0.28em] text-white/35">
              Colour theme
            </p>

            <div className="mt-3 grid grid-cols-5 gap-1.5">
              {THEMES.map((t) => {
                const active = theme === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => pick(t.id)}
                    title={t.label}
                    className="group flex flex-col items-center gap-1.5 rounded-xl px-1 py-2 transition-colors duration-200 hover:bg-white/[0.05]"
                  >
                    <span
                      className={cn(
                        "relative block size-7 rounded-full transition-transform duration-200 group-hover:scale-110",
                        active && "scale-110"
                      )}
                      style={{
                        background: `linear-gradient(160deg, ${t.swatch}, ${t.swatch}cc)`,
                        boxShadow: active
                          ? `0 0 18px -2px ${t.swatch}, inset 0 1px 0 rgba(255,255,255,0.35)`
                          : "inset 0 1px 0 rgba(255,255,255,0.25)",
                      }}
                    >
                      <span
                        className="absolute inset-0 rounded-full border transition-colors duration-200"
                        style={{
                          borderColor: active
                            ? "rgba(255,255,255,0.9)"
                            : "rgba(255,255,255,0.12)",
                        }}
                        aria-hidden
                      />
                    </span>
                    <span
                      className={cn(
                        "font-mono text-[9px] uppercase tracking-wider",
                        active ? "text-warm-white" : "text-white/35"
                      )}
                    >
                      {t.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="mt-3 border-t border-white/[0.06] px-0.5 pt-2.5 text-[11px] leading-snug text-muted-warm">
              Buttons, glows, the waveform — everything re-tints instantly.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
