import Image from "next/image";
import { cn } from "@/lib/utils";
import { Equalizer } from "./equalizer";

interface BrandLogoProps {
  className?: string;
  /** show wordmark next to the raster logo lockup */
  withEqualizer?: boolean;
  /** show the "Bitify" wordmark next to the mark (used in the navbar) */
  withWordmark?: boolean;
  priority?: boolean;
}

/**
 * Bitify Music brand lockup.
 * Uses the official brand asset as a transparent-background PNG, so the
 * white equalizer mark sits cleanly on the dark page background.
 */
export function BrandLogo({ className, withEqualizer = false, withWordmark = false, priority }: BrandLogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <Image
        src="/assets/brand/bitify-logo.png"
        alt="Bitify Music"
        width={648}
        height={648}
        priority={priority}
        className="h-full w-auto select-none"
      />
      {withWordmark && (
        <span
          aria-hidden="true"
          className="font-display -translate-y-[3px] select-none text-[1.2rem] font-bold leading-none tracking-tight text-warm-white sm:text-[1.35rem]"
        >
          Bitify
        </span>
      )}
      {withEqualizer && <Equalizer bars={4} className="h-3.5 opacity-70" />}
    </span>
  );
}
