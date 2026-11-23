import type { MetadataRoute } from "next";
import { PLATFORM_PAGES, SITE_URL } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/downloads`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/features`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    ...PLATFORM_PAGES.map((p) => ({
      url: `${SITE_URL}/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: p.downloadUrl ? 0.8 : 0.5,
    })),
  ];
  return pages;
}
