"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * LiveVideo — a real screen recording presented as a living capture.
 *
 * The video always starts muted (autoplay-safe, and the page never talks
 * over the visitor); a small control on the surface toggles the sound on
 * a user gesture. It pauses itself whenever it leaves the viewport or
 * whenever the parent hides it (e.g. another view pill is selected), so
 * it never burns CPU in the background. If the recording can't load at
 * all, `onError` lets the parent fall back to the matching still shot.
 */
interface LiveVideoProps {
  src: string;
  poster: string;
  alt: string;
  /** parent-driven pause (e.g. another tab/pill is active) */
  paused?: boolean;
  /** fires when the recording can't load — parent shows the still instead */
  onError?: () => void;
  /** show the "LIVE" badge (default true) */
  badge?: boolean;
  className?: string;
}

export function LiveVideo({
  src,
  poster,
  alt,
  paused = false,
  onError,
  badge = true,
  className,
}: LiveVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [flash, setFlash] = useState<"idle" | "on" | "off">("idle");

  /* pause off-screen, resume on-screen (unless parent-paused). If the
     recording was left unmuted, a gesture-less resume can be blocked —
     fall back to muted playback rather than freezing the frame. */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const resume = () =>
      v.play().catch(() => {
        v.muted = true;
        setMuted(true);
        v.play().catch(() => {});
      });
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !paused) resume();
          else if (!e.isIntersecting) v.pause();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [paused]);

  /* parent-driven pause */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (paused) v.pause();
    else
      v.play().catch(() => {
        v.muted = true;
        setMuted(true);
        v.play().catch(() => {});
      });
  }, [paused]);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    setFlash(v.muted ? "off" : "on");
    if (!v.muted) v.play().catch(() => {});
    window.setTimeout(() => setFlash("idle"), 1400);
  }, []);

  return (
    <div className={cn("live-video relative h-full w-full", className)}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onError={(e) => onError?.()}
        aria-label={alt}
        className="h-full w-full select-none object-cover"
      />

      {/* control cluster — badge + sound toggle ride the top-left corner,
          away from the phone that leans on the chassis's bottom-right */}
      <div className="lv-topbar">
        {badge && (
          <span className="lv-badge" aria-hidden>
            <i className="lv-dot" />
            LIVE
          </span>
        )}

        {/* sound toggle — the recording is muted until asked for */}
        <button
          type="button"
          onClick={toggleMute}
          data-state={muted ? "muted" : "sound"}
          aria-label={muted ? "Unmute the recording" : "Mute the recording"}
          className="lv-sound"
        >
          {muted ? (
            <VolumeX className="h-4 w-4" aria-hidden />
          ) : (
            <Volume2 className="h-4 w-4" aria-hidden />
          )}
          <span className="lv-sound-tip" data-flash={flash}>
            {muted ? "Play with sound" : "Muted"}
          </span>
        </button>
      </div>
    </div>
  );
}
