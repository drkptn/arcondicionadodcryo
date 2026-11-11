import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Reveal, Words } from "./Reveal";

type SectionHeadingProps = {
  index: string;
  eyebrow: string;
  title: string;
  /** Índice da palavra a partir da qual o título recebe o gradiente gelo. */
  accentFrom?: number;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
  id?: string;
};

/** Cabeçalho padrão de seção: índice técnico + título + texto de apoio. */
export function SectionHeading({ index, eyebrow, title, accentFrom, description, align = "left", className, id }: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-col gap-6", align === "center" && "items-center text-center", className)}>
      <Reveal className="flex items-center gap-3">
        <span className="eyebrow text-accent">{index}</span>
        <span aria-hidden className="h-px w-8 bg-line-strong" />
        <span className="eyebrow">{eyebrow}</span>
      </Reveal>
      <h2 id={id} className="display-lg max-w-[18ch]">
        <Words text={title} accentFrom={accentFrom} accentClassName="text-ice-gradient" />
      </h2>
      {description && (
        <Reveal delay={0.15} className={cn("max-w-xl text-base leading-relaxed text-muted md:text-lg", align === "center" && "mx-auto")}>
          {description}
        </Reveal>
      )}
    </div>
  );
}
