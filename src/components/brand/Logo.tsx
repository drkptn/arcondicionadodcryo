import { useId } from "react";
import { cn } from "@/lib/cn";

/**
 * IDENTIDADE DCRYO
 * Símbolo: um "D" atravessado por duas correntes de ar — as faixas remetem às
 * aletas do aparelho, ao fluxo de ar frio e a ondas. Desenho próprio, sem ícones prontos.
 * Wordmark: letras geométricas monolineares desenhadas em SVG (não dependem de fonte).
 */

export type LogoTone = "current" | "gradient" | "white" | "navy" | "ocean";

const SOLID: Record<Exclude<LogoTone, "gradient" | "current">, string> = {
  white: "#EAF3FA",
  navy: "#141E30",
  ocean: "#1A3F75",
};

export const SYMBOL_D = "M13 6H23A18 18 0 0 1 23 42H13A2 2 0 0 1 11 40V8A2 2 0 0 1 13 6Z";
export const SYMBOL_WAVES = [
  "M5 19.6C13 14.4 20 14.6 26.5 18.6S38.5 22.8 46 17.2",
  "M5 31.6C13 26.4 20 26.6 26.5 30.6S38.5 34.8 46 29.2",
];

type SymbolProps = {
  size?: number;
  tone?: LogoTone;
  className?: string;
  title?: string;
};

export function LogoSymbol({ size = 32, tone = "current", className, title }: SymbolProps) {
  const id = useId().replace(/:/g, "");
  const fill = tone === "gradient" ? `url(#g${id})` : tone === "current" ? "currentColor" : SOLID[tone];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <mask id={`m${id}`} maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48">
          <path d={SYMBOL_D} fill="#fff" />
          {SYMBOL_WAVES.map((d) => (
            <path key={d} d={d} stroke="#000" strokeWidth="3.3" strokeLinecap="round" />
          ))}
        </mask>
        {tone === "gradient" && (
          <linearGradient id={`g${id}`} x1="12" y1="6" x2="34" y2="42" gradientUnits="userSpaceOnUse">
            <stop stopColor="#EAF3FA" />
            <stop offset="0.5" stopColor="#A9C8E0" />
            <stop offset="1" stopColor="#4F7DAE" />
          </linearGradient>
        )}
      </defs>
      <rect width="48" height="48" fill={fill} mask={`url(#m${id})`} />
    </svg>
  );
}

/** Traços centrais das letras D C R Y O (altura 20, espessura definida no stroke). */
export const WORDMARK_PATHS = [
  "M2.2 14H9A10 10 0 0 1 9 34H2.2Z",
  "M43.4 16.9A10 10 0 1 0 43.4 31.1",
  "M52.6 36.1V14H61A6.1 6.1 0 0 1 61 26.2H52.6M61.2 26.2L69.2 36.1",
  "M74.6 12.4L85.4 25.2L96.2 12.4M85.4 25.2V36.1",
  "M112.2 14A10 10 0 1 0 112.2 34A10 10 0 1 0 112.2 14Z",
];
export const WORDMARK_VIEWBOX = "0 8 124.4 32";

export function LogoWordmark({
  height = 18,
  tone = "current",
  className,
}: {
  height?: number;
  tone?: Exclude<LogoTone, "gradient">;
  className?: string;
}) {
  const stroke = tone === "current" ? "currentColor" : SOLID[tone];
  return (
    <svg
      height={height}
      viewBox={WORDMARK_VIEWBOX}
      fill="none"
      stroke={stroke}
      strokeWidth="4.4"
      strokeLinejoin="round"
      className={className}
      style={{ width: "auto" }}
      aria-hidden
    >
      {WORDMARK_PATHS.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

type LogoProps = {
  /** Altura total do conjunto, em px. */
  size?: number;
  symbolTone?: LogoTone;
  wordTone?: Exclude<LogoTone, "gradient">;
  className?: string;
  withWordmark?: boolean;
};

/** Versão horizontal: símbolo + nome. */
export function Logo({ size = 34, symbolTone = "gradient", wordTone = "current", className, withWordmark = true }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-[0.55em]", className)} style={{ fontSize: size * 0.5 }}>
      <LogoSymbol size={size} tone={symbolTone} />
      {withWordmark && <LogoWordmark height={size * 0.5} tone={wordTone} />}
      <span className="sr-only">DCRYO</span>
    </span>
  );
}
