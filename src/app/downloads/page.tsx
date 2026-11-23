import type { Metadata } from "next";
import { Downloads } from "@/components/site/downloads";

export const metadata: Metadata = {
  title: "Download Bitify Music for Windows, Mac, Linux & Android",
  description:
    "Get Bitify Music for Windows (portable), macOS (Apple Silicon DMG), Linux (x86_64 tarball) or Android (ARM64 APK). Pick your platform and download directly.",
  alternates: { canonical: "/downloads" },
  openGraph: {
    title: "Download Bitify Music — Every Platform",
    description:
      "Windows, macOS, Linux and Android builds. One library, every screen.",
    url: "/downloads",
  },
};

export default function DownloadsPage() {
  return (
    <main>
      <div className="mx-auto max-w-[1200px] px-6 pt-32 text-center">
        <h1 className="font-display text-balance text-4xl font-semibold tracking-tight text-warm-white sm:text-5xl">
          Bitify Music downloads
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-warm sm:text-lg">
          Four platforms, one experience. Choose your device below for a direct
          download — or pick a platform for installation details and answers.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm">
          {[
            ["/windows", "Windows"],
            ["/mac", "macOS"],
            ["/linux", "Linux"],
            ["/android", "Android"],
            ["/tv", "TV"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-muted-warm hover:border-white/25 hover:text-warm-white"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
      <Downloads />
    </main>
  );
}
