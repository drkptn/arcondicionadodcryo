/**
 * CONFIGURAÇÃO CENTRAL DA EMPRESA
 * ---------------------------------------------------------------------------
 * Tudo o que é específico do negócio fica aqui (ou em variáveis de ambiente).
 * Campos vazios ("" ou []) NÃO aparecem no site — nada é inventado.
 *
 * Variáveis de ambiente suportadas (.env.local / painel da hospedagem):
 *   NEXT_PUBLIC_SITE_URL          URL pública do site (ex.: https://www.dcryo.com.br)
 *   NEXT_PUBLIC_WHATSAPP_NUMBER   Somente dígitos, com DDI e DDD (ex.: 5511999999999)
 *   NEXT_PUBLIC_CONTACT_EMAIL     E-mail de contato exibido no site
 *   NEXT_PUBLIC_FORM_ENDPOINT     Endpoint que recebe o formulário via POST JSON
 *                                 (Formspree, Getform, Basin, webhook próprio…)
 *   NEXT_PUBLIC_BASE_PATH         Subpasta de publicação (ex.: /arcondicionadodcryo)
 */

const env = (value: string | undefined) => (value ?? "").trim();

export const site = {
  name: "DCRYO",
  /** Pronúncia sugerida: "dê-crio". */
  tagline: "Climatização · Instalação · Conforto",
  shortDescription:
    "Instalação profissional de ar-condicionado com precisão técnica, atendimento especializado e conforto em cada detalhe.",

  /** URL pública — usada em SEO, sitemap e Open Graph. */
  url: env(process.env.NEXT_PUBLIC_SITE_URL) || "https://www.seudominio.com.br",

  // --- Contato -------------------------------------------------------------
  /** WhatsApp no formato internacional, só dígitos. Vazio = o visitante escolhe o contato ao abrir o WhatsApp. */
  whatsapp: env(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER).replace(/\D/g, ""),
  /** Como o telefone deve aparecer escrito no site (ex.: "(11) 99999-9999"). */
  phoneDisplay: "",
  email: env(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  /** Endpoint do formulário de contato. Vazio = o formulário é enviado pelo WhatsApp. */
  formEndpoint: env(process.env.NEXT_PUBLIC_FORM_ENDPOINT),

  // --- Atendimento (preencher com dados reais) -----------------------------
  /** Ex.: "São Paulo e região metropolitana". */
  serviceArea: "",
  /** Ex.: ["São Paulo", "Guarulhos", "Osasco"] — usado também nos dados estruturados. */
  cities: [] as string[],
  /** Ex.: "Segunda a sábado, das 8h às 18h". */
  hours: "",

  // --- Dados legais (rodapé e política de privacidade) ----------------------
  legalName: "",
  cnpj: "",
  address: "",

  // --- Redes sociais (URL completa; vazio = não exibe) ----------------------
  social: {
    instagram: "",
    facebook: "",
    youtube: "",
    tiktok: "",
  },

  /** Mensagem padrão do botão de WhatsApp. */
  whatsappDefaultMessage:
    "Olá! Gostaria de solicitar um orçamento para instalação de ar-condicionado. Poderiam me ajudar?",
} as const;

export const basePath = env(process.env.NEXT_PUBLIC_BASE_PATH).replace(/\/$/, "");

/** Prefixa caminhos de /public com o basePath (necessário em hospedagem por subpasta). */
export const asset = (path: string) => `${basePath}${path.startsWith("/") ? path : `/${path}`}`;

export const navigation = [
  { id: "servicos", label: "Serviços" },
  { id: "tecnologia", label: "Tecnologia" },
  { id: "processo", label: "Como funciona" },
  { id: "galeria", label: "Galeria" },
  { id: "diferenciais", label: "Diferenciais" },
  { id: "duvidas", label: "Dúvidas" },
  { id: "contato", label: "Contato" },
] as const;

export type SectionId = (typeof navigation)[number]["id"];
