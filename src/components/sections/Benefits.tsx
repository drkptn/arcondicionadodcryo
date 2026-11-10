import { Icon } from "@/components/icons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { benefits } from "@/config/content";

/** 06 — Diferenciais: lista editorial com título fixo ao lado. */
export function Benefits() {
  return (
    <section id="diferenciais" aria-labelledby="diferenciais-titulo" className="relative scroll-mt-20 py-24 md:py-36">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 hairline" />
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionHeading
              id="diferenciais-titulo"
              index="06"
              eyebrow="Diferenciais"
              title="Mais do que instalar. Entregar conforto."
              accentFrom={4}
              description="O resultado de uma boa instalação você sente todos os dias: no silêncio, na conta de luz e na temperatura sempre no ponto."
            />
            {/* indicador decorativo: faixa de conforto */}
            <Reveal delay={0.2} className="mt-12 hidden max-w-xs lg:block" >
              <div aria-hidden className="flex items-center justify-between font-mono text-[0.625rem] uppercase tracking-[0.18em] text-muted">
                <span>Frio</span>
                <span className="text-accent">Zona de conforto</span>
                <span>Quente</span>
              </div>
              <div aria-hidden className="relative mt-3 h-1.5 rounded-full bg-[linear-gradient(90deg,#1a3f75,#a9c8e0_45%,#eaf3fa_55%,#8494a8)] opacity-80">
                <span className="absolute left-[38%] top-1/2 h-4 w-[24%] -translate-y-1/2 rounded-full border border-accent" />
              </div>
            </Reveal>
          </div>
        </div>

        <ul className="lg:col-span-7">
          {benefits.map((benefit, index) => (
            <Reveal as="li" key={benefit.title} delay={index * 0.04} className="group relative border-b border-line first:border-t">
              <span aria-hidden className="absolute inset-0 origin-left scale-x-0 bg-[linear-gradient(90deg,color-mix(in_srgb,var(--accent)_9%,transparent),transparent)] transition-transform duration-700 ease-out-expo group-hover:scale-x-100" />
              <div className="relative flex items-start gap-5 py-7 md:gap-8 md:py-8">
                <span className="mt-1 font-mono text-[0.6875rem] tracking-[0.2em] text-muted">{String(index + 1).padStart(2, "0")}</span>
                <div className="flex-1">
                  <h3 className="font-display text-xl font-semibold tracking-[-0.025em] transition-transform duration-700 ease-out-expo group-hover:translate-x-2 md:text-2xl">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted md:text-[0.9375rem]">{benefit.text}</p>
                </div>
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-line-strong text-accent transition-[background-color,color,border-color,rotate] duration-700 ease-out-expo group-hover:-rotate-6 group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent">
                  <Icon name={benefit.icon} size={24} />
                </span>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
