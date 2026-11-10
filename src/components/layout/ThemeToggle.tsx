"use client";

import { motion } from "motion/react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useHydrated } from "@/lib/hooks";
import { cn } from "@/lib/cn";

/**
 * Alternador de tema próprio: um "termostato" em miniatura.
 * O disco desliza entre lua (escuro) e sol (claro); a troca se espalha pela página
 * como uma frente fria (View Transitions API, quando disponível).
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const hydrated = useHydrated();
  const isLight = hydrated && theme === "light";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isLight}
      aria-label={isLight ? "Ativar tema escuro" : "Ativar tema claro"}
      title={isLight ? "Tema escuro" : "Tema claro"}
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        toggle({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      }}
      className={cn(
        "group relative inline-flex h-10 w-[4.25rem] shrink-0 items-center rounded-full border border-line-strong bg-surface/60 p-1 transition-colors duration-500 hover:border-accent/60",
        className,
      )}
    >
      <span aria-hidden className="pointer-events-none absolute inset-x-3 flex items-center justify-between text-muted">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M20 14.3A8 8 0 1 1 9.7 4a6.3 6.3 0 0 0 10.3 10.3z" />
        </svg>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="12" cy="12" r="3.8" />
          <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
        </svg>
      </span>
      <motion.span
        aria-hidden
        initial={false}
        animate={{ x: isLight ? 28 : 0 }}
        transition={{ type: "spring", stiffness: 420, damping: 30 }}
        className="relative grid size-8 place-items-center rounded-full bg-[linear-gradient(140deg,#35577d,#1a3f75)] text-frost shadow-[inset_0_1px_0_rgb(255_255_255/0.3),0_4px_14px_-4px_rgb(26_63_117/0.9)]"
      >
        <motion.svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={{ rotate: isLight ? 90 : 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {isLight ? (
            <>
              <circle cx="12" cy="12" r="3.8" />
              <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
            </>
          ) : (
            <path d="M20 14.3A8 8 0 1 1 9.7 4a6.3 6.3 0 0 0 10.3 10.3z" />
          )}
        </motion.svg>
      </motion.span>
    </button>
  );
}
