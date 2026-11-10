"use client";

import { motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { steps } from "@/config/content";
import { cn } from "@/lib/cn";

/** 04 — Como funciona: linha de progresso que se preenche com a rolagem. */
export function Process() {
  const track = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start 78%", "end 62%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  const [reached, setReached] = useState(-1);

  useMotionValueEvent(progress, "change", (value) => {
    const index = Math.floor(value * steps.length + 0.12) - (value < 0.03 ? 1 : 0);
    setReached(Math.min(steps.length - 1, Math.max(-1, Math.min(index, steps.length - 1))));
  });

  return (
    <section id="processo" aria-labelledby="processo-titulo" className="relative scroll-mt-20 py-24 md:py-36">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 hairline" />
      <div className="container-x">
        <SectionHeading
          id="processo-titulo"
          index="04"
          eyebrow="Como funciona"
          title="Quatro passos até o clima ideal."
          accentFrom={4}
          description="Um processo simples e transparente, do primeiro contato ao aparelho funcionando."
        />

        <ol ref={track} className="relative mt-16 grid gap-10 md:mt-24 md:grid-cols-4 md:gap-6">
          {/* trilho — horizontal no desktop, vertical no celular */}
          <div aria-hidden className="absolute left-7 top-7 h-[calc(100%-3.5rem)] w-px bg-line-strong md:left-7 md:right-7 md:top-7 md:h-px md:w-auto">
            <motion.div
              style={{ scaleY: progress }}
              className="absolute inset-0 origin-top bg-[linear-gradient(to_bottom,#35577d,#a9c8e0)] md:hidden"
            />
            <motion.div
              style={{ scaleX: progress }}
              className="absolute inset-0 hidden origin-left bg-[linear-gradient(to_right,#35577d,#a9c8e0)] md:block"
            />
          </div>

          {steps.map((step, index) => {
            const on = index <= reached;
            return (
              <Reveal as="li" key={step.title} delay={index * 0.08} className="relative flex gap-6 md:block">
                <div
                  className={cn(
                    "relative z-10 grid size-14 shrink-0 place-items-center rounded-full border bg-bg transition-[border-color,background-color,color,box-shadow] duration-700 ease-out-expo",
                    on
                      ? "border-accent bg-accent text-on-accent shadow-[0_0_0_6px_color-mix(in_srgb,var(--accent)_14%,transparent),0_0_34px_-2px_var(--glow)]"
                      : "border-line-strong text-muted",
                  )}
                >
                  <Icon name={step.icon} size={24} />
                </div>
                <div className="md:mt-9 md:pr-6">
                  <p className="eyebrow">
                    <span className={cn("transition-colors duration-500", on && "text-accent")}>Passo {String(index + 1).padStart(2, "0")}</span>
                  </p>
                  <h3 className="mt-3 font-display text-xl font-semibold tracking-[-0.025em] md:text-2xl">{step.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted md:text-[0.9375rem]">{step.text}</p>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
