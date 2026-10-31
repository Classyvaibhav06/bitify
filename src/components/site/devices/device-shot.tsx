"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { DeviceShot } from "@/lib/site-config";
import { cn } from "@/lib/utils";

interface DeviceShotImageProps {
  shot: DeviceShot;
  /** rendered height class (width follows the intrinsic aspect ratio) */
  className?: string;
  /** sizes attribute for next/image optimization hints */
  sizes?: string;
  priority?: boolean;
  /** gentle idle float (disabled for reduced-motion users) */
  float?: boolean;
  floatDuration?: number;
  /** "height" sizes by height (width auto); "width" spans full width */
  fit?: "height" | "width";
}

/**
 * Presents a real device cutout (transparent-background WebP that keeps its
 * own physical bezel). The image is never cropped or distorted — it is sized
 * by height and the width follows the intrinsic aspect ratio.
 */
export function DeviceShotImage({
  shot,
  className,
  sizes = "(max-width: 760px) 60vw, 340px",
  priority = false,
  float = false,
  floatDuration = 7,
  fit = "height",
}: DeviceShotImageProps) {
  const reduce = useReducedMotion();

  const img = (
    <Image
      src={shot.src}
      alt={shot.alt}
      width={shot.width}
      height={shot.height}
      sizes={sizes}
      priority={priority}
      draggable={false}
      className={cn(
        "select-none [filter:drop-shadow(0_34px_60px_rgba(0,0,0,0.62))]",
        fit === "width" ? "w-full" : "h-full w-auto",
        className
      )}
    />
  );

  if (float && !reduce) {
    return (
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: floatDuration, repeat: Infinity, ease: "easeInOut" }}
        className="flex h-full items-start justify-center"
      >
        {img}
      </motion.div>
    );
  }

  return <div className="flex h-full items-start justify-center">{img}</div>;
}
