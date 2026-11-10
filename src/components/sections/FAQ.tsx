"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faq } from "@/config/content";
import { cn } from "@/lib/cn";
import { whatsappUrl } from "@/lib/whatsapp";

/** 09 — Perguntas frequentes: acordeão acessível com animação de altura. */
export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="duvidas" aria-labelledby="duvidas-titulo" className="relative scroll-mt-20 py-24 md:py-36">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 hairline" />
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <SectionHeading id="duvidas-titulo" index="09" eyebrow="Dúvidas" title="Perguntas frequentes." accentFrom={1} />
            <Reveal delay={0.15} className="mt-8 max-w-xs text-base leading-relaxed text-muted">
              Não encontrou o que procurava? Fale com a gente — respondemos sem compromisso.
            </Reveal>
            <Reveal delay={0.25} className="mt-7">
              <Button variant="glass" href={whatsappUrl("Olá! Tenho uma dúvida sobre instalação de ar-condicionado.")} external icon="whatsapp">
                Tirar uma dúvida
              </Button>
            </Reveal>
          </div>
        </div>

        <ul className="lg:col-span-8">
          {faq.map((item, index) => {
            const expanded = open === index;
            return (
              <Reveal as="li" key={item.q} delay={Math.min(index, 5) * 0.04} className="border-b border-line first:border-t">
                <h3>
                  <button
                    type="button"
                    id={`faq-botao-${index}`}
                    aria-expanded={expanded}
                    aria-controls={`faq-painel-${index}`}
                    onClick={() => setOpen(expanded ? null : index)}
                    className="group flex w-full items-center gap-5 py-6 text-left md:gap-8 md:py-7"
                  >
                    <span className="font-mono text-[0.6875rem] tracking-[0.2em] text-muted">{String(index + 1).padStart(2, "0")}</span>
                    <span
                      className={cn(
                        "flex-1 font-display text-lg font-semibold leading-snug tracking-[-0.02em] transition-colors duration-300 md:text-xl",
                        expanded ? "text-fg" : "text-fg-soft group-hover:text-fg",
                      )}
                    >
                      {item.q}
                    </span>
                    <span
                      aria-hidden
                      className={cn(
                        "relative grid size-10 shrink-0 place-items-center rounded-full border transition-[background-color,border-color,color,rotate] duration-500 ease-out-expo",
                        expanded ? "rotate-180 border-accent bg-accent text-on-accent" : "border-line-strong text-fg group-hover:border-accent",
                      )}
                    >
                      <span className="absolute h-px w-3.5 bg-current" />
                      <span className={cn("absolute h-3.5 w-px bg-current transition-transform duration-500 ease-out-expo", expanded && "scale-y-0")} />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.div
                      id={`faq-painel-${index}`}
                      role="region"
                      aria-labelledby={`faq-botao-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-8 pl-[2.6rem] pr-14 text-[0.9375rem] leading-relaxed text-muted md:pl-[3.4rem] md:text-base">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
