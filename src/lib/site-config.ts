/**
 * Bitify Music — Site Configuration
 * ----------------------------------
 * Single, documented source of truth for product assets, download links
 * and copy. Everything that is expected to change after launch lives here.
 *
 * ─── ASSET NOTES ──────────────────────────────────────────────────────────
 * MOBILE_SCREENS            Real app screenshots (720px) presented inside
 *                            the CSS PhoneMockup — the phone body is built
 *                            in the browser, so nothing is ever cropped
 *                            out of a marketing photo.
 * TV_SHOTS                   Real TV cutouts (transparent-background WebP)
 *                            cropped from the product photography with their
 *                            own physical bezels — presented directly.
 * tv-*.webp                  Raw 16:9 TV screen captures (used where a
 *                            synthetic TV frame is still appropriate).
 * tv-lyrics/upnext/singalong  Real TV app captures (Lyrics, Up Next and
 * -real.webp                  Sing Along views) framed with a baked bezel
 *                            matching the product-photography cutouts.
 * tv-lyrics-spotlight.webp    Clean bezel-free Lyrics capture for the
 *                            Features “centrepiece” spotlight.
 * desktop-*.webp             Desktop app window screenshots (shown inside the
 *                            monitor mockup / window frame).
 * promo-*.webp               Official promotional artwork (provided brand assets)
 *
 * ─── DOWNLOAD LINKS ───────────────────────────────────────────────────────
 * Desktop builds (Windows portable, macOS DMG, Linux tarball) and the Android
 * APK are live on GitHub Releases.
 * on GitHub Releases. Set `downloadUrl` for TV once it ships — the UI
 * automatically switches from the "coming soon" state to a real download
 * button. Version strings and OS compatibility live here too.
 */

