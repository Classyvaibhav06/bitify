import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PLATFORM_PAGES } from "@/lib/site-config";
import { PlatformPage } from "@/components/site/platform-page";

// One statically generated route per platform: /windows, /mac, /linux, /android, /tv
export function generateStaticParams() {
  return PLATFORM_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = PLATFORM_PAGES.find((p) => p.slug === slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/${page.slug}` },
    openGraph: {
      title: page.title,
      description: page.description,
      url: `/${page.slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = PLATFORM_PAGES.find((p) => p.slug === slug);
  if (!page) notFound();
  return <PlatformPage page={page} />;
}
