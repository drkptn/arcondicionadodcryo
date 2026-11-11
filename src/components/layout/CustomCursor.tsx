"use client";

import { useEffect, useRef } from "react";
import { useFinePointer, usePrefersReducedMotion } from "@/lib/hooks";

type Particle = { x: number; y: number; vx: number; vy: number; life: number; size: number };

/**
 * Cursor da DCRYO (somente desktop com mouse):
 *  - ponto luminoso que segue o ponteiro + anel com atraso suave
 *  - o anel cresce sobre elementos interativos e mostra rótulos (data-cursor="Ver")
 *  - microcristais de gelo se desprendem em movimentos rápidos
 * Em telas de toque nada disso é montado.
 */
export function CustomCursor() {
  const fine = useFinePointer();
  const reduce = usePrefersReducedMotion();
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!fine || reduce) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { ...pos };
    const last = { ...pos };
    let visible = false;
    let hover = false;
    let text = "";
    let pressed = false;
    let raf = 0;
    const particles: Particle[] = [];

    const ctx = canvas.current?.getContext("2d") ?? null;
    const resize = () => {
      if (!canvas.current) return;
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.current.width = window.innerWidth * dpr;
      canvas.current.height = window.innerHeight * dpr;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pos.x = event.clientX;
      pos.y = event.clientY;
      if (!visible) {
        visible = true;
        ringPos.x = pos.x;
        ringPos.y = pos.y;
      }
      const target = event.target as Element | null;
      const interactive = target?.closest?.("a, button, [role='button'], [role='switch'], [data-cursor], summary, label, select");
      hover = Boolean(interactive);
      text = interactive?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor ?? "";

      const speed = Math.hypot(pos.x - last.x, pos.y - last.y);
      if (speed > 14 && particles.length < 26) {
        particles.push({
          x: pos.x,
          y: pos.y,
          vx: (Math.random() - 0.5) * 0.6,
          vy: Math.random() * 0.5 + 0.15,
          life: 1,
          size: Math.random() * 1.6 + 0.6,
        });
      }
      last.x = pos.x;
      last.y = pos.y;
    };
    const onLeave = () => {
      visible = false;
    };
    const onDown = () => {
      pressed = true;
    };
    const onUp = () => {
      pressed = false;
    };

    const tick = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.16;
      ringPos.y += (pos.y - ringPos.y) * 0.16;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) scale(${hover ? 0 : pressed ? 0.6 : 1})`;
        dot.current.style.opacity = visible ? "1" : "0";
      }
      if (ring.current) {
        const scale = text ? 2.3 : hover ? 1.55 : pressed ? 0.8 : 1;
        ring.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%) scale(${scale})`;
        ring.current.style.opacity = visible ? "1" : "0";
        ring.current.dataset.state = text ? "label" : hover ? "hover" : "idle";
      }
      if (label.current && label.current.textContent !== text) label.current.textContent = text;

      if (ctx && canvas.current) {
        if (particles.length || canvas.current.dataset.dirty === "1") {
          ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
          canvas.current.dataset.dirty = particles.length ? "1" : "0";
        }
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 0.022;
          if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
          }
          ctx.globalAlpha = p.life * 0.7;
          ctx.fillStyle = root.dataset.theme === "light" ? "#1a3f75" : "#cfe3f3";
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("resize", resize);
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("resize", resize);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [fine, reduce]);

  if (!fine || reduce) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[400]">
      <canvas ref={canvas} className="absolute inset-0 size-full" />
      <div
        ref={ring}
        data-state="idle"
        className="group/ring absolute left-0 top-0 grid size-10 place-items-center rounded-full border border-accent/55 opacity-0 transition-[opacity,background-color,border-color,scale] duration-300 will-change-transform data-[state=hover]:border-accent data-[state=hover]:bg-accent/10 data-[state=label]:border-transparent data-[state=label]:bg-frost data-[state=label]:shadow-[0_10px_30px_-10px_rgb(0_0_30/0.6)]"
        style={{ transition: "opacity .3s, background-color .35s, border-color .35s, transform .18s cubic-bezier(.16,1,.3,1)" }}
      >
        <span
          ref={label}
          className="scale-[0.44] whitespace-nowrap font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-navy"
        />
      </div>
      <div
        ref={dot}
        className="absolute left-0 top-0 size-2 rounded-full bg-accent opacity-0 shadow-[0_0_14px_3px_var(--glow)] will-change-transform"
        style={{ transition: "opacity .3s, transform .12s cubic-bezier(.16,1,.3,1)" }}
      />
    </div>
  );
}
