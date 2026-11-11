"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/icons";
import { useScroller } from "@/components/providers/SmoothScroll";
import { Picture } from "@/components/ui/Picture";
import type { GalleryItem } from "@/config/content";

type LightboxProps = {
  items: GalleryItem[];
  index: number | null;
  onClose: () => void;
  onChange: (index: number) => void;
};

/** Visualização ampliada da galeria: teclado (← → Esc), toque (arrastar) e foco preso no diálogo. */
export function Lightbox({ items, index, onClose, onChange }: LightboxProps) {
  const open = index !== null;
  const dialog = useRef<HTMLDivElement>(null);
  const restore = useRef<HTMLElement | null>(null);
  const { lock } = useScroller();

  const step = useCallback(
    (direction: number) => {
      if (index === null) return;
      onChange((index + direction + items.length) % items.length);
    },
    [index, items.length, onChange],
  );

  useEffect(() => {
    if (!open) return;
    restore.current = document.activeElement as HTMLElement | null;
    lock(true);
    const focusTimer = window.setTimeout(() => dialog.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus(), 60);
    return () => {
      window.clearTimeout(focusTimer);
      lock(false);
      restore.current?.focus({ preventScroll: true });
    };
  }, [open, lock]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
      if (event.key === "Tab" && dialog.current) {
        const focusable = dialog.current.querySelectorAll<HTMLElement>("button");
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, step]);

  if (typeof document === "undefined") return null;
  const item = index !== null ? items[index] : null;

  return createPortal(
    <AnimatePresence>
      {item && index !== null && (
        <motion.div
          ref={dialog}
          role="dialog"
          aria-modal="true"
          aria-label={`${item.title} — imagem ampliada`}
          data-lenis-prevent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[200] flex flex-col bg-[rgb(4_7_14/0.94)] text-frost backdrop-blur-xl"
          onClick={onClose}
        >
          <div className="flex items-center justify-between px-5 py-4 md:px-8 md:py-6" onClick={(event) => event.stopPropagation()}>
            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-frost/60">
              {String(index + 1).padStart(2, "0")} <span className="text-frost/30">/ {String(items.length).padStart(2, "0")}</span>
            </p>
            <button
              type="button"
              data-autofocus
              onClick={onClose}
              aria-label="Fechar imagem ampliada"
              className="grid size-11 place-items-center rounded-full border border-white/20 transition-[background-color,rotate] duration-500 hover:rotate-90 hover:bg-white/10"
            >
              <Icon name="close" size={18} />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-20">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={item.image}
                initial={{ opacity: 0, scale: 0.96, filter: "blur(12px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.02, filter: "blur(12px)" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.3}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -70) step(1);
                  if (info.offset.x > 70) step(-1);
                }}
                onClick={(event) => event.stopPropagation()}
                className="flex max-h-full max-w-full cursor-grab items-center justify-center active:cursor-grabbing"
              >
                <Picture
                  name={item.image}
                  alt={item.alt}
                  sizes="100vw"
                  priority
                  className="max-h-full"
                  imgClassName="pointer-events-none max-h-[72svh] w-auto max-w-full rounded-2xl object-contain shadow-[0_40px_120px_-30px_rgb(0_0_0/0.9)]"
                />
              </motion.div>
            </AnimatePresence>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                step(-1);
              }}
              aria-label="Imagem anterior"
              className="absolute left-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/30 backdrop-blur transition-colors hover:bg-white/10 md:left-6"
            >
              <Icon name="chevronLeft" size={20} />
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                step(1);
              }}
              aria-label="Próxima imagem"
              className="absolute right-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/30 backdrop-blur transition-colors hover:bg-white/10 md:right-6"
            >
              <Icon name="chevronRight" size={20} />
            </button>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-3 px-5 py-5 md:px-8 md:py-7" onClick={(event) => event.stopPropagation()}>
            <div>
              <p className="font-display text-xl font-semibold tracking-[-0.02em]">{item.title}</p>
              <p className="mt-1 text-sm text-frost/60">{item.place}</p>
            </div>
            <p className="rounded-full border border-white/15 px-3 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-frost/60">
              Imagem ilustrativa
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
