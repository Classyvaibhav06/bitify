import type { Metadata } from "next";
import { Features } from "@/components/site/features";
import { Showcase } from "@/components/site/showcase";

export const metadata: Metadata = {
  title: "Bitify Music Features — Lyrics, Playlists, Stats & Every Screen",
  description:
    "Explore Bitify Music: synced lyrics, Liked Music and playlists, listening stats and streaks, search, full-screen artwork and a listening experience across desktop, Android and TV.",
  alternates: { canonical: "/features" },
  openGraph: {
    title: "Bitify Music Features",
    description: "Everything you need for the way you listen, on every screen.",
    url: "/features",
  },
};

export default function FeaturesPage() {
  return (
    <main>
      <div className="mx-auto max-w-[1200px] px-6 pt-32 text-center">
        <h1 className="font-display text-balance text-4xl font-semibold tracking-tight text-warm-white sm:text-5xl">
          Built around the way you listen
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-warm sm:text-lg">
          A deep album session, the quick save, the song you need to replay
          right now — Bitify puts the whole listening experience on every
          screen you own.
        </p>
      </div>
      <Features />
      <Showcase />
    </main>
  );
}
