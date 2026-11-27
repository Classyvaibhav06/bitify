import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/next";
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

// Instrument Serif (italic only) — the editorial accent face. One
// italic serif word inside a grotesque headline is what makes the
// type system feel art-directed instead of templated.
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["italic"],
});

const siteUrl = SITE_URL;
const siteDescription =
  "Bitify Music is a cross-platform music player for Windows, macOS, Linux, Android and TV — one library with synced lyrics, playlists, listening stats and full-screen playback across every screen. Download the app for your device.";

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
    "Windows music player",
    "macOS music app",
    "Linux music player",
    "Android music APK",
    "TV music app",
    "synced lyrics music app",
    "listening stats music app",
  ],
  authors: [{ name: "Bitify Music" }],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.png" }],
  },
  openGraph: {
    title: "Bitify Music — Cross-Platform Music Player for Every Screen",
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
      <head>
        {/*
          Accent theme — restore the visitor's saved colour scheme
          before first paint so a non-default theme never flashes
          crimson first. Values are validated against the known
          theme list; anything else falls back to :root (crimson).
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{
var t=localStorage.getItem('bitify-theme');
if(t==='violet'||t==='amber'||t==='emerald'||t==='cyan'){document.documentElement.setAttribute('data-theme',t)}
}catch(e){}})()`,
          }}
        />
        {/*
          Universal scroll reveals — runs before first paint, fully
          independent of React. Adds `.rjs` to <html> (so CSS can hide
          not-yet-revealed elements) and wires a vanilla
          IntersectionObserver that marks revealed elements with a
          `data-rv` attribute — unmanaged by React, so hydration never
          sees a className mismatch. Bails out entirely for
          reduced-motion / no-IO browsers, and force-reveals anything
          stuck in view after 2.5s as a safety net — content can never
          stay invisible.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{
if(!('IntersectionObserver' in window))return;
var h=document.documentElement;h.classList.add('rjs');
var io=new IntersectionObserver(function(es){
for(var i=0;i<es.length;i++){var e=es[i];
if(e.isIntersecting){e.target.setAttribute('data-rv','');io.unobserve(e.target)}}
},{rootMargin:'0px 0px -9% 0px',threshold:0.05});
var q=function(){
document.querySelectorAll('.reveal, .reveal-stagger').forEach(function(el){io.observe(el)})
};
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',q)}else{q()}
setTimeout(function(){
document.querySelectorAll('.reveal:not([data-rv]), .reveal-stagger:not([data-rv])').forEach(function(el){
var r=el.getBoundingClientRect();
if(r.top<window.innerHeight&&r.bottom>0)el.setAttribute('data-rv','')
})
},2500)
}catch(e){}})()`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${instrumentSerif.variable} antialiased bg-background text-foreground`}
      >
        <StructuredData />
        {children}
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
