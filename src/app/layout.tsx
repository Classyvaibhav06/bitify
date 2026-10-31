import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

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
  weight: ["400", "500", "600", "700"],
});

const siteUrl = "https://bitify.music";
const siteDescription =
  "One seamless music experience across your desktop, mobile, and TV. Bitify Music — your music, every screen.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Bitify Music — Your Music. Every Screen.",
    template: "%s · Bitify Music",
  },
  description: siteDescription,
  applicationName: "Bitify Music",
  keywords: [
    "Bitify Music",
    "music app",
    "desktop music player",
    "mobile music app",
    "TV music app",
    "multi-platform music",
  ],
  authors: [{ name: "Bitify Music" }],
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.png" }],
  },
  openGraph: {
    title: "Bitify Music — Your Music. Every Screen.",
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
        {children}
        <Toaster />
      </body>
    </html>
  );
}
