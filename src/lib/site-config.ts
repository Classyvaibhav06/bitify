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
 * desktop-home/lyrics/        Latest desktop app captures (v2.0.3 UI) — Home,
 * explore.webp                Now Playing with word-synced lyrics, and the
 *                            Explore view. Shown in the hero switcher, the
 *                            sticky Showcase stack and the window frames.
 *
 * ─── DOWNLOAD LINKS ───────────────────────────────────────────────────────
 * All installers are live on GitHub Releases (repo: bitify-updates):
 *   • Desktop v2.0.3 — Windows (x64 + ARM64), macOS (Apple Silicon +
 *     Intel) and Linux (x86_64) builds.
 *   • Mobile v1.8.4 — Android APK (arm64).
 * Set `downloadUrl` for TV once it ships — the UI automatically switches
 * from the "coming soon" state to a real download button. Version strings,
 * OS compatibility and per-build file sizes live here too.
 */

export type PlatformId = "desktop" | "mobile" | "tv";
export type DesktopOs = "windows" | "macos" | "linux";

/** Metadata for the three desktop operating systems */
export const OS_META: Record<
  DesktopOs,
  { label: string; short: string; format: string; note: string }
> = {
  windows: {
    label: "Windows",
    short: "Win",
    format: ".exe",
    note: "Windows 10 or later",
  },
  macos: {
    label: "macOS",
    short: "Mac",
    format: ".dmg",
    note: "macOS 11 Big Sur or later",
  },
  linux: {
    label: "Linux",
    short: "Linux",
    format: ".tar.gz",
    note: "Any modern x86_64 distro",
  },
};

/** One downloadable artifact for a desktop OS (per-arch) */
export interface OsBuild {
  os: DesktopOs;
  /** chip selector label, e.g. "64-bit" or "Apple Silicon" */
  arch: string;
  format: string;
  /** human file size, e.g. "13 MB" */
  size: string;
  url: string;
}

export interface DownloadConfig {
  id: PlatformId;
  platform: string;
  /** e.g. "Windows 10 or later · macOS 11+ · Linux x86_64" */
  requirements: string;
  /** e.g. "v2.0.3" — leave empty until verified */
  version: string;
  /** Primary link — the default (Windows x64) desktop build, or the APK */
  downloadUrl: string | null;
  /** Desktop per-OS / per-arch builds (empty for TV) */
  builds: OsBuild[];
  /** default install steps; desktop cards use per-OS steps from OS_STEPS */
  installSteps: string[];
}

const DESKTOP_BASE =
  "https://github.com/vishnu893-maker/bitify-updates/releases/download/desktop-v2.0.3";

export const DOWNLOADS: DownloadConfig[] = [
  {
    id: "desktop",
    platform: "Desktop / PC",
    requirements: "Windows 10+ · macOS 11+ · Linux x86_64",
    version: "v2.0.3",
    downloadUrl: `${DESKTOP_BASE}/Bitify-2.0.3-windows-x64-setup.exe`,
    builds: [
      {
        os: "windows",
        arch: "64-bit",
        format: ".exe",
        size: "13 MB",
        url: `${DESKTOP_BASE}/Bitify-2.0.3-windows-x64-setup.exe`,
      },
      {
        os: "windows",
        arch: "ARM64",
        format: ".exe",
        size: "13 MB",
        url: `${DESKTOP_BASE}/Bitify-2.0.3-windows-arm64-setup.exe`,
      },
      {
        os: "macos",
        arch: "Apple Silicon",
        format: ".dmg",
        size: "16 MB",
        url: `${DESKTOP_BASE}/ytm-rs-setup-2.0.3-macos-arm64.dmg`,
      },
      {
        os: "macos",
        arch: "Intel",
        format: ".dmg",
        size: "17 MB",
        url: `${DESKTOP_BASE}/ytm-rs-setup-2.0.3-macos-x64.dmg`,
      },
      {
        os: "linux",
        arch: "x86_64",
        format: ".tar.gz",
        size: "19 MB",
        url: `${DESKTOP_BASE}/ytm-rs-2.0.3-linux-x86_64.tar.gz`,
      },
    ],
    installSteps: [
      "Download the Bitify Music setup for your computer.",
      "Run the installer and follow the on-screen steps.",
      "Open Bitify Music and start listening.",
    ],
  },
  {
    id: "mobile",
    platform: "Android",
    requirements: "Android · 64-bit (ARM64) · APK installer",
    version: "v1.8.4",
    downloadUrl:
      "https://github.com/vishnu893-maker/bitify-updates/releases/download/v1.8.4/Bitify-1.8.4-arm64.apk",
    builds: [
      {
        os: "linux", // not used — mobile card renders its own single APK row
        arch: "ARM64",
        format: ".apk",
        size: "70 MB",
        url: "https://github.com/vishnu893-maker/bitify-updates/releases/download/v1.8.4/Bitify-1.8.4-arm64.apk",
      },
    ],
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
    builds: [],
    installSteps: [
      "Find Bitify Music in your TV's app store.",
      "Install the app on your television.",
      "Open Bitify Music on the big screen and press play.",
    ],
  },
];

