"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uPointer;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float a = 0.5, s = 0.0;
  for (int i = 0; i < 5; i++) { s += a * noise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; }
  return s;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  // perspectiva: o topo da tela é o horizonte, distante
  float depth = 1.0 / max(0.05, 1.08 - uv.y);
  vec2 p = vec2((uv.x - 0.5) * aspect * depth * 1.15, depth * 1.6);
  float t = uTime * 0.055;
  p += (uPointer - 0.5) * 0.25;

  // ondulação longa (domain warping) + cristas
  vec2 q = p + 1.5 * vec2(fbm(p * 0.55 + vec2(t, -t * 0.6)), fbm(p * 0.55 + vec2(-t * 0.7, t) + 5.2));
  float swell = fbm(q * 0.9 + vec2(t * 1.2, t * 0.5));
  float crest = 1.0 - abs(2.0 * fbm(q * 2.1 - vec2(t * 1.6, t * 0.4)) - 1.0);
  float foam = pow(crest, 7.0) * smoothstep(0.42, 0.72, swell);
  float fine = pow(1.0 - abs(2.0 * fbm(q * 5.5 + t * 2.0) - 1.0), 10.0) * 0.35;

  vec3 abyss = vec3(0.0, 0.004, 0.045);
  vec3 navy = vec3(0.03, 0.065, 0.14);
  vec3 ocean = vec3(0.07, 0.19, 0.38);
  vec3 ice = vec3(0.72, 0.84, 0.93);

  vec3 col = mix(abyss, navy, smoothstep(0.2, 0.55, swell));
  col = mix(col, ocean, smoothstep(0.52, 0.86, swell) * 0.75);
  col += ice * (foam * 0.55 + fine * smoothstep(0.5, 0.8, swell) * 0.4);

  // névoa em direção ao horizonte e vinheta
  float haze = smoothstep(0.25, 1.0, uv.y);
  col = mix(col, abyss, haze * haze * 0.9);
  float vig = smoothstep(1.25, 0.35, length((uv - 0.5) * vec2(1.0, 1.25)));
  col *= mix(0.55, 1.0, vig);
  gl_FragColor = vec4(col, 1.0);
}
`;

/**
 * Oceano profundo à noite — shader procedural (WebGL puro, sem bibliotecas).
 * Renderiza em baixa resolução, pausa fora da tela e vira quadro estático com
 * "prefers-reduced-motion". Sem WebGL, o gradiente CSS de fundo permanece.
 */
export function OceanCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const location = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "uRes");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uPointer = gl.getUniformLocation(program, "uPointer");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    let raf = 0;
    let running = false;
    let time = 12;
    let last = performance.now();

    const resize = () => {
      const scale = Math.min(0.6, 900 / Math.max(1, canvas.clientWidth));
      canvas.width = Math.max(2, Math.round(canvas.clientWidth * scale));
      canvas.height = Math.max(2, Math.round(canvas.clientHeight * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      if (!running) draw();
    };
    const draw = () => {
      gl.uniform1f(uTime, time);
      gl.uniform2f(uPointer, pointer.x, pointer.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const frame = (now: number) => {
      time += Math.min(0.05, (now - last) / 1000);
      last = now;
      pointer.x += (pointer.tx - pointer.x) * 0.03;
      pointer.y += (pointer.ty - pointer.y) * 0.03;
      draw();
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (running || reduce) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointer.tx = event.clientX / window.innerWidth;
      pointer.ty = 1 - event.clientY / window.innerHeight;
    };

    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), { rootMargin: "100px" });
    io.observe(canvas);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener("pointermove", onMove, { passive: true });
    resize();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={cn("size-full", className)} />;
}
