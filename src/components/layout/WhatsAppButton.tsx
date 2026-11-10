"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { Icon } from "@/components/icons";
import { whatsappUrl } from "@/lib/whatsapp";

/**
 * Botão flutuante de WhatsApp com a identidade da DCRYO (vidro azul + selo verde).
 * Aparece depois da primeira dobra e se recolhe quando o formulário de contato ou o
 * rodapé estão na tela, para não cobrir informação nem duplicar o chamado.
 */
export function WhatsAppButton() {
  const { scrollY } = useScroll();
  const [past, setPast] = useState(false);
  const [covered, setCovered] = useState(false);

  useMotionValueEvent(scrollY, "change", (value) => setPast(value > window.innerHeight * 0.6));

  useEffect(() => {
    const targets = ["contato", "rodape"].map((id) => document.getElementById(id)).filter((el): el is HTMLElement => Boolean(el));
    if (!targets.length) return;
    const state = new Map<Element, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => state.set(entry.target, entry.isIntersecting));
        setCovered([...state.values()].some(Boolean));
      },
      { rootMargin: "0px 0px -25% 0px" },
    );
    targets.forEach((target) => io.observe(target));
    return () => io.disconnect();
  }, []);

  return (
    <AnimatePresence>
      {past && !covered && (
        <motion.a
          href={whatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Falar com a DCRYO pelo WhatsApp"
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.9 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="group glass fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-[70] flex h-14 items-center gap-3 rounded-full p-1.5 pr-1.5 text-fg shadow-[0_20px_50px_-20px_rgb(0_0_30/0.75)] hoverable:hover:pr-5 md:bottom-7 md:right-7"
          style={{ transition: "padding .6s cubic-bezier(.16,1,.3,1)" }}
        >
          <span className="relative grid size-11 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#1a9460,#127248)] text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.3)]">
            <span aria-hidden className="absolute inset-0 animate-pulse-soft rounded-full ring-2 ring-[#1a9460]/50" />
            <Icon name="whatsapp" size={24} className="relative" />
          </span>
          <span className="grid max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium leading-tight opacity-0 transition-[max-width,opacity] duration-700 ease-out-expo hoverable:group-hover:max-w-[12rem] hoverable:group-hover:opacity-100">
            <span>Fale conosco</span>
            <span className="text-xs font-normal text-muted">Orçamento pelo WhatsApp</span>
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
