"use client";

import Lenis from "lenis";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";

type ScrollContextValue = {
  scrollTo: (target: string | HTMLElement | number, options?: { offset?: number; immediate?: boolean }) => void;
  /** Trava/destrava a rolagem (menus e modais). */
  lock: (locked: boolean) => void;
};

const ScrollContext = createContext<ScrollContextValue>({ scrollTo: () => {}, lock: () => {} });

/** O Lenis já respeita `scroll-padding-top` do <html> (altura do cabeçalho fixo). */
const HEADER_OFFSET = 0;

export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.105,
      wheelMultiplier: 1,
      anchors: { offset: HEADER_OFFSET },
      stopInertiaOnNavigate: true,
    });
    lenisRef.current = lenis;
    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollTo = useCallback<ScrollContextValue["scrollTo"]>((target, options) => {
    const lenis = lenisRef.current;
    const offset = options?.offset ?? HEADER_OFFSET;
    // A posição final é calculada a partir da rolagem real da janela (e não do estado
    // interno do Lenis), para acertar o alvo mesmo logo após um salto nativo de rolagem.
    let top: number;
    if (typeof target === "number") {
      top = target;
    } else {
      const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
      if (!el) return;
      const padding = Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      top = el.getBoundingClientRect().top + window.scrollY - padding + offset;
    }
    top = Math.max(0, top);
    if (lenis) {
      lenis.scrollTo(top, {
        immediate: options?.immediate,
        force: true,
        duration: 1.5,
        easing: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
      });
    } else {
      window.scrollTo({ top });
    }
  }, []);

  const lock = useCallback((locked: boolean) => {
    const lenis = lenisRef.current;
    if (locked) lenis?.stop();
    else lenis?.start();
    document.documentElement.style.overflow = locked ? "hidden" : "";
  }, []);

  const value = useMemo(() => ({ scrollTo, lock }), [scrollTo, lock]);
  return <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>;
}

export const useScroller = () => useContext(ScrollContext);
