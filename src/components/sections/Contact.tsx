"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { OceanCanvas } from "@/components/effects/OceanCanvas";
import { Icon, type IconName } from "@/components/icons";
import { useQuote } from "@/components/providers/QuoteProvider";
import { Button } from "@/components/ui/Button";
import { SelectField, TextAreaField, TextField } from "@/components/ui/Field";
import { Reveal, Words } from "@/components/ui/Reveal";
import { environmentTypes, services } from "@/config/content";
import { basePath, site } from "@/config/site";
import { isValidEmail, isValidPhone, maskPhone } from "@/lib/format";
import { composeMessage, openWhatsapp, whatsappUrl } from "@/lib/whatsapp";

type Values = {
  name: string;
  phone: string;
  email: string;
  city: string;
  service: string;
  environment: string;
  message: string;
  /** Campo-isca contra robôs: deve ficar vazio. */
  website: string;
};

type Status = "idle" | "sending" | "sent" | "whatsapp" | "error";

const empty: Values = { name: "", phone: "", email: "", city: "", service: "", environment: "", message: "", website: "" };
const serviceOptions = [...services.map((service) => service.short), "Outro assunto"];
const order: (keyof Values)[] = ["name", "phone", "email", "city", "service"];
const fieldIds: Partial<Record<keyof Values, string>> = {
  name: "contato-nome",
  phone: "contato-telefone",
  email: "contato-email",
  city: "contato-cidade",
  service: "contato-servico",
};

function validate(values: Values) {
  const errors: Partial<Record<keyof Values, string>> = {};
  if (values.name.trim().length < 3) errors.name = "Informe seu nome completo.";
  if (!isValidPhone(values.phone)) errors.phone = "Informe um telefone com DDD. Ex.: (11) 99999-9999.";
  if (values.email.trim() && !isValidEmail(values.email)) errors.email = "Confira o e-mail informado.";
  if (values.city.trim().length < 2) errors.city = "Informe a cidade do atendimento.";
  if (!values.service) errors.service = "Selecione o tipo de serviço.";
  return errors;
}

function buildMessage(values: Values) {
  return composeMessage(
    "Olá! Gostaria de solicitar um orçamento:",
    [
      ["Nome", values.name],
      ["Telefone", values.phone],
      ["E-mail", values.email],
      ["Cidade", values.city],
      ["Serviço", values.service],
      ["Ambiente", values.environment],
      ["Mensagem", values.message],
    ],
    "Enviado pelo formulário do site.",
  );
}

