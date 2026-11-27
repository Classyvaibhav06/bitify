import type { Metadata } from "next";
import { Equalizer } from "@/components/site/equalizer";

export const metadata: Metadata = {
  title: "404 — Lost in the mix",
};

export default function NotFound() {
  return (
    <main className="grain relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-background px-6 text-center">
      {/* atmosphere */}
      <div aria-hidden className="glow-crimson absolute inset-0" />
      <div aria-hidden className="hairline-grid absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_45%,black,transparent)]" />

      <div className="relative">
        <Equalizer bars={7} className="h-6" />

        <p className="eyebrow mt-8">Error 404</p>
        <h1 className="mt-5 font-display text-5xl font-bold tracking-tight text-warm-white sm:text-7xl">
          Lost in the mix.
        </h1>
        <p className="mx-auto mt-6 max-w-md text-pretty leading-relaxed text-muted-warm">
          This track doesn&apos;t exist — the page you were looking for has
          been moved, renamed, or never made it into the library.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-crimson px-7 py-3.5 text-sm font-semibold text-white shadow-[0_12px_40px_-8px_rgb(var(--acc-rgb)/0.6)] transition-all duration-300 hover:bg-crimson-bright"
          >
            Back to the music
          </a>
          <a
            href="/#downloads"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-7 py-3.5 text-sm font-semibold text-warm-white transition-colors hover:border-white/30"
          >
            Get Bitify
          </a>
        </div>
      </div>
    </main>
  );
}
