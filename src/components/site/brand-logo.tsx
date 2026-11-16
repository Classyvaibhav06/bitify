import Image from "next/image";
import { cn } from "@/lib/utils";
import { Equalizer } from "./equalizer";

interface BrandLogoProps {
  className?: string;
  /** show wordmark next to the raster logo lockup */
  withEqualizer?: boolean;
  priority?: boolean;
}

/**
 * Bitify Music brand lockup.
 * Uses the official brand asset as a transparent-background PNG, so the
 * white equalizer mark sits cleanly on the dark page background.
 */
export function BrandLogo({ className, withEqualizer = false, priority }: BrandLogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <Image
        src="/assets/brand/bitify-logo.png"
        alt="Bitify Music"
        width={598}
        height={739}
        priority={priority}
        className="h-full w-auto select-none"
      />
      {withEqualizer && <Equalizer bars={4} className="h-3.5 opacity-70" />}
    </span>
  );
}
