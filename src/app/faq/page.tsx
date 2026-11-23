import type { Metadata } from "next";
import { Faq } from "@/components/site/faq";
import { JsonLd } from "@/components/site/json-ld";
import { FAQ_ITEMS, SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Bitify Music FAQ — Downloads, Platforms & Installation",
  description:
    "Answers about Bitify Music: which platforms it supports, how to download the Windows, macOS, Linux and Android builds, how to install them, and what's coming for TV.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "Bitify Music FAQ",
    description: "Everything you need to know about getting Bitify running.",
    url: "/faq",
  },
};

export default function FaqPage() {
  return (
    <main>
      <JsonLd
        schema={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ_ITEMS.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
          url: `${SITE_URL}/faq`,
        }}
      />
      <div className="mx-auto max-w-[1200px] px-6 pt-32 text-center">
        <h1 className="font-display text-balance text-4xl font-semibold tracking-tight text-warm-white sm:text-5xl">
          Bitify Music FAQ
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-warm sm:text-lg">
          Short answers about downloads, platform support and getting started
          on your device.
        </p>
      </div>
      <Faq />
    </main>
  );
}
