import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { testimonials, type Testimonial } from "@/config/content";
import { whatsappUrl } from "@/lib/whatsapp";

const months = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

function formatDate(value?: string) {
  if (!value) return null;
  const [year, month] = value.split("-").map(Number);
  return month ? `${months[month - 1]} ${year}` : String(year);
}

function Stars({ rating }: { rating: number }) {
  return (
    <span role="img" aria-label={`Avaliação: ${rating} de 5 estrelas`} className="flex gap-0.5 text-accent">
      {Array.from({ length: 5 }, (_, index) => (
        <Icon key={index} name="star" size={16} className={index < rating ? undefined : "opacity-20"} />
      ))}
    </span>
  );
}

function Card({ item, index }: { item: Testimonial; index: number }) {
  return (
    <Reveal as="li" delay={index * 0.08}>
      <figure className="flex h-full flex-col rounded-[1.75rem] border border-line bg-surface p-7">
        <Stars rating={item.rating} />
        <blockquote className="mt-5 flex-1 text-[0.9375rem] leading-relaxed text-fg-soft">“{item.text}”</blockquote>
        <figcaption className="mt-7 flex items-center gap-3 border-t border-line pt-5">
          <span aria-hidden className="grid size-10 place-items-center rounded-full bg-accent/15 font-display text-sm font-semibold text-accent">
            {item.name.trim().charAt(0).toUpperCase()}
          </span>
          <span>
            <span className="block text-sm font-semibold">{item.name}</span>
            <span className="block text-xs text-muted">{[item.service, formatDate(item.date)].filter(Boolean).join(" · ")}</span>
          </span>
        </figcaption>
      </figure>
    </Reveal>
  );
}

/** Moldura vazia, pronta para receber uma avaliação real. */
function Placeholder({ index }: { index: number }) {
  return (
    <Reveal as="li" delay={index * 0.08} className={index === 1 ? "md:translate-y-8" : undefined}>
      <div aria-hidden className="flex h-full min-h-[15rem] flex-col rounded-[1.75rem] border border-dashed border-line-strong p-7">
        <span className="flex gap-0.5 text-line-strong">
          {Array.from({ length: 5 }, (_, star) => (
            <Icon key={star} name="star" size={16} />
          ))}
        </span>
        <div className="mt-6 flex flex-1 flex-col gap-2.5">
          <span className="h-2.5 w-full rounded-full bg-line" />
          <span className="h-2.5 w-11/12 rounded-full bg-line" />
          <span className="h-2.5 w-2/3 rounded-full bg-line" />
        </div>
        <div className="mt-7 flex items-center gap-3 border-t border-line pt-5">
          <span className="size-10 rounded-full bg-line" />
          <span className="flex flex-col gap-2">
            <span className="h-2.5 w-28 rounded-full bg-line" />
            <span className="h-2 w-20 rounded-full bg-line" />
          </span>
        </div>
      </div>
    </Reveal>
  );
}

/**
 * 08 — Depoimentos. Só exibe avaliações reais cadastradas em src/config/content.ts.
 * Sem avaliações, a seção vira um convite honesto — nada é inventado.
 */
export function Testimonials() {
  const hasReviews = testimonials.length > 0;
  return (
    <section id="depoimentos" aria-labelledby="depoimentos-titulo" className="relative scroll-mt-20 py-24 md:py-36">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 hairline" />
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            id="depoimentos-titulo"
            index="08"
            eyebrow="Depoimentos"
            title={hasReviews ? "Quem instalou, recomenda." : "A próxima avaliação pode ser a sua."}
            accentFrom={hasReviews ? 2 : 4}
            description={
              hasReviews
                ? "Avaliações de clientes atendidos pela DCRYO."
                : "Este espaço é reservado para avaliações reais de clientes. Preferimos deixá-lo em branco a preenchê-lo com frases prontas."
            }
          />
          {!hasReviews && (
            <Reveal delay={0.2} className="shrink-0">
              <Button
                variant="secondary"
                href={whatsappUrl("Olá! Fui atendido(a) pela DCRYO e gostaria de deixar minha avaliação.")}
                external
                trailingIcon="arrowUpRight"
              >
                Já é cliente? Avalie
              </Button>
            </Reveal>
          )}
        </div>

        <ul className="mt-14 grid gap-4 md:mt-20 md:grid-cols-3">
          {hasReviews
            ? testimonials.map((item, index) => <Card key={`${item.name}-${index}`} item={item} index={index} />)
            : [0, 1, 2].map((index) => <Placeholder key={index} index={index} />)}
        </ul>
      </div>
    </section>
  );
}
