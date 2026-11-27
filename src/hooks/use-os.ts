"use client";

import { useSyncExternalStore } from "react";
import {
  DOWNLOADS,
  OS_META,
  type DesktopOs,
} from "@/lib/site-config";

/**
 * OS auto-detection — powers the "Download for <your OS>" smart CTAs.
 *
 * The initial state is "windows" so server HTML and the first client
 * render always match (no hydration mismatch); the real OS is resolved
 * in an effect and the UI swaps in afterwards.
 */
export type DetectedOs =
  | "windows"
  | "macos"
  | "linux"
  | "android"
  | "ios"
  | "unknown";

function detectOs(): DetectedOs {
  if (typeof navigator === "undefined") return "windows";
  const ua = navigator.userAgent;

  if (/android/i.test(ua)) return "android";
  if (/iphone|ipad|ipod/i.test(ua)) return "ios";

  // iPadOS 13+ masquerades as desktop Safari on a Mac
  if (/Macintosh/i.test(ua) && /Touch/i.test(ua) && !/Chrome/i.test(ua)) {
    return "ios";
  }

  const uaData = (
    navigator as Navigator & {
      userAgentData?: { platform?: string };
    }
  ).userAgentData;
  const platform = String(
    uaData?.platform ?? navigator.platform ?? ua
  ).toLowerCase();

  if (platform.includes("mac") || /mac os x/i.test(ua)) return "macos";
  if (platform.includes("win") || /windows/i.test(ua)) return "windows";
  if (platform.includes("linux") || /linux|x11/i.test(ua)) return "linux";
  return "unknown";
}

/** The visitor's OS — "windows" on the server, real OS after hydration. */
export function useOs(): DetectedOs {
  // The OS never changes during a session, so there is nothing to subscribe
  // to; useSyncExternalStore simply gives us a hydration-safe client-only
  // read (server snapshot = "windows") without setState-in-effect.
  return useSyncExternalStore(
    subscribeOs,
    detectOs,
    getServerOs
  );
}

const subscribeOs = () => () => {};
const getServerOs = (): DetectedOs => "windows";

export interface PrimaryDownload {
  url: string;
  /** CTA label, e.g. "Download for macOS" */
  label: string;
  /** which desktop OS tab this points at (null for APK / anchor) */
  os: DesktopOs | null;
}

const desktop = DOWNLOADS.find((d) => d.id === "desktop");
const mobile = DOWNLOADS.find((d) => d.id === "mobile");

/** Resolve the smart primary download for a detected OS. */
export function resolvePrimaryDownload(os: DetectedOs): PrimaryDownload {
  switch (os) {
    case "android":
      return {
        url: mobile?.downloadUrl ?? "#downloads",
        label: "Download for Android",
        os: null,
      };
    case "macos": {
      const build = desktop?.builds.find(
        (b) => b.os === "macos" && b.arch === "Apple Silicon"
      );
      return {
        url: build?.url ?? desktop?.downloadUrl ?? "#downloads",
        label: "Download for macOS",
        os: "macos",
      };
    }
    case "linux": {
      const build = desktop?.builds.find((b) => b.os === "linux");
      return {
        url: build?.url ?? desktop?.downloadUrl ?? "#downloads",
        label: "Download for Linux",
        os: "linux",
      };
    }
    case "ios":
      // no native iOS build — walk them to the downloads section
      return { url: "#downloads", label: "Get Bitify Music", os: null };
    default:
      return {
        url: desktop?.downloadUrl ?? "#downloads",
        label: "Download for Windows",
        os: "windows",
      };
  }
}

/** Map a detected OS to the desktop tab it should auto-select. */
export function desktopTabFor(os: DetectedOs): DesktopOs {
  if (os === "macos" || os === "linux") return os;
  return "windows";
}

export { OS_META };
