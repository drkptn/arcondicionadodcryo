/**
 * SISTEMA DE IDENTIDADE — dados exibidos em /marca.
 */
export const palette = [
  { name: "Preto azulado", hex: "#00002A", role: "Profundidade máxima: gradientes do hero e do oceano." },
  { name: "Abissal", hex: "#070C18", role: "Fundo principal do tema escuro." },
  { name: "Azul-marinho profundo", hex: "#141E30", role: "Superfícies escuras e textos no tema claro." },
  { name: "Azul oceano", hex: "#1A3F75", role: "Cor de ação: botões e destaques no tema claro." },
  { name: "Azul intermediário", hex: "#35577D", role: "Gradientes, estados de foco e apoio." },
  { name: "Cinza azulado", hex: "#8494A8", role: "Textos secundários e legendas." },
  { name: "Azul gelo", hex: "#A9C8E0", role: "Destaque no tema escuro: ícones, linhas e brilho." },
  { name: "Branco frio", hex: "#EAF3FA", role: "Texto no tema escuro e fundos no tema claro." },
] as const;

export const typography = [
  {
    family: "Manrope",
    variable: "font-display",
    role: "Títulos",
    note: "Geométrica e contida. Pesos 500–600, entrelinha justa e espaçamento negativo.",
    sample: "Seu ambiente. Na temperatura perfeita.",
  },
  {
    family: "Inter",
    variable: "font-sans",
    role: "Textos e interface",
    note: "Leitura confortável em qualquer tamanho. Peso 400 para texto, 500 para ações.",
    sample: "Instalação profissional de ar-condicionado com precisão técnica e conforto em cada detalhe.",
  },
  {
    family: "JetBrains Mono",
    variable: "font-mono",
    role: "Dados e rótulos técnicos",
    note: "Caixa alta, corpo pequeno e espaçamento largo — como a etiqueta de um equipamento.",
    sample: "01 — SPLIT HI-WALL · 22°C",
  },
] as const;

export type NameOption = {
  name: string;
  origin: string;
  pronunciation: string;
  strengths: string;
  cautions: string;
  /** Nota de 1 a 5 em cada critério (avaliação de design, não pesquisa de mercado). */
  scores: { fala: number; memoria: number; visual: number; marca: number; clima: number };
  chosen?: boolean;
};

export const nameStudy: NameOption[] = [
  {
    name: "DCRYO",
    origin: "DCR (iniciais de referência) + CRYO (frio, em grego)",
    pronunciation: "dê-crio",
    strengths: "Curto, simétrico e tecnológico. Grafia incomum, o que favorece registro e domínio. Rende um bom símbolo com a letra D.",
    cautions: "A pronúncia não é óbvia à primeira leitura — vale reforçar “dê-crio” na comunicação falada.",
    scores: { fala: 3, memoria: 4, visual: 5, marca: 5, clima: 4 },
    chosen: true,
  },
  {
    name: "NEVO",
    origin: "De neve / névoa",
    pronunciation: "né-vo",
    strengths: "Quatro letras, sonoridade suave e totalmente natural em português. Elegante.",
    cautions: "Palavra curta e comum: maior chance de já existir como marca em outros segmentos.",
    scores: { fala: 5, memoria: 4, visual: 4, marca: 3, clima: 4 },
  },
  {
    name: "KLIMO",
    origin: "De clima / climatização",
    pronunciation: "clí-mo",
    strengths: "Relação direta com o serviço, fácil de falar e de lembrar. Formas redondas e simpáticas.",
    cautions: "Tom mais amigável do que premium; o K no lugar do C pode gerar erro de digitação.",
    scores: { fala: 5, memoria: 4, visual: 3, marca: 3, clima: 5 },
  },
  {
    name: "CRYON",
    origin: "De cryo + sufixo tecnológico",
    pronunciation: "crí-on",
    strengths: "Soa como marca de tecnologia; curto e forte.",
    cautions: "Construção muito usada em nomes de produtos — risco alto de conflito de marca.",
    scores: { fala: 4, memoria: 3, visual: 4, marca: 2, clima: 4 },
  },
  {
    name: "FROSTA",
    origin: "De frost (geada)",
    pronunciation: "frós-ta",
    strengths: "Fácil de pronunciar e de escrever; evoca frio imediatamente.",
    cautions: "Lembra o universo de alimentos congelados mais do que climatização.",
    scores: { fala: 5, memoria: 3, visual: 3, marca: 2, clima: 3 },
  },
  {
    name: "ARKTO",
    origin: "De Ártico (arktos)",
    pronunciation: "ár-qui-to",
    strengths: "Visual forte e geométrico, com letras angulosas. Passa robustez.",
    cautions: "Encontro “RKT” é difícil de falar em português; pede soletração.",
    scores: { fala: 2, memoria: 3, visual: 5, marca: 4, clima: 3 },
  },
  {
    name: "BRISAR",
    origin: "De brisa, como verbo inventado",
    pronunciation: "bri-zár",
    strengths: "Português, leve e positivo. Fala de conforto mais do que de frio.",
    cautions: "Menos tecnológico; pode soar como marca de ventiladores ou aromatizadores.",
    scores: { fala: 5, memoria: 3, visual: 3, marca: 3, clima: 4 },
  },
  {
    name: "DCR Clima",
    origin: "Iniciais + descrição do serviço",
    pronunciation: "dê-cê-erre clima",
    strengths: "Claro e direto: quem lê entende o que a empresa faz. Bom para busca local.",
    cautions: "Formato comum no setor — é justamente a cara de “assistência técnica” que o projeto quer evitar.",
    scores: { fala: 4, memoria: 2, visual: 2, marca: 2, clima: 5 },
  },
  {
    name: "ROBAIR",
    origin: "Roberto + air",
    pronunciation: "ro-bér",
    strengths: "Pessoal e com história; traz o nome do fundador.",
    cautions: "Pronúncia ambígua (ro-ba-ír / ro-bér) e tom caseiro; difícil de escalar.",
    scores: { fala: 2, memoria: 3, visual: 3, marca: 2, clima: 3 },
  },
];

export const criteria = [
  { key: "fala", label: "Pronúncia em português" },
  { key: "memoria", label: "Memorabilidade" },
  { key: "visual", label: "Aparência visual" },
  { key: "marca", label: "Potencial de marca e domínio" },
  { key: "clima", label: "Relação com climatização" },
] as const;

export const logoFiles = [
  { file: "dcryo-horizontal-fundo-escuro.svg", label: "Horizontal · fundo escuro", background: "#0B1424" },
  { file: "dcryo-horizontal-fundo-claro.svg", label: "Horizontal · fundo claro", background: "#F1F5F9" },
  { file: "dcryo-horizontal-branco.svg", label: "Horizontal · branca", background: "#1A3F75" },
  { file: "dcryo-horizontal-azul.svg", label: "Horizontal · azul", background: "#EAF3FA" },
  { file: "dcryo-simbolo-gradiente.svg", label: "Símbolo · gradiente gelo", background: "#070C18" },
  { file: "dcryo-simbolo-branco.svg", label: "Símbolo · branco", background: "#35577D" },
  { file: "dcryo-simbolo-azul.svg", label: "Símbolo · azul", background: "#EAF3FA" },
  { file: "dcryo-simbolo-marinho.svg", label: "Símbolo · marinho", background: "#A9C8E0" },
] as const;
