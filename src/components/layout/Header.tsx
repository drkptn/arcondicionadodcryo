"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { useQuote } from "@/components/providers/QuoteProvider";
import { useScroller } from "@/components/providers/SmoothScroll";
import { Button } from "@/components/ui/Button";
import { basePath, navigation } from "@/config/site";
import { cn } from "@/lib/cn";
import { whatsappUrl } from "@/lib/whatsapp";
import { ThemeToggle } from "./ThemeToggle";

/** Destaca no menu a seção que está na tela. */
function useActiveSection() {
  const [active, setActive] = useState<string>("");
  useEffect(() => {
    const sections = navigation
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => io.observe(section));
    return () => io.disconnect();
  }, []);
  return active;
}

export function Header({ home = true }: { home?: boolean }) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection();
  const { lock, scrollTo } = useScroller();
  const { requestQuote } = useQuote();
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useMotionValueEvent(scrollY, "change", (value) => setScrolled(value > 24));

  useEffect(() => {
    lock(open);
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (event.key === "Tab" && menuRef.current) {
        const focusable = [
          toggleRef.current,
          ...menuRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
        ].filter((el): el is HTMLElement => Boolean(el));
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
  }, [open, lock]);

  // Fecha o menu ao passar para o layout de desktop
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mql.matches && setOpen(false);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const href = (id: string) => (home ? `#${id}` : `${basePath}/#${id}`);

  const go = (id: string) => {
    setOpen(false);
    if (home) window.setTimeout(() => scrollTo(`#${id}`), 60);
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[90] transition-[padding] duration-700 ease-out-expo",
          scrolled ? "py-2.5" : "py-4 md:py-5",
        )}
      >
        <div className="container-x">
          <div
            className={cn(
              "relative flex items-center justify-between gap-4 rounded-full border px-3 py-2 pl-5 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-700 ease-out-expo",
              scrolled || open
                ? "border-(--glass-line) bg-(--glass) shadow-[0_18px_50px_-28px_rgb(0_0_20/0.7)] backdrop-blur-xl backdrop-saturate-150"
                : "border-transparent bg-transparent",
            )}
          >
            <a
              href={home ? "#topo" : `${basePath}/`}
              aria-label="DCRYO — início"
              className="relative z-10 flex items-center rounded-full text-fg"
              onClick={() => setOpen(false)}
            >
              <Logo size={32} />
            </a>

            <nav aria-label="Navegação principal" className="hidden lg:block">
              <ul className="flex items-center gap-1">
                {navigation.slice(0, 6).map((item) => (
                  <li key={item.id}>
                    <a
                      href={href(item.id)}
                      aria-current={active === item.id ? "true" : undefined}
                      className={cn(
                        "relative rounded-full px-3.5 py-2 text-[0.8125rem] font-medium tracking-[-0.005em] transition-colors duration-300",
                        active === item.id ? "text-fg" : "text-muted hover:text-fg",
                      )}
                    >
                      {active === item.id && (
                        <motion.span
                          layoutId="nav-pill"
                          aria-hidden
                          className="absolute inset-0 rounded-full border border-line-strong bg-accent/8"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                      <span className="relative">{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="relative z-10 flex items-center gap-2">
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>
              <div className="hidden sm:block">
                <Button
                  size="sm"
                  trailingIcon="arrowUpRight"
                  href={href("contato")}
                  onClick={(event) => {
                    if (!home) return;
                    event.preventDefault();
                    requestQuote();
                  }}
                >
                  Solicitar orçamento
                </Button>
              </div>
              <button
                ref={toggleRef}
                type="button"
                aria-expanded={open}
                aria-controls="menu-mobile"
                aria-label={open ? "Fechar menu" : "Abrir menu"}
                onClick={() => setOpen((value) => !value)}
                className="relative grid size-11 place-items-center rounded-full border border-line-strong text-fg lg:hidden"
              >
                <span aria-hidden className="relative block h-3 w-5">
                  <span
                    className={cn(
                      "absolute left-0 top-0 h-[1.5px] w-full rounded bg-current transition-transform duration-500 ease-out-expo",
                      open && "translate-y-[5.25px] rotate-45",
                    )}
                  />
                  <span
                    className={cn(
                      "absolute bottom-0 left-0 h-[1.5px] w-full rounded bg-current transition-transform duration-500 ease-out-expo",
                      open ? "-translate-y-[5.25px] -rotate-45" : "origin-right scale-x-[0.6]",
                    )}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-mobile"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            data-lenis-prevent
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.75, ease: [0.65, 0, 0.35, 1] }}
            className="fixed inset-0 z-[80] flex flex-col overflow-y-auto bg-bg lg:hidden"
          >
            <div aria-hidden className="isotherms pointer-events-none absolute inset-0 opacity-60" />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-40 top-1/4 size-[28rem] rounded-full bg-ocean/40 blur-[110px]"
            />
            <nav aria-label="Navegação móvel" className="container-x relative mt-28 flex-1">
              <ul className="flex flex-col">
                {navigation.map((item, index) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.18 + index * 0.055 }}
                    className="border-b border-line"
                  >
                    <a
                      href={href(item.id)}
                      onClick={() => go(item.id)}
                      className="group flex items-baseline justify-between py-4"
                    >
                      <span className="font-display text-[clamp(1.75rem,7.5vw,2.5rem)] font-semibold tracking-[-0.035em]">
                        {item.label}
                      </span>
                      <span className="eyebrow">{String(index + 1).padStart(2, "0")}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, delay: 0.55 }}
              className="container-x relative flex flex-col gap-4 pb-8 pt-8"
            >
              <Button href={whatsappUrl()} external variant="whatsapp" size="lg" icon="whatsapp" className="w-full" magnetic={false}>
                Falar pelo WhatsApp
              </Button>
              <div className="flex items-center justify-between">
                <span className="eyebrow">Tema</span>
                <ThemeToggle />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
