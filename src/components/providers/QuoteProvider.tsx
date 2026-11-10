"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { useScroller } from "./SmoothScroll";

type QuoteContextValue = {
  /** Serviço pré-selecionado no formulário de contato (valor de `service.short`). */
  service: string;
  setService: (service: string) => void;
  /** Seleciona o serviço e leva o visitante até o formulário. */
  requestQuote: (service?: string) => void;
};

const QuoteContext = createContext<QuoteContextValue>({ service: "", setService: () => {}, requestQuote: () => {} });

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [service, setService] = useState("");
  const { scrollTo } = useScroller();

  const requestQuote = useCallback(
    (next?: string) => {
      if (next) setService(next);
      scrollTo("#contato");
      window.setTimeout(() => document.getElementById("contato-nome")?.focus({ preventScroll: true }), 900);
    },
    [scrollTo],
  );

  const value = useMemo(() => ({ service, setService, requestQuote }), [service, requestQuote]);
  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
}

export const useQuote = () => useContext(QuoteContext);
