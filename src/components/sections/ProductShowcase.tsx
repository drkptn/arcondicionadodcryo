"use client";

import { AnimatePresence, motion } from "motion/react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { Icon } from "@/components/icons";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Picture } from "@/components/ui/Picture";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { features, type FeatureView } from "@/config/content";
import { cn } from "@/lib/cn";
import { supportsWebGL, useMediaQuery, useOnScreen, usePrefersReducedMotion } from "@/lib/hooks";
import type { DragState } from "@/components/three/ProductScene";

const ProductScene = dynamic(() => import("@/components/three/ProductScene"), { ssr: false });

const EASE = [0.16, 1, 0.3, 1] as const;

/** 03 — Tecnologia: apresentação do aparelho como produto premium, em 3D. */
export function ProductShowcase() {
  const stage = useRef<HTMLDivElement>(null);
  const visible = useOnScreen(stage, "200px");
  const { theme } = useTheme();
  const reduce = usePrefersReducedMotion();
  const small = useMediaQuery("(max-width: 767px)");
  const [view, setView] = useState<FeatureView>("design");
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [mounted, setMounted] = useState(false);
  const [touched, setTouched] = useState(false);
  const drag = useRef<DragState>({ yaw: 0, pitch: 0, dragging: false });
  const last = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const id = requestAnimationFrame(() => setWebgl(supportsWebGL()));
    return () => cancelAnimationFrame(id);
  }, []);
  // monta o canvas só quando a seção se aproxima (economiza GPU no carregamento)
  useEffect(() => {
    if (visible) setMounted(true);
  }, [visible]);

  const use3D = webgl === true && !reduce;
  const active = features.find((feature) => feature.id === view)!;

  const select = (id: FeatureView) => {
    drag.current.yaw = 0;
    drag.current.pitch = 0;
    setView(id);
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!use3D) return;
    drag.current.dragging = true;
    last.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
    setTouched(true);
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current.dragging) return;
    const dx = event.clientX - last.current.x;
    const dy = event.clientY - last.current.y;
    last.current = { x: event.clientX, y: event.clientY };
    drag.current.yaw = Math.max(-2.4, Math.min(2.4, drag.current.yaw + dx * 0.008));
    if (event.pointerType === "mouse") drag.current.pitch = Math.max(-0.7, Math.min(0.7, drag.current.pitch + dy * 0.005));
  };
  const onPointerUp = () => {
    drag.current.dragging = false;
  };
  const nudge = (direction: number) => {
    drag.current.yaw = Math.max(-2.4, Math.min(2.4, drag.current.yaw + direction * 0.5));
    setTouched(true);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") nudge(-1);
    if (event.key === "ArrowRight") nudge(1);
  };

  return (
    <section id="tecnologia" aria-labelledby="tecnologia-titulo" className="relative scroll-mt-20 overflow-hidden py-24 md:py-36">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_70%_45%,color-mix(in_srgb,var(--hero-c)_26%,transparent),transparent_70%)]" />
      <div className="container-x relative">
        <SectionHeading
          id="tecnologia-titulo"
          index="03"
          eyebrow="Tecnologia"
          title="Tecnologia que transforma o ambiente."
          accentFrom={2}
          description="Gire o aparelho e explore o que faz diferença no dia a dia. Nós ajudamos a traduzir a ficha técnica em conforto real."
        />

        <div className="mt-14 grid gap-6 md:mt-20 lg:grid-cols-12 lg:gap-8">
          {/* ---------- Palco 3D ---------- */}
          <Reveal blur className="lg:order-2 lg:col-span-8">
            <div
              ref={stage}
              role="group"
              aria-label="Visualização 3D do aparelho. Use as setas esquerda e direita para girar."
              tabIndex={0}
              data-cursor={use3D ? "Girar" : undefined}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onKeyDown={onKeyDown}
              className="grain relative aspect-[4/5] touch-pan-y select-none overflow-hidden rounded-[2rem] border border-line-strong bg-[linear-gradient(160deg,var(--surface-2),var(--bg)_70%)] shadow-(--shadow) sm:aspect-[16/12] lg:aspect-auto lg:h-full lg:min-h-[36rem]"
            >
              <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_42%,color-mix(in_srgb,var(--accent)_22%,transparent),transparent_70%)]" />
              <div aria-hidden className="isotherms pointer-events-none absolute inset-0 opacity-70 [mask-image:linear-gradient(to_top,#000,transparent_60%)]" />

              <div className="absolute inset-0">
                {use3D && mounted ? (
                  <ProductScene view={view} light={theme === "light"} active={visible} lite={small} drag={drag} temperature={22} />
                ) : (
                  webgl !== null &&
                  !use3D && (
                    <div className="grid size-full place-items-center p-8">
                      <Picture
                        name={view === "ar" ? "product_open" : view === "eficiencia" ? "product_front" : "product_hero"}
                        alt="Render ilustrativo de um ar-condicionado split"
                        sizes="(min-width: 1024px) 60vw, 92vw"
                        imgClassName="object-contain"
                      />
                    </div>
                  )
                )}
              </div>

              {/* legendas técnicas */}
              <div className="pointer-events-none absolute inset-x-5 top-5 flex items-start justify-between md:inset-x-7 md:top-7">
                <div>
                  <p className="eyebrow">Split Hi-Wall</p>
                  <p className="mt-2 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-muted/80">Modelo 3D ilustrativo</p>
                </div>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={active.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="glass rounded-full px-3.5 py-2 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-fg-soft"
                  >
                    {active.label}
                  </motion.p>
                </AnimatePresence>
              </div>

              <div className="absolute inset-x-5 bottom-5 flex items-end justify-between md:inset-x-7 md:bottom-7">
                <p
                  className={cn(
                    "pointer-events-none flex items-center gap-2.5 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-muted transition-opacity duration-700",
                    (touched || !use3D) && "opacity-0",
                  )}
                >
                  <Icon name="rotate" size={16} className="animate-[spin_9s_linear_infinite]" />
                  Arraste para girar
                </p>
                {use3D && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      aria-label="Girar para a esquerda"
                      onClick={() => nudge(-1)}
                      onPointerDown={(event) => event.stopPropagation()}
                      className="glass grid size-11 place-items-center rounded-full text-fg transition-[border-color,scale] duration-300 hover:border-accent active:scale-90"
                    >
                      <Icon name="chevronLeft" size={18} />
                    </button>
                    <button
                      type="button"
                      aria-label="Girar para a direita"
                      onClick={() => nudge(1)}
                      onPointerDown={(event) => event.stopPropagation()}
                      className="glass grid size-11 place-items-center rounded-full text-fg transition-[border-color,scale] duration-300 hover:border-accent active:scale-90"
                    >
                      <Icon name="chevronRight" size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Reveal>

          {/* ---------- Recursos ---------- */}
          <div className="lg:order-1 lg:col-span-4">
            <ul className="flex flex-col">
              {features.map((feature, index) => {
                const selected = feature.id === view;
                return (
                  <Reveal as="li" key={feature.id} delay={index * 0.05} className="border-b border-line first:border-t">
                    <button
                      type="button"
                      aria-expanded={selected}
                      aria-controls={`recurso-${feature.id}`}
                      onClick={() => select(feature.id)}
                      className="group flex w-full items-center gap-4 py-4 text-left"
                    >
                      <span
                        className={cn(
                          "grid size-10 shrink-0 place-items-center rounded-xl border transition-[background-color,border-color,color] duration-500",
                          selected ? "border-accent bg-accent text-on-accent" : "border-line-strong text-muted group-hover:border-accent group-hover:text-fg",
                        )}
                      >
                        <Icon name={feature.icon} size={20} />
                      </span>
                      <span
                        className={cn(
                          "flex-1 font-display text-lg font-semibold tracking-[-0.02em] transition-colors duration-300",
                          selected ? "text-fg" : "text-muted group-hover:text-fg",
                        )}
                      >
                        {feature.label}
                      </span>
                      <span className="font-mono text-[0.6875rem] tracking-[0.2em] text-muted">{String(index + 1).padStart(2, "0")}</span>
                    </button>
                    <AnimatePresence initial={false}>
                      {selected && (
                        <motion.div
                          id={`recurso-${feature.id}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.55, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <div className="pb-6 pl-14 pr-2">
                            <p className="font-display text-base font-semibold tracking-[-0.015em] text-accent">{feature.title}</p>
                            <p className="mt-2 text-sm leading-relaxed text-muted">{feature.text}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Reveal>
                );
              })}
            </ul>
            <Reveal className="mt-6 text-xs leading-relaxed text-muted/80">
              Recursos e desempenho variam conforme marca e modelo. Indicamos o equipamento adequado na avaliação técnica.
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
