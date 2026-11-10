"use client";

import { Icon } from "@/components/icons";
import { useQuote } from "@/components/providers/QuoteProvider";
import { Picture } from "@/components/ui/Picture";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TiltCard } from "@/components/ui/TiltCard";
import { services, type Service } from "@/config/content";
import { cn } from "@/lib/cn";

const featuredLayout = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7"];

function QuoteLink({ service, className }: { service: Service; className?: string }) {
  const { requestQuote } = useQuote();
  return (
    <button
      type="button"
      onClick={() => requestQuote(service.short)}
      aria-label={`Solicitar orçamento: ${service.title}`}
      className={cn(
        "group/q relative z-10 inline-flex items-center gap-2 rounded-full text-sm font-medium text-fg transition-colors",
        className,
      )}
    >
      <span className="link-line pb-0.5">Solicitar orçamento</span>
      <span className="grid size-8 place-items-center rounded-full border border-line-strong transition-[background-color,border-color,color,rotate] duration-500 ease-out-expo group-hover/q:rotate-45 group-hover/q:border-accent group-hover/q:bg-accent group-hover/q:text-on-accent">
        <Icon name="arrowUpRight" size={15} />
      </span>
    </button>
  );
}

function FeaturedCard({ service, index }: { service: Service; index: number }) {
  return (
    <Reveal delay={(index % 2) * 0.1} className={cn("group", featuredLayout[index])}>
      <TiltCard as="article" max={3.5} className="flex min-h-[26rem] flex-col justify-end overflow-hidden rounded-[2rem] border border-line bg-surface md:min-h-[30rem]">
        {service.image && (
          <div className="absolute inset-0">
            <Picture
              name={service.image}
              alt={service.imageAlt ?? ""}
              sizes="(min-width: 1024px) 56vw, 100vw"
              imgClassName="transition-transform duration-[1600ms] ease-out-expo group-hover:scale-[1.05]"
            />
            <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgb(7_12_24/0.94)_8%,rgb(7_12_24/0.55)_45%,rgb(7_12_24/0.08)_78%)]" />
          </div>
        )}
        <div className="relative z-10 flex items-start justify-between p-6 md:p-8 [transform:translateZ(30px)]">
          <span className="glass grid size-12 place-items-center rounded-2xl text-frost">
            <Icon name={service.icon} size={24} />
          </span>
          <span className="font-mono text-[0.6875rem] tracking-[0.2em] text-frost/70">{String(index + 1).padStart(2, "0")}</span>
        </div>
        <div className="relative z-10 mt-auto p-6 text-frost md:p-8 [transform:translateZ(40px)]">
          <h3 className="max-w-[20ch] font-display text-2xl font-semibold leading-tight tracking-[-0.03em] md:text-[1.75rem]">
            {service.title}
          </h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-frost/75 md:text-[0.9375rem]">{service.description}</p>
          {service.points && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {service.points.map((point) => (
                <li key={point} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-frost/85 backdrop-blur-sm">
                  {point}
                </li>
              ))}
            </ul>
          )}
          <QuoteLink service={service} className="mt-6 text-frost [&_.border-line-strong]:border-white/25" />
        </div>
        <span className="pointer-events-none absolute bottom-3 right-4 z-10 font-mono text-[0.5625rem] uppercase tracking-[0.18em] text-frost/45">
          Imagem ilustrativa
        </span>
      </TiltCard>
    </Reveal>
  );
}

function CompactCard({ service, index }: { service: Service; index: number }) {
  return (
    <Reveal delay={(index % 3) * 0.08} className="group">
      <TiltCard as="article" className="flex min-h-[17rem] flex-col rounded-[1.75rem] border border-line bg-surface p-6 transition-colors duration-500 hover:bg-surface-2 md:p-7">
        <div className="flex items-start justify-between [transform:translateZ(24px)]">
          <span className="grid size-12 place-items-center rounded-2xl border border-line-strong bg-bg text-accent transition-[background-color,color,border-color] duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent">
            <Icon name={service.icon} size={24} />
          </span>
          <span className="font-mono text-[0.6875rem] tracking-[0.2em] text-muted">{String(index + 5).padStart(2, "0")}</span>
        </div>
        <h3 className="mt-8 font-display text-xl font-semibold leading-snug tracking-[-0.025em] [transform:translateZ(18px)]">
          {service.title}
        </h3>
        <p className="mt-2.5 text-sm leading-relaxed text-muted">{service.description}</p>
        <QuoteLink service={service} className="mt-auto pt-6" />
      </TiltCard>
    </Reveal>
  );
}

/** 02 — Serviços: quatro destaques com imagem + seis cards técnicos. */
export function Services() {
  const featured = services.filter((service) => service.image);
  const compact = services.filter((service) => !service.image);
  return (
    <section id="servicos" aria-labelledby="servicos-titulo" className="relative scroll-mt-20 py-24 md:py-36">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 hairline" />
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            id="servicos-titulo"
            index="02"
            eyebrow="Serviços"
            title="Do primeiro furo ao último ajuste."
            accentFrom={4}
          />
          <Reveal delay={0.15} className="max-w-sm text-base leading-relaxed text-muted lg:pb-2">
            Instalação, manutenção e orientação para residências e empresas. Cada serviço começa por entender o seu
            ambiente.
          </Reveal>
        </div>

        <div className="mt-14 grid gap-4 md:mt-20 lg:grid-cols-12">
          {featured.map((service, index) => (
            <FeaturedCard key={service.id} service={service} index={index} />
          ))}
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {compact.map((service, index) => (
            <CompactCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
