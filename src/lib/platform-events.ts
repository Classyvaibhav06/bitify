import type { PlatformId } from "./site-config";

/**
 * Cross-section platform selection events.
 * Lets "Explore Desktop/Mobile/TV" CTAs focus a platform in the
 * ecosystem section without page navigation.
 */

const EVENT = "bitify:select-platform";

export function selectPlatform(id: PlatformId) {
  document.getElementById("ecosystem")?.scrollIntoView({ behavior: "smooth" });
  // slight delay so the section is in view when the switch animates
  window.setTimeout(() => {
    window.dispatchEvent(new CustomEvent<PlatformId>(EVENT, { detail: id }));
  }, 350);
}

export function onPlatformSelect(handler: (id: PlatformId) => void) {
  const listener = (e: Event) => handler((e as CustomEvent<PlatformId>).detail);
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}
