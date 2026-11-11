import * as THREE from "three";

const SEGMENTS: Record<string, string> = {
  "0": "abcdef",
  "1": "bc",
  "2": "abged",
  "3": "abgcd",
  "4": "fgbc",
  "5": "afgcd",
  "6": "afgedc",
  "7": "abc",
  "8": "abcdefg",
  "9": "abcdfg",
  C: "afed",
};

const W = 512;
const H = 218;

function digit(ctx: CanvasRenderingContext2D, ch: string, x0: number, y0: number, dw: number, dh: number, t: number) {
  const hl = dw - t * 1.7;
  const vl = dh / 2 - t * 1.6;
  const seg: Record<string, [number, number, number, number]> = {
    a: [x0 + t * 0.85, y0, hl, t],
    g: [x0 + t * 0.85, y0 + dh / 2 - t / 2, hl, t],
    d: [x0 + t * 0.85, y0 + dh - t, hl, t],
    f: [x0, y0 + t * 0.8, t, vl],
    b: [x0 + dw - t, y0 + t * 0.8, t, vl],
    e: [x0, y0 + dh / 2 + t * 0.8, t, vl],
    c: [x0 + dw - t, y0 + dh / 2 + t * 0.8, t, vl],
  };
  for (const s of SEGMENTS[ch] ?? "") {
    const [x, y, w, h] = seg[s];
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, t / 2);
    ctx.fill();
  }
}

function draw(ctx: CanvasRenderingContext2D, value: number) {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#3d9df5";
  ctx.shadowColor = "rgba(61, 157, 245, 0.9)";
  ctx.shadowBlur = 18;
  const text = String(Math.round(value)).padStart(2, "0");
  const dw = 74;
  const dh = 132;
  const t = 13;
  let x = 120;
  const y0 = (H - dh) / 2;
  for (const ch of text) {
    digit(ctx, ch, x, y0, dw, dh, t);
    x += dw + 26;
  }
  // grau + C
  ctx.lineWidth = 6.4;
  ctx.strokeStyle = "#3d9df5";
  ctx.beginPath();
  ctx.arc(x + 10, y0 + 16, 11, 0, Math.PI * 2);
  ctx.stroke();
  digit(ctx, "C", x + 34, y0, 34, 62, 7);
}

/** Textura do display do aparelho (dígitos de 7 segmentos), redesenhada a cada mudança de temperatura. */
export function createDisplayTexture(initial: number) {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  draw(ctx, initial);
  const texture = new THREE.CanvasTexture(canvas);
  texture.flipY = false;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return {
    texture,
    set(value: number) {
      draw(ctx, value);
      texture.needsUpdate = true;
    },
    dispose() {
      texture.dispose();
    },
  };
}
