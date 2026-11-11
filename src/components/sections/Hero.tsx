"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { useQuote } from "@/components/providers/QuoteProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Button } from "@/components/ui/Button";
import { Condensation } from "@/components/ui/Condensation";
import { Picture } from "@/components/ui/Picture";
import { Words } from "@/components/ui/Reveal";
import { site } from "@/config/site";
import { cn } from "@/lib/cn";
import { introDelay, supportsWebGL, useMediaQuery, useOnScreen, usePointerRef, usePrefersReducedMotion } from "@/lib/hooks";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), { ssr: false });

const MIN = 17;
const MAX = 26;
const EASE = [0.16, 1, 0.3, 1] as const;

const mode = (t: number) => (t <= 19 ? "Frio intenso" : t <= 22 ? "Conforto" : t <= 24 ? "Brisa suave" : "Econômico");

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const visible = useOnScreen(ref, "120px");
  const pointer = usePointerRef();
  const { theme } = useTheme();
  const { requestQuote } = useQuote();
  const reduce = usePrefersReducedMotion();
  const small = useMediaQuery("(max-width: 767px)");
  const [temperature, setTemperature] = useState(22);
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);
  const [delay] = useState(introDelay);

  useEffect(() => {
    const id = requestAnimationFrame(() => setWebgl(supportsWebGL()));
    return () => cancelAnimationFrame(id);
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const numeralY = useTransform(scrollYProgress, [0, 1], [0, 160]);

  const use3D = webgl === true && !reduce;
  const usePoster = webgl === false || (webgl === true && reduce);
  const cold = (MAX - temperature) / (MAX - MIN);

  return (
    <section id="topo" ref={ref} aria-labelledby="hero-titulo" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      {/* ---------- Atmosfera: oceano profundo à noite ---------- */}
      <div aria-hidden className="grain absolute inset-0 -z-20">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--hero-a)_0%,var(--bg)_78%)]" />
        <div
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            background:
              "radial-gradient(60% 55% at 72% 38%, color-mix(in srgb, var(--hero-c) 62%, transparent) 0%, transparent 70%), radial-gradient(45% 40% at 12% 85%, color-mix(in srgb, var(--hero-b) 80%, transparent) 0%, transparent 72%)",
            opacity: 0.55 + cold * 0.45,
          }}
        />
        {/* textura de água: ruído orgânico esticado, à deriva */}
        <div className="absolute inset-x-0 bottom-0 h-[62%] overflow-hidden opacity-70 [mask-image:linear-gradient(to_top,#000_10%,transparent_95%)]">
          <div className="water absolute inset-y-0 left-0 w-[200%] animate-drift" />
        </div>
        <div className="isotherms absolute inset-0 opacity-50 [mask-image:radial-gradient(70%_60%_at_70%_45%,#000,transparent)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(to_top,var(--bg),transparent)]" />
      </div>

      {/* ---------- Numeral gigante de temperatura (atrás do aparelho) ---------- */}
      <motion.div
        aria-hidden
        style={{ y: numeralY }}
        className="pointer-events-none absolute right-[5vw] top-[11svh] -z-10 hidden select-none font-display text-[clamp(9rem,17vw,17rem)] font-semibold leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_var(--line-strong)] lg:block"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={temperature}
            initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -30, filter: "blur(12px)" }}
            transition={{ duration: 0.6, ease: EASE }}
            className="inline-block tabular-nums"
          >
            {temperature}°
          </motion.span>
        </AnimatePresence>
      </motion.div>

      {/* ---------- Aparelho 3D ---------- */}
      <div
        aria-hidden
        className={cn("absolute inset-0 -z-[5] transition-opacity duration-[1800ms] ease-out", ready ? "opacity-100" : "opacity-0")}
      >
        {use3D && (
          <HeroScene
            temperature={temperature}
            light={theme === "light"}
            active={visible}
            lite={small}
            pointer={pointer}
            onReady={() => setReady(true)}
          />
        )}
      </div>
      {usePoster && (
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[14%] -z-[5] mx-auto w-[min(92vw,46rem)] md:left-auto md:right-[2vw] md:top-[20%] md:mx-0 md:w-[52vw]">
          <Picture name="product_hero" alt="" sizes="(min-width: 768px) 52vw, 92vw" priority imgClassName="object-contain drop-shadow-[0_40px_60px_rgb(0_0_30/0.45)]" />
        </div>
      )}

      {/* ---------- Conteúdo ---------- */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="container-x relative z-10 flex flex-1 flex-col justify-end pb-6 pt-[47svh] md:justify-center md:pb-16 md:pt-28"
      >
        <div className="max-w-[46rem]">
          <motion.p
            data-reveal
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay }}
            className="eyebrow mb-6 flex items-center gap-3 md:mb-8"
          >
            <span aria-hidden className="inline-block size-1.5 animate-pulse-soft rounded-full bg-accent shadow-[0_0_12px_2px_var(--glow)]" />
            {site.tagline}
          </motion.p>

          <h1 id="hero-titulo" className="display-xl">
            <span className="block">
              <Words text="Seu ambiente." immediate delay={delay + 0.1} />
            </span>
            <span className="block">
              <Words text="Na temperatura" immediate delay={delay + 0.26} />
            </span>
            <span className="block">
              <Words text="perfeita." immediate delay={delay + 0.4} accentFrom={0} accentClassName="text-ice-gradient" />
            </span>
          </h1>

          <motion.p
            data-reveal
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: delay + 0.6 }}
            className="mt-6 max-w-md text-base leading-relaxed text-fg-soft md:mt-8 md:text-lg"
          >
            {site.shortDescription}
          </motion.p>

          <motion.div
            data-reveal
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: delay + 0.75 }}
            className="mt-8 flex flex-wrap items-center gap-3 md:mt-10"
          >
            <Button
              size="lg"
              href="#contato"
              trailingIcon="arrowUpRight"
              onClick={(event) => {
                event.preventDefault();
                requestQuote();
              }}
            >
              Solicitar orçamento
            </Button>
            <Button size="lg" variant="secondary" href="#servicos" trailingIcon="arrowDown">
              Conhecer serviços
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* ---------- Barra inferior: rolagem + termostato ---------- */}
      <motion.div
        data-reveal
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: delay + 1 }}
        className="container-x relative z-10 flex items-end justify-between gap-6 pb-7 pt-8 md:absolute md:inset-x-0 md:bottom-0 md:pb-9 md:pt-0"
      >
        <a href="#sobre" className="group hidden items-center gap-4 md:flex">
          <span aria-hidden className="relative h-14 w-px overflow-hidden bg-line-strong">
            <span className="absolute left-0 top-0 h-5 w-full animate-[scroll-hint_2.4s_cubic-bezier(.65,0,.35,1)_infinite] bg-accent" />
          </span>
          <span className="eyebrow transition-colors group-hover:text-fg">Role para explorar</span>
        </a>

        <div className="glass relative w-full max-w-[19rem] rounded-[1.75rem] p-4 shadow-(--shadow) md:ml-auto">
          <Condensation count={16} seed={11} />
          <div className="relative flex items-center justify-between">
            <span className="eyebrow">Temperatura</span>
            <span className="eyebrow text-accent">{mode(temperature)}</span>
          </div>
          <div className="relative mt-3 flex items-center justify-between">
            <button
              type="button"
              aria-label="Diminuir temperatura"
              disabled={temperature <= MIN}
              onClick={() => setTemperature((t) => Math.max(MIN, t - 1))}
              className="grid size-11 place-items-center rounded-full border border-line-strong text-fg transition-[background-color,border-color,opacity,scale] duration-300 hover:border-accent hover:bg-accent/10 active:scale-90 disabled:opacity-35"
            >
              <Icon name="minus" size={18} />
            </button>
            <output aria-live="polite" aria-label={`Temperatura: ${temperature} graus Celsius`} className="relative block h-12 overflow-hidden font-display text-5xl font-semibold leading-[3rem] tracking-[-0.05em] tabular-nums">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={temperature}
                  initial={{ y: 26, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -26, opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="block"
                >
                  {temperature}
                  <span className="align-top text-2xl text-muted">°C</span>
                </motion.span>
              </AnimatePresence>
            </output>
            <button
              type="button"
              aria-label="Aumentar temperatura"
              disabled={temperature >= MAX}
              onClick={() => setTemperature((t) => Math.min(MAX, t + 1))}
              className="grid size-11 place-items-center rounded-full border border-line-strong text-fg transition-[background-color,border-color,opacity,scale] duration-300 hover:border-accent hover:bg-accent/10 active:scale-90 disabled:opacity-35"
            >
              <Icon name="plus" size={18} />
            </button>
          </div>
          <div aria-hidden className="relative mt-4 flex items-end justify-between gap-[3px]">
            {Array.from({ length: MAX - MIN + 1 }, (_, i) => MIN + i).map((t) => (
              <span
                key={t}
                className={cn(
                  "w-full rounded-full transition-[height,background-color] duration-500 ease-out-expo",
                  t === temperature ? "h-3.5 bg-accent" : t < temperature ? "h-1.5 bg-accent/45" : "h-1.5 bg-line-strong",
                )}
              />
            ))}
          </div>
          <p className="relative mt-3 text-[0.75rem] leading-snug text-muted">
            Ajuste e veja o ar responder. <span className="text-fg-soft">Modelo 3D ilustrativo.</span>
          </p>
        </div>
      </motion.div>
    </section>
  );
}
