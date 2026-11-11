# DCRYO — Climatização · Instalação · Conforto

Landing page da DCRYO, empresa de instalação de ar-condicionado e climatização.
Site estático (Next.js) com hero 3D, tema claro/escuro, simulador de orçamento,
galeria com lightbox e integração com WhatsApp.

## Rodando o projeto

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # gera o site estático em ./out
npm run lint
npm run typecheck
```

Requer Node.js 20 ou superior.

## Antes de publicar — o que só a empresa pode informar

Nada no site foi inventado: telefone, endereço, cidades, CNPJ, números e depoimentos
ficam **vazios até serem preenchidos**. Campos vazios não aparecem para o visitante.

| O quê | Onde |
| --- | --- |
| Número do WhatsApp, URL do site, e-mail, endpoint do formulário | `.env.local` (modelo em `.env.example`) |
| Telefone por extenso, área de atendimento, cidades, horário, razão social, CNPJ, redes sociais | `src/config/site.ts` |
| Serviços, textos, perguntas frequentes, galeria | `src/config/content.ts` |
| Depoimentos (somente avaliações reais) | `testimonials` em `src/config/content.ts` |
| Data e texto da política de privacidade | `src/app/privacidade/page.tsx` |

Sem `NEXT_PUBLIC_WHATSAPP_NUMBER`, os botões abrem o WhatsApp com a mensagem pronta e o
visitante escolhe o contato — funciona, mas configure o número antes de divulgar o site.

### Formulário de contato

- **Sem endpoint configurado:** o formulário valida os dados e envia pelo WhatsApp.
- **Com `NEXT_PUBLIC_FORM_ENDPOINT`:** os dados são enviados por `POST` em JSON
  (`nome`, `telefone`, `email`, `cidade`, `servico`, `ambiente`, `mensagem`, `origem`).
  Qualquer serviço que aceite JSON funciona (Formspree, Getform, Basin, webhook próprio).
  Se o envio falhar, o visitante recebe a opção de mandar os mesmos dados pelo WhatsApp.

## Estrutura

```
src/
  app/                 páginas: início, /privacidade, /marca, 404, sitemap, robots, manifesto
  config/
    site.ts            dados da empresa (fonte única)
    content.ts         textos, serviços, FAQ, galeria, depoimentos
    brand.ts           paleta, tipografia e estudo de nomes (página /marca)
  components/
    sections/          Hero, About, Services, ProductShowcase, Process, Gallery,
                       Benefits, BudgetSimulator, Testimonials, FAQ, Contact
    layout/            Header, Footer, ThemeToggle, WhatsAppButton, CustomCursor, Preloader
    three/             cena 3D (React Three Fiber): split, partículas, fluxo de ar
    ui/                Button, TiltCard, Reveal, Field, Lightbox, Picture, Condensation…
    brand/ · icons/    logotipo e conjunto de ícones próprios (SVG)
    effects/           oceano procedural (shader WebGL)
public/
  models/split.glb     modelo 3D da unidade interna
  images/              imagens otimizadas (AVIF + WebP)
  brand/               versões do logotipo em SVG e ícones
tools/
  3d/                  scripts Blender (Python) que geram o modelo e os renders
  images/              otimização de imagens e geração dos arquivos da marca
```

## Imagens

As imagens da galeria são **renders 3D ilustrativos** — e estão identificadas assim no site.
Para trocar por fotos reais:

1. Salve a foto em `tools/images/source` com o **mesmo nome** do render (ex.: `sala.jpg`).
2. Rode `npm run images` — gera AVIF/WebP em vários tamanhos e atualiza o manifesto.
3. Ajuste título e descrição em `gallery` (`src/config/content.ts`) e remova o aviso
   `galleryNote` quando a galeria for só de fotos reais.

## Modelo 3D e renders

O split do hero é um modelo próprio, gerado por código (`tools/3d/ac_model.py`) e exportado
para `public/models/split.glb` (~130 KB). Os mesmos scripts produzem os renders da galeria.

```bash
pip install bpy            # módulo Python do Blender
npm run 3d:model           # regenera public/models/split.glb
npm run 3d:renders         # renderiza as cenas em tools/images/source (demorado)
npm run images             # otimiza para public/images
```

No navegador, a cena usa iluminação procedural (sem HDRI externo), pausa quando sai da tela,
reduz a resolução em aparelhos lentos e é substituída por uma imagem quando não há WebGL ou
quando o visitante prefere menos movimento.

## Identidade visual

A página `/marca` (não indexada) reúne símbolo, versões do logotipo, paleta, tipografia,
ícones, padrões e o estudo de nomes. Os SVGs ficam em `public/brand`; para regenerá-los
(e o favicon): `node tools/images/brand-assets.mjs`.

> O nome DCRYO é uma proposta. Antes de registrar, verifique a disponibilidade da marca
> (INPI) e do domínio.

## Publicação

O build gera HTML/CSS/JS estáticos em `out/` — hospede em Vercel, Netlify, Cloudflare Pages,
GitHub Pages ou qualquer servidor de arquivos. Para publicar em subpasta, defina
`NEXT_PUBLIC_BASE_PATH` (ex.: `/arcondicionadodcryo`) antes do build.

Defina `NEXT_PUBLIC_SITE_URL` com o domínio final: ele alimenta o sitemap, o `robots.txt`,
as tags Open Graph e os dados estruturados (schema.org).

## Acessibilidade e desempenho

- Navegação completa por teclado, foco visível, rótulos em todos os campos, textos alternativos.
- `prefers-reduced-motion`: animações, rolagem suave, cursor e 3D são desativados.
- Em telas de toque não há cursor personalizado nem efeitos de mouse.
- Imagens responsivas em AVIF/WebP com carregamento tardio; 3D carregado sob demanda.
