"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, MoveHorizontal } from "lucide-react";
import { Reveal } from "./reveal";
import { DESKTOP_SHOTS } from "@/lib/site-config";
import { cn } from "@/lib/utils";

/**
 * Showcase — the rotating stage.
 *
 * Desktop (md+): one large frame whose image area is aspect-locked to the
 * real capture (1497×967), so the whole screen is always visible — never
 * cropped, never zoomed. The three captures crossfade like record sleeves
 * while story-style progress bars fill along the top. The clock is pure
 * CSS: the active fill's `animationend` advances the slide, so pausing
 * the fill (hover) pauses the slideshow in perfect sync — zero timers to
 * drift. Arrows and the filmstrip beneath jump anywhere; the stage only
 * starts rotating once it has actually been seen.
 *
 * Mobile: the same three screens become a hand-sized snap carousel —
 * swipe through cards that peek at the edges, with pill dots tracking
 * the card nearest to centre. Captions move *below* the frame so the
 * artwork stays clean on a small display.
 */
const CARDS = [
  {
    ...DESKTOP_SHOTS[0],
    kicker: "Home",
    title: "Every song you love, one warm dashboard.",
    desc: "Listening stats, song mixes and Listen Again shelves — your taste, front and centre.",
  },
  {
    ...DESKTOP_SHOTS[1],
    kicker: "Now Playing",
    title: "Turn the volume up on the words.",
    desc: "Album art on the left, word-synced karaoke lyrics on the right — full-screen, no clutter.",
  },
  {
    ...DESKTOP_SHOTS[2],
    kicker: "Explore",
    title: "Find your next favourite.",
    desc: "Moods & genres, fresh releases and the charts — one tap away from anything.",
  },
] as const;

