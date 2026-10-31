"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, MonitorSmartphone } from "lucide-react";
import { Equalizer } from "./equalizer";
import { MonitorFrame } from "./devices/monitor-frame";
import { TvFrame } from "./devices/tv-frame";
import { TvScreenPlate } from "./devices/tv-screen-plate";
import { SCREENSHOTS } from "@/lib/site-config";

const ease = [0.21, 0.47, 0.32, 0.98] as const;

export function Hero() {
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start end", "end start"],
  });

  // layered parallax rates
  const tvY = useTransform(scrollYProgress, [0, 1], [-26, 60]);
  const monitorY = useTransform(scrollYProgress, [0, 1], [4, -44]);
  const phoneY = useTransform(scrollYProgress, [0, 1], [26, -84]);

  const anim = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 26 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, delay, ease },
  });

  return (
    <section
      id="top"
      aria-label="Bitify Music — Your Music. Every Screen."
      className="grain relative overflow-hidden"
    >
      {/* atmosphere */}
      <div aria-hidden className="glow-crimson absolute inset-0" />
      <div aria-hidden className="glow-violet absolute inset-0" />
      <div aria-hidden className="hairline-grid absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_75%_65%_at_50%_35%,black,transparent)]" />

      <div className="relative z-10 mx-auto flex min-h-svh max-w-[1200px] flex-col items-center px-6 pb-6 pt-24 sm:pt-28">
        {/* ---- copy ---- */}
        <motion.p
          {...anim(0.05)}
          className="eyebrow flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 backdrop-blur-sm"
        >
          <Equalizer bars={4} className="h-2.5" />
          Introducing Bitify Music
        </motion.p>

        <motion.h1
          {...anim(0.16)}
          className="mt-6 text-center font-display text-[clamp(2.75rem,7vw,5.25rem)] font-bold leading-[0.98] tracking-[-0.03em]"
        >
          <span className="block text-warm-white">Your Music.</span>
          <span className="text-outline block" aria-hidden>
            Every Screen.
          </span>
          <span className="sr-only">Every Screen.</span>
        </motion.h1>

        <motion.p
          {...anim(0.3)}
          className="mt-5 max-w-xl text-pretty text-center text-base leading-relaxed text-muted-warm sm:text-lg"
        >
          One seamless music experience across your desktop, mobile, and TV.
        </motion.p>

        <motion.div
          {...anim(0.44)}
          className="mt-8 flex flex-col items-center gap-4 sm:flex-row"
        >
          <a
            href="#experience"
            className="group inline-flex items-center gap-2.5 rounded-full bg-crimson px-7 py-3.5 text-sm font-semibold tracking-wide text-white shadow-[0_12px_40px_-8px_rgba(224,57,62,0.6)] transition-all duration-300 hover:scale-[1.02] hover:bg-crimson-bright hover:shadow-[0_16px_52px_-8px_rgba(224,57,62,0.75)]"
          >
            Explore Bitify
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
          </a>
          <a
            href="#downloads"
            className="group inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.03] px-7 py-3.5 text-sm font-semibold tracking-wide text-warm-white backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:bg-white/[0.07]"
          >
            <MonitorSmartphone className="h-4 w-4 text-muted-warm transition-colors group-hover:text-warm-white" aria-hidden />
            Download for PC
          </a>
        </motion.div>

        {/* ---- device stage ---- */}
        <div
          ref={stageRef}
          className="relative mt-10 h-[380px] w-full max-w-[980px] sm:h-[440px] lg:h-[470px]"
          aria-label="Bitify Music running on a TV, desktop monitor and smartphone"
        >
          {/* TV — rearmost layer */}
          <motion.div
            style={reduce ? undefined : { y: tvY }}
            initial={reduce ? false : { opacity: 0, y: 70, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.3, delay: 0.55, ease }}
            className="absolute left-1/2 top-0 w-[88%] -translate-x-1/2 sm:w-[76%] lg:w-[68%]"
          >
            <TvFrame stand={false}>
              <TvScreenPlate variant="minimal" />
            </TvFrame>
          </motion.div>

          {/* monitor — middle layer */}
          <motion.div
            style={reduce ? undefined : { y: monitorY }}
            initial={reduce ? false : { opacity: 0, y: 90, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.3, delay: 0.72, ease }}
            className="absolute bottom-0 left-[0%] w-[66%] sm:left-[4%] sm:w-[58%] lg:w-[54%]"
          >
            <MonitorFrame parallax={false}>
              <Image
                src={SCREENSHOTS.desktop.hero}
                alt="Bitify Music desktop application — home view with library and player"
                fill
                priority
                sizes="(max-width: 640px) 66vw, 54vw"
                className="object-cover object-top"
              />
            </MonitorFrame>
          </motion.div>

          {/* phone — front layer */}
          <motion.div
            style={reduce ? undefined : { y: phoneY }}
            initial={reduce ? false : { opacity: 0, y: 110, rotate: 2 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 1.3, delay: 0.9, ease }}
            className="absolute bottom-0 right-[2%] w-[28%] min-w-[120px] sm:bottom-4 sm:right-[6%] sm:w-[20%] lg:w-[17%]"
          >
            <motion.div
              animate={reduce ? undefined : { y: [0, -7, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="device-shadow relative aspect-[674/1396] overflow-hidden rounded-[26px] ring-1 ring-white/15"
            >
              <Image
                src={SCREENSHOTS.mobile.hero}
                alt="Bitify Music mobile application — Listen Now home screen"
                fill
                priority
                sizes="(max-width: 640px) 28vw, 17vw"
                className="object-cover"
              />
              {/* light catch on the glass */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-[26px] bg-[linear-gradient(115deg,rgba(255,255,255,0.1)_0%,transparent_22%)]"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* scroll hint */}
        <motion.a
          href="#experience"
          {...anim(1.25)}
          className="group mt-9 hidden flex-col items-center gap-3 text-white/30 transition-colors hover:text-white/60 sm:flex"
          aria-label="Scroll to explore"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.35em]">Scroll</span>
          <span className="relative h-10 w-px overflow-hidden bg-white/15">
            <motion.span
              className="absolute inset-x-0 top-0 h-1/2 bg-crimson"
              animate={reduce ? undefined : { y: ["-100%", "220%"] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </motion.a>
      </div>

      {/* fade into next section */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background"
      />
    </section>
  );
}