/** Per-OS install steps for the desktop download card */
export const OS_STEPS: Record<DesktopOs, string[]> = {
  windows: [
    "Download the Bitify Music setup for Windows.",
    "Run the .exe installer and follow the on-screen steps.",
    "Open Bitify Music and start listening.",
  ],
  macos: [
    "Download the Bitify Music .dmg for your Mac.",
    "Open the disk image and drag Bitify Music to Applications.",
    "Launch Bitify Music from your Applications folder.",
  ],
  linux: [
    "Download the Bitify Music tarball for Linux.",
    "Extract it and run the bitify binary inside.",
    "Optional: create a .desktop entry to pin it to your launcher.",
  ],
};

/** Canonical origin. Change this one value when a custom domain goes live. */
export const SITE_URL = "https://bitifyy.vercel.app";

/**
 * Data for the dedicated, indexable platform pages. Built from the current
 * release URLs so these pages never drift from the downloads section.
 */
export interface PlatformPageData {
  slug: string;
  id: string;
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

const desktopDl = DOWNLOADS.find((d) => d.id === "desktop");
const mobileDl = DOWNLOADS.find((d) => d.id === "mobile");
const tvDl = DOWNLOADS.find((d) => d.id === "tv");
const buildFor = (os: DesktopOs) => desktopDl?.builds?.find((b) => b.os === os);

export const PLATFORM_PAGES: PlatformPageData[] = [
  {
    slug: "windows",
    id: "desktop",
    eyebrow: "For Windows",
    title: "Bitify Music for Windows — Desktop Music Player",
    description:
      "Download Bitify Music for Windows: a desktop player with synced lyrics, playlists, listening stats and a full-screen Now Playing view. Version 2.0.3.",
    h1: "Bitify Music for Windows",
    intro:
      "A full listening studio for your Windows desktop. Get the persistent player bar, keyboard-first controls and a Now Playing view built for losing yourself in an album.",
    highlights: [
      { title: "A desktop app, not a web page", text: "Native setup for Windows 10 or later, with the controls and library you expect from Bitify." },
      { title: "Every part of your library", text: "Liked Music, playlists, listening stats and streaks, search, synced lyrics and full-screen artwork." },
      { title: "One experience, every screen", text: "The same Bitify experience you know on macOS, Linux, Android and TV, tuned for the desktop." },
    ],
    steps: OS_STEPS.windows,
    faqs: [
      { question: "Which Windows versions are supported?", answer: "The desktop build targets Windows 10 or later, 64-bit." },
      { question: "What's in the download?", answer: "A Windows installer (.exe). Run it and follow the on-screen steps to get started." },
    ],
    downloadUrl: buildFor("windows")?.url ?? desktopDl?.downloadUrl ?? null,
    version: desktopDl?.version ?? LATEST_VERSIONS.desktop,
    requirements: OS_META.windows.note + " · 64-bit installer",
  },
  {
    slug: "mac",
    id: "macos",
    eyebrow: "For macOS",
    title: "Bitify Music for Mac — macOS Music Player",
    description:
      "Download Bitify Music for macOS: a DMG installer with synced lyrics, playlists, listening stats and a full-screen player. Version 2.0.3.",
    h1: "Bitify Music for Mac",
    intro:
      "Your library on your Mac. The macOS build brings the same lyrics, playlists, listening stats and full-screen artwork in a familiar DMG installer.",
    highlights: [
      { title: "Familiar macOS setup", text: "Open the DMG and drag Bitify Music to Applications, then launch it like any other Mac app." },
      { title: "Built for Apple Silicon", text: "An Apple Silicon build is available, with an Intel build for older Macs." },
      { title: "The same library, everywhere", text: "Continue with the playlists, Liked Music and listening stats you use on other screens." },
    ],
    steps: OS_STEPS.macos,
    faqs: [
      { question: "Does this build work on Intel Macs?", answer: "Yes — both Apple Silicon and Intel DMG builds are available in the Downloads section." },
      { question: "How do I install the DMG?", answer: "Download the DMG, open it, drag Bitify Music into Applications, then launch it." },
    ],
    downloadUrl: buildFor("macos")?.url ?? null,
    version: desktopDl?.version ?? LATEST_VERSIONS.desktop,
    requirements: OS_META.macos.note + " · Apple Silicon · DMG",
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
      "A standalone player for Linux desktops. Download the x86_64 tarball, extract it and run Bitify — no package manager required.",
    highlights: [
      { title: "Standalone tarball", text: "The Linux build is a tar.gz archive. Unpack it and run the binary from a folder you control." },
      { title: "No system changes", text: "It runs from the extracted folder, so there's no system-wide installation." },
      { title: "All the listening tools", text: "Search, Liked Music, playlists, listening stats, synced lyrics and full-screen artwork are included." },
    ],
    steps: OS_STEPS.linux,
    faqs: [
      { question: "Which Linux systems are supported?", answer: "The build targets modern x86_64 Linux distributions and runs from an extracted tarball." },
      { question: "Do I need root access?", answer: "No. Extract the archive into your own folder and run the binary from there." },
    ],
    downloadUrl: buildFor("linux")?.url ?? null,
    version: desktopDl?.version ?? LATEST_VERSIONS.desktop,
    requirements: OS_META.linux.note + " · tar.gz",
  },
  {
    slug: "android",
    id: "mobile",
    eyebrow: "For Android",
    title: "Bitify Music for Android — ARM64 Music App (APK)",
    description:
      "Download the Bitify Music Android APK: quick picks, synced lyrics, one-handed playback and full-screen artwork. ARM64 build, version 1.8.4.",
    h1: "Bitify Music for Android",
    intro:
      "Your music in your pocket. Quick picks, synced lyrics and a one-handed player that goes wherever you do — with the same library you know from desktop and TV.",
    highlights: [
      { title: "Made for one hand", text: "Search, likes and playback controls stay within thumb reach, with full-screen artwork when you want it." },
      { title: "Lyrics that keep up", text: "Synced lyrics and a Now Playing view turn a phone into a proper listening device." },
      { title: "Direct APK download", text: "The ARM64 APK is available straight from the release — no app store account required." },
    ],
    steps: mobileDl?.installSteps ?? [],
    faqs: [
      { question: "Is Bitify Music on Google Play?", answer: "The Android build is currently distributed as an APK from the Downloads section of this site." },
      { question: "Which Android devices does it support?", answer: "This APK is built for 64-bit ARM (ARM64) Android devices." },
    ],
    downloadUrl: mobileDl?.downloadUrl ?? null,
    version: mobileDl?.version ?? LATEST_VERSIONS.mobile,
    requirements: mobileDl?.requirements ?? "Android · 64-bit (ARM64) · APK installer",
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
      { title: "Made for the big screen", text: "Full-screen artwork and lyrics that read from across the room." },
      { title: "A queue for everyone", text: "See what's playing and what's next without reaching for a phone." },
      { title: "One ecosystem", text: "The same Bitify listening experience you use on Windows, macOS, Linux and Android." },
    ],
    steps: tvDl?.installSteps ?? [],
    faqs: [
      { question: "Is the TV app available to download?", answer: "The TV experience is presented on this site. Its download link will be published in the Downloads section when it goes live." },
      { question: "What kind of TVs is it for?", answer: "It's designed for smart TVs and Android TV-style interfaces, with navigation built around a remote." },
    ],
    downloadUrl: tvDl?.downloadUrl ?? null,
    version: tvDl?.version ?? "",
    requirements: tvDl?.requirements ?? "",
  },
];

