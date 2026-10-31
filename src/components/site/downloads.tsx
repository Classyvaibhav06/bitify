"use client";

import Image from "next/image";
import { ArrowDownToLine, Clock, Monitor, Smartphone, Tv } from "lucide-react";
import { Reveal } from "./reveal";
import { DOWNLOADS, SCREENSHOTS, type DownloadConfig } from "@/lib/site-config";
import { useToast } from "@/hooks/use-toast";
import { TvScreenPlate } from "./devices/tv-screen-plate";
import { cn } from "@/lib/utils";

const PLATFORM_META: Record<
  DownloadConfig["id"],
  { icon: typeof Monitor; note: string }
> = {
  desktop: { icon: Monitor, note: "Installer for your computer" },
  mobile: { icon: Smartphone, note: "App for your phone" },
  tv: { icon: Tv, note: "App for your television" },
};

/** Mini device visual shown at the top of each download card. */
function CardVisual({ id }: { id: DownloadConfig["id"] }) {
  if (id === "desktop") {
    return (
      <div className="relative mx-auto w-[74%] overflow-hidden rounded-lg border border-white/10 bg-[#101014] p-1 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.8)]">
        <div className="relative aspect-[3/2] overflow-hidden rounded-[5px]">
          <Image
            src={SCREENSHOTS.desktop.home}
            alt="Bitify Music desktop interface"
            fill
            sizes="300px"
            className="object-cover object-top"
          />
        </div>
      </div>
    );
  }
  if (id === "mobile") {
    return (
      <div className="relative mx-auto aspect-[674/1396] w-[86px] overflow-hidden rounded-xl ring-1 ring-white/15 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.8)]">
        <Image
          src={SCREENSHOTS.mobile.home}
          alt="Bitify Music mobile interface"
          fill
          sizes="180px"
          className="object-cover"
        />
      </div>
    );
  }
  return (
    <div className="relative mx-auto w-[88%] overflow-hidden rounded-md border border-white/10 bg-[#101014] p-[3px] shadow-[0_16px_40px_-12px_rgba(0,0,0,0.8)]">
      <div className="relative aspect-video overflow-hidden rounded-[3px]">
        <TvScreenPlate variant="minimal" />
      </div>
    </div>
  );
}

export function Downloads() {
  const { toast } = useToast();

  const notifyPending = (platform: string) => {
    toast({
      title: `${platform} download is coming soon`,
      description:
        "Official links will be published here at release. Check back shortly — the rest of the page shows what's waiting for you.",
    });
  };

  return (
    <section
      id="downloads"
      aria-label="Downloads"
      className="relative overflow-hidden border-t border-white/[0.05]"
    >
      <div
        aria-hidden
        className="absolute left-1/2 top-0 -z-10 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(224,57,62,0.07),transparent_65%)] blur-[110px]"
      />

      <div className="mx-auto max-w-[1200px] px-6 py-28 sm:py-36">
        {/* ---- header ---- */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow inline-flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-crimson/70" aria-hidden />
            Downloads
            <span className="inline-block h-px w-8 bg-crimson/70" aria-hidden />
          </p>
          <h2 className="mt-5 font-display text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-warm-white sm:text-5xl">
            Your next listening experience starts here.
          </h2>
          <p className="mt-6 text-pretty text-base leading-relaxed text-muted-warm sm:text-lg">
            Bitify Music is ready for every screen you own. Pick your platform
            below — each download installs the same Bitify experience, tuned
            for its device.
          </p>
        </Reveal>

        {/* ---- cards ---- */}
        <div className="mt-16 grid gap-5 sm:mt-20 lg:grid-cols-3">
          {DOWNLOADS.map((dl, i) => {
            const meta = PLATFORM_META[dl.id];
            return (
              <Reveal key={dl.id} delay={i * 0.08} className="h-full">
                <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] transition-colors duration-500 hover:border-crimson/25 hover:bg-white/[0.035]">
                  {/* device visual stage */}
                  <div className="relative flex h-52 items-center justify-center overflow-hidden border-b border-white/[0.06] bg-[radial-gradient(ellipse_80%_70%_at_50%_60%,rgba(224,57,62,0.06),transparent_70%)] pt-8">
                    <CardVisual id={dl.id} />
                  </div>

                  <div className="flex flex-1 flex-col p-7">
                    <div className="flex items-center gap-3">
                      <meta.icon className="h-5 w-5 text-crimson" aria-hidden />
                      <h3 className="font-display text-xl font-semibold tracking-tight text-warm-white">
                        {dl.platform}
                      </h3>
                      {/* version / status */}
                      <span
                        className={cn(
                          "ml-auto inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em]",
                          dl.downloadUrl
                            ? "bg-crimson/15 text-crimson-bright"
                            : "bg-white/[0.05] text-white/40"
                        )}
                      >
                        {dl.downloadUrl ? (
                          dl.version || "Latest"
                        ) : (
                          <>
                            <Clock className="h-3 w-3" aria-hidden />
                            Link pending
                          </>
                        )}
                      </span>
                    </div>

                    <p className="mt-1.5 text-[12px] text-muted-warm">
                      {dl.requirements || meta.note}
                    </p>

                    {/* install steps */}
                    <ol className="mt-6 space-y-3" aria-label={`How to install on ${dl.platform}`}>
                      {dl.installSteps.map((step, si) => (
                        <li key={si} className="flex items-start gap-3 text-[13px] leading-relaxed text-muted-warm">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/[0.12] font-mono text-[10px] text-white/50">
                            {si + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>

                    {/* action */}
                    <div className="mt-auto pt-8">
                      {dl.downloadUrl ? (
                        <a
                          href={dl.downloadUrl}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-crimson px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-crimson-bright"
                        >
                          <ArrowDownToLine className="h-4 w-4" aria-hidden />
                          Download {dl.platform.split(" ")[0]}
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={() => notifyPending(dl.platform)}
                          className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.03] px-6 py-3 text-sm font-semibold text-muted-warm transition-all duration-300 hover:border-crimson/40 hover:text-warm-white"
                        >
                          <Clock className="h-4 w-4" aria-hidden />
                          Download coming soon
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.15} className="mt-10 text-center">
          <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.22em] text-white/25">
            Download links are configured in one place —
            <span className="text-white/40"> src/lib/site-config.ts</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
