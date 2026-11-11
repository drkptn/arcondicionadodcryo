/**
 * CONTEÚDO DO SITE
 * Textos, serviços, perguntas frequentes, galeria e depoimentos.
 * Edite aqui sem precisar mexer nos componentes.
 */
import type { IconName } from "@/components/icons";

// ---------------------------------------------------------------------------
// Serviços
// ---------------------------------------------------------------------------
export type Service = {
  id: string;
  title: string;
  /** Nome curto usado nos formulários. */
  short: string;
  description: string;
  icon: IconName;
  /** Nome da imagem (public/images) — só nos cards de destaque. */
  image?: string;
  imageAlt?: string;
  points?: string[];
};

export const services: Service[] = [
  {
    id: "split",
    title: "Instalação de ar-condicionado Split",
    short: "Instalação de Split",
    description:
      "Unidade interna nivelada, tubulação dimensionada, vácuo no sistema e teste de funcionamento. Instalação limpa, do suporte ao acabamento.",
    icon: "split",
    image: "detalhe_acabamento",
    imageAlt: "Render ilustrativo de um split instalado com canaleta de acabamento alinhada",
    points: ["Fixação e nivelamento", "Vácuo e teste de estanqueidade", "Acabamento da tubulação"],
  },
  {
    id: "inverter",
    title: "Instalação de ar-condicionado Inverter",
    short: "Instalação de Inverter",
    description:
      "Equipamentos Inverter pedem procedimento rigoroso para entregar a economia que prometem. Seguimos as recomendações do fabricante em cada etapa.",
    icon: "inverter",
    image: "detalhe_display",
    imageAlt: "Render ilustrativo do painel de um split com display de temperatura aceso",
    points: ["Procedimento conforme fabricante", "Carga e pressões conferidas"],
  },
  {
    id: "residencial",
    title: "Instalação residencial",
    short: "Instalação residencial",
    description:
      "Quartos, salas e home offices climatizados com discrição: ponto de instalação pensado para o conforto, a estética e o silêncio do ambiente.",
    icon: "home",
    image: "quarto",
    imageAlt: "Render ilustrativo de um quarto com split instalado sobre parede azul",
  },
  {
    id: "comercial",
    title: "Instalação para ambientes comerciais",
    short: "Instalação comercial",
    description:
      "Lojas, escritórios, consultórios e recepções. Planejamos a distribuição dos aparelhos para manter clientes e equipe confortáveis.",
    icon: "building",
    image: "comercial",
    imageAlt: "Render ilustrativo de uma recepção comercial com dois splits instalados",
  },
  {
    id: "desinstalacao",
    title: "Desinstalação de equipamentos",
    short: "Desinstalação",
    description:
      "Retirada segura do aparelho, com recolhimento do fluido refrigerante e proteção das conexões para reaproveitamento.",
    icon: "uninstall",
  },
  {
    id: "remanejamento",
    title: "Remanejamento de aparelhos",
    short: "Remanejamento",
    description:
      "Vai mudar o layout ou de endereço? Retiramos e reinstalamos seu equipamento no novo ponto, revisando a infraestrutura.",
    icon: "move",
  },
  {
    id: "manutencao",
    title: "Manutenção preventiva",
    short: "Manutenção preventiva",
    description:
      "Verificação periódica de componentes, conexões e desempenho para evitar falhas e prolongar a vida útil do aparelho.",
    icon: "maintenance",
  },
  {
    id: "limpeza",
    title: "Limpeza e higienização",
    short: "Limpeza e higienização",
    description:
      "Limpeza de filtros, serpentina e bandeja de dreno. Ar mais saudável, menos odores e melhor rendimento.",
    icon: "clean",
  },
  {
    id: "avaliacao",
    title: "Avaliação técnica",
    short: "Avaliação técnica",
    description:
      "Analisamos o ambiente, a parte elétrica e o trajeto da tubulação antes de qualquer serviço — sem achismo.",
    icon: "inspect",
  },
  {
    id: "orientacao",
    title: "Orientação para escolha de equipamentos",
    short: "Orientação de compra",
    description:
      "Ainda não comprou? Ajudamos a definir capacidade, tipo e tecnologia ideais para o seu espaço e o seu orçamento.",
    icon: "guide",
  },
];

