/**
 * Bitify Music — Site Configuration
 * ----------------------------------
 * Single, documented source of truth for product assets, download links
 * and copy. Everything that is expected to change after launch lives here.
 *
 * ─── ASSET NOTES ──────────────────────────────────────────────────────────
 * desktop-home.webp     Real desktop app screenshot — Home / browsing view
 * desktop-library.webp  Real desktop app screenshot — Library + listening stats
 * desktop-lyrics.webp   Real desktop app screenshot — Now Playing / synced lyrics
 * mobile-home.webp      Real mobile app render — "Listen Now" home screen (device shot)
 * mobile-lyrics-warm.webp Real mobile app render — synced lyrics, warm ambient crop
 * promo-*.webp          Official promotional artwork (provided brand assets)
 *
 * ─── MISSING ASSETS (to add later) ────────────────────────────────────────
 * • TV application screenshots — the TV mockups currently render a branded
 *   placeholder plate (see <TvScreenPlate />). Replace by pointing the
 *   `tvScreenshots` entries below at real 16:9 captures.
 *
 * ─── DOWNLOAD LINKS ───────────────────────────────────────────────────────
 * No official download URLs have been published yet. Set `downloadUrl` for
 * each platform below once available — the UI will automatically switch from
 * the "coming soon" state to a real download button. Version strings and
 * OS compatibility should also be filled in here when confirmed.
 */

export type PlatformId = "desktop" | "mobile" | "tv";

export interface DownloadConfig {
  id: PlatformId;
  platform: string;
  /** e.g. "Windows 10/11 · macOS" — leave empty until verified */
  requirements: string;
  /** e.g. "v1.4.2" — leave empty until verified */
  version: string;
  /** Set to a real URL to enable the download button */
  downloadUrl: string | null;
  installSteps: string[];
}

export const DOWNLOADS: DownloadConfig[] = [
  {
    id: "desktop",
    platform: "Desktop / PC",
    requirements: "", // TODO: add verified OS support
    version: "", // TODO: add current release version
    downloadUrl: null, // TODO: set official installer link
    installSteps: [
      "Download the Bitify Music installer for your computer.",
      "Run the installer and follow the on-screen steps.",
      "Open Bitify Music and start listening.",
    ],
  },
  {
    id: "mobile",
    platform: "Mobile",
    requirements: "", // TODO: add verified device support
    version: "",
    downloadUrl: null, // TODO: set store listing link
    installSteps: [
      "Get Bitify Music from your device's app store.",
      "Install and open the app.",
      "Sign in and your library is ready to go.",
    ],
  },
  {
    id: "tv",
    platform: "TV",
    requirements: "", // TODO: add verified TV platform support
    version: "",
    downloadUrl: null, // TODO: set TV store listing link
    installSteps: [
      "Find Bitify Music in your TV's app store.",
      "Install the app on your television.",
      "Open Bitify Music on the big screen and press play.",
    ],
  },
];

export const NAV_LINKS = [
  { label: "Experience", href: "#experience" },
  { label: "Desktop", href: "#desktop" },
  { label: "Mobile", href: "#mobile" },
  { label: "TV", href: "#tv" },
  { label: "Downloads", href: "#downloads" },
] as const;

export const DESKTOP_NAV_ITEMS = [
  "Home",
  "Explore",
  "Library",
  "History",
  "Downloads",
  "Local Music",
  "Liked Music",
] as const;

export const FAQ_ITEMS = [
  {
    question: "What is Bitify Music?",
    answer:
      "Bitify Music is a music application built around one idea: your music should follow you across every screen you own. It ships as three experiences — a desktop application, a mobile app, and a TV app — designed as one unified product.",
  },
  {
    question: "Which platforms support Bitify Music?",
    answer:
      "Bitify Music is available as a desktop / PC application, a mobile application, and a TV application. All three versions are already developed and presented on this page as one ecosystem.",
  },
  {
    question: "How can I download Bitify Music?",
    answer:
      "Download links for Desktop, Mobile and TV are published in the Downloads section of this page as each release goes live. Head there to get the latest version for your screen of choice.",
  },
  {
    question: "How do I install the desktop version?",
    answer:
      "Once the installer is downloaded, run it and follow the on-screen steps. When installation finishes, open Bitify Music on your computer and press play — your library is ready.",
  },
  {
    question: "Does Bitify Music support TV devices?",
    answer:
      "Yes. Bitify Music includes a dedicated TV application built for the big screen, so you can bring your listening experience into the living room.",
  },
  {
    question: "How can I get help?",
    answer:
      "For questions, feedback or issues, reach out through the support channel published with your download. This page will link the official support contact as soon as it is public.",
  },
] as const;

/** Screenshot registry — swap paths here when new captures are available */
export const SCREENSHOTS = {
  desktop: {
    home: "/assets/desktop/desktop-home.webp",
    library: "/assets/desktop/desktop-library.webp",
    lyrics: "/assets/desktop/desktop-lyrics.webp",
    /** dedicated hero copy (kept separate so the hero can preload it eagerly
     *  while the same screenshot appears lazily further down the page) */
    hero: "/assets/desktop/desktop-hero.webp",
  },
  mobile: {
    home: "/assets/mobile/mobile-home.webp",
    lyricsWarm: "/assets/mobile/mobile-lyrics-warm.webp",
    hero: "/assets/mobile/mobile-hero.webp",
  },
  promo: {
    warm: "/assets/promo/promo-lyrics-warm.webp",
    dark: "/assets/promo/promo-home-dark.webp",
    lifestyle: "/assets/promo/promo-lifestyle-hand.webp",
  },
  brand: {
    logo: "/assets/brand/bitify-logo.png",
  },
} as const;