export type PlatformId = "desktop" | "macos" | "linux" | "mobile" | "tv";

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
    requirements: "Windows 10 or later · 64-bit · portable (no install)",
    version: "v2.0.1",
    downloadUrl:
      "https://github.com/vishnu893-maker/bitify-updates/releases/download/desktop-v2.0.1/Bitify-2.0.1-windows-x64-portable.zip",
    installSteps: [
      "Download the Bitify Music portable zip for Windows.",
      "Extract the zip and open Bitify — no installation needed.",
      "Start listening from anywhere, including a USB drive.",
    ],
  },
  {
    id: "macos",
    platform: "macOS",
    requirements: "macOS · Apple Silicon (ARM64) · DMG installer",
    version: "v2.0.3",
    downloadUrl:
      "https://github.com/vishnu893-maker/bitify-updates/releases/download/desktop-v2.0.3/ytm-rs-setup-2.0.3-macos-arm64.dmg",
    installSteps: [
      "Download the Bitify Music DMG for Apple Silicon Macs.",
      "Open the DMG and drag Bitify Music into your Applications folder.",
      "Launch it from Applications — macOS may ask to confirm on first open.",
    ],
  },
  {
    id: "linux",
    platform: "Linux",
    requirements: "Linux x86_64 · tar.gz archive",
    version: "v2.0.3",
    downloadUrl:
      "https://github.com/vishnu893-maker/bitify-updates/releases/download/desktop-v2.0.3/ytm-rs-2.0.3-linux-x86_64.tar.gz",
    installSteps: [
      "Download the Linux x86_64 tarball.",
      "Extract it with: tar -xzf ytm-rs-2.0.3-linux-x86_64.tar.gz",
      "Open the extracted folder and run the Bitify Music executable.",
    ],
  },
  {
    id: "mobile",
    platform: "Android",
    requirements: "Android · 64-bit (ARM64) · APK installer",
    version: "v1.8.3",
    downloadUrl:
      "https://github.com/vishnu893-maker/bitify-updates/releases/download/v1.8.3/Bitify-1.8.3-arm64.apk",
    installSteps: [
      "Download the Bitify Music APK on your Android phone.",
      "Open the file and tap Allow if Android asks to install from your browser.",
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

/**
 * Dedicated, indexable landing pages for each platform. Content is derived
 * from the product facts already published on the homepage — no invented
 * specs, pricing or availability.
 */
export interface PlatformPageData {
  slug: string;
  id: PlatformId;
  eyebrow: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  highlights: { title: string; text: string }[];
  steps: string[];
  faqs: { question: string; answer: string }[];
  downloadUrl: string | null;
  version: string;
  requirements: string;
}

export const PLATFORM_PAGES: PlatformPageData[] = [
  {
    slug: "windows",
    id: "desktop",
    eyebrow: "For Windows",
    title: "Bitify Music for Windows — Portable Music Player",
    description:
      "Download Bitify Music for Windows: a portable x64 player with synced lyrics, playlists, listening stats and a full-screen Now Playing view. No installation needed.",
    h1: "Bitify Music for Windows",
    intro:
      "A full listening studio for your Windows desktop. Extract the portable app and get a persistent player bar, keyboard-first controls and a Now Playing view built for losing yourself in an album.",
    highlights: [
      {
        title: "Portable by design",
        text: "It's a zip, not an installer. Extract it to any folder — or a USB drive — and run Bitify without changing your system.",
      },
      {
        title: "Every part of your library",
        text: "Liked Music, playlists, listening stats and streaks, search, synced lyrics and full-screen artwork all live in one place.",
      },
      {
        title: "One experience, every screen",
        text: "The same Bitify experience you know from Android and TV, tuned for the bigger desktop display.",
      },
    ],
    steps: DOWNLOADS.find((d) => d.id === "desktop")?.installSteps ?? [],
    faqs: [
      {
        question: "Do I need administrator rights?",
        answer:
          "No. The Windows build is portable — extract the zip and run the executable. There is no installer and no system-wide change.",
      },
      {
        question: "Can I run Bitify Music from a USB drive?",
        answer:
          "Yes. Because the app is portable, you can keep it on removable storage and take your setup with you.",
      },
    ],
    downloadUrl: DOWNLOADS.find((d) => d.id === "desktop")?.downloadUrl ?? null,
    version: DOWNLOADS.find((d) => d.id === "desktop")?.version ?? "",
    requirements: DOWNLOADS.find((d) => d.id === "desktop")?.requirements ?? "",
  },
  {
    slug: "mac",
    id: "macos",
    eyebrow: "For macOS",
    title: "Bitify Music for Mac — Apple Silicon Music Player",
    description:
      "Download Bitify Music for macOS on Apple Silicon: a DMG installer with synced lyrics, playlists, listening stats and a full-screen player. Version 2.0.3.",
    h1: "Bitify Music for Mac",
    intro:
      "Your library on Apple Silicon. The macOS build brings the same lyrics, playlists, listening stats and full-screen artwork to your Mac in a familiar DMG installer.",
    highlights: [
      {
        title: "Built for Apple Silicon",
        text: "This build targets macOS on ARM64 (Apple Silicon) hardware and ships as a standard DMG.",
      },
      {
        title: "Familiar macOS setup",
        text: "Open the DMG, drag Bitify Music to Applications, and launch it like any other Mac app.",
      },
      {
        title: "The same library, everywhere",
        text: "Continue with the playlists, Liked Music and listening stats you use on Windows, Android and TV.",
      },
    ],
    steps: DOWNLOADS.find((d) => d.id === "macos")?.installSteps ?? [],
    faqs: [
      {
        question: "Does this build work on Intel Macs?",
        answer:
          "This release is built for Apple Silicon (ARM64) Macs. An Intel build is not published yet.",
      },
      {
        question: "How do I install the DMG?",
        answer:
          "Download the DMG, open it, drag Bitify Music into your Applications folder, then launch it from Applications. macOS may ask you to confirm on first open.",
      },
    ],
    downloadUrl: DOWNLOADS.find((d) => d.id === "macos")?.downloadUrl ?? null,
    version: DOWNLOADS.find((d) => d.id === "macos")?.version ?? "",
    requirements: DOWNLOADS.find((d) => d.id === "macos")?.requirements ?? "",
  },
  {
    slug: "linux",
    id: "linux",
    eyebrow: "For Linux",
    title: "Bitify Music for Linux — x86_64 Music Player",
    description:
      "Download Bitify Music for Linux x86_64: a standalone tar.gz with synced lyrics, playlists, listening stats and a full-screen player. Version 2.0.3.",
    h1: "Bitify Music for Linux",
    intro:
      "A standalone player for Linux desktops. Download the x86_64 tarball, extract it and run Bitify — no package manager, no install step, no root access required.",
    highlights: [
      {
        title: "Standalone tarball",
        text: "The Linux build is distributed as a tar.gz archive. Unpack it and run the executable from a folder you control.",
      },
      {
        title: "No system changes",
        text: "Because it runs from the extracted folder, Bitify doesn't need to be installed system-wide.",
      },
      {
        title: "All the listening tools",
        text: "Search, Liked Music, playlists, listening stats, synced lyrics and full-screen artwork are all included.",
      },
    ],
    steps: DOWNLOADS.find((d) => d.id === "linux")?.installSteps ?? [],
    faqs: [
      {
        question: "Which Linux systems are supported?",
        answer:
          "This build targets Linux on x86_64 processors and runs from an extracted tarball. Check the download requirements before grabbing it.",
      },
      {
        question: "Do I need root access?",
        answer:
          "No. Extract the archive into your own folder and run the Bitify Music executable from there.",
      },
    ],
    downloadUrl: DOWNLOADS.find((d) => d.id === "linux")?.downloadUrl ?? null,
    version: DOWNLOADS.find((d) => d.id === "linux")?.version ?? "",
    requirements: DOWNLOADS.find((d) => d.id === "linux")?.requirements ?? "",
  },
  {
    slug: "android",
    id: "mobile",
    eyebrow: "For Android",
    title: "Bitify Music for Android — ARM64 Music App (APK)",
    description:
      "Download the Bitify Music Android APK: quick picks, synced lyrics, one-handed playback and full-screen artwork. ARM64 build, version 1.8.3.",
    h1: "Bitify Music for Android",
    intro:
      "Your music in your pocket. Quick picks, synced lyrics and a one-handed player that goes wherever you do — with the same library you know from desktop and TV.",
    highlights: [
      {
        title: "Made for one hand",
        text: "Search, likes and playback controls stay within thumb reach, with full-screen album artwork when you want it.",
      },
      {
        title: "Lyrics that keep up",
        text: "Synced lyrics and a Now Playing view turn a phone into a proper listening device.",
      },
      {
        title: "Direct APK download",
        text: "The ARM64 APK is available straight from the release — no app store account required.",
      },
    ],
    steps: DOWNLOADS.find((d) => d.id === "mobile")?.installSteps ?? [],
    faqs: [
      {
        question: "Is Bitify Music on Google Play?",
        answer:
          "The Android build is currently distributed as an APK from the Downloads section of this site. A Play Store listing has not been published yet.",
      },
      {
        question: "Which Android devices does it support?",
        answer:
          "This APK is built for 64-bit ARM (ARM64) Android devices.",
      },
    ],
    downloadUrl: DOWNLOADS.find((d) => d.id === "mobile")?.downloadUrl ?? null,
    version: DOWNLOADS.find((d) => d.id === "mobile")?.version ?? "",
    requirements: DOWNLOADS.find((d) => d.id === "mobile")?.requirements ?? "",
  },
  {
    slug: "tv",
    id: "tv",
    eyebrow: "For TV",
    title: "Bitify Music for TV — The Living Room Experience",
    description:
      "Bitify Music on television: big artwork, synced lyrics and a queue for the whole room, with navigation made for a remote. TV download link coming soon.",
    h1: "Bitify Music for TV",
    intro:
      "Bring music into the room. The TV experience is built around large artwork, a queue everyone can see, and controls made for a remote instead of a mouse.",
    highlights: [
      {
        title: "Made for the big screen",
        text: "Full-screen artwork and lyrics that read from across the room.",
      },
      {
        title: "A queue for everyone",
        text: "See what's playing and what's next without reaching for a phone.",
      },
      {
        title: "One ecosystem",
        text: "The same Bitify listening experience you use on desktop, Mac, Linux and Android.",
      },
    ],
    steps: DOWNLOADS.find((d) => d.id === "tv")?.installSteps ?? [],
    faqs: [
      {
        question: "Is the TV app available to download?",
        answer:
          "The TV experience is presented on this site. Its download link will be published in the Downloads section as soon as it goes live.",
      },
      {
        question: "What kind of TVs is it for?",
        answer:
          "It's designed for smart TVs and Android TV-style interfaces, with navigation built around a remote.",
      },
    ],
    downloadUrl: DOWNLOADS.find((d) => d.id === "tv")?.downloadUrl ?? null,
    version: DOWNLOADS.find((d) => d.id === "tv")?.version ?? "",
    requirements: DOWNLOADS.find((d) => d.id === "tv")?.requirements ?? "",
  },
];

export const NAV_LINKS = [
  { label: "Experience", href: "#experience" },
  { label: "Desktop", href: "#desktop" },
  { label: "Mobile", href: "#mobile" },
  { label: "TV", href: "#tv" },
  { label: "Downloads", href: "/downloads" },
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
      "Bitify Music runs on Windows (a portable x64 app that needs no installation), macOS on Apple Silicon (DMG), Linux x86_64 (tar.gz), Android via an ARM64 APK, and as a dedicated TV app. One library and the same listening experience on every screen.",
  },
  {
    question: "How can I download Bitify Music?",
    answer:
      "Windows (portable zip), macOS (Apple Silicon DMG), Linux (x86_64 tarball) and Android (ARM64 APK) builds are available now — grab yours from the Downloads section. The TV app's link will be published there as soon as it goes live.",
  },
  {
    question: "How do I install the desktop version?",
    answer:
      "Extract the downloaded portable zip and open Bitify Music — no installation needed. Press play and your library is ready.",
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
    library: "/assets/desktop/desktop-library-real.webp",
    lyrics: "/assets/desktop/desktop-nowplaying.webp",
    /** dedicated hero copy (kept separate so the hero can preload it eagerly
     *  while the same screenshot appears lazily further down the page) */
    hero: "/assets/desktop/desktop-hero.webp",
  },
  tv: {
    nowplaying: "/assets/tv/tv-nowplaying.webp",
    fullscreen: "/assets/tv/tv-fullscreen.webp",
    /** bezel-free Lyrics capture shown in the Features “centrepiece” */
    spotlight: "/assets/tv/tv-lyrics-spotlight.webp",
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

/**
 * Canonical origin for metadata, canonical tag, sitemap and schema.
 * Change this one value when a custom domain goes live (also update
 * robots.txt and the Google Search Console property).
 */
export const SITE_URL = "https://bitifyy.vercel.app";

/**
 * Live total page-view counter badge (free abacus.jasoncameron.dev hit API).
 * Incremented client-side once per page load; hidden silently if unreachable.
 * Note: counts views, not unique visitors — it has no identity tracking.
 */
export const VISITOR_COUNTER_URL =
  "https://abacus.jasoncameron.dev/hit/bitify-website/total-views";

/**
 * Real TV cutouts — cropped straight from the product photography with
 * transparent backgrounds, keeping their own physical bezels so they are
 * presented directly (no synthetic frames on top). `width`/`height` mirror
 * the intrinsic WebP dimensions so next/image can reserve the correct
 * aspect ratio without distorting the cutout.
 */
export interface DeviceShot {
  src: string;
  width: number;
  height: number;
  label: string;
  alt: string;
}

/**
 * Mobile app screens — real app screenshots captured straight from the
 * device (720px wide, ≈2.05 aspect). They are presented inside the CSS
 * PhoneMockup component (a phone body built in the browser), so every
 * screen keeps its full artwork and true proportions — nothing is ever
 * cropped out of a marketing photo again.
 */
export interface MobileScreen {
  src: string;
  width: number;
  height: number;
  label: string;
  alt: string;
  /** tiny inline webp used as next/image blur placeholder */
  blur: string;
}

export const MOBILE_SCREENS: Record<string, MobileScreen> = {
  nowplaying: {
    src: "/assets/mobile/shots/shot-nowplaying.webp",
    width: 720,
    height: 1474,
    label: "Now Playing",
    alt: "Bitify Music mobile app — Now Playing with full-screen album artwork and playback controls",
    blur:
      "data:image/webp;base64,UklGRpoAAABXRUJQVlA4II4AAABQBACdASoQACEAPvVkqE+qpaOiNUgBUB6JQBS1hRP3dMHEOAJJ9fINXDIAAP68adg6IxLJJoPVR0pHybQSbtIdtKcv2PbN6uGtwtwHMeb/MyEvglnmfFQfE1XShvepg2knxX70YM8tDXWj1QviFo0doB1/v5/kIKRY4ffa7Sj5ec9yU9VbuSsuWP7uJ6AA",
  },
  lyrics: {
    src: "/assets/mobile/shots/shot-lyrics.webp",
    width: 720,
    height: 1466,
    label: "Lyrics",
    alt: "Bitify Music mobile app — synced lyrics view",
    blur:
      "data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAADwAwCdASoQACEAPwl0rVErpqQiqqwBcCEJaQDMWAz4N/GMUPcRMC/AAPzUrelUkzPd8s0FdkxhmswaQVCUA2XJlDD3ocuCTsmcYLpBhtC3Xx2oAAA=",
  },
  player: {
    src: "/assets/mobile/shots/shot-player.webp",
    width: 720,
    height: 1471,
    label: "Full Player",
    alt: "Bitify Music mobile app — full player controls for the current track",
    blur:
      "data:image/webp;base64,UklGRm4AAABXRUJQVlA4IGIAAADQAwCdASoQACEAPvVkqE+qpaQiNUgBUB6JaQAAUmB2WxK1FIm6HgAA/NS0ge9vMQr9HdDhkm2twR79zpNoMc9ih/OgH5D6Rmduq2oV1AGwYmow9yQq5r8N+NV0ls+1bPhAAA==",
  },
  library: {
    src: "/assets/mobile/shots/shot-library.webp",
    width: 720,
    height: 1496,
    label: "Library",
    alt: "Bitify Music mobile app — Library with listening stats, streaks and playlists",
    blur:
      "data:image/webp;base64,UklGRo4AAABXRUJQVlA4IIIAAAAQBACdASoQACEAPwVsrE+rpiQiNVgIAXAgiUAXBgLNYQqs/oDXFJJ4MAD+7qcLUR8KIXub6p2efl3sWcCR6y+fijz5A1fsTAcRPghph0Hj6bDIhx+C8+7W1dyF/cVH6dugCy+yZ8fW2y+lyqD7fkGukSssGByhZ4TrNDJN/cmfGgAA",
  },
  search: {
    src: "/assets/mobile/shots/shot-search.webp",
    width: 720,
    height: 1503,
    label: "Search",
    alt: "Bitify Music mobile app — Search results with songs and albums",
    blur:
      "data:image/webp;base64,UklGRn4AAABXRUJQVlA4IHIAAAAQBACdASoQACEAPwlwsVArpiSiqqwBcCEJZwAAumqvwyCaserClgsiAAD+9tr9hQuJjOh/eQm06YEKEoseR0Mj0+75zHotZoLJUB56zQ+HFUdY+brIR6fweQsonSEPCZSRuWtNvDYgQ4e0UU2IVDJAAAA=",
  },
  explore: {
    src: "/assets/mobile/shots/shot-explore.webp",
    width: 720,
    height: 1490,
    label: "Explore",
    alt: "Bitify Music mobile app — Explore view with mood and activity playlists",
    blur:
      "data:image/webp;base64,UklGRroAAABXRUJQVlA4IK4AAADQBACdASoQACEAPvVkqU+qpaQiNUgBUB6JYgCw7C+/gJ/b/OSZ/tmMOjsfug2MQAD+8QQvdEbdeKNh5Q6umwgRDRyrs732JwnTe+5nk494G3CwiKX7wcCsYtd7/inNEdSMLTjUPcTCnDJ9iFIGTaijaGZ3fCNHnXU2yFYXNKxWUqfdiBrK9AVRjFLfiwV/oiVeKRP+QQ4nR03KfllI/zJmXSjHT4D/ipGf0fFAAAA=",
  },
  party: {
    src: "/assets/mobile/shots/shot-party.webp",
    width: 720,
    height: 1484,
    label: "Party",
    alt: "Bitify Music mobile app — Listen Together party queue",
    blur:
      "data:image/webp;base64,UklGRpIAAABXRUJQVlA4IIYAAACQBACdASoQACEAPwluslArpiSiqqwBcCEJZQDNwEXug6w78yFAEZCOTE4QgAAA/vXc//kmHyW5+TOB9CRe3sgSfinXL8dL93FkOUc+0fhKIsWoRUyCd1k1LDAWYjsSqMGEFjaP3BbRgCNuwjp+nm8Qm3Z2fHIiovvjwQfC8rBexzeROF8gAA==",
  },
  liked: {
    src: "/assets/mobile/shots/shot-liked.webp",
    width: 720,
    height: 1470,
    label: "Liked",
    alt: "Bitify Music mobile app — Liked Music playlist",
    blur:
      "data:image/webp;base64,UklGRqQAAABXRUJQVlA4IJgAAAAQBQCdASoQACEAPwFwq0+rJqOiNVgIAWAgCWwAnQHcAfa0j/MqskVAUjbg+pR1XosAAP7xgZmr7OPK/SYvREn7Qeae4cM1C1yU3n/aQ2dYZxUgChVv6mBNj3Uq4B64/lN8NRiIq7DyVYFiEBTUuEMUXauafvhC6ssIIFLse79qLX5h0JAq3kUXAnlQJ9k6nnlJtHvDhhAAAA==",
  },
};

/**
 * Hero coverflow — the seven distinct app views, ordered so neighbouring
 * screens always contrast in mood and colour (artwork → grid → typography
 * → gradient → search → social → stats).
 */
export const HERO_CAROUSEL: MobileScreen[] = [
  MOBILE_SCREENS.nowplaying,
  MOBILE_SCREENS.explore,
  MOBILE_SCREENS.lyrics,
  MOBILE_SCREENS.liked,
  MOBILE_SCREENS.search,
  MOBILE_SCREENS.party,
  MOBILE_SCREENS.library,
];

export const TV_SHOTS: Record<string, DeviceShot> = {
  nowplaying: {
    src: "/assets/tv/tv-nowplaying-real.webp",
    width: 1600,
    height: 912,
    label: "Now Playing",
    alt: "Bitify Music on TV — Now Playing with album art, synced lyrics and Up Next queue",
  },
  fullscreen: {
    src: "/assets/tv/tv-fullscreen-real.webp",
    width: 1600,
    height: 925,
    label: "Fullscreen",
    alt: "Bitify Music on TV — fullscreen Now Playing view",
  },
  lyrics: {
    src: "/assets/tv/tv-lyrics-real.webp",
    width: 1636,
    height: 939,
    label: "Lyrics",
    alt: "Bitify Music on TV — Now Playing with word-synced lyrics for Kill Bill by SZA",
  },
  singalong: {
    src: "/assets/tv/tv-singalong-real.webp",
    width: 1636,
    height: 939,
    label: "Sing Along",
    alt: "Bitify Music on TV — karaoke-style Sing Along lyrics for PRIDE. by Kendrick Lamar",
  },
  upnext: {
    src: "/assets/tv/tv-upnext-real.webp",
    width: 1636,
    height: 951,
    label: "Up Next",
    alt: "Bitify Music on TV — Up Next queue with shuffle, repeat and autoplay",
  },
};
