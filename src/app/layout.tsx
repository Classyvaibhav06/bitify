import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/toaster";
import { SITE_URL } from "@/lib/site-config";
import { StructuredData } from "@/components/site/structured-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  // only the weights the display face actually uses (500 = FAQ
  // questions, 600 = headings, 700 = hero/footer wordmark)
  weight: ["500", "600", "700"],
});

const siteUrl = SITE_URL;
const siteDescription =
  "Bitify Music is a cross-platform music player for Windows, Android and TV — one library with synced lyrics, playlists, listening stats and full-screen playback across every screen. Download the portable app or APK.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Bitify Music — Music Player for Desktop, Android & TV",
    template: "%s | Bitify Music",
  },
  description: siteDescription,
  applicationName: "Bitify Music",
  keywords: [
    "Bitify Music",
    "cross-platform music player",
    "music app for desktop and mobile",
    "Windows portable music player",
    "Android music APK",
    "TV music app",
    "music player for Windows and Android",
    "synced lyrics music app",
    "listening stats music app",
    "music library across devices",
  ],
  authors: [{ name: "Bitify Music" }],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.png" }],
  },
  openGraph: {
    title: "Bitify Music — Cross-Platform Music Player for Desktop, Android & TV",
    description: siteDescription,
    url: siteUrl,
    siteName: "Bitify Music",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Bitify Music — one seamless music experience across desktop, mobile, and TV",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bitify Music — Your Music. Every Screen.",
    description: siteDescription,
  },
};

export const viewport: Viewport = {
  themeColor: "#060607",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} antialiased bg-background text-foreground`}
      >
        <StructuredData />
        {children}
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
