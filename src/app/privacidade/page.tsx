import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { basePath, site } from "@/config/site";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description: "Como a DCRYO coleta, usa e protege os dados enviados pelo site.",
  alternates: { canonical: "/privacidade/" },
};

/** Atualize esta data sempre que o texto mudar. */
const UPDATED = "novembro de 2026";

const sections: { title: string; body: (string | string[])[] }[] = [
  {
    title: "1. Quem é responsável pelos seus dados",
    body: [
      `Esta política explica como a ${site.name}${site.legalName ? ` (${site.legalName}${site.cnpj ? `, CNPJ ${site.cnpj}` : ""})` : ""} trata os dados pessoais enviados por meio deste site, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD).`,
    ],
  },
  {
    title: "2. Quais dados coletamos",
    body: [
      "Coletamos apenas as informações que você decide enviar:",
      [
        "Formulário de contato: nome, telefone/WhatsApp, e-mail (opcional), cidade, tipo de serviço, tipo de ambiente e mensagem.",
        "Simulador de solicitação: tipo de imóvel e de ambiente, tipo e quantidade de aparelhos, capacidade aproximada, cidade e observações.",
        "Conversas pelo WhatsApp: as informações que você compartilhar durante o atendimento.",
      ],
      "Este site não utiliza cookies de publicidade nem ferramentas de rastreamento. A única informação guardada no seu navegador é a preferência de tema (claro ou escuro), que não identifica você.",
    ],
  },
  {
    title: "3. Para que usamos os dados",
    body: [
      [
        "Responder ao seu pedido de contato e elaborar o orçamento solicitado.",
        "Agendar e realizar o serviço contratado.",
        "Cumprir obrigações legais e fiscais relacionadas à prestação do serviço.",
      ],
      "Não vendemos seus dados e não os utilizamos para envio de publicidade sem o seu consentimento.",
    ],
  },
  {
    title: "4. Com quem os dados são compartilhados",
    body: [
      "Para viabilizar o atendimento, os dados podem passar por prestadores de serviço de tecnologia, como o WhatsApp (Meta), o serviço de hospedagem do site e, quando aplicável, o serviço que recebe os envios do formulário. Esses fornecedores tratam os dados conforme as suas próprias políticas de privacidade.",
    ],
  },
  {
    title: "5. Por quanto tempo guardamos",
    body: [
      "Mantemos os dados pelo tempo necessário para atender à sua solicitação e cumprir obrigações legais. Depois disso, eles são eliminados ou anonimizados.",
    ],
  },
  {
    title: "6. Seus direitos",
    body: [
      "A LGPD garante a você, entre outros, o direito de confirmar a existência de tratamento, acessar, corrigir, atualizar e solicitar a exclusão dos seus dados, além de revogar o consentimento a qualquer momento.",
      "Para exercer esses direitos, entre em contato pelos canais indicados abaixo.",
    ],
  },
  {
    title: "7. Segurança",
    body: [
      "Adotamos medidas razoáveis para proteger as informações recebidas contra acesso não autorizado, perda ou alteração. Nenhum sistema é totalmente imune a riscos; por isso, evite enviar pelo site dados sensíveis que não sejam necessários ao orçamento.",
    ],
  },
  {
    title: "8. Alterações nesta política",
    body: ["Esta política pode ser atualizada para refletir mudanças no site ou na legislação. A data da última atualização aparece no topo desta página."],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Header home={false} />
      <main id="conteudo" className="relative pb-24 pt-36 md:pb-36 md:pt-48">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(60%_70%_at_70%_0%,color-mix(in_srgb,var(--hero-c)_40%,transparent),transparent_70%)]" />
        <div className="container-x relative max-w-3xl">
          <p className="eyebrow">Última atualização: {UPDATED}</p>
          <h1 className="display-lg mt-6">Política de privacidade</h1>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            Transparência também faz parte do nosso trabalho. Aqui você entende quais dados o site recebe e o que fazemos com eles.
          </p>

          <div className="mt-14 flex flex-col gap-12">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="font-display text-2xl font-semibold tracking-[-0.025em]">{section.title}</h2>
                <div className="mt-4 flex flex-col gap-4 text-base leading-relaxed text-fg-soft">
                  {section.body.map((block, index) =>
                    Array.isArray(block) ? (
                      <ul key={index} className="flex flex-col gap-2.5">
                        {block.map((item) => (
                          <li key={item} className="flex gap-3">
                            <span aria-hidden className="mt-[0.7em] inline-block size-1.5 shrink-0 rounded-full bg-accent" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p key={index}>{block}</p>
                    ),
                  )}
                </div>
              </section>
            ))}

            <section>
              <h2 className="font-display text-2xl font-semibold tracking-[-0.025em]">9. Fale conosco</h2>
              <div className="mt-4 flex flex-col gap-3 text-base leading-relaxed text-fg-soft">
                <p>Dúvidas sobre esta política ou sobre os seus dados podem ser enviadas por:</p>
                <ul className="flex flex-col gap-2.5">
                  {site.email && (
                    <li>
                      E-mail:{" "}
                      <a href={`mailto:${site.email}`} className="link-line font-medium text-fg">
                        {site.email}
                      </a>
                    </li>
                  )}
                  <li>
                    Formulário de contato:{" "}
                    <a href={`${basePath}/#contato`} className="link-line font-medium text-fg">
                      seção Contato do site
                    </a>
                  </li>
                  {site.address && <li>Endereço: {site.address}</li>}
                </ul>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer home={false} />
    </>
  );
}
