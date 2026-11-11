"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { Icon } from "@/components/icons";
import { useQuote } from "@/components/providers/QuoteProvider";
import { Lightbox } from "@/components/ui/Lightbox";
import { Picture } from "@/components/ui/Picture";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { gallery, galleryNote, type GalleryCategory } from "@/config/content";
import { useHydrated } from "@/lib/hooks";
import { cn } from "@/lib/cn";

type Filter = "todos" | GalleryCategory;

const filters: { id: Filter; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "residencial", label: "Residencial" },
  { id: "comercial", label: "Comercial" },
  { id: "detalhes", label: "Detalhes" },
];

/** 05 — Galeria: grade editorial inspirada em portfólios de arquitetura, com lightbox. */
export function Gallery() {
  const [filter, setFilter] = useState<Filter>("todos");
  const [open, setOpen] = useState<number | null>(null);
  const hydrated = useHydrated();
  const { requestQuote } = useQuote();
  const items = useMemo(() => (filter === "todos" ? gallery : gallery.filter((item) => item.category === filter)), [filter]);

  return (
    <section id="galeria" aria-labelledby="galeria-titulo" className="relative py-24 md:py-36">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 hairline" />
      <div className="container-x">
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <SectionHeading
            id="galeria-titulo"
            index="05"
            eyebrow="Galeria"
            title="Ambientes onde o clima faz parte do projeto."
            accentFrom={3}
          />
          <Reveal delay={0.1}>
            <div role="group" aria-label="Filtrar galeria" className="flex flex-wrap gap-2">
              {filters.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={filter === item.id}
                  onClick={() => setFilter(item.id)}
                  className={cn(
                    "relative rounded-full border px-4 py-2 text-[0.8125rem] font-medium transition-colors duration-300",
                    filter === item.id ? "border-transparent text-on-accent" : "border-line-strong text-muted hover:border-accent hover:text-fg",
                  )}
                >
                  {filter === item.id && (
                    <motion.span
                      layoutId="gallery-filter"
                      aria-hidden
                      className="absolute inset-0 rounded-full bg-accent"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{item.label}</span>
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-16 lg:auto-rows-[9rem] lg:grid-cols-12">
          <AnimatePresence mode="popLayout" initial={false}>
            {items.map((item, index) => (
              <motion.li
                key={item.image}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "group relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-line bg-surface lg:aspect-auto",
                  filter === "todos" ? item.layout : "lg:col-span-6 lg:row-span-3",
                )}
              >
                <button
                  type="button"
                  data-cursor="Ver"
                  onClick={() => setOpen(index)}
                  aria-label={`Ampliar imagem: ${item.title}`}
                  className="absolute inset-0 block size-full text-left"
                >
                  <Picture
                    name={item.image}
                    alt={item.alt}
                    sizes="(min-width: 1024px) 66vw, (min-width: 640px) 50vw, 100vw"
                    className="absolute inset-0"
                    imgClassName="transition-transform duration-[1800ms] ease-out-expo group-hover:scale-[1.06]"
                  />
                  <span aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgb(7_12_24/0.82),transparent_52%)] opacity-70 transition-opacity duration-700 group-hover:opacity-100" />
                  <span className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3 text-frost">
                    <span>
                      <span className="block font-mono text-[0.625rem] uppercase tracking-[0.2em] text-frost/60">
                        {String(index + 1).padStart(2, "0")} · {item.place}
                      </span>
                      <span className="mt-1.5 block font-display text-lg font-semibold tracking-[-0.02em] md:text-xl">{item.title}</span>
                    </span>
                    <span aria-hidden className="grid size-10 shrink-0 translate-y-2 place-items-center rounded-full border border-white/25 bg-white/10 opacity-0 backdrop-blur transition-[opacity,translate] duration-500 ease-out-expo group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
                      <Icon name="expand" size={16} />
                    </span>
                  </span>
                </button>
              </motion.li>
            ))}
            {filter === "todos" && (
              <motion.li
                key="chamada"
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex min-h-[15rem] flex-col justify-between overflow-hidden rounded-[1.75rem] border border-line-strong bg-[linear-gradient(150deg,var(--surface-2),var(--surface))] p-6 sm:col-span-2 lg:col-span-4 lg:row-span-2 lg:min-h-0"
              >
                <span aria-hidden className="isotherms pointer-events-none absolute inset-0 opacity-70" />
                <p className="eyebrow relative text-accent">Próximo projeto</p>
                <div className="relative">
                  <p className="font-display text-2xl font-semibold leading-tight tracking-[-0.03em]">O seu ambiente pode ser o próximo.</p>
                  <button
                    type="button"
                    onClick={() => requestQuote()}
                    className="group/c mt-4 inline-flex items-center gap-2 text-sm font-medium text-fg"
                  >
                    <span className="link-line pb-0.5">Solicitar orçamento</span>
                    <span className="grid size-8 place-items-center rounded-full border border-line-strong transition-[background-color,border-color,color,rotate] duration-500 ease-out-expo group-hover/c:rotate-45 group-hover/c:border-accent group-hover/c:bg-accent group-hover/c:text-on-accent">
                      <Icon name="arrowUpRight" size={15} />
                    </span>
                  </button>
                </div>
              </motion.li>
            )}
          </AnimatePresence>
        </ul>

        <Reveal className="mt-8 flex items-start gap-3 text-sm text-muted">
          <span aria-hidden className="mt-2 inline-block size-1.5 shrink-0 rounded-full bg-accent" />
          {galleryNote}
        </Reveal>
      </div>

      {hydrated && <Lightbox items={items} index={open} onClose={() => setOpen(null)} onChange={setOpen} />}
    </section>
  );
}
