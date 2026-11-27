import { Smartphone } from "lucide-react";
import { LogoMark } from "./logo-mark";
import { Reveal } from "./reveal";
import { OsDownloadButton } from "./os-download-button";
import { DOWNLOADS } from "@/lib/site-config";

const MOBILE_DOWNLOAD =
  DOWNLOADS.find((d) => d.id === "mobile")?.downloadUrl ?? "#downloads";

/**
 * Final call-to-action — the pressing on the turntable.
 *
 * A real vinyl record (CSS grooves, crimson label carrying the waveform
 * mark, conic sheen riding the rotation) spins beside the headline while
 * a gold/crimson comet orbits the panel's border. The layout stacks
 * centred on phones and locks side-by-side from lg up.
 */
export function CtaBanner() {
  return (
    <section aria-label="Get Bitify Music" className="relative">
      <div className="mx-auto max-w-[1200px] px-6 pb-16 pt-0 sm:pb-20">
        <Reveal>
          <div className="cta-panel cta-beam">
            <div className="relative z-[2] grid items-center gap-10 px-6 py-14 sm:px-12 sm:py-16 lg:grid-cols-[minmax(0,220px)_minmax(0,1fr)] lg:gap-16">
              {/* ---- the pressing ---- */}
              <div className="mx-auto w-36 shrink-0 sm:w-44 lg:w-full lg:max-w-[220px]">
                <div className="vinyl-record" aria-hidden>
                  <div className="vinyl-label">
                    <LogoMark animated={false} tone="light" />
                  </div>
                  <span className="vinyl-spindle" />
                </div>
                <p className="mt-5 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-white/35">
                  Side A · 33⅓ RPM
                </p>
              </div>

              {/* ---- the pitch ---- */}
              <div className="text-center lg:text-left">
                <h2 className="mx-auto max-w-2xl font-display text-balance text-4xl font-bold leading-[1.02] tracking-[-0.035em] text-warm-white sm:text-6xl lg:mx-0">
                  Press play{" "}
                  <i className="font-serif-accent gold-foil">everywhere.</i>
                </h2>

                <p className="mx-auto mt-5 max-w-md text-pretty text-base leading-relaxed text-muted-warm sm:text-lg lg:mx-0">
                  One library, one queue, every screen. Free, forever — and it
                  takes about a minute to set up.
                </p>

                <div className="mt-9 flex flex-col items-center justify-center gap-3.5 sm:flex-row lg:justify-start">
                  <OsDownloadButton />
                  <a
                    href={MOBILE_DOWNLOAD}
                    className="btn-ghost inline-flex px-7 py-3.5 text-sm"
                  >
                    <Smartphone className="h-4 w-4" aria-hidden />
                    Get the Android app
                  </a>
                </div>

                <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35 lg:justify-start">
                  <li className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className="inline-block h-1 w-1 rotate-45 bg-gold-bright/80"
                    />
                    Free
                  </li>
                  <li className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className="inline-block h-1 w-1 rotate-45 bg-gold-bright/80"
                    />
                    No ads
                  </li>
                  <li className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className="inline-block h-1 w-1 rotate-45 bg-gold-bright/80"
                    />
                    No account walls
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