// ---------------------------------------------------------------------------
// Sobre — princípios (sem números inventados)
// ---------------------------------------------------------------------------
export const principles = [
  {
    title: "Precisão",
    text: "Nível, vácuo, torque e carga conferidos. Instalação é técnica, não improviso.",
  },
  {
    title: "Cuidado",
    text: "Ambiente protegido durante o serviço e entregue limpo e organizado.",
  },
  {
    title: "Transparência",
    text: "Orçamento detalhado antes de começar. Sem custo surpresa no final.",
  },
];

// ---------------------------------------------------------------------------
// Tecnologia — recursos apresentados na vitrine 3D
// ---------------------------------------------------------------------------
export type FeatureView = "design" | "eficiencia" | "inverter" | "ar" | "controle" | "silencio";

export const features: { id: FeatureView; label: string; title: string; text: string; icon: IconName }[] = [
  {
    id: "design",
    label: "Design",
    title: "Presença discreta",
    text: "Linhas contínuas, painel liso e acabamento sóbrio: o aparelho deixa de ser um ruído visual e passa a compor o ambiente.",
    icon: "design",
  },
  {
    id: "eficiencia",
    label: "Eficiência energética",
    title: "Mais conforto por quilowatt",
    text: "A etiqueta de eficiência do Inmetro mostra quanto cada modelo entrega pela energia que consome. Ajudamos você a comparar antes de comprar.",
    icon: "leaf",
  },
  {
    id: "inverter",
    label: "Tecnologia Inverter",
    title: "Potência sob medida",
    text: "Em vez de ligar e desligar, o compressor ajusta a rotação continuamente. O resultado é temperatura estável e menos picos de consumo.",
    icon: "inverter",
  },
  {
    id: "ar",
    label: "Distribuição de ar",
    title: "O ar no lugar certo",
    text: "A posição da unidade e o direcionamento das aletas definem como o ar circula. Planejamos o ponto de instalação para evitar jatos diretos e zonas quentes.",
    icon: "airflow",
  },
  {
    id: "controle",
    label: "Controle de temperatura",
    title: "Ajuste fino",
    text: "Modos de operação, programação e, em muitos modelos, controle pelo celular. No dia da instalação, deixamos tudo configurado e explicado.",
    icon: "thermo",
  },
  {
    id: "silencio",
    label: "Silêncio operacional",
    title: "Conforto que não se ouve",
    text: "Unidade bem fixada, nivelada e com tubulação correta vibra menos e faz menos ruído — a instalação pesa tanto quanto o aparelho.",
    icon: "silence",
  },
];

// ---------------------------------------------------------------------------
// Como funciona
// ---------------------------------------------------------------------------
export const steps: { title: string; text: string; icon: IconName }[] = [
  {
    title: "Entre em contato",
    text: "Pelo WhatsApp ou pelo formulário. Respondemos com as primeiras orientações.",
    icon: "chat",
  },
  {
    title: "Conte sobre o ambiente",
    text: "Tamanho, tipo de espaço e equipamento desejado ou já comprado. Fotos ajudam bastante.",
    icon: "room",
  },
  {
    title: "Receba avaliação e orçamento",
    text: "Analisamos as informações e enviamos um orçamento detalhado, item por item.",
    icon: "quote",
  },
  {
    title: "Agende a instalação",
    text: "Combinamos data e horário. No dia, instalação, testes e orientações de uso.",
    icon: "calendar",
  },
];

// ---------------------------------------------------------------------------
// Diferenciais
// ---------------------------------------------------------------------------
export const benefits: { title: string; text: string; icon: IconName }[] = [
  {
    title: "Atendimento personalizado",
    text: "Cada ambiente é único. Ouvimos sua necessidade antes de propor qualquer solução.",
    icon: "person",
  },
  {
    title: "Organização durante a instalação",
    text: "Móveis e piso protegidos, ferramentas no lugar e ambiente limpo ao final.",
    icon: "organize",
  },
  {
    title: "Atenção aos detalhes",
    text: "Alinhamento, acabamento da tubulação e posição do dreno: o que não aparece também importa.",
    icon: "detail",
  },
  {
    title: "Avaliação técnica",
    text: "Parte elétrica, estrutura e trajeto da tubulação verificados antes do serviço.",
    icon: "inspect",
  },
  {
    title: "Transparência no orçamento",
    text: "Você sabe exatamente o que está incluído — materiais, mão de obra e eventuais adicionais.",
    icon: "quote",
  },
  {
    title: "Compromisso com a qualidade",
    text: "Procedimentos corretos e materiais adequados para o equipamento render o que promete.",
    icon: "shield",
  },
  {
    title: "Orientação ao cliente",
    text: "Explicamos o uso, a limpeza dos filtros e os cuidados para o aparelho durar mais.",
    icon: "guide",
  },
];

