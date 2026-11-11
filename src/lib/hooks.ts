"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";

/** Media query reativa (false no servidor). */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (callback) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export const useFinePointer = () => useMediaQuery("(hover: hover) and (pointer: fine)");
export const usePrefersReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");

/** true depois da hidratação — para conteúdo que só existe no cliente. */
export function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

/** Observa se o elemento está na tela (para pausar canvas e animações fora de vista). */
export function useOnScreen<T extends Element>(ref: RefObject<T | null>, rootMargin = "0px", once = false) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        // `once`: depois da primeira vez na tela, permanece verdadeiro
        if (once && entry.isIntersecting) io.disconnect();
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, once]);
  return visible;
}

/** Posição do ponteiro normalizada (-1..1) em relação à janela, sem re-render. */
export function usePointerRef() {
  const pointer = useRef({ x: 0, y: 0, active: false });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
      pointer.current.active = true;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return pointer;
}

/** Atraso da animação de entrada: maior na primeira visita (há a abertura), curto nas demais. */
export function introDelay() {
  if (typeof document === "undefined") return 0;
  return document.documentElement.classList.contains("no-intro") ? 0.1 : 1.55;
}

/** Detecta suporte a WebGL uma única vez. */
export function supportsWebGL() {
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}