export function Showcase() {
  const [current, setCurrent] = useState(0);
  const [armed, setArmed] = useState(false);
  const [mCurrent, setMCurrent] = useState(0);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const go = useCallback((i: number) => {
    const n = ((i % CARDS.length) + CARDS.length) % CARDS.length;
    setCurrent(n);
  }, []);

  /* the stage only starts rotating once it has been seen — no burned
     cycles while it is still above/below the viewport */
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setArmed(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // carousel: which card is nearest the centre? (mobile, rAF-throttled)
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = track.getBoundingClientRect();
      const centre = mid.left + mid.width / 2;
      let best = 0;
      let bestDist = Infinity;
      Array.from(track.children).forEach((el, i) => {
        const r = (el as HTMLElement).getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - centre);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setMCurrent(best);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const scrollToCard = (i: number) => {
    const card = trackRef.current?.children[i] as HTMLElement | undefined;
    card?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  return (
    <section
      id="showcase"
      aria-label="Showcase — inside the Bitify Music desktop app"
      className="relative"
    >
      {/* ---- header ---- */}
      <div className="mx-auto max-w-[1200px] px-6 pt-20 sm:pt-28">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">
            <span className="eyebrow-idx">01</span>
            Showcase
          </p>
          <h2 className="mt-5 font-display text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-warm-white sm:text-5xl">
            Step inside{" "}
            <span className="text-crimson-bright">the app.</span>
          </h2>
          <p className="mt-6 text-pretty text-base leading-relaxed text-muted-warm sm:text-lg">
            Real screens from the desktop build —{" "}
            <span className="md:hidden">swipe through them like album art.</span>
            <span className="hidden md:inline">
              every pixel of the real thing, rotating like record sleeves.
            </span>
          </p>
          {/* hint — swipe on phones */}
          <p className="mt-9 inline-flex items-center gap-2 text-xs font-medium text-white/35 md:hidden">
            Swipe
            <MoveHorizontal
              className="h-3.5 w-3.5 text-crimson-bright"
              aria-hidden
            />
          </p>
        </Reveal>
      </div>

      {/* ---- the stage (desktop) — one frame, full artwork, auto-rotating ---- */}
      <div className="mx-auto mt-12 hidden max-w-[1100px] px-4 sm:px-6 md:block">
        <Reveal y={32}>
          <div ref={stageRef} className="sc-stage group/stage">
            <div className="stack-frame flex flex-col">
              {/* image area — aspect-locked to the real capture so the
                  full screen is always visible, never cropped */}
              <div className="relative aspect-[1497/967] w-full overflow-hidden">
                {CARDS.map((card, i) => (
                  <Image
                    key={card.kicker}
                    src={card.src}
                    alt={card.alt}
                    fill
                    sizes="(max-width: 1152px) 92vw, 1060px"
                    className={cn(
                      "select-none object-cover transition-[opacity,transform] duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                      i === current
                        ? "opacity-100 [transform:scale(1)]"
                        : "pointer-events-none opacity-0 [transform:scale(1.035)]"
                    )}
                  />
                ))}

                {/* story progress — the stage's visible heartbeat.
                    The active fill drives the slideshow: its animationend
                    advances the slide, and hover pauses both in sync. */}
                <div
                  role="tablist"
                  aria-label="Showcase screens"
                  className="absolute inset-x-4 top-4 z-10 flex gap-1.5"
                >
                  {CARDS.map((c, i) => (
                    <button
                      key={c.kicker}
                      type="button"
                      role="tab"
                      aria-selected={i === current}
                      aria-label={`Show the ${c.kicker} screen`}
                      onClick={() => go(i)}
                      className="group/prog relative h-4 flex-1 cursor-pointer"
                    >
                      <span className="absolute inset-x-0 top-[calc(50%-1.5px)] h-[3px] overflow-hidden rounded-full bg-black/45 ring-1 ring-white/10" />
                      {i < current && (
                        <span className="absolute inset-x-0 top-[calc(50%-1.5px)] h-[3px] rounded-full bg-warm-white/85" />
                      )}
                      {i === current && armed && (
                        <span
                          key={current}
                          onAnimationEnd={() => go(current + 1)}
                          className="sc-progress-fill absolute inset-x-0 top-[calc(50%-1.5px)] h-[3px] rounded-full"
                        />
                      )}
                    </button>
                  ))}
                </div>

                {/* prev / next — surface on stage hover */}
                <button
                  type="button"
                  onClick={() => go(current - 1)}
                  aria-label="Previous screen"
                  className="absolute left-3.5 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/55 text-warm-white opacity-0 backdrop-blur-md transition-all duration-300 hover:border-white/40 hover:bg-black/80 focus-visible:opacity-100 group-hover/stage:opacity-100"
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => go(current + 1)}
                  aria-label="Next screen"
                  className="absolute right-3.5 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/55 text-warm-white opacity-0 backdrop-blur-md transition-all duration-300 hover:border-white/40 hover:bg-black/80 focus-visible:opacity-100 group-hover/stage:opacity-100"
                >
                  <ChevronRight className="h-5 w-5" aria-hidden />
                </button>
              </div>

              {/* caption — swaps with the slide */}
              <div className="border-t border-white/[0.08] bg-[#0a0a0c] p-5 sm:p-8">
                <div key={current} className="sc-cap">
                  <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-crimson-bright">
                    {CARDS[current].kicker}
                  </p>
                  <h3 className="mt-3 max-w-xl font-display text-balance text-2xl font-semibold leading-tight tracking-[-0.02em] text-warm-white sm:text-3xl">
                    {CARDS[current].title}
                  </h3>
                  <p className="mt-2.5 max-w-2xl text-pretty text-sm leading-relaxed text-muted-warm">
                    {CARDS[current].desc}
                  </p>
                </div>
              </div>
            </div>

            {/* filmstrip — pick a sleeve */}
            <div className="mt-5 grid grid-cols-3 gap-3 sm:gap-4">
              {CARDS.map((card, i) => (
                <button
                  key={card.kicker}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Show the ${card.kicker} screen`}
                  className={cn(
                    "sc-thumb group text-left",
                    i === current && "is-active"
                  )}
                >
                  <span className="sc-thumb-frame relative block aspect-[1497/967] overflow-hidden">
                    <Image
                      src={card.src}
                      alt=""
                      fill
                      sizes="(max-width: 1152px) 30vw, 350px"
                      className="select-none object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </span>
                  <span className="mt-2.5 flex items-center justify-between px-0.5">
                    <span className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-white/40 transition-colors duration-300 group-hover:text-warm-white">
                      {card.kicker}
                    </span>
                    <span className="font-mono text-[10px] tabular-nums text-white/25">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* ---- the carousel (mobile) — same screens, thumb-sized ---- */}
      <div className="mt-10 md:hidden">
        <div
          ref={trackRef}
          className="sc-carousel flex snap-x snap-mandatory gap-4 overflow-x-auto px-[max(1.5rem,calc(50vw-170px))] pb-2 [mask-image:linear-gradient(to_right,transparent,black_6%,black_91%,transparent)]"
        >
          {CARDS.map((card, i) => (
            <article
              key={card.kicker}
              className="w-[78vw] max-w-[340px] shrink-0 snap-center"
            >
              <div className="aspect-[1497/967]">
                <div className="stack-frame rounded-[1.1rem]">
                  <Image
                    src={card.src}
                    alt={card.alt}
                    fill
                    sizes="78vw"
                    className="select-none object-cover"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-[#060607]/85 via-[#060607]/35 to-[#060607]/20"
                  />
                  {/* kicker */}
                  <p className="absolute bottom-3 left-3 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-warm-white/90">
                    {card.kicker}
                  </p>
                </div>
              </div>

              {/* caption lives below the frame on small screens — only the
                  centred card's caption reads; neighbours hide theirs so
                  nothing is ever seen clipped at the edge */}
              <div
                className={cn(
                  "px-1 pt-4 transition-opacity duration-500",
                  i === mCurrent ? "opacity-100" : "opacity-0"
                )}
              >
                <h3 className="font-display text-balance text-xl font-semibold leading-snug tracking-[-0.02em] text-warm-white">
                  {card.title}
                </h3>
                <p className="mt-2 text-pretty text-[13px] leading-relaxed text-muted-warm">
                  {card.desc}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* pill dots — the card nearest centre lights up */}
        <div className="mt-5 flex items-center justify-center gap-2">
          {CARDS.map((c, i) => (
            <button
              key={c.kicker}
              type="button"
              onClick={() => scrollToCard(i)}
              data-current={i === mCurrent}
              aria-label={`Go to card ${i + 1} of ${CARDS.length} — ${c.kicker}`}
              className="sc-dot"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
