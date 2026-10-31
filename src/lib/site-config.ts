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
 * desktop-*.webp             Desktop app window screenshots (shown inside the
 *                            monitor mockup / window frame).
 * promo-*.webp               Official promotional artwork (provided brand assets)
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
    library: "/assets/desktop/desktop-library-real.webp",
    lyrics: "/assets/desktop/desktop-nowplaying.webp",
    /** dedicated hero copy (kept separate so the hero can preload it eagerly
     *  while the same screenshot appears lazily further down the page) */
    hero: "/assets/desktop/desktop-hero.webp",
  },
  tv: {
    nowplaying: "/assets/tv/tv-nowplaying.webp",
    fullscreen: "/assets/tv/tv-fullscreen.webp",
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
};
