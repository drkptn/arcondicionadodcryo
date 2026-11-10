"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const EASE = [0.16, 1, 0.3, 1] as const;

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  /** Desfoque de movimento só na entrada. */
  blur?: boolean;
  as?: "div" | "li" | "section" | "p" | "span";
};

/** Entrada suave quando o elemento chega à tela (uma única vez). */
export function Reveal({ children, className, delay = 0, y = 26, blur = false, as = "div" }: RevealProps) {
  const Comp = motion[as];
  return (
    <Comp
      data-reveal
      className={className}
      initial={{ opacity: 0, y, filter: blur ? "blur(10px)" : "blur(0px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.95, ease: EASE, delay }}
    >
      {children}
    </Comp>
  );
}

type WordsProps = {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  /** Anima ao montar (hero) em vez de esperar entrar na tela. */
  immediate?: boolean;
  /** Classe aplicada a palavras a partir deste índice (para destacar o fim da frase). */
  accentFrom?: number;
  accentClassName?: string;
};

/** Revela o texto palavra a palavra, subindo de trás de uma máscara. */
export function Words({ text, className, delay = 0, stagger = 0.055, immediate = false, accentFrom, accentClassName }: WordsProps) {
  const words = text.split(" ");
  return (
    <motion.span
      className={cn("inline", className)}
      aria-label={text}
      role="text"
      initial="hidden"
      animate={immediate ? "show" : undefined}
      whileInView={immediate ? undefined : "show"}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
    >
      {words.map((word, index) => (
        <span key={`${word}-${index}`} aria-hidden className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-bottom">
          <motion.span
            data-reveal
            className={cn("inline-block", accentFrom !== undefined && index >= accentFrom && accentClassName)}
            variants={{
              hidden: { y: "108%", rotate: 4, opacity: 0 },
              show: { y: "0%", rotate: 0, opacity: 1, transition: { duration: 1.05, ease: EASE } },
            }}
          >
            {word}
            {index < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
