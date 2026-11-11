"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** Indicador de progresso de leitura — um filete de "temperatura" no topo. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.3 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[95] h-[2px] origin-left bg-[linear-gradient(90deg,#1a3f75,#6f9dc8_55%,#eaf3fa)]"
    />
  );
}