/** 10 — Contato e orçamento: formulário validado + WhatsApp, sobre um oceano noturno. */
export function Contact() {
  const { service, setService } = useQuote();
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const result = useRef<HTMLDivElement>(null);
  const viaEndpoint = Boolean(site.formEndpoint);

  // serviço escolhido nos cards de serviço → já vem selecionado aqui
  useEffect(() => {
    if (service) setValues((current) => ({ ...current, service }));
  }, [service]);

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
    if (key === "service") setService(String(value));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    const first = order.find((key) => found[key]);
    if (first) {
      document.getElementById(fieldIds[first]!)?.focus();
      return;
    }
    if (values.website) {
      setStatus("sent");
      return;
    }

    if (!viaEndpoint) {
      openWhatsapp(buildMessage(values));
      setStatus("whatsapp");
      window.requestAnimationFrame(() => result.current?.focus());
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch(site.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          nome: values.name.trim(),
          telefone: values.phone,
          email: values.email.trim(),
          cidade: values.city.trim(),
          servico: values.service,
          ambiente: values.environment,
          mensagem: values.message.trim(),
          origem: "Site DCRYO — formulário de contato",
        }),
      });
      if (!response.ok) throw new Error(String(response.status));
      setStatus("sent");
    } catch {
      setStatus("error");
    }
    window.requestAnimationFrame(() => result.current?.focus());
  };

  const reset = () => {
    setValues(empty);
    setErrors({});
    setStatus("idle");
  };

  const info: { icon: IconName; label: string; value: string; href?: string }[] = [
    site.phoneDisplay ? { icon: "whatsapp" as const, label: "WhatsApp", value: site.phoneDisplay, href: whatsappUrl() } : null,
    site.email ? { icon: "mail" as const, label: "E-mail", value: site.email, href: `mailto:${site.email}` } : null,
    site.serviceArea ? { icon: "pin" as const, label: "Área de atendimento", value: site.serviceArea } : null,
    site.hours ? { icon: "clock" as const, label: "Horário", value: site.hours } : null,
  ].filter((item): item is NonNullable<typeof item> => item !== null);

  const done = status === "sent" || status === "whatsapp";

  return (
    <section id="contato" data-theme="dark" aria-labelledby="contato-titulo" className="relative isolate scroll-mt-0 overflow-hidden bg-deep py-24 text-fg md:py-36">
      {/* oceano profundo */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(80%_60%_at_30%_30%,#12305c,transparent_70%),linear-gradient(180deg,#070c18,#00002a_60%,#070c18)]">
        <OceanCanvas className="opacity-90" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--bg)_0%,transparent_18%,transparent_78%,#070c18_100%)]" />
      </div>
      {/* transição de temperatura: a página "esfria" ao entrar nesta seção */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 hairline" />

      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <Reveal className="flex items-center gap-3">
            <span className="eyebrow text-accent">10</span>
            <span aria-hidden className="h-px w-8 bg-line-strong" />
            <span className="eyebrow">Contato e orçamento</span>
          </Reveal>
          <h2 id="contato-titulo" className="display-lg mt-6 max-w-[14ch]">
            <Words text="Vamos deixar seu ambiente na temperatura ideal?" accentFrom={5} accentClassName="text-ice-gradient" />
          </h2>
          <Reveal delay={0.15} className="mt-7 max-w-md text-base leading-relaxed text-fg-soft md:text-lg">
            Conte o que você precisa. Respondemos com as primeiras orientações e um orçamento detalhado.
          </Reveal>

          <Reveal delay={0.25} className="mt-9 flex flex-wrap items-center gap-3">
            <Button variant="whatsapp" size="lg" icon="whatsapp" href={whatsappUrl()} external>
              Chamar no WhatsApp
            </Button>
          </Reveal>

          {info.length > 0 && (
            <Reveal delay={0.3} as="div" className="mt-12">
              <ul className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {info.map((item) => (
                  <li key={item.label} className="flex items-start gap-3.5 bg-[rgb(7_12_24/0.72)] p-5 backdrop-blur-md">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-line-strong text-accent">
                      <Icon name={item.icon} size={20} />
                    </span>
                    <span className="min-w-0">
                      <span className="eyebrow block">{item.label}</span>
                      {item.href ? (
                        <a href={item.href} className="link-line mt-1.5 inline-block break-words text-sm font-medium">
                          {item.value}
                        </a>
                      ) : (
                        <span className="mt-1.5 block text-sm font-medium">{item.value}</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>

        <Reveal blur className="lg:col-span-7">
          <div className="glass relative overflow-hidden rounded-[2rem] p-6 shadow-(--shadow) md:p-9">
            <AnimatePresence mode="wait" initial={false}>
              {done ? (
                <motion.div
                  key="done"
                  ref={result}
                  tabIndex={-1}
                  role="status"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="flex min-h-[30rem] flex-col items-center justify-center text-center outline-none"
                >
                  <span className="relative grid size-20 place-items-center rounded-full border border-accent/50 bg-accent/10 text-accent">
                    <span aria-hidden className="absolute inset-0 animate-pulse-soft rounded-full ring-1 ring-accent/40" />
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, delay: 0.25, ease: [0.65, 0, 0.35, 1] }} />
                    </svg>
                  </span>
                  <h3 className="mt-7 font-display text-2xl font-semibold tracking-[-0.03em] md:text-3xl">
                    {status === "whatsapp" ? "Mensagem pronta no WhatsApp." : "Solicitação enviada."}
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted md:text-base">
                    {status === "whatsapp"
                      ? "Abrimos o WhatsApp com os seus dados preenchidos. Agora é só confirmar o envio por lá."
                      : "Recebemos os seus dados e retornaremos o contato em breve. Obrigado pela confiança."}
                  </p>
                  <div className="mt-8 flex flex-wrap justify-center gap-3">
                    {status === "whatsapp" && (
                      <Button variant="whatsapp" icon="whatsapp" onClick={() => openWhatsapp(buildMessage(values))}>
                        Abrir o WhatsApp de novo
                      </Button>
                    )}
                    <Button variant="secondary" onClick={reset}>
                      Enviar outra solicitação
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  noValidate
                  onSubmit={submit}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                  aria-label="Formulário de orçamento"
                  className="grid gap-4 sm:grid-cols-2"
                >
                  <TextField id="contato-nome" label="Nome completo" value={values.name} onChange={(v) => set("name", v)} error={errors.name} autoComplete="name" required maxLength={80} className="sm:col-span-2" />
                  <TextField
                    id="contato-telefone"
                    label="Telefone / WhatsApp"
                    type="tel"
                    inputMode="tel"
                    value={values.phone}
                    onChange={(v) => set("phone", maskPhone(v))}
                    error={errors.phone}
                    autoComplete="tel-national"
                    required
                  />
                  <TextField id="contato-email" label="E-mail" optional type="email" inputMode="email" value={values.email} onChange={(v) => set("email", v)} error={errors.email} autoComplete="email" maxLength={120} />
                  <TextField id="contato-cidade" label="Cidade" value={values.city} onChange={(v) => set("city", v)} error={errors.city} autoComplete="address-level2" required maxLength={80} />
                  <SelectField id="contato-servico" label="Tipo de serviço" value={values.service} onChange={(v) => set("service", v)} options={serviceOptions} error={errors.service} required />
                  <SelectField id="contato-ambiente" label="Tipo de ambiente" optional value={values.environment} onChange={(v) => set("environment", v)} options={environmentTypes} className="sm:col-span-2" />
                  <TextAreaField
                    id="contato-mensagem"
                    label="Mensagem"
                    optional
                    value={values.message}
                    onChange={(v) => set("message", v)}
                    maxLength={1000}
                    className="sm:col-span-2"
                    hint="Conte sobre o ambiente, o aparelho e o melhor horário para contato."
                  />

                  {/* campo-isca: invisível para pessoas, tentador para robôs */}
                  <div aria-hidden className="absolute -left-[9999px] size-px overflow-hidden">
                    <label>
                      Não preencha este campo
                      <input type="text" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(event) => set("website", event.target.value)} />
                    </label>
                  </div>

                  {status === "error" && (
                    <div ref={result} tabIndex={-1} role="alert" className="rounded-2xl border border-(--danger)/50 bg-(--danger)/10 p-4 text-sm outline-none sm:col-span-2">
                      <p className="font-medium text-(--danger)">Não foi possível enviar agora.</p>
                      <p className="mt-1 text-fg-soft">
                        Tente novamente em instantes ou{" "}
                        <button type="button" className="link-line font-medium text-fg" onClick={() => openWhatsapp(buildMessage(values))}>
                          envie os mesmos dados pelo WhatsApp
                        </button>
                        .
                      </p>
                    </div>
                  )}

                  <div className="mt-2 flex flex-col-reverse items-start justify-between gap-5 sm:col-span-2 sm:flex-row sm:items-center">
                    <p className="max-w-xs text-xs leading-relaxed text-muted">
                      Seus dados são usados apenas para responder a esta solicitação.{" "}
                      <a href={`${basePath}/privacidade/`} className="link-line text-fg-soft">
                        Política de privacidade
                      </a>
                      .
                    </p>
                    <Button
                      type="submit"
                      size="lg"
                      variant={viaEndpoint ? "primary" : "whatsapp"}
                      icon={viaEndpoint ? undefined : "whatsapp"}
                      trailingIcon={viaEndpoint ? "arrowUpRight" : undefined}
                      loading={status === "sending"}
                      className="w-full sm:w-auto"
                    >
                      {status === "sending" ? "Enviando…" : viaEndpoint ? "Enviar solicitação" : "Enviar pelo WhatsApp"}
                    </Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
