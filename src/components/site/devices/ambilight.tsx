import { cn } from "@/lib/utils";

interface AmbilightProps {
  className?: string;
  /** overall intensity of the rear lights (0–1) */
  intensity?: number;
}

/**
 * Ambilight — soft rear lights for a real device cutout photo.
 *
 * Renders two layers behind the sibling photo: a wide, slowly
 * breathing halo (crimson core, violet rim) and a tighter edge-glow
 * strip that hugs the frame silhouette. Because both layers use
 * negative z-index they must live inside a `relative` wrapper that
 * holds the device image — see the TV hero, TV experience and the
 * downloads section.
 */
export function Ambilight({ className, intensity = 1 }: AmbilightProps) {
  return (
    <>
      <div
        aria-hidden
        className={cn("amb-halo", className)}
        style={intensity !== 1 ? { opacity: intensity } : undefined}
      />
      <div
        aria-hidden
        className="amb-edge"
        style={intensity !== 1 ? { opacity: intensity } : undefined}
      />
    </>
  );
}
