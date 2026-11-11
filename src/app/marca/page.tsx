import type { Metadata } from "next";
import { LogoSymbol } from "@/components/brand/Logo";
import { Icon, iconNames } from "@/components/icons";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Condensation } from "@/components/ui/Condensation";
import { criteria, logoFiles, nameStudy, palette, typography } from "@/config/brand";
import { asset } from "@/config/site";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Identidade visual",
  description: "Sistema de identidade da DCRYO: logotipo, cores, tipografia, ícones e padrões.",
  robots: { index: false, follow: false },
};

const fontClass = { "font-display": "font-display", "font-sans": "font-sans", "font-mono": "font-mono" } as const;

function Block({ index, title, intro, children }: { index: string; title: string; intro?: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line py-16 md:py-24">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="eyebrow text-accent">{index}</p>
          <h2 className="display-md mt-4">{title}</h2>
          {intro && <p className="mt-4 max-w-sm text-base leading-relaxed text-muted">{intro}</p>}
        </div>
        <div className="lg:col-span-8">{children}</div>
      </div>
    </section>
  );
}

const lightText = (hex: string) => {
  const n = Number.parseInt(hex.slice(1), 16);
  const luminance = (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  return luminance < 0.55;
};

export default function BrandPage() {
  return (
    <>
      <Header home={false} />
      <main id="conteudo" className="relative pb-10 pt-36 md:pt-48">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[36rem] bg-[radial-gradient(60%_70%_at_70%_0%,color-mix(in_srgb,var(--hero-c)_40%,transparent),transparent_70%)]" />
        <div className="container-x relative">
          <p className="eyebrow">Sistema de identidade · uso interno</p>
          <h1 className="display-lg mt-6 max-w-[16ch]">A marca DCRYO em detalhes.</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Tecnologia, precisão e frescor. Este guia reúne os elementos que dão unidade à marca — do símbolo ao menor ícone da
            interface.
          </p>

          <div className="mt-16">
            <Block
              index="01"
              title="Símbolo"
              intro="Um “D” atravessado por duas correntes de ar. As faixas lembram as aletas do aparelho, o fluxo de ar frio e o movimento das ondas — sem recorrer ao floco de neve."
            >
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="grid aspect-square place-items-center rounded-3xl border border-line bg-[#070c18] text-frost sm:col-span-2 sm:aspect-auto sm:min-h-[20rem]">
                  <LogoSymbol size={180} tone="gradient" title="Símbolo DCRYO" />
                </div>
                <div className="grid gap-4">
                  <div className="grid place-items-center rounded-3xl border border-line bg-[#eaf3fa] p-6">
                    <LogoSymbol size={84} tone="ocean" />
                  </div>
                  <div className="flex items-end justify-center gap-5 rounded-3xl border border-line bg-surface p-6 text-fg">
                    {[48, 32, 20, 16].map((size) => (
                      <span key={size} className="flex flex-col items-center gap-2">
                        <LogoSymbol size={size} tone="current" />
                        <span className="font-mono text-[0.5625rem] text-muted">{size}px</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted">
                Favicon: o símbolo sobre um quadrado azul-marinho de cantos arredondados, com as ondas alargadas para continuar
                legível em 16 px.
              </p>
            </Block>

            <Block index="02" title="Versões do logotipo" intro="Arquivos SVG prontos em /public/brand. Clique para abrir e baixar.">
              <ul className="grid gap-4 sm:grid-cols-2">
                {logoFiles.map((logo) => (
                  <li key={logo.file}>
                    <a
                      href={asset(`/brand/${logo.file}`)}
                      download
                      className="group block overflow-hidden rounded-3xl border border-line transition-colors hover:border-accent"
                    >
                      <span className="grid h-40 place-items-center p-8" style={{ background: logo.background }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={asset(`/brand/${logo.file}`)} alt={`Logotipo DCRYO — ${logo.label}`} className="h-[4.5rem] w-auto max-w-[80%] object-contain" />
                      </span>
                      <span className="flex items-center justify-between gap-3 bg-surface px-5 py-3.5 text-sm">
                        <span className="font-medium">{logo.label}</span>
                        <span className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted group-hover:text-accent">SVG ↓</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </Block>

            <Block index="03" title="Cores" intro="Oceano profundo à noite: azuis frios, do quase preto ao branco gelo. Nenhum neon.">
              <ul className="grid gap-3 sm:grid-cols-2">
                {palette.map((color) => (
                  <li key={color.hex} className="flex overflow-hidden rounded-2xl border border-line bg-surface">
                    <span
                      className={cn("flex w-28 shrink-0 items-end p-3 font-mono text-[0.6875rem]", lightText(color.hex) ? "text-white/85" : "text-[#141e30]/80")}
                      style={{ background: color.hex }}
                    >
                      {color.hex}
                    </span>
                    <span className="p-4">
                      <span className="block text-sm font-semibold">{color.name}</span>
                      <span className="mt-1 block text-xs leading-relaxed text-muted">{color.role}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="h-24 rounded-2xl bg-[linear-gradient(135deg,#00002a,#1a3f75)]" />
                <div className="h-24 rounded-2xl bg-[linear-gradient(135deg,#141e30,#35577d)]" />
                <div className="h-24 rounded-2xl bg-[linear-gradient(135deg,#35577d,#a9c8e0,#eaf3fa)]" />
              </div>
            </Block>

            <Block index="04" title="Tipografia" intro="Três famílias, três funções. Todas gratuitas (Google Fonts) e servidas pelo próprio site.">
              <ul className="flex flex-col gap-4">
                {typography.map((font) => (
                  <li key={font.family} className="rounded-3xl border border-line bg-surface p-6 md:p-8">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="eyebrow">{font.role}</p>
                      <p className="font-mono text-[0.6875rem] text-muted">{font.family}</p>
                    </div>
                    <p
                      className={cn(
                        "mt-5",
                        fontClass[font.variable],
                        font.variable === "font-display" && "text-3xl font-semibold tracking-[-0.035em] md:text-5xl",
                        font.variable === "font-sans" && "max-w-xl text-lg leading-relaxed",
                        font.variable === "font-mono" && "text-sm uppercase tracking-[0.2em]",
                      )}
                    >
                      {font.sample}
                    </p>
                    <p className="mt-5 text-sm text-muted">{font.note}</p>
                  </li>
                ))}
              </ul>
            </Block>

            <Block index="05" title="Ícones" intro="Conjunto próprio: grade de 24 px, traço de 1,5 px e terminações arredondadas. Nada de biblioteca genérica.">
              <ul className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
                {iconNames.map((name) => (
                  <li key={name} title={name} className="grid aspect-square place-items-center rounded-2xl border border-line bg-surface text-fg-soft transition-colors hover:border-accent hover:text-accent">
                    <Icon name={name} size={24} />
                    <span className="sr-only">{name}</span>
                  </li>
                ))}
              </ul>
            </Block>

            <Block index="06" title="Padrões e texturas" intro="Elementos gráficos proprietários que dão atmosfera sem competir com o conteúdo.">
              <ul className="grid gap-4 sm:grid-cols-2">
                <li className="overflow-hidden rounded-3xl border border-line">
                  <div className="isotherms h-44 bg-surface" />
                  <p className="bg-surface px-5 py-3.5 text-sm">
                    <span className="font-medium">Isotermas</span> <span className="text-muted">— linhas de fluxo concêntricas.</span>
                  </p>
                </li>
                <li className="overflow-hidden rounded-3xl border border-line">
                  <div className="relative h-44 bg-[linear-gradient(160deg,#1a3f75,#141e30)]">
                    <Condensation count={30} seed={5} bias="even" />
                  </div>
                  <p className="bg-surface px-5 py-3.5 text-sm">
                    <span className="font-medium">Condensação</span> <span className="text-muted">— gotas sobre vidro refrigerado.</span>
                  </p>
                </li>
                <li className="overflow-hidden rounded-3xl border border-line">
                  <div className="relative h-44 overflow-hidden bg-[linear-gradient(180deg,#00002a,#0d1f3d)]">
                    <div className="water absolute inset-0" style={{ opacity: 0.6 }} />
                  </div>
                  <p className="bg-surface px-5 py-3.5 text-sm">
                    <span className="font-medium">Superfície de água</span> <span className="text-muted">— ruído orgânico à deriva.</span>
                  </p>
                </li>
                <li className="overflow-hidden rounded-3xl border border-line">
                  <div className="flex h-44 items-center justify-center gap-6 bg-surface px-8">
                    <div className="w-full">
                      <div className="flex items-end justify-between gap-[3px]">
                        {Array.from({ length: 10 }, (_, i) => (
                          <span key={i} className={cn("w-full rounded-full", i === 5 ? "h-3.5 bg-accent" : i < 5 ? "h-1.5 bg-accent/45" : "h-1.5 bg-line-strong")} />
                        ))}
                      </div>
                      <p className="mt-4 font-display text-4xl font-semibold tracking-[-0.05em]">
                        22<span className="align-top text-lg text-muted">°C</span>
                      </p>
                    </div>
                  </div>
                  <p className="bg-surface px-5 py-3.5 text-sm">
                    <span className="font-medium">Indicadores de temperatura</span> <span className="text-muted">— escalas e leituras.</span>
                  </p>
                </li>
              </ul>
            </Block>

            <Block
              index="07"
              title="Estudo de nomes"
              intro="Nove caminhos avaliados em cinco critérios. As notas são uma leitura de design — antes de registrar, confirme a disponibilidade da marca no INPI e do domínio."
            >
              <ul className="flex flex-col gap-3">
                {nameStudy.map((option) => {
                  const total = Object.values(option.scores).reduce((sum, value) => sum + value, 0);
                  return (
                    <li
                      key={option.name}
                      className={cn("rounded-3xl border p-6 md:p-7", option.chosen ? "border-accent bg-accent/8" : "border-line bg-surface")}
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                        <h3 className="font-display text-2xl font-semibold tracking-[-0.02em]">
                          {option.name}
                          {option.chosen && (
                            <span className="ml-3 rounded-full bg-accent px-2.5 py-1 align-middle font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-on-accent">
                              Escolhido
                            </span>
                          )}
                        </h3>
                        <p className="font-mono text-[0.6875rem] text-muted">
                          “{option.pronunciation}” · {total}/25
                        </p>
                      </div>
                      <p className="mt-2 text-sm text-muted">{option.origin}</p>
                      <dl className="mt-4 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
                        <div>
                          <dt className="eyebrow">Pontos fortes</dt>
                          <dd className="mt-1.5 leading-relaxed text-fg-soft">{option.strengths}</dd>
                        </div>
                        <div>
                          <dt className="eyebrow">Atenção</dt>
                          <dd className="mt-1.5 leading-relaxed text-fg-soft">{option.cautions}</dd>
                        </div>
                      </dl>
                      <ul className="mt-5 grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
                        {criteria.map((criterion) => (
                          <li key={criterion.key} className="flex items-center justify-between gap-3 text-xs text-muted">
                            <span>{criterion.label}</span>
                            <span className="flex gap-1" role="img" aria-label={`${option.scores[criterion.key]} de 5`}>
                              {Array.from({ length: 5 }, (_, i) => (
                                <span key={i} className={cn("size-1.5 rounded-full", i < option.scores[criterion.key] ? "bg-accent" : "bg-line-strong")} />
                              ))}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-6 text-sm leading-relaxed text-muted">
                <strong className="font-semibold text-fg">Recomendação:</strong> manter DCRYO. É o nome com mais personalidade visual e
                maior chance de ser único. Como reserva, NEVO (mais fácil de falar) e KLIMO (mais direto).
              </p>
            </Block>
          </div>
        </div>
      </main>
      <Footer home={false} />
    </>
  );
}
