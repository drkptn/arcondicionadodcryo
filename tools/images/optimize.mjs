/**
 * Otimiza as imagens do site: gera AVIF + WebP em várias larguras e o manifesto
 * usado pelo componente <Picture>.
 *
 *   npm run images                       → processa tools/images/source
 *   node tools/images/optimize.mjs <dir> → processa outra pasta
 *
 * Para trocar um render ilustrativo por uma foto real, salve a foto em
 * tools/images/source com o MESMO nome (ex.: sala.jpg) e rode `npm run images`.
 */
import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const sourceDir = path.resolve(process.argv[2] ?? path.join(root, "tools/images/source"));
const outDir = path.join(root, "public/images");
const manifestPath = path.join(root, "src/config/images.generated.json");
const WIDTHS = [480, 800, 1200, 1600, 2000];

await mkdir(outDir, { recursive: true });
const files = (await readdir(sourceDir)).filter((f) => /\.(png|jpe?g|webp|tiff?)$/i.test(f)).sort();
const manifest = {};

for (const file of files) {
  const name = path.parse(file).name;
  const input = path.join(sourceDir, file);
  const meta = await sharp(input).metadata();
  const alpha = Boolean(meta.hasAlpha) && name.startsWith("product");
  const widths = WIDTHS.filter((w) => w <= meta.width);
  if (!widths.length || widths.at(-1) < Math.min(meta.width, WIDTHS.at(-1))) widths.push(Math.min(meta.width, WIDTHS.at(-1)));

  for (const w of widths) {
    let pipeline = sharp(input).resize({ width: w, withoutEnlargement: true });
    if (!alpha) {
      // Tratamento de cor da marca: leve contraste e dessaturação para unificar a galeria.
      pipeline = pipeline.flatten({ background: "#070c18" }).modulate({ saturation: 0.94 }).linear(1.04, -4);
    }
    await pipeline.clone().avif({ quality: alpha ? 62 : 54, effort: 5 }).toFile(path.join(outDir, `${name}-${w}.avif`));
    await pipeline.clone().webp({ quality: alpha ? 84 : 78, effort: 5 }).toFile(path.join(outDir, `${name}-${w}.webp`));
  }

  const blur = alpha
    ? null
    : `data:image/webp;base64,${(await sharp(input).resize({ width: 24 }).webp({ quality: 40 }).toBuffer()).toString("base64")}`;

  manifest[name] = { width: meta.width, height: meta.height, widths, alpha, blur };
  console.log(`✓ ${name}  ${meta.width}×${meta.height}  [${widths.join(", ")}]`);
}

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`\nManifesto: ${path.relative(root, manifestPath)}`);
