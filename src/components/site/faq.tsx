"use client";

import { MessageCircleQuestion } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "./reveal";
import { FAQ_ITEMS } from "@/lib/site-config";

export function Faq() {
  return (
    <section
      id="faq"
      aria-label="Frequently asked questions"
      className="relative border-t border-white/[0.05]"
    >
      <div aria-hidden className="ambient-top" />
      <div className="relative mx-auto max-w-[1200px] px-6 py-28 sm:py-36">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          {/* ---- header + support card ---- */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <p className="eyebrow">
                <span className="eyebrow-idx">07</span>
                FAQ
              </p>
              <h2 className="mt-5 font-display text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-warm-white sm:text-5xl">
                Questions,
                <br />
                <span className="text-crimson-bright">answered.</span>
              </h2>
              <p className="mt-6 text-pretty text-base leading-relaxed text-muted-warm sm:text-lg">
                Everything you need to know about Bitify Music and the three
                experiences it ships with.
              </p>
            </Reveal>

            {/* still stuck? — fills the rail, speaks human */}
            <Reveal delay={0.1}>
              <div className="glass-card mt-10 p-6">
                <span className="icon-tile">
                  <MessageCircleQuestion className="h-[18px] w-[18px]" aria-hidden />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold tracking-[-0.01em] text-warm-white">
                  Still stuck?
                </h3>
                <p className="mt-2 text-pretty text-[13px] leading-relaxed text-muted-warm">
                  The crew reads every message themselves — reach out through
                  the support channel published with your download, and
                  you&apos;ll hear back from a human, not a ticket number.
                </p>
              </div>
            </Reveal>
          </div>

          {/* ---- accordion ---- */}
          <Reveal delay={0.08}>
            <Accordion
              type="single"
              collapsible
              className="border-t border-white/[0.08]"
            >
              {FAQ_ITEMS.map((item, i) => (
                <AccordionItem
                  key={item.question}
                  value={`faq-${i}`}
                  className="border-b border-white/[0.08] transition-colors duration-300 data-[state=open]:border-crimson/25"
                >
                  <AccordionTrigger className="group py-6 text-left text-base font-medium tracking-[-0.01em] text-warm-white transition-colors hover:text-crimson-bright sm:text-lg [&>svg]:text-white/35 [&>svg]:transition-colors [&>svg]:duration-300 [&[data-state=open]>svg]:text-crimson-bright [&[data-state=open]>span:first-child]:text-crimson-bright">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 text-sm leading-relaxed text-muted-warm sm:text-[15px]">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
