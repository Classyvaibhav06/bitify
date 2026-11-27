import { cn } from "@/lib/utils";
import { LogoMark } from "./logo-mark";

interface BrandLogoProps {
  className?: string;
  /** overall height of the mark (wordmark scales with it) */
  size?: "sm" | "md";
  /** animate the waveform mark like a live equalizer */
  animated?: boolean;
}

/**
 * Bitify Music brand lockup — the new waveform LogoMark paired with the
 * wordmark: "Bitify" in the display face + a mono "MUSIC" tag. Hovering
 * the lockup tints the bars crimson (see `.logo-lockup` in globals.css).
 */
export function BrandLogo({ className, size = "md", animated = true }: BrandLogoProps) {
  return (
    <span className={cn("logo-lockup group inline-flex items-center", className)}>
      <LogoMark
        animated={animated}
        className={cn(size === "sm" ? "h-7 w-7" : "h-9 w-9 sm:h-10 sm:w-10")}
      />
      <span
        className={cn(
          "ml-2.5 font-display font-bold tracking-tight text-warm-white",
          size === "sm" ? "text-lg" : "text-xl sm:text-[1.35rem]"
        )}
      >
        Bitify
      </span>
      <span
        aria-hidden
        className={cn(
          "mx-2 h-4 w-px bg-white/15",
          size === "sm" ? "hidden sm:block" : "hidden sm:block"
        )}
      />
      <span
        className={cn(
          "font-mono font-medium uppercase tracking-[0.3em] text-crimson-bright",
          size === "sm" ? "hidden text-[9px] sm:inline" : "hidden text-[10px] sm:inline"
        )}
      >
        Music
      </span>
    </span>
  );
}
