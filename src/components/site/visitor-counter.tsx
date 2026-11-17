"use client";

import { useEffect, useState } from "react";
import { VISITOR_COUNTER_URL } from "@/lib/site-config";

/**
 * VisitorCounter — tiny live page-view badge for the footer's legal bar.
 * Increments the public abacus.jasoncameron.dev counter once per mount and
 * renders the total. If the service is unreachable (or the request fails),
 * the badge renders nothing — the layout never breaks because of it.
 */
export function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch(VISITOR_COUNTER_URL, { cache: "no-store", signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data: { value?: number }) => {
        if (typeof data?.value === "number") setCount(data.value);
      })
      .catch(() => {
        /* unreachable — stay hidden */
      });
    return () => controller.abort();
  }, []);

  if (count === null) return null;

  return (
    <p
      className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-white/30"
      title="Total page views counted since launch (public counter)"
    >
      <span
        aria-hidden
        className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#e6393f] shadow-[0_0_6px_rgba(230,57,63,0.7)]"
      />
      {count.toLocaleString("en-US")} total views
    </p>
  );
}
