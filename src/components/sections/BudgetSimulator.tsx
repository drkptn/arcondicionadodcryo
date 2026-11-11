"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Condensation } from "@/components/ui/Condensation";
import { ChipGroup, SelectField, TextAreaField, TextField } from "@/components/ui/Field";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { btuOptions, environmentTypes, equipmentTypes, ownershipOptions } from "@/config/content";
import { cn } from "@/lib/cn";
import { composeMessage, hasWhatsappNumber, openWhatsapp } from "@/lib/whatsapp";

type Segment = "residencial" | "comercial";

type State = {
  segment: Segment | "";
  environment: string;
  equipment: (typeof equipmentTypes)[number]["id"] | "";
  quantity: number;
  btu: string;
  ownership: (typeof ownershipOptions)[number]["id"] | "";
  city: string;
  notes: string;
};

const initial: State = { segment: "", environment: "", equipment: "", quantity: 1, btu: "", ownership: "", city: "", notes: "" };

const stepNames = ["Ambiente", "Equipamento", "Local", "Resumo"];
const EASE = [0.16, 1, 0.3, 1] as const;

const segments = [
  { id: "residencial", label: "Residencial", hint: "Casa ou apartamento" },
  { id: "comercial", label: "Comercial", hint: "Empresa, loja ou clínica" },
] as const;

