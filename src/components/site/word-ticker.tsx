/**
 * WordTicker — the loud strip between the Showcase and the rest of the page.
 *
 * A single transform-only CSS marquee (same composited keyframe the quiet
 * capabilities Marquee uses) carrying oversized display words that rotate
 * through four finishes — solid warm-white, hollow outline, crimson, and
 * the champagne-gold foil — street-poster energy with a jeweller's accent,
 * for zero runtime cost. Reduced-motion visitors get a static row.
 */
const WORDS = [
  { text: "Your Music", tone: "solid" },
  { text: "Every Screen", tone: "outline" },
  { text: "Sing Along", tone: "crimson" },
  { text: "Word-Synced", tone: "outline" },
  { text: "Listen Together", tone: "solid" },
  { text: "Free Forever", tone: "foil" },
] as const;

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul
      aria-hidden={hidden || undefined}
      className="flex w-max shrink-0 items-center gap-8 pr-8 sm:gap-12 sm:pr-12"
    >
      {WORDS.map((w) => (
        <li key={w.text} className="flex items-center gap-8 sm:gap-12">
          <span
            className={
              w.tone === "solid"
                ? "font-display text-3xl font-bold tracking-tight text-warm-white sm:text-6xl"
                : w.tone === "crimson"
                  ? "font-display text-3xl font-bold tracking-tight text-crimson sm:text-6xl"
                  : w.tone === "foil"
                    ? "gold-foil font-display text-3xl font-bold tracking-tight sm:text-6xl"
                    : "text-outline font-display text-3xl font-bold tracking-tight sm:text-6xl"
            }
          >
            {w.text}
          </span>
          <span
            aria-hidden
            className={
              w.tone === "foil"
                ? "inline-block h-2.5 w-2.5 rotate-45 rounded-[2px] bg-[linear-gradient(135deg,var(--gold-bright),var(--gold))] shadow-[0_0_10px_rgb(var(--gold-rgb)/0.5)]"
                : "inline-block h-2.5 w-2.5 rotate-45 rounded-[2px] bg-crimson/80"
            }
          />
        </li>
      ))}
    </ul>
  );
}

export function WordTicker() {
  return (
    <section
      aria-label="Bitify Music in words"
      className="relative overflow-hidden border-y border-white/[0.06] bg-[#08080a] py-7 sm:py-9"
    >
      <div className="marquee-mask overflow-hidden">
        <div
          className="marquee-track flex w-max"
          style={{ animationDuration: "38s" }}
        >
          <Row />
          <Row hidden />
        </div>
      </div>
    </section>
  );
}
