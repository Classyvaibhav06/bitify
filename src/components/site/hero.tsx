"use client";

import { useRef, type CSSProperties } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, MonitorSmartphone } from "lucide-react";
import { Equalizer } from "./equalizer";
import { LaptopMockup } from "./devices/laptop-mockup";
import { DeviceShotImage } from "./devices/device-shot";
import { PhoneMockup } from "./devices/phone-mockup";
import { MOBILE_SCREENS, SCREENSHOTS, TV_SHOTS } from "@/lib/site-config";

/**
 * Hero — a cinematic product shoot in CSS.
 *
 * One near-black stage, three real devices and a full lighting
 * rig: a warm-white key spot behind the TV, crimson fills behind
 * the desktop and the phone, thin warm rims on every frame,
 * contact shadows and a muted reflective floor. The whole rig
 * fades in on load (`.hero-fade`), only the device backlights
 * breathe, and three parallax layers drift gently on scroll.
 * Entrance animations stay pure CSS (`.hero-rise*`) so the hero
 * renders before hydration; framer-motion only adds the parallax.
 */
export function Hero() {
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start end", "end start"],
  });

  // layered parallax rates — restrained; the further forward, the faster
  const tvY = useTransform(scrollYProgress, [0, 1], [-18, 42]);
  const laptopY = useTransform(scrollYProgress, [0, 1], [4, -30]);
  const phoneY = useTransform(scrollYProgress, [0, 1], [18, -58]);

  return (
    <section
      id="top"
      aria-label="Bitify Music — Your Music. Every Screen."
      className="grain relative overflow-hidden bg-[#080808]"
    >
      {/* ---- lighting rig: layered washes, fading in on load ---- */}
      <div
        aria-hidden
        className="hero-shell hero-fade absolute inset-0"
        style={{ "--d": "0.1s" } as CSSProperties}
      />
      <div
        aria-hidden
        className="hero-fade hairline-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_72%_60%_at_50%_36%,black,transparent)]"
        style={{ "--d": "0.35s", "--hero-fade-to": "0.4" } as CSSProperties}
      />
      {/* thin red light trails near the bottom edges */}
      <div
        aria-hidden
        className="hero-trail hero-trail-l hero-fade"
        style={{ "--d": "1.1s", "--hero-fade-to": "0.55" } as CSSProperties}
      />
      <div
        aria-hidden
        className="hero-trail hero-trail-r hero-fade"
        style={{ "--d": "1.25s", "--hero-fade-to": "0.55" } as CSSProperties}
      />

      <div className="relative z-10 mx-auto flex min-h-svh max-w-[1200px] flex-col items-center px-6 pb-16 pt-24 sm:pt-28">
        {/* ---- copy ---- */}
        <p
          className="hero-badge eyebrow flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 backdrop-blur-sm"
          style={{ "--d": "0.05s" } as CSSProperties}
        >
          <Equalizer bars={5} className="h-3.5" />
          Introducing Bitify Music
        </p>

        <h1
          className="hero-rise mt-6 text-center font-display text-[clamp(2.9rem,7.5vw,5.75rem)] font-bold leading-[0.98] tracking-[-0.03em]"
          style={{ "--d": "0.16s" } as CSSProperties}
        >
          <span className="block text-warm-white">Your Music.</span>
          <span className="hero-outline block" aria-hidden>
            Every Screen.
          </span>
          <span className="sr-only">Every Screen.</span>
        </h1>

        <p
          className="hero-rise mt-5 max-w-xl text-pretty text-center text-base leading-relaxed text-muted-warm sm:text-lg"
          style={{ "--d": "0.3s" } as CSSProperties}
        >
          One seamless music experience across your desktop, mobile, and TV.
        </p>

        <div
          className="hero-rise mt-8 flex flex-col items-center gap-4 sm:flex-row"
          style={{ "--d": "0.44s" } as CSSProperties}
        >
          <a
            href="#experience"
            className="group inline-flex items-center gap-2.5 rounded-full bg-crimson px-7 py-3.5 text-sm font-semibold tracking-wide text-white shadow-[0_12px_40px_-8px_rgba(240,50,60,0.6)] transition-all duration-300 hover:scale-[1.02] hover:bg-crimson-bright hover:shadow-[0_16px_52px_-8px_rgba(240,50,60,0.75)]"
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
        </div>

        {/* ---- device stage — TV behind, laptop front-left, phone front-right ---- */}
        <div
          ref={stageRef}
          className="relative mt-12 h-[400px] w-full max-w-[1040px] sm:h-[540px] lg:h-[580px]"
          aria-label="Bitify Music running on a TV, laptop and smartphone"
        >
          {/* TV — real photo cutout, rearmost layer, lit from behind */}
          <motion.div
            style={reduce ? undefined : { y: tvY }}
            className="absolute left-1/2 top-0 w-[100%] -translate-x-1/2 sm:w-[86%] lg:w-[74%]"
          >
            <div
              className="hero-rise-stage relative"
              style={{ "--d": "0.55s" } as CSSProperties}
            >
              {/* backlight — warm key light + crimson wash behind the panel */}
              <div aria-hidden className="hero-tv-backlight" />
              {/* warm-white rim + crimson glow tracing the real bezel */}
              <div className="hero-tv-light">
                <DeviceShotImage
                  shot={TV_SHOTS.nowplaying}
                  priority
                  fit="width"
                  sizes="(max-width: 640px) 96vw, 76vw"
                />
              </div>
              {/* contact shadow + light pool under the stand */}
              <div aria-hidden className="hero-tv-floor" />
            </div>
          </motion.div>

          {/* laptop — middle layer, a real 3D clamshell front-left */}
          <motion.div
            style={reduce ? undefined : { y: laptopY }}
            className="absolute bottom-[1%] left-[-2%] w-[90%] sm:bottom-[2%] sm:left-[2%] sm:w-[62%] lg:bottom-[1%] lg:left-[1%] lg:w-[57%]"
          >
            <div
              className="hero-rise-stage"
              style={{ "--d": "0.72s" } as CSSProperties}
            >
              <LaptopMockup>
                <Image
                  src={SCREENSHOTS.desktop.hero}
                  alt="Bitify Music desktop application — home view with library and player"
                  fill
                  priority
                  sizes="(max-width: 640px) 90vw, 57vw"
                  className="object-cover object-top"
                />
              </LaptopMockup>
            </div>
          </motion.div>

          {/* phone — front layer, CSS body around a real app screenshot */}
          <motion.div
            style={reduce ? undefined : { y: phoneY }}
            className="absolute bottom-[0%] right-[1%] sm:bottom-[2%] sm:right-[5%] lg:right-[4%]"
          >
            <div
              className="hero-rise-stage hero-rise-rotate relative"
              style={{ "--d": "0.9s" } as CSSProperties}
            >
              <motion.div
                animate={reduce ? undefined : { y: [0, -8, 0] }}
                transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
                className="rotate-[3deg] [--pw:min(26vw,168px)] sm:[--pw:min(19vw,196px)] lg:[--pw:204px]"
              >
                <div className="relative">
                  {/* controlled red glow hugging the phone */}
                  <div aria-hidden className="phone-glow" />
                  {/* delicate warm-white rim on the body */}
                  <div className="hero-phone-rim">
                    <PhoneMockup
                      screen={MOBILE_SCREENS.nowplaying}
                      priority
                      sizes="(max-width: 640px) 26vw, 204px"
                    />
                  </div>
                  {/* contact shadow + red pool on the floor */}
                  <div aria-hidden className="hero-phone-shadow" />
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* stage floor — muted red & warm-white reflections under the devices */}
          <div aria-hidden className="hero-floor" />
        </div>
      </div>

      {/* fade into next section */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background"
      />
    </section>
  );
}
