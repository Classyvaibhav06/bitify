import { DOWNLOADS, FAQ_ITEMS, SITE_URL } from "@/lib/site-config";

/**
 * JSON-LD structured data for search engines and AI answer engines.
 * Uses only facts already published on the page — no invented claims.
 * Emitted server-side so crawlers see it in the raw HTML.
 */
export function StructuredData() {
  const desktop = DOWNLOADS.find((d) => d.id === "desktop");
  const mobile = DOWNLOADS.find((d) => d.id === "mobile");

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
      ...(desktop && desktop.downloadUrl
        ? [
            {
              "@type": "SoftwareApplication",
              name: "Bitify Music for Desktop",
              applicationCategory: "MusicApplication",
              operatingSystem: desktop.requirements || "Windows 10 or later, 64-bit",
              url: `${SITE_URL}/#downloads`,
              downloadUrl: desktop.downloadUrl,
              publisher: { "@id": `${SITE_URL}/#organization` },
              softwareVersion: desktop.version.replace(/^v/, ""),
              description:
                "Bitify Music for Windows — a portable music player with lyrics, playlists and listening stats.",
            },
          ]
        : []),
      ...(mobile && mobile.downloadUrl
        ? [
            {
              "@type": "SoftwareApplication",
              name: "Bitify Music for Android",
              applicationCategory: "MusicApplication",
              operatingSystem: mobile.requirements || "Android ARM64",
              url: `${SITE_URL}/#downloads`,
              downloadUrl: mobile.downloadUrl,
              publisher: { "@id": `${SITE_URL}/#organization` },
              softwareVersion: mobile.version.replace(/^v/, ""),
              description:
                "Bitify Music for Android — quick picks, synced lyrics and a one-handed player.",
            },
          ]
        : []),
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
