"use client";

import type { ReactNode } from "react";
import { ArrowUpRight, Github, LifeBuoy, Mail, ShieldCheck, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

/**
 * Privacy Policy / Terms of Service / Support — presented as in-page
 * dialogs (the site is a single page). The legal stance mirrors the
 * open-source music-client convention: Bitify is an independent
 * third-party player that hosts no media, collects no personal data,
 * and streams through public / user-authenticated APIs — the user is
 * responsible for respecting platform terms and local copyright law.
 */

const UPDATED = "Last updated: November 2025";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-7 first:mt-0">
      <h3 className="font-display text-base font-semibold tracking-tight text-warm-white">
        {title}
      </h3>
      <div className="mt-2.5 space-y-2.5 text-[13.5px] leading-relaxed text-muted-warm">
        {children}
      </div>
    </section>
  );
}

function LegalDialog({
  triggerLabel,
  icon: Icon,
  title,
  description,
  children,
}: {
  triggerLabel: string;
  icon: typeof ShieldCheck;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger className="inline-flex cursor-pointer items-center gap-1 text-sm text-muted-warm transition-colors hover:text-warm-white">
        <Icon className="h-3.5 w-3.5 text-crimson/80" aria-hidden />
        {triggerLabel}
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] gap-0 overflow-y-auto border-white/10 bg-[#0A0A0D] p-0 sm:max-w-2xl">
        <DialogHeader className="border-b border-white/[0.06] bg-gradient-to-b from-crimson/[0.07] to-transparent px-6 py-6 sm:px-8">
          <DialogTitle className="flex items-center gap-3 font-display text-xl font-semibold tracking-tight text-warm-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-crimson/30 bg-crimson/10">
              <Icon className="h-4 w-4 text-crimson-bright" aria-hidden />
            </span>
            {title}
          </DialogTitle>
          <DialogDescription className="text-[13px] text-muted-warm">
            {description}
          </DialogDescription>
          <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/25">
            {UPDATED}
          </p>
        </DialogHeader>
        <div className="px-6 py-6 sm:px-8">{children}</div>
        {/* scroll cue — fades the last lines so the body reads as
            scrollable (sticky, so it stays pinned while scrolling) */}
        <div
          aria-hidden
          className="pointer-events-none sticky bottom-0 -mt-12 h-12 shrink-0 bg-gradient-to-t from-[#0A0A0D] to-transparent"
        />
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/* Privacy Policy                                                      */
/* ------------------------------------------------------------------ */

function PrivacyContent() {
  return (
    <>
      <Section title="The short version">
        <p>
          Bitify Music was built privacy-first. The app does not require an
          account, does not ask for your identity, and does not track what
          you listen to on any server we control. Your library lives on
          your devices — full stop.
        </p>
      </Section>

      <Section title="What we do not collect">
        <ul className="ml-4 list-disc space-y-1.5">
          <li>No sign-up, email address or phone number is required.</li>
          <li>No analytics or tracking SDKs are bundled with the app.</li>
          <li>No listening history, playlists or preferences leave your device.</li>
          <li>No advertising identifiers are read or shared.</li>
        </ul>
      </Section>

      <Section title="What stays on your device">
        <p>
          Your playlists, likes, queue, offline downloads, lyrics cache and
          player preferences are stored in the app&apos;s local storage on
          your computer, phone or TV. Uninstalling the app removes them —
          we keep no backup, because we never receive them in the first
          place.
        </p>
      </Section>

      <Section title="Third-party services">
        <p>
          Bitify is an interface, not a server. When you search or stream,
          requests go directly from your device to public or
          user-authenticated music APIs and community lyric providers
          (LRCLIB, Musixmatch and similar open services used by many
          open-source players). Those requests are subject to the
          respective providers&apos; privacy policies. If you sign in to a
          third-party platform from inside Bitify, that platform&apos;s own
          terms and privacy policy govern the session — Bitify never sees
          or stores your credentials.
        </p>
      </Section>

      <Section title="Permissions">
        <ul className="ml-4 list-disc space-y-1.5">
          <li>
            <strong className="text-warm-white">Storage</strong> — for
            offline downloads and the local music library you choose to
            index.
          </li>
          <li>
            <strong className="text-warm-white">Network</strong> — to
            stream audio and fetch lyrics from the providers above.
          </li>
        </ul>
        <p>No other permissions are requested.</p>
      </Section>

      <Section title="Changes to this policy">
        <p>
          If the policy ever changes, the updated version will ship with
          the app release and be linked from this page. Continued use
          after an update means you accept the revised policy.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Questions about privacy? Open an issue on the{" "}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-0.5 text-crimson-bright transition-colors hover:text-warm-white"
          >
            GitHub repository
            <ArrowUpRight className="h-3 w-3" aria-hidden />
          </a>{" "}
          and the developer (Vishnu) will get back to you.
        </p>
      </Section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Terms of Service                                                    */
/* ------------------------------------------------------------------ */

function TermsContent() {
  return (
    <>
      <Section title="Acceptance">
        <p>
          By downloading, installing or using Bitify Music you agree to
          these terms. If you do not agree, please do not use the app.
        </p>
      </Section>

      <Section title="The nature of the service">
        <p>
          Bitify Music is an independent, community-driven third-party
          audio player and client. It is{" "}
          <strong className="text-warm-white">
            not associated with Google LLC, YouTube Music, or any of their
            parent companies
          </strong>
          , nor with any other streaming platform.
        </p>
        <p>
          <strong className="text-warm-white">No media hosting.</strong>{" "}
          Bitify does not host, upload, or store copyrighted music files.
          It operates strictly as an interface to scan local device
          storage or stream media directly from public, public-facing, or
          user-authenticated APIs.
        </p>
      </Section>

      <Section title="Your responsibility">
        <p>
          This software is created solely for personal research,
          educational, and fair-use purposes. You are entirely responsible
          for ensuring your usage aligns with your local copyright laws
          and the Terms of Service of any platform you connect to.
        </p>
        <p>
          <strong className="text-warm-white">No ad-blocking guarantee.</strong>{" "}
          While Bitify focuses on providing a clean listening environment,
          it does not guarantee permanent bypasses or modifications to
          commercial third-party platform conditions.
        </p>
      </Section>

      <Section title="No warranty">
        <p>
          The app is provided &quot;as is&quot;, without warranty of any
          kind. Streaming availability, lyric coverage and third-party API
          behaviour can change at any time and are outside our control.
        </p>
      </Section>

      <Section title="Limitation of liability">
        <p>
          To the maximum extent permitted by law, the developer shall not
          be liable for any damages arising from the use or inability to
          use this software, including any consequences of how third-party
          platforms respond to API usage.
        </p>
      </Section>

      <Section title="Credits & open source">
        <p>
          Bitify Music was designed and developed by{" "}
          <strong className="text-warm-white">Vishnu</strong>. It is built
          with open-source scripts and data from GitHub, and its design
          language is inspired by YouTube Music. Full credit goes to the
          original authors of every component used.
        </p>
      </Section>

      <Section title="Changes to these terms">
        <p>
          These terms may be updated as the project evolves. The current
          version always ships with the latest release and is linked from
          this page.
        </p>
      </Section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Support                                                             */
/* ------------------------------------------------------------------ */

function SupportContent() {
  return (
    <>
      <Section title="Where to get help">
        <p>
          Bitify is developed in the open. The fastest way to get help is
          the project&apos;s GitHub repository — browse existing issues or
          open a new one:
        </p>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.03] px-4 py-2 text-[13px] font-semibold text-warm-white transition-colors hover:border-crimson/40 hover:bg-white/[0.06]"
        >
          <Github className="h-4 w-4" aria-hidden />
          Open the repository
          <ArrowUpRight className="h-3.5 w-3.5 text-muted-warm" aria-hidden />
        </a>
      </Section>

      <Section title="Reporting a bug">
        <p>
          To make a bug report easy to act on, include:
        </p>
        <ul className="ml-4 list-disc space-y-1.5">
          <li>Your platform (Windows, macOS, Android, iOS or TV) and app version.</li>
          <li>What you expected, and what actually happened.</li>
          <li>Steps to reproduce the issue, starting from the home screen.</li>
          <li>A screenshot or screen recording, if the problem is visual.</li>
        </ul>
      </Section>

      <Section title="Frequently asked">
        <p>
          <strong className="text-warm-white">
            When do the download links go live?
          </strong>{" "}
          Official desktop and Android builds are published on the Downloads section of
          this page at release — the buttons there will switch from
          &quot;coming soon&quot; to real links.
        </p>
        <p>
          <strong className="text-warm-white">Which platforms are supported?</strong>{" "}
          Windows and macOS for desktop, Android and iOS for mobile, and
          Android TV / smart TVs for the living room.
        </p>
        <p>
          <strong className="text-warm-white">Is Bitify free?</strong>{" "}
          Yes — the project is free to use, built on open-source scripts
          and community data.
        </p>
      </Section>

      <Section title="Contact the developer">
        <p className="flex items-center gap-2">
          <Mail className="h-3.5 w-3.5 text-crimson/80" aria-hidden />
          Reach Vishnu through the repository above — issues are checked
          regularly.
        </p>
      </Section>
    </>
  );
}

/* ------------------------------------------------------------------ */

export function LegalDialogs() {
  return (
    <ul className="mt-5 space-y-3">
      <li>
        <LegalDialog
          triggerLabel="Privacy Policy"
          icon={ShieldCheck}
          title="Privacy Policy"
          description="What Bitify Music collects (almost nothing), what stays on your device, and who else is involved when you stream."
        >
          <PrivacyContent />
        </LegalDialog>
      </li>
      <li>
        <LegalDialog
          triggerLabel="Terms of Service"
          icon={FileText}
          title="Terms of Service"
          description="The ground rules for using Bitify Music — the nature of the service, your responsibilities, and the limits of the warranty."
        >
          <TermsContent />
        </LegalDialog>
      </li>
      <li>
        <LegalDialog
          triggerLabel="Support"
          icon={LifeBuoy}
          title="Support"
          description="Where to get help, how to report a bug, and answers to the questions people ask most."
        >
          <SupportContent />
        </LegalDialog>
      </li>
    </ul>
  );
}
