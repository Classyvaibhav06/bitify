import Link from "next/link";
import { ArrowDownToLine, ArrowRight, Check } from "lucide-react";
import { JsonLd } from "./json-ld";
import { PLATFORM_PAGES, SITE_URL, type PlatformPageData } from "@/lib/site-config";

/** Shared template for the dedicated, indexable platform landing pages. */
export function PlatformPage({ page }: { page: PlatformPageData }) {
  const others = PLATFORM_PAGES.filter((p) => p.slug !== page.slug);
  const pageUrl = `${SITE_URL}/${page.slug}`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Downloads", item: `${SITE_URL}/downloads` },
          { "@type": "ListItem", position: 3, name: page.h1, item: pageUrl },
        ],
      },
      ...(page.downloadUrl
        ? [
            {
              "@type": "SoftwareApplication",
              name: page.h1,
              operatingSystem: page.requirements || page.eyebrow,
              applicationCategory: "MusicApplication",
              url: pageUrl,
              downloadUrl: page.downloadUrl,
              softwareVersion: page.version.replace(/^v/, ""),
              description: page.description,
            },
          ]
        : []),
      {
        "@type": "FAQPage",
        mainEntity: page.faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
    ],
  };

  return (
    <main className="min-h-screen bg-background pt-32 pb-24 text-foreground">
      <JsonLd schema={schema} />
      <div className="mx-auto max-w-[1100px] px-6">
        {/* breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-10 flex flex-wrap items-center gap-2 text-xs text-muted-warm">
          <Link href="/" className="hover:text-warm-white">Home</Link>
          <span aria-hidden>/</span>
          <Link href="/downloads" className="hover:text-warm-white">Downloads</Link>
          <span aria-hidden>/</span>
          <span aria-current="page" className="text-warm-white">{page.h1}</span>
        </nav>

        {/* hero */}
        <header className="max-w-3xl">
          <p className="eyebrow">{page.eyebrow}</p>
          <h1 className="mt-5 font-display text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-warm-white sm:text-6xl">
            {page.h1}
          </h1>
          <p className="mt-6 text-pretty text-base leading-relaxed text-muted-warm sm:text-lg">
            {page.intro}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            {page.downloadUrl ? (
              <a
                href={page.downloadUrl}
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 rounded-full bg-crimson px-7 py-3.5 text-sm font-semibold tracking-wide text-white transition-all duration-300 hover:bg-crimson-bright focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-crimson"
              >
                <ArrowDownToLine className="h-4 w-4 transition-transform group-hover:translate-y-0.5" aria-hidden />
                Download for {page.eyebrow.replace(/^For /, "")}
              </a>
            ) : (
              <Link
                href="/downloads"
                className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.04] px-7 py-3.5 text-sm font-semibold text-warm-white hover:border-white/30"
              >
                Download link coming soon
              </Link>
            )}
            {page.version && (
              <span className="rounded-full bg-crimson/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-crimson-bright">
                {page.version}
              </span>
            )}
            {page.requirements && (
              <span className="text-xs text-muted-warm">{page.requirements}</span>
            )}
          </div>
        </header>

        {/* highlights */}
        <section aria-labelledby="why-heading" className="mt-20 border-t border-white/[0.06] pt-14">
          <h2 id="why-heading" className="font-display text-2xl font-semibold text-warm-white sm:text-3xl">
            Why use Bitify on {page.eyebrow.replace(/^For /, "")}?
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {page.highlights.map((h) => (
              <div key={h.title} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
                <Check className="h-4 w-4 text-crimson-bright" aria-hidden />
                <h3 className="mt-4 font-display text-lg font-semibold text-warm-white">{h.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-warm">{h.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* steps */}
        <section aria-labelledby="steps-heading" className="mt-20 border-t border-white/[0.06] pt-14">
          <h2 id="steps-heading" className="font-display text-2xl font-semibold text-warm-white sm:text-3xl">
            How to get started
          </h2>
          <ol className="mt-8 space-y-4">
            {page.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-4 text-sm leading-relaxed text-muted-warm">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 font-mono text-xs text-white/60">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </section>

        {/* FAQ */}
        <section aria-labelledby="faq-heading" className="mt-20 border-t border-white/[0.06] pt-14">
          <h2 id="faq-heading" className="font-display text-2xl font-semibold text-warm-white sm:text-3xl">
            {page.eyebrow.replace(/^For /, "")} questions
          </h2>
          <dl className="mt-8 space-y-8">
            {page.faqs.map((f) => (
              <div key={f.question}>
                <dt className="font-display text-lg font-semibold text-warm-white">{f.question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted-warm">{f.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* internal links — strong, contextual site links for crawlers and people */}
        <section aria-labelledby="more-heading" className="mt-20 border-t border-white/[0.06] pt-14">
          <h2 id="more-heading" className="font-display text-2xl font-semibold text-warm-white">
            More ways to listen
          </h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {others.map((p) => (
              <Link
                key={p.slug}
                href={`/${p.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-muted-warm hover:border-white/25 hover:text-warm-white"
              >
                Bitify for {p.eyebrow.replace(/^For /, "")}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            ))}
            <Link href="/features" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-muted-warm hover:text-warm-white">
              All features
            </Link>
            <Link href="/faq" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-muted-warm hover:text-warm-white">
              Full FAQ
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
