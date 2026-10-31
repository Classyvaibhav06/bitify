import Image from "next/image";
import type { MobileScreen } from "@/lib/site-config";
import { cn } from "@/lib/utils";

/**
 * PhoneMockup — a phone body built entirely in CSS that presents a real app
 * screenshot. The screen uses object-cover inside a fixed 1 : 2 body, so every
 * screenshot keeps its artwork and true proportions (never re-photographed,
 * never wrapped in another device, never distorted).
 *
 * Sizing: the parent controls the width through the `--pw` custom property
 * (defaults to 300px). Everything — bezel, corner radius, camera, buttons —
 * derives from it, so one component scales cleanly from mobile to desktop.
 */

interface PhoneMockupProps {
  screen: MobileScreen;
  /** next/image sizes hint */
  sizes?: string;
  priority?: boolean;
  className?: string;
  /** show the faint glass reflection sweep (default true) */
  glare?: boolean;
}

export function PhoneMockup({
  screen,
  sizes = "(max-width: 640px) 56vw, 320px",
  priority = false,
  className,
  glare = true,
}: PhoneMockupProps) {
  return (
    <div className={cn("phone-mockup", className)} aria-hidden={false}>
      {/* physical side keys */}
      <span aria-hidden className="pm-key pm-key-vol" />
      <span aria-hidden className="pm-key pm-key-power" />

      <div className="pm-screen">
        <Image
          src={screen.src}
          alt={screen.alt}
          width={screen.width}
          height={screen.height}
          sizes={sizes}
          priority={priority}
          placeholder="blur"
          blurDataURL={screen.blur}
          draggable={false}
          className="h-full w-full select-none object-cover"
        />
        {glare && <span aria-hidden className="pm-glare" />}
        <span aria-hidden className="pm-camera" />
      </div>
    </div>
  );
}
