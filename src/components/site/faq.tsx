"use client";

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
      <div className="mx-auto max-w-[1200px] px-6 py-28 sm:py-36">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          {/* ---- header ---- */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <p className="eyebrow flex items-center gap-3">
                <span className="inline-block h-px w-8 bg-crimson/70" aria-hidden />
                FAQ
              </p>
              <h2 className="mt-5 font-display text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-warm-white sm:text-5xl">
                Questions,
                <br />
                answered.
              </h2>
              <p className="mt-6 text-pretty text-base leading-relaxed text-muted-warm sm:text-lg">
                Everything you need to know about Bitify Music and the three
                experiences it ships with.
              </p>
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
                  className="border-b border-white/[0.08]"
                >
                  <AccordionTrigger className="group py-6 text-left font-display text-base font-medium tracking-tight text-warm-white transition-colors hover:text-crimson-bright sm:text-lg [&[data-state=open]>span:first-child]:text-crimson-bright">
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
