import { DOWNLOADS, FAQ_ITEMS, SITE_URL } from "@/lib/site-config";

/**
 * JSON-LD structured data for search engines and AI answer engines.
 * Uses only facts already published on the page — no invented claims.
 * Emitted server-side so crawlers see it in the raw HTML.
 */
export function StructuredData() {
  const software = DOWNLOADS.filter((d) => d.downloadUrl).map((d) => ({
    "@type": "SoftwareApplication",
    name: `Bitify Music for ${d.platform}`,
    applicationCategory: "MusicApplication",
    operatingSystem: d.requirements || "See download requirements",
    url: `${SITE_URL}/#download-${d.id}`,
    downloadUrl: d.downloadUrl,
    publisher: { "@id": `${SITE_URL}/#organization` },
    softwareVersion: d.version.replace(/^v/, ""),
    description: `Bitify Music for ${d.platform} — a cross-platform music player with lyrics, playlists and listening stats.`,
  }));

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Bitify Music",
        url: SITE_URL,
        description: "The team behind Bitify Music, a cross-platform music player.",
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Bitify Music",
        description: "One seamless music experience across desktop, mobile and TV.",
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en",
      },
      ...software,
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: FAQ_ITEMS.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };

  // escape "<" so a string can never terminate the script element
  const json = JSON.stringify(schema).replace(/</g, "\\u003c");

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
