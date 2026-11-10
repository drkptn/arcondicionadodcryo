import { LogoWordmark, SYMBOL_D, SYMBOL_WAVES } from "@/components/brand/Logo";

/**
 * Abertura curta (≈1,4 s): o símbolo é desenhado por linhas de fluxo de ar.
 * É toda em CSS — não bloqueia o conteúdo e some sozinha mesmo sem JavaScript.
 * Em visitas repetidas na mesma sessão ela é pulada (classe .no-intro no <html>).
 */
export function Preloader() {
  return (
    <div className="preloader" aria-hidden>
      <div className="flex flex-col items-center gap-7">
        <svg
          className="preloader-symbol"
          width="76"
          height="76"
          viewBox="0 0 48 48"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={SYMBOL_D} pathLength={1} />
          {SYMBOL_WAVES.map((d) => (
            <path key={d} d={d} pathLength={1} stroke="#a9c8e0" />
          ))}
        </svg>
        <div className="preloader-fade">
          <LogoWordmark height={15} tone="white" />
        </div>
        <div className="h-px w-36 overflow-hidden bg-white/12">
          <div className="preloader-bar h-full bg-[linear-gradient(90deg,#35577d,#a9c8e0)]" />
        </div>
      </div>
    </div>
  );
}
