/**
 * Gera os arquivos da identidade a partir do desenho da marca:
 *   - favicon (src/app/icon.svg, favicon.ico, apple-icon.png) e ícones do manifesto
 *   - versões do logotipo em SVG (public/brand)
 *
 *   node tools/images/brand-assets.mjs
 *
 * Os traçados abaixo espelham src/components/brand/Logo.tsx — altere nos dois lugares.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const brandDir = path.join(root, "public/brand");
const appDir = path.join(root, "src/app");
await mkdir(brandDir, { recursive: true });

const D = "M13 6H23A18 18 0 0 1 23 42H13A2 2 0 0 1 11 40V8A2 2 0 0 1 13 6Z";
const WAVES = ["M5 19.6C13 14.4 20 14.6 26.5 18.6S38.5 22.8 46 17.2", "M5 31.6C13 26.4 20 26.6 26.5 30.6S38.5 34.8 46 29.2"];
const WORD = [
  "M2.2 14H9A10 10 0 0 1 9 34H2.2Z",
  "M43.4 16.9A10 10 0 1 0 43.4 31.1",
  "M52.6 36.1V14H61A6.1 6.1 0 0 1 61 26.2H52.6M61.2 26.2L69.2 36.1",
  "M74.6 12.4L85.4 25.2L96.2 12.4M85.4 25.2V36.1",
  "M112.2 14A10 10 0 1 0 112.2 34A10 10 0 1 0 112.2 14Z",
];

const GRADIENTS = {
  ice: ["#EAF3FA", "#A9C8E0", "#4F7DAE"],
  ocean: ["#35577D", "#1A3F75", "#141E30"],
};

const defs = (fill, waveWidth = 3.3) => `
  <defs>
    <mask id="m" maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48">
      <path d="${D}" fill="#fff"/>
      ${WAVES.map((w) => `<path d="${w}" stroke="#000" stroke-width="${waveWidth}" stroke-linecap="round" fill="none"/>`).join("")}
    </mask>
    ${
      Array.isArray(fill)
        ? `<linearGradient id="g" x1="12" y1="6" x2="34" y2="42" gradientUnits="userSpaceOnUse"><stop stop-color="${fill[0]}"/><stop offset=".5" stop-color="${fill[1]}"/><stop offset="1" stop-color="${fill[2]}"/></linearGradient>`
        : ""
    }
  </defs>`;
const paint = (fill) => (Array.isArray(fill) ? "url(#g)" : fill);

const symbolSvg = (fill, background) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="512" height="512">${defs(fill)}
  ${background ? `<rect width="48" height="48" fill="${background}"/>` : ""}
  <rect width="48" height="48" fill="${paint(fill)}" mask="url(#m)"/>
</svg>
`;

const horizontalSvg = (symbolFill, wordColor, background) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 208 64" width="832" height="256">${defs(symbolFill)}
  ${background ? `<rect width="208" height="64" fill="${background}"/>` : ""}
  <g transform="translate(8 8)"><rect width="48" height="48" fill="${paint(symbolFill)}" mask="url(#m)"/></g>
  <g transform="translate(70 12.2) scale(.826)" fill="none" stroke="${wordColor}" stroke-width="4.4" stroke-linejoin="round">
    ${WORD.map((d) => `<path d="${d}"/>`).join("")}
  </g>
</svg>
`;

/** Favicon: símbolo simplificado (ondas mais largas) sobre fundo azul-marinho arredondado. */
const iconSvg = (radius = 11, pad = 0.8) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">${defs(GRADIENTS.ice, 4)}
  <rect width="48" height="48" rx="${radius}" fill="#0B1424"/>
  <g transform="translate(24 24) scale(${pad}) translate(-25.5 -24)"><rect width="48" height="48" fill="url(#g)" mask="url(#m)"/></g>
</svg>
`;

const files = {
  "dcryo-simbolo-gradiente.svg": symbolSvg(GRADIENTS.ice),
  "dcryo-simbolo-branco.svg": symbolSvg("#EAF3FA"),
  "dcryo-simbolo-azul.svg": symbolSvg("#1A3F75"),
  "dcryo-simbolo-marinho.svg": symbolSvg("#141E30"),
  "dcryo-horizontal-fundo-escuro.svg": horizontalSvg(GRADIENTS.ice, "#EAF3FA", "#0B1424"),
  "dcryo-horizontal-fundo-claro.svg": horizontalSvg(GRADIENTS.ocean, "#141E30", "#F1F5F9"),
  "dcryo-horizontal-branco.svg": horizontalSvg("#EAF3FA", "#EAF3FA"),
  "dcryo-horizontal-azul.svg": horizontalSvg("#1A3F75", "#1A3F75"),
  "dcryo-horizontal-marinho.svg": horizontalSvg("#141E30", "#141E30"),
};
for (const [name, svg] of Object.entries(files)) await writeFile(path.join(brandDir, name), svg);

await writeFile(path.join(appDir, "icon.svg"), iconSvg());
const png = (svg, size) => sharp(Buffer.from(svg), { density: 600 }).resize(size, size).png().toBuffer();
await writeFile(path.join(appDir, "apple-icon.png"), await png(iconSvg(0, 0.74), 180));
await writeFile(path.join(brandDir, "icon-192.png"), await png(iconSvg(), 192));
await writeFile(path.join(brandDir, "icon-512.png"), await png(iconSvg(), 512));
await writeFile(path.join(brandDir, "icon-maskable-512.png"), await png(iconSvg(0, 0.62), 512));

// favicon.ico (PNG embutido em 16, 32 e 48 px)
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map((size) => png(iconSvg(size === 16 ? 9 : 11, size === 16 ? 0.92 : 0.84), size)));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((size, index) => {
  const at = 6 + index * 16;
  header.writeUInt8(size, at);
  header.writeUInt8(size, at + 1);
  header.writeUInt16LE(1, at + 4);
  header.writeUInt16LE(32, at + 6);
  header.writeUInt32LE(images[index].length, at + 8);
  header.writeUInt32LE(offset, at + 12);
  offset += images[index].length;
});
await writeFile(path.join(appDir, "favicon.ico"), Buffer.concat([header, ...images]));

console.log(`✓ ${Object.keys(files).length} versões do logotipo em public/brand`);
console.log("✓ favicon (icon.svg, favicon.ico, apple-icon.png) e ícones do manifesto");