// ---------------------------------------------------------------------------
// Galeria — IMAGENS ILUSTRATIVAS (renders 3D). Substitua por fotos reais:
// coloque os arquivos em tools/images/source e rode `npm run images`.
// ---------------------------------------------------------------------------
export type GalleryCategory = "residencial" | "comercial" | "detalhes";

export type GalleryItem = {
  image: string;
  title: string;
  place: string;
  category: GalleryCategory;
  alt: string;
  /** Classes de grid (colunas/linhas) no desktop. */
  layout: string;
};

export const galleryNote =
  "Imagens ilustrativas (renders 3D). Esta galeria será atualizada com fotos de instalações realizadas.";

export const gallery: GalleryItem[] = [
  {
    image: "sala",
    title: "Sala de estar",
    place: "Residencial",
    category: "residencial",
    alt: "Render ilustrativo: sala de estar com sofá azul-marinho e split instalado na parede",
    layout: "lg:col-span-8 lg:row-span-3",
  },
  {
    image: "quarto",
    title: "Suíte",
    place: "Residencial",
    category: "residencial",
    alt: "Render ilustrativo: quarto ao entardecer com split sobre parede azul",
    layout: "lg:col-span-4 lg:row-span-5",
  },
  {
    image: "detalhe_display",
    title: "Painel e display",
    place: "Detalhe",
    category: "detalhes",
    alt: "Render ilustrativo: detalhe do painel frontal de um split com display aceso",
    layout: "lg:col-span-4 lg:row-span-2",
  },
  {
    image: "escritorio",
    title: "Home office",
    place: "Residencial",
    category: "residencial",
    alt: "Render ilustrativo: escritório com mesa de madeira e split instalado",
    layout: "lg:col-span-4 lg:row-span-2",
  },
  {
    image: "comercial",
    title: "Recepção",
    place: "Comercial",
    category: "comercial",
    alt: "Render ilustrativo: recepção comercial com balcão de madeira e dois splits",
    layout: "lg:col-span-8 lg:row-span-3",
  },
  {
    image: "detalhe_acabamento",
    title: "Acabamento da tubulação",
    place: "Detalhe",
    category: "detalhes",
    alt: "Render ilustrativo: split visto de baixo com aleta aberta e canaleta alinhada",
    layout: "lg:col-span-4 lg:row-span-4",
  },
  {
    image: "reuniao",
    title: "Sala de reunião",
    place: "Comercial",
    category: "comercial",
    alt: "Render ilustrativo: sala de reunião com mesa longa e split na parede azul",
    layout: "lg:col-span-8 lg:row-span-3",
  },
];

// ---------------------------------------------------------------------------
// Depoimentos — adicione APENAS avaliações reais de clientes.
// Enquanto a lista estiver vazia, o site mostra um convite à avaliação.
//
// Exemplo de preenchimento:
//   { name: "Nome do cliente", rating: 5, text: "Comentário…", date: "2026-03", service: "Instalação de Split" }
// ---------------------------------------------------------------------------
export type Testimonial = {
  name: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  /** Formato AAAA-MM (opcional). */
  date?: string;
  service?: string;
};

export const testimonials: Testimonial[] = [];

