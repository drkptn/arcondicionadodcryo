"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

function ScrubWord({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {children}&nbsp;
    </motion.span>
  );
}

/** Texto que "acende" palavra a palavra conforme a rolagem. */
export function ScrubText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 88%", "end 55%"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className} aria-label={text}>
      <span aria-hidden>
        {words.map((word, index) => {
          const start = index / words.length;
          return (
            <ScrubWord key={`${word}-${index}`} progress={scrollYProgress} range={[start, Math.min(1, start + 1.6 / words.length)]}>
              {word}
            </ScrubWord>
          );
        })}
      </span>
    </p>
  );
}

/** Moldura com paralaxe vertical: o conteúdo desliza em velocidade diferente da página. */
export function Parallax({ children, className, amount = 9 }: { children: ReactNode; className?: string; amount?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${amount}%`, `${amount}%`]);
  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <motion.div style={{ y, scale: 1 + (amount * 2.2) / 100 }} className="size-full will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}

/** Deslocamento vertical simples ligado à rolagem (camadas em velocidades diferentes). */
export function Drift({ children, className, distance = 60 }: { children: ReactNode; className?: string; distance?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
