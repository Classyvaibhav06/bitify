"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** delay in seconds */
  delay?: number;
  /** distance in px the element travels up */
  y?: number;
  className?: string;
  once?: boolean;
}

/**
 * Scroll-triggered reveal wrapper.
 * Automatically disabled for users preferring reduced motion.
 *
 * Robustness: uses framer-motion's `useInView` with `fallback: true` so that
 * environments without a working IntersectionObserver (some sandboxed
 * iframes / preview panes) still reveal the content. A short mount-time
 * safety net additionally forces visibility after 1.2s so nothing ever stays
 * stuck at opacity 0.
 */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  once = true,
}: RevealProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    once,
    amount: 0.05,
    fallback: true,
  });
  const [safeVisible, setSafeVisible] = useState(false);

  useEffect(() => {
    if (inView) return;
    const t = setTimeout(() => setSafeVisible(true), 1200);
    return () => clearTimeout(t);
  }, [inView]);

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  const shown = inView || safeVisible;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.9, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerProps {
  children: ReactNode;
  className?: string;
  /** stagger between children in seconds */
  interval?: number;
}

/** Container that staggers its direct children reveals. */
export function StaggerGroup({ children, className, interval = 0.09 }: StaggerProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    once: true,
    amount: 0.05,
    fallback: true,
  });
  const [safeVisible, setSafeVisible] = useState(false);

  useEffect(() => {
    if (inView) return;
    const t = setTimeout(() => setSafeVisible(true), 1200);
    return () => clearTimeout(t);
  }, [inView]);

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  const shown = inView || safeVisible;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={shown ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: interval } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  y = 24,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