/** 07 — Simulador: organiza as informações e gera a solicitação de orçamento (sem preços automáticos). */
export function BudgetSimulator() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<State>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof State, string>>>({});
  const [copied, setCopied] = useState(false);
  const panel = useRef<HTMLDivElement>(null);

  const set = <K extends keyof State>(key: K, value: State[K]) => {
    setData((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const validate = (index: number) => {
    const next: Partial<Record<keyof State, string>> = {};
    if (index === 0) {
      if (!data.segment) next.segment = "Escolha o tipo de imóvel.";
      if (!data.environment) next.environment = "Selecione o tipo de ambiente.";
    }
    if (index === 1) {
      if (!data.equipment) next.equipment = "Escolha o tipo de equipamento (ou “Ainda não sei”).";
      if (!data.ownership) next.ownership = "Conte se você já tem o aparelho.";
    }
    if (index === 2 && data.city.trim().length < 2) next.city = "Informe a cidade e, se quiser, o bairro.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const go = (target: number) => {
    setDirection(target > step ? 1 : -1);
    setStep(target);
    window.requestAnimationFrame(() => panel.current?.focus({ preventScroll: true }));
  };
  const next = () => validate(step) && go(step + 1);

  const equipmentLabel = equipmentTypes.find((item) => item.id === data.equipment)?.label ?? "";
  const ownershipLabel = ownershipOptions.find((item) => item.id === data.ownership)?.label ?? "";
  const summary: [string, string][] = [
    ["Tipo de imóvel", data.segment === "comercial" ? "Comercial" : data.segment === "residencial" ? "Residencial" : ""],
    ["Ambiente", data.environment],
    ["Equipamento", equipmentLabel],
    ["Quantidade de aparelhos", String(data.quantity)],
    ["Capacidade (BTUs)", data.btu || "Não informado"],
    ["Já possui o aparelho", ownershipLabel],
    ["Cidade / região", data.city],
    ["Observações", data.notes],
  ];

  const message = composeMessage(
    "Olá! Fiz a simulação no site e gostaria de uma avaliação personalizada:",
    summary,
    "Podem me ajudar com o orçamento?",
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message.replace(/\*/g, ""));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="simulador" aria-labelledby="simulador-titulo" className="relative overflow-hidden py-24 md:py-36">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 hairline" />
      <div aria-hidden className="pointer-events-none absolute -left-40 top-1/3 size-[36rem] rounded-full bg-ocean/25 blur-[130px] light:bg-ice/50" />
      <div className="container-x relative grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <SectionHeading
            id="simulador-titulo"
            index="07"
            eyebrow="Simulador"
            title="Monte sua solicitação em um minuto."
            accentFrom={4}
            description="Responda a poucas perguntas e envie tudo organizado pelo WhatsApp. Sem tabela genérica de preços: cada ambiente recebe uma avaliação personalizada."
          />
          <Reveal delay={0.2} className="mt-10 hidden lg:block">
            <ol className="flex flex-col gap-3">
              {stepNames.map((name, index) => (
                <li key={name} className="flex items-center gap-4">
                  <span
                    className={cn(
                      "grid size-8 place-items-center rounded-full border font-mono text-[0.6875rem] transition-[background-color,border-color,color] duration-500",
                      index < step
                        ? "border-accent bg-accent text-on-accent"
                        : index === step
                          ? "border-accent text-accent"
                          : "border-line-strong text-muted",
                    )}
                  >
                    {index < step ? <Icon name="check" size={14} strokeWidth={2.2} /> : index + 1}
                  </span>
                  <span className={cn("text-sm font-medium transition-colors duration-500", index === step ? "text-fg" : "text-muted")}>{name}</span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>

        <Reveal blur className="lg:col-span-7">
          <div className="glass relative overflow-hidden rounded-[2rem] shadow-(--shadow)">
            <Condensation count={20} seed={23} />
            {/* progresso */}
            <div className="relative flex items-center justify-between gap-4 border-b border-(--glass-line) px-6 py-5 md:px-9">
              <p className="eyebrow">
                Etapa <span className="text-accent">{String(step + 1).padStart(2, "0")}</span> / 04<span className="hidden sm:inline"> · {stepNames[step]}</span>
              </p>
              <div aria-hidden className="flex gap-1.5">
                {stepNames.map((name, index) => (
                  <span key={name} className={cn("h-1 w-8 rounded-full transition-colors duration-500", index <= step ? "bg-accent" : "bg-line-strong")} />
                ))}
              </div>
            </div>

            <div
              ref={panel}
              tabIndex={-1}
              aria-live="polite"
              className="relative min-h-[26rem] px-6 py-8 outline-none md:px-9 md:py-10"
            >
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 36, filter: "blur(6px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: direction * -36, filter: "blur(6px)" }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="flex flex-col gap-7"
                >
                  {step === 0 && (
                    <>
                      <ChipGroup legend="Onde será a instalação?" name="sim-segmento" options={segments} value={data.segment} onChange={(value) => set("segment", value)} error={errors.segment} />
                      <ChipGroup
                        legend="Tipo de ambiente"
                        name="sim-ambiente"
                        options={environmentTypes.map((item) => ({ id: item, label: item }))}
                        value={data.environment}
                        onChange={(value) => set("environment", value)}
                        error={errors.environment}
                        columns="grid-cols-2 sm:grid-cols-3"
                      />
                    </>
                  )}

                  {step === 1 && (
                    <>
                      <ChipGroup legend="Tipo de equipamento" name="sim-equipamento" options={equipmentTypes} value={data.equipment} onChange={(value) => set("equipment", value)} error={errors.equipment} />
                      <div className="grid gap-5 sm:grid-cols-2">
                        <fieldset>
                          <legend className="eyebrow mb-3">Quantidade de aparelhos</legend>
                          <div className="flex h-[3.75rem] items-center justify-between rounded-2xl border border-line-strong px-2">
                            <button
                              type="button"
                              aria-label="Diminuir quantidade"
                              disabled={data.quantity <= 1}
                              onClick={() => set("quantity", Math.max(1, data.quantity - 1))}
                              className="grid size-11 place-items-center rounded-xl text-fg transition-colors hover:bg-accent/12 disabled:opacity-35"
                            >
                              <Icon name="minus" size={18} />
                            </button>
                            <output aria-live="polite" className="font-display text-2xl font-semibold tabular-nums">
                              {data.quantity}
                            </output>
                            <button
                              type="button"
                              aria-label="Aumentar quantidade"
                              disabled={data.quantity >= 30}
                              onClick={() => set("quantity", Math.min(30, data.quantity + 1))}
                              className="grid size-11 place-items-center rounded-xl text-fg transition-colors hover:bg-accent/12 disabled:opacity-35"
                            >
                              <Icon name="plus" size={18} />
                            </button>
                          </div>
                        </fieldset>
                        <div>
                          <p aria-hidden className="eyebrow mb-3">
                            Capacidade aproximada
                          </p>
                          <SelectField id="sim-btu" label="BTUs" optional value={data.btu} onChange={(value) => set("btu", value)} options={btuOptions} placeholder="Se souber, selecione" />
                        </div>
                      </div>
                      <ChipGroup legend="Você já tem o aparelho?" name="sim-posse" options={ownershipOptions} value={data.ownership} onChange={(value) => set("ownership", value)} error={errors.ownership} columns="sm:grid-cols-3" />
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <TextField id="sim-cidade" label="Cidade e bairro" value={data.city} onChange={(value) => set("city", value)} error={errors.city} autoComplete="address-level2" required maxLength={80} />
                      <TextAreaField
                        id="sim-obs"
                        label="Observações"
                        optional
                        value={data.notes}
                        onChange={(value) => set("notes", value)}
                        rows={5}
                        maxLength={600}
                        hint="Ex.: andar do apartamento, distância até a área externa, marca e modelo do aparelho."
                      />
                    </>
                  )}

                  {step === 3 && (
                    <div>
                      <p className="font-display text-2xl font-semibold tracking-[-0.03em]">Receba uma avaliação personalizada.</p>
                      <p className="mt-2 text-sm leading-relaxed text-muted">
                        Confira o resumo e envie. Respondemos com as próximas orientações e o orçamento.
                      </p>
                      <dl className="mt-6 grid gap-x-8 gap-y-0 sm:grid-cols-2">
                        {summary
                          .filter(([, value]) => value)
                          .map(([label, value]) => (
                            <div key={label} className="border-b border-(--glass-line) py-3">
                              <dt className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted">{label}</dt>
                              <dd className="mt-1 text-sm font-medium text-fg">{value}</dd>
                            </div>
                          ))}
                      </dl>
                      {!hasWhatsappNumber && (
                        <p className="mt-5 text-xs leading-relaxed text-muted">
                          Ao enviar, o WhatsApp abre com a mensagem pronta para você escolher o contato.
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="relative flex flex-wrap items-center justify-between gap-3 border-t border-(--glass-line) px-6 py-5 md:px-9">
              {step > 0 ? (
                <Button variant="ghost" size="sm" magnetic={false} icon="chevronLeft" onClick={() => go(step - 1)}>
                  Voltar
                </Button>
              ) : (
                <span className="text-xs text-muted">Leva menos de um minuto.</span>
              )}
              {step < 3 ? (
                <Button trailingIcon="arrowRight" onClick={next}>
                  Continuar
                </Button>
              ) : (
                <div className="flex flex-wrap items-center gap-2.5">
                  <Button variant="secondary" size="md" icon={copied ? "check" : "copy"} magnetic={false} onClick={copy}>
                    {copied ? "Copiado" : "Copiar resumo"}
                  </Button>
                  <Button variant="whatsapp" icon="whatsapp" onClick={() => openWhatsapp(message)}>
                    Enviar pelo WhatsApp
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
