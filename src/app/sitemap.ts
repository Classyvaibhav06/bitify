import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";

// Single-page site: one canonical URL. Using the route handler keeps the
// sitemap's origin in sync with SITE_URL (change that one file for a new domain).
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
