"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Returns `false` during SSR and the hydration render, `true` afterwards.
 * Lets components render SSR-visible markup and only apply mount animations
 * to elements created after hydration (e.g. tab-switch views) — without
 * calling setState inside an effect.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
