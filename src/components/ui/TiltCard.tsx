"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import { useRef, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  /** Inclinação máxima em graus. */
  max?: number;
  /** Reflexo de luz que acompanha o cursor. */
  glare?: boolean;
  as?: "div" | "article" | "li";
};

/**
 * Card com perspectiva 3D: inclina conforme o mouse, com borda/spotlight dinâmicos
 * (classe .spot) e reflexo de luz. Em telas de toque fica estático.
 */
export function TiltCard({ children, className, max = 5, glare = true, as = "div" }: TiltCardProps) {
  const ref = useRef<HTMLElement | null>(null);
  const rx = useSpring(useMotionValue(0), { stiffness: 160, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 160, damping: 18 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(0);
  const glareBg = useMotionTemplate`radial-gradient(420px circle at ${gx}% ${gy}%, rgb(234 243 250 / 0.14), transparent 55%)`;

  const onMove = (event: PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el || event.pointerType !== "mouse") return;
    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    ry.set((px - 0.5) * 2 * max);
    rx.set(-(py - 0.5) * 2 * max);
    gx.set(px * 100);
    gy.set(py * 100);
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  const Comp = motion[as];
  return (
    <div className="h-full [perspective:1100px]">
      <Comp
        ref={(node: HTMLElement | null) => {
          ref.current = node;
        }}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className={cn("spot relative h-full will-change-transform", className)}
      >
        {children}
        {glare && (
          <motion.span
            aria-hidden
            style={{ background: glareBg }}
            className="pointer-events-none absolute inset-0 z-[3] rounded-[inherit] opacity-0 transition-opacity duration-500 hoverable:group-hover:opacity-100"
          />
        )}
      </Comp>
    </div>
  );
}