// ---------------------------------------------------------------------------
// Perguntas frequentes
// ---------------------------------------------------------------------------
export const faq: { q: string; a: string }[] = [
  {
    q: "Quanto custa instalar um ar-condicionado?",
    a: "Depende da capacidade do aparelho, da distância entre as unidades interna e externa, da infraestrutura existente (tubulação, dreno e ponto elétrico) e do acesso ao local. Por isso não trabalhamos com preço único: depois de entender o seu ambiente, enviamos um orçamento detalhado para você decidir com tranquilidade.",
  },
  {
    q: "Qual a diferença entre Split e Inverter?",
    a: "“Split” é o formato do aparelho: uma unidade interna (evaporadora) e uma externa (condensadora). “Inverter” é a tecnologia do compressor, que varia a rotação para manter a temperatura em vez de ligar e desligar. Existem splits convencionais e splits Inverter — estes costumam consumir menos energia e ser mais silenciosos, com valor de compra maior.",
  },
  {
    q: "Como escolher a capacidade em BTUs?",
    a: "A capacidade ideal considera a área, o pé-direito, a incidência de sol, o número de pessoas e os equipamentos que geram calor. Uma referência inicial comum fica entre 600 e 800 BTU/h por m², mas é apenas um ponto de partida: aparelho pequeno demais não dá conta, e grande demais gasta mais e controla mal a umidade. Na avaliação técnica indicamos a capacidade adequada.",
  },
  {
    q: "É necessário preparar a infraestrutura?",
    a: "Em geral, sim: ponto elétrico dedicado com disjuntor adequado, passagem para a tubulação de cobre, ponto de dreno e local apropriado para a condensadora. Em imóveis novos é comum a infraestrutura já estar pronta. Quando não está, avaliamos o que precisa ser feito e incluímos no orçamento.",
  },
  {
    q: "Quanto tempo demora uma instalação?",
    a: "Uma instalação padrão, com infraestrutura pronta e fácil acesso, costuma ser concluída no mesmo dia. Casos que exigem novas passagens, longas distâncias de tubulação ou trabalho em altura podem levar mais tempo — a previsão é informada junto com o orçamento.",
  },
  {
    q: "A empresa realiza instalação em apartamentos?",
    a: "Sim. Em condomínios, vale conferir antes as regras do prédio: local permitido para a condensadora, padrão de fachada, horários para serviços e eventual necessidade de autorização. Orientamos você sobre o que verificar com a administração.",
  },
  {
    q: "Vocês atendem empresas e comércios?",
    a: "Sim. Atendemos escritórios, lojas, consultórios e outros espaços comerciais, com planejamento para reduzir o impacto do serviço na rotina do local.",
  },
  {
    q: "É possível instalar um equipamento já adquirido?",
    a: "Sim. Se você já comprou o aparelho, informe marca, modelo e capacidade para prepararmos o orçamento da instalação. Se ainda não comprou, podemos orientar a escolha antes.",
  },
  {
    q: "Como funciona o agendamento?",
    a: "Depois de aprovar o orçamento, combinamos data e horário conforme a sua disponibilidade e a nossa agenda. No dia, além da instalação e dos testes, você recebe as orientações de uso e de cuidados com o equipamento.",
  },
  {
    q: "Como solicitar um orçamento?",
    a: "Pelo WhatsApp, pelo formulário de contato ou pelo simulador desta página. Quanto mais detalhes do ambiente e do aparelho você enviar — fotos ajudam bastante —, mais preciso fica o orçamento.",
  },
];

// ---------------------------------------------------------------------------
// Opções dos formulários
// ---------------------------------------------------------------------------
export const environmentTypes = [
  "Sala",
  "Quarto",
  "Home office",
  "Escritório",
  "Loja ou comércio",
  "Consultório ou clínica",
  "Outro",
] as const;

export const equipmentTypes = [
  { id: "hiwall", label: "Split Hi-Wall", hint: "O modelo de parede mais comum" },
  { id: "inverter", label: "Split Inverter", hint: "Mais econômico e silencioso" },
  { id: "pisoteto", label: "Piso-teto", hint: "Ambientes amplos" },
  { id: "cassete", label: "Cassete", hint: "Embutido no forro" },
  { id: "naosei", label: "Ainda não sei", hint: "Quero orientação" },
] as const;

export const btuOptions = ["Não sei", "9.000", "12.000", "18.000", "24.000", "30.000 ou mais"] as const;

export const ownershipOptions = [
  { id: "sim", label: "Sim, já tenho" },
  { id: "nao", label: "Ainda não" },
  { id: "orientacao", label: "Quero ajuda para escolher" },
] as const;
