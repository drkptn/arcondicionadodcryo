"use client";

import Lenis from "lenis";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";

type ScrollContextValue = {
  scrollTo: (target: string | HTMLElement | number, options?: { offset?: number; immediate?: boolean }) => void;
  /** Trava/destrava a rolagem (menus e modais). */
  lock: (locked: boolean) => void;
};

const ScrollContext = createContext<ScrollContextValue>({ scrollTo: () => {}, lock: () => {} });

const HEADER_OFFSET = -76;

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
    if (lenis) {
      lenis.scrollTo(target, { offset, immediate: options?.immediate, force: true });
      return;
    }
    const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
    if (typeof el === "number") window.scrollTo({ top: el });
    else if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset });
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