export const NAV_LINKS = [
  { label: "Showcase", href: "#showcase" },
  { label: "Features", href: "#features" },
  { label: "Integrations", href: "#integrations" },
  { label: "Crew", href: "#crew" },
  { label: "Downloads", href: "/downloads" },
  { label: "FAQ", href: "/faq" },
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
      "Bitify Music runs on Windows, macOS and Linux as a desktop application, on Android phones, and on TVs — one unified product across every screen. The desktop builds ship for x64 and ARM64 machines, including native Apple Silicon and Intel Macs.",
  },
  {
    question: "How can I download Bitify Music?",
    answer:
      "Bitify Music for Windows, macOS and Linux, plus the Android app (APK), are available now — grab them from the Downloads section of this page. The TV app's link will be published there as soon as it goes live.",
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

export const DESKTOP_SHOTS: DesktopShot[] = [
  {
    src: "/assets/desktop/desktop-home.webp",
    width: 1497,
    height: 967,
    label: "Home",
    alt: "Bitify Music desktop app — Home with listening stats, song mixes and Listen Again shelves",
  },
  {
    src: "/assets/desktop/desktop-lyrics.webp",
    width: 1497,
    height: 968,
    label: "Now Playing",
    alt: "Bitify Music desktop app — Now Playing with large album art and karaoke-style synced lyrics",
  },
  {
    src: "/assets/desktop/desktop-explore.webp",
    width: 1490,
    height: 963,
    label: "Explore",
    alt: "Bitify Music desktop app — Explore with moods & genres, new releases and charts",
  },
];

/** Latest shipping versions — surfaced in the hero badge and CTA banner */
export const LATEST_VERSIONS = {
  desktop: "v2.0.3",
  mobile: "v1.8.4",
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
  home: {
    src: "/assets/mobile/shots/shot-home.webp",
    width: 720,
    height: 1478,
    label: "Home",
    alt: "Bitify Music mobile app — Home with Listen Now, recents and song mixes",
    blur:
      "data:image/webp;base64,UklGRmYBAABXRUJQVlA4IFoBAACQBwCdASoYADEAPulapk0pJKOiM/ZqqSAdCWIAzNQJ90Uq3m+1xWHW40iKpMKE0x8EOueK/L7VG7jbSiYFew+8U5rvkIAA/u+paei+b8Ex/fYiMZ75f9yS2E35/m3b5dNXos+VbWekHHzhfC58dkhE9ZzoqJR2vAfkrBfppNelplu1LOxlclqTRLBnOQ/MQmHeOqqIgX+zTfIz8SU73KsL4nuzrWe0CUWiu4NwDsiK923ENb0ftD4TwtMhPOCAiGjFxumuOEO7O7jK9ZkbQQJIEjwI4KcC9Lk6/8XtBmWCC3pJvNNXqymGPfRjeOyILyeat3xTaAwd54GtZZ1y6LubdMIAA8JHBOyEPe6psYQ4h1T9ANg66sYWEgQqEUEdDGKkkIn/foFvKfIXIHJh2K8ervZPAKcPwg+n0tRYx4ItK+Ys4kGOrekq+T4RyM3nsn31FjP0T/Ij/AAA",
  },
  nowplaying: {
    src: "/assets/mobile/shots/shot-nowplaying.webp",
    width: 720,
    height: 1518,
    label: "Now Playing",
    alt: "Bitify Music mobile app — Now Playing with full-screen album artwork and playback controls",
    blur:
      "data:image/webp;base64,UklGRooBAABXRUJQVlA4IH4BAABwCACdASoYADMAPulcqU+pJKOiMBQMASAdCWoAuzNkJb4GXUZOm4+EdFWb8qoAWTnp3t/NsT+PN4C5nAWd9X7wZOMHItVmeW7k+/j4AP7p/ilO4JysUkFx2CS/x9f+kxg/zkLPpT2Q1NeWQBzpNnHDPk2bXWN07Ask5394GsgR/8WJGnJ4b7xUdVph1b3CCOKP0UDhMV/jzZnav+3/0hds5KFwgvRls+iT6V7T/OrqRHlDU2raSXx445d/2fFJoK0YGZtcWUanP4CaxtgVB6LyyalphYhHUumiGJWco0KpqgjXNhufwGj492aoilj24qpZIXeuEuo0zlNtQ3CVXccejMet/XucnzFjd/3PV3AMFZDo1IHnhp55G7IIeVOJweTqK/ylir2N6EdT43g02LqXwwtBf0N2zlRuKVsvzhmm2kuLEN2eVG6R2WqT+qu2xJmrzIHSdt8Xa6DjtD1gSQ8ueUi46uFnYzT94zckirzuDUeIQUhb4uz/6AAGwAAA",
  },
  lyrics: {
    src: "/assets/mobile/shots/shot-lyrics.webp",
    width: 720,
    height: 1600,
    label: "Lyrics",
    alt: "Bitify Music mobile app — time-synced lyrics with the mini player",
    blur:
      "data:image/webp;base64,UklGRtwAAABXRUJQVlA4INAAAADwBgCdASoYADUAPuFUpU0opCOiMBv9+RAcCWkA0fgZG/9GoUsQpFk3q9ip10G/A50Ju+FKO9mszDv1GnT1fPQAAP6meNQdxQal2N7rboSq6yC5SbPHEqbTEkwpDHHUN38UjEunUVKYOvd3+H6rtcL7iYhgCLAwz616EbP+UZLlVudctP6CW1lEZhcDSiKpyyi1hs7eC7HaaLIk4iKtXZtG5TPY7xroO4RUzW0+cKxbTl6vIzj45KLo0xHoShKkIIQIdfjMBso459fLBKzCAAAA",
  },
  singalong: {
    src: "/assets/mobile/shots/shot-singalong.webp",
    width: 720,
    height: 1471,
    label: "Sing Along",
    alt: "Bitify Music mobile app — Sing Along view with word-synced lyrics",
    blur:
      "data:image/webp;base64,UklGRtAAAABXRUJQVlA4IMQAAAAwBgCdASoYADEAPulsrVEpJiQiqBgKqSAdCWkAzUgbEnzehyaWNF+5f/M9Bu+WU6/ZVJDgxmrMVGMAAPjX+2njOUMzQWUJ18BI5kZDNHXXYVdYLb/XgFdavxgJClOdzcPeq13KECFqFbF8bPJci/eYsY7r9GqJw+Qr0hzRDwaCUWHTfVWKlRgX8hKZdL8tPxMlMpsegg/VXIzHGcPuAC/BwtleHMoAHnmojJzxYZYT7xbYW25og/mVkx7UR/gwGvwyAAAA",
  },
  explore: {
    src: "/assets/mobile/shots/shot-explore.webp",
    width: 720,
    height: 1475,
    label: "Explore",
    alt: "Bitify Music mobile app — Explore with moods, activities and categories",
    blur:
      "data:image/webp;base64,UklGRnABAABXRUJQVlA4IGQBAABwBwCdASoYADEAPulmqU0pJiQiLBqsySAdCWYAv9FlA6812VAPDhGKlm3a88+TzTCjX51il4kQPdughm+Du0F/CSEtwAD+7SE9vJMGuBitw7A648OGYgyaS98U/lL3zeo9f6nE6BNCFyiHq+fMXZIAaUkjsFnNKcfpjyt0sW7p++j93Dihhuhd5g3WwwT/1dAlj2cs1JqSMKWoHHifH7uvvwUcxmc2S4ap5atC2fqsnFtsWP0nJxrWLvf49LsKDRjOKSvacDT4YQM5Fe3tbxiifxY0+m0DYoPw2WPcAp8LYWFLoTx0J4LWlF+gAHBDPvmMjoqE/8/L/GN/kD0Vi+fWLON4BYCEyMsqX3N5EQIN3Kg9Q86KuWVMjJGI+AxCi7grKc1ixmw2Bt1rJ5w+6EdcA6eKo7f5avMb8O2nHf4dzA/o/+tez95LlSEY2hR0c4/Lnir0livOKdq5qNgcmRHylq+AAAA==",
  },
  search: {
    src: "/assets/mobile/shots/shot-search.webp",
    width: 720,
    height: 1474,
    label: "Search",
    alt: "Bitify Music mobile app — Search with instant songs, albums and artists",
    blur:
      "data:image/webp;base64,UklGRuQAAABXRUJQVlA4INgAAABQBgCdASoYADEAPuloq1CpJaOirBVZmSAdCWcAyCAjHPZt87N3DpIk0DCh0+bd8vBgclb95IJES9EYAAD+9ZdfbIaNUIB/kUbqh2MMXSfjPja4PhXAzrLI/zR3zvnX5txVSZ3jeaHs+mECaru+cWzb4gOdEQl8LesOxorLkOfkkB10WyZS/fGXykOvaeQYmMcyF1vzx8JQ2W4igNZNIs+ziMDMIbfguNlNmPRKRv8x1afR1LFCz0qItvISKRdWLKwycPwbe/wXHFCMOnVddILAaBv22/YAAAA=",
  },
};

/**
 * Desktop app window captures — real screenshots at their intrinsic
 * dimensions, presented inside the CSS WindowFrame (a macOS-style chrome
 * built in the browser).
 */
export interface DesktopShot {
  src: string;
  width: number;
  height: number;
  label: string;
  alt: string;
}

/**
 * Live screen recordings with sound — presented muted by default with an
 * unmute control (the user's music never auto-plays out loud). `poster` is
 * the matching still capture shown while the video buffers (and forever,
 * if the video can't load at all).
 */
export const LIVE_VIDEOS = {
  desktop: {
    src: "/assets/desktop/desktop-live.mp4",
    poster: "/assets/desktop/desktop-lyrics.webp",
    label: "Live",
    alt: "Bitify Music desktop app — Now Playing with word-synced lyrics, screen recording",
  },
  tv: {
    src: "/assets/tv/tv-live.mp4",
    poster: "/assets/tv/tv-live-poster.webp",
    label: "Live",
    alt: "Bitify Music on TV — Now Playing screen recording",
  },
} as const;

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
