"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uSize;
  uniform float uFocus;
  uniform vec2 uPointer;
  uniform vec3 uBox;
  attribute float aSeed;
  varying float vAlpha;
  varying float vBlur;
  void main() {
    vec3 p = position;
    // deriva lenta: o ar frio desce e ondula
    float fall = uTime * (0.018 + aSeed * 0.03);
    p.y = mod(p.y - fall + uBox.y * 0.5, uBox.y) - uBox.y * 0.5;
    p.x += sin(uTime * 0.22 + aSeed * 40.0) * 0.12;
    p.z += cos(uTime * 0.17 + aSeed * 23.0) * 0.1;
    // leve reação ao cursor (paralaxe por profundidade)
    p.xy += uPointer * (0.06 + aSeed * 0.14);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float depth = -mv.z;
    float coc = clamp(abs(depth - uFocus) / 3.2, 0.0, 1.0); // círculo de confusão
    vBlur = coc;
    float twinkle = 0.65 + 0.35 * sin(uTime * (0.6 + aSeed) + aSeed * 90.0);
    vAlpha = mix(0.85, 0.09, coc) * twinkle;
    gl_PointSize = uSize * uPixelRatio * (0.45 + aSeed * 0.8) * (1.0 + coc * 3.4) / depth;
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vAlpha;
  varying float vBlur;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float soft = mix(0.42, 0.06, vBlur);
    float a = smoothstep(0.5, soft, d);
    gl_FragColor = vec4(uColor, a * vAlpha * uOpacity);
  }
`;

type ParticlesProps = {
  count: number;
  /** Volume (largura, altura, profundidade) em unidades de mundo. */
  width: number;
  height: number;
  depth?: number;
  pointer: React.RefObject<{ x: number; y: number }>;
  light?: boolean;
  focus?: number;
};

const DARK = new THREE.Color("#bcdcf5");
const LIGHT = new THREE.Color("#35577d");

/**
 * Partículas atmosféricas: gotículas e microcristais com profundidade de campo
 * (as fora de foco ficam maiores e mais tênues, como bokeh).
 */
export function Particles({ count, width, height, depth = 5, pointer, light = false, focus = 4.6 }: ParticlesProps) {
  const material = useRef<THREE.ShaderMaterial>(null);

  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    let s = 1337;
    const rand = () => {
      s = (s * 16807) % 2147483647;
      return s / 2147483647;
    };
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rand() - 0.5) * width;
      positions[i * 3 + 1] = (rand() - 0.5) * height;
      positions[i * 3 + 2] = (rand() - 0.5) * depth;
      seeds[i] = rand();
    }
    return { positions, seeds };
  }, [count, width, height, depth]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
      uSize: { value: 17 },
      uFocus: { value: 4.6 },
      uPointer: { value: new THREE.Vector2() },
      uBox: { value: new THREE.Vector3(1, 1, 1) },
      uColor: { value: new THREE.Color("#bcdcf5") },
      uOpacity: { value: 0.7 },
    }),
    [],
  );

  useFrame((state, delta) => {
    const u = material.current?.uniforms;
    if (!u) return;
    u.uTime.value += delta;
    u.uPixelRatio.value = state.gl.getPixelRatio();
    u.uFocus.value = focus;
    (u.uBox.value as THREE.Vector3).set(width, height, depth);
    (u.uColor.value as THREE.Color).copy(light ? LIGHT : DARK);
    u.uOpacity.value = light ? 0.38 : 0.7;
    const target = pointer.current;
    const p = u.uPointer.value as THREE.Vector2;
    p.x += (-target.x * 0.5 - p.x) * 0.04;
    p.y += (target.y * 0.5 - p.y) * 0.04;
  });

  return (
    <points key={`${count}-${Math.round(width * 10)}-${Math.round(height * 10)}`} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        args={[{ vertexShader: VERT, fragmentShader: FRAG, uniforms }]}
        transparent
        depthWrite={false}
        blending={light ? THREE.NormalBlending : THREE.AdditiveBlending}
      />
    </points>
  );
}
