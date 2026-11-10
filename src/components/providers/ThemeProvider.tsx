"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";

export type Theme = "dark" | "light";
const STORAGE_KEY = "dcryo-theme";

type ThemeContextValue = {
  theme: Theme;
  /** Alterna o tema. `origin` (px) define de onde parte a transição circular. */
  toggle: (origin?: { x: number; y: number }) => void;
};

const ThemeContext = createContext<ThemeContextValue>({ theme: "dark", toggle: () => {} });

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

const getSnapshot = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");
const getServerSnapshot = (): Theme => "dark";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback((origin?: { x: number; y: number }) => {
    const root = document.documentElement;
    const next: Theme = getSnapshot() === "dark" ? "light" : "dark";
    const apply = () => {
      root.dataset.theme = next;
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* armazenamento indisponível: o tema vale só para esta visita */
      }
    };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce && typeof document.startViewTransition === "function") {
      root.style.setProperty("--vt-x", `${origin?.x ?? window.innerWidth - 80}px`);
      root.style.setProperty("--vt-y", `${origin?.y ?? 40}px`);
      document.startViewTransition(apply);
    } else {
      apply();
    }
  }, []);

  const value = useMemo(() => ({ theme, toggle }), [theme, toggle]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);

/** Script inline: aplica o tema salvo antes da primeira pintura e decide se mostra a abertura. */
export const themeInitScript = `(function(){try{var d=document.documentElement;var t=localStorage.getItem("${STORAGE_KEY}");if(t==="light"||t==="dark"){d.setAttribute("data-theme",t)}if(sessionStorage.getItem("dcryo-intro")){d.classList.add("no-intro")}else{sessionStorage.setItem("dcryo-intro","1")}}catch(e){}})()`;
