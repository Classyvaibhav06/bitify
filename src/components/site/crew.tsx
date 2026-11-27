import Image from "next/image";
import { Headphones } from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem } from "./reveal";

/**
 * Crew — the humans behind Bitify Music.
 *
 * Three quiet cards. The founder (Vishnu) is marked by a crimson
 * hairline, not a spotlight. Each card carries a "now playing" line
 * — the crew dogfoods the player, and it shows.
 */
const CREW = [
  {
    name: "Vishnu",
    role: "Founder & Lead Developer",
    founder: true,
    avatar: "/assets/crew/vishnu.webp",
    bio: "Started Bitify with one itch: one player for every screen. Now he ships the desktop app and keeps the whole engine in tune.",
    focus: ["Architecture", "Desktop app", "Everything else"],
    playing: "Pal Pal — Talwiinder",
  },
  {
    name: "Pratham",
    role: "Developer",
    founder: false,
    avatar: "/assets/crew/pratham.webp",
    bio: "Builds the sync engine — the magic that makes your queue follow you from the desk to the couch without missing a beat.",
    focus: ["Sync engine", "Mobile app", "Integrations"],
    playing: "Invincible — Pop Smoke",
  },
  {
    name: "Vaibhav",
    role: "Developer",
    founder: false,
    avatar: "/assets/crew/vaibhav.webp",
    bio: "Crafts the big-screen experience — the TV app your living room parties deserve, from Up Next to Sing Along.",
    focus: ["TV app", "UI & motion", "Performance"],
    playing: "SICKO MODE — Travis Scott",
  },
] as const;

export function Crew() {
  return (
    <section
      id="crew"
      aria-label="The crew behind Bitify Music"
      className="relative border-t border-white/[0.05]"
    >
      <div className="mx-auto max-w-[1200px] px-6 py-24 sm:py-32">
        {/* ---- header ---- */}
        <Reveal className="max-w-2xl">
          <p className="eyebrow">
            <span className="eyebrow-idx">05</span>
            The Crew
          </p>
          <h2 className="mt-5 font-display text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-warm-white sm:text-5xl">
            Three <i className="font-serif-accent text-crimson-bright">humans.</i>{" "}
            One soundtrack.
          </h2>
          <p className="mt-6 text-pretty text-base leading-relaxed text-muted-warm sm:text-lg">
            Bitify isn&apos;t built by a faceless company — it&apos;s a small
            crew that loves music as much as you do. Say hi when you see them
            shipping.
          </p>
        </Reveal>

        {/* ---- cards ---- */}
        <StaggerGroup className="mt-14 grid grid-cols-1 gap-4 sm:mt-16 md:grid-cols-3">
          {CREW.map((member) => (
            <StaggerItem key={member.name} className="h-full">
              <article
                className={`crew-card group flex h-full flex-col items-center p-7 text-center sm:p-8 ${
                  member.founder ? "crew-card-founder" : ""
                }`}
              >
                {/* avatar with a plain hairline ring (+ vinyl sheen on hover) */}
                <div className="crew-avatar-ring mt-2 size-24 sm:size-28">
                  <div className="crew-vinyl" aria-hidden />
                  <Image
                    src={member.avatar}
                    alt={`Stylized avatar of ${member.name}, ${member.role} of Bitify Music`}
                    width={224}
                    height={224}
                    sizes="112px"
                    className="relative size-full rounded-full object-cover"
                  />
                </div>

                <h3 className="mt-5 font-display text-xl font-semibold tracking-[-0.02em] text-warm-white">
                  {member.name}
                </h3>
                <p className="mt-1 text-[13px] font-medium tracking-wide text-crimson-bright">
                  {member.role}
                </p>

                <p className="mt-4 min-h-[3.75rem] text-pretty text-sm leading-relaxed text-muted-warm">
                  {member.bio}
                </p>

                {/* focus chips */}
                <ul className="mt-5 flex flex-wrap items-center justify-center gap-1.5">
                  {member.focus.map((f) => (
                    <li
                      key={f}
                      className="rounded-full border border-white/[0.08] px-3 py-1 text-[11px] font-medium tracking-wide text-warm-white/60"
                    >
                      {f}
                    </li>
                  ))}
                </ul>

                {/* now playing — the crew dogfoods the player */}
                <p className="mt-6 inline-flex max-w-full items-center gap-2 rounded-full border border-white/[0.08] bg-black/40 px-4 py-2 text-[11px] font-medium text-muted-warm">
                  <Headphones
                    className="h-3.5 w-3.5 shrink-0 text-crimson-bright"
                    aria-hidden
                  />
                  <span className="truncate">
                    <span className="sr-only">Currently playing: </span>
                    {member.playing}
                  </span>
                  <span className="np-eq shrink-0" aria-hidden>
                    {[0, 1, 2].map((i) => (
                      <i key={i} style={{ "--eq-i": i } as React.CSSProperties} />
                    ))}
                  </span>
                </p>
              </article>
            </StaggerItem>
          ))}
        </StaggerGroup>

        {/* ---- bottom note ---- */}
        <Reveal delay={0.1} className="mt-10">
          <p className="text-center text-sm text-muted-warm">
            Late-night builds are fuelled by one shared playlist — ask them
            for the link.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
