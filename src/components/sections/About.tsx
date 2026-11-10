import { Picture } from "@/components/ui/Picture";
import { Reveal } from "@/components/ui/Reveal";
import { Drift, Parallax, ScrubText } from "@/components/ui/ScrollEffects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { principles } from "@/config/content";

/** 01 — Apresentação da empresa: composição editorial assimétrica. */
export function About() {
  return (
    <section id="sobre" aria-labelledby="sobre-titulo" className="relative scroll-mt-20 py-24 md:py-40">
      <div className="container-x grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <SectionHeading id="sobre-titulo" index="01" eyebrow="A DCRYO" title="Conforto pensado nos mínimos detalhes." accentFrom={3} />

          <ScrubText
            className="mt-12 max-w-[34ch] font-display text-[clamp(1.35rem,1.4vw+1rem,2.1rem)] font-medium leading-[1.28] tracking-[-0.022em] text-fg md:mt-16"
            text="Climatizar bem é um trabalho de precisão. O aparelho certo, no ponto certo, instalado do jeito certo — é isso que separa um ambiente apenas frio de um ambiente realmente confortável."
          />

          <Reveal className="mt-8 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            Cuidamos de cada etapa, da avaliação do espaço ao acabamento final, com organização durante o serviço e
            orientação clara sobre o uso do equipamento. Sem improviso e sem surpresa no orçamento.
          </Reveal>

          <ul className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-3 md:mt-20">
            {principles.map((item, index) => (
              <Reveal as="li" key={item.title} delay={index * 0.1} className="group relative bg-bg p-6 transition-colors duration-500 hover:bg-surface md:p-7">
                <span className="eyebrow text-accent">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-8 font-display text-xl font-semibold tracking-[-0.02em]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
                <span aria-hidden className="absolute inset-x-6 bottom-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-700 ease-out-expo group-hover:scale-x-100" />
              </Reveal>
            ))}
          </ul>
        </div>

        {/* Imagens arquitetônicas (ilustrativas) em camadas */}
        <div className="relative lg:col-span-5 lg:pl-6">
          <Reveal blur className="relative ml-auto w-[82%] lg:mt-10 lg:w-full">
            <Parallax className="aspect-[4/5] rounded-[2rem] border border-line">
              <Picture
                name="sala"
                alt="Render ilustrativo: sala de estar com split instalado e faixa de sol na parede"
                sizes="(min-width: 1024px) 38vw, 82vw"
                imgClassName="object-[62%_50%]"
              />
            </Parallax>
            <span className="glass absolute left-4 top-4 rounded-full px-3 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-fg-soft">
              Imagem ilustrativa
            </span>
          </Reveal>

          <Drift distance={46} className="absolute -bottom-10 left-0 w-[46%] sm:w-[40%] lg:-left-10 lg:bottom-16 lg:w-[52%]">
            <Reveal delay={0.2} className="overflow-hidden rounded-3xl border border-line-strong shadow-(--shadow)">
              <Picture
                name="detalhe_display"
                alt="Render ilustrativo: detalhe do display de temperatura de um split"
                sizes="(min-width: 1024px) 20vw, 44vw"
                className="aspect-square"
              />
            </Reveal>
          </Drift>

          {/* régua de temperatura — elemento gráfico da marca */}
          <div aria-hidden className="absolute -right-1 top-0 hidden h-full flex-col justify-between py-16 lg:flex xl:-right-8">
            {[26, 24, 22, 20, 18].map((t) => (
              <span key={t} className="flex items-center gap-2 font-mono text-[0.625rem] tracking-[0.14em] text-muted">
                <span className={t === 22 ? "h-px w-6 bg-accent" : "h-px w-3 bg-line-strong"} />
                <span className={t === 22 ? "text-accent" : undefined}>{t}°</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
