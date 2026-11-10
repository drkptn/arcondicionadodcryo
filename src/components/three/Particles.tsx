"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
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
    vAlpha = mix(0.9, 0.16, coc) * twinkle;
    gl_PointSize = uSize * uPixelRatio * (0.55 + aSeed * 0.9) * (1.0 + coc * 5.5) / depth;
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
  box?: [number, number, number];
  pointer: React.RefObject<{ x: number; y: number }>;
  light?: boolean;
  focus?: number;
};

/**
 * Partículas atmosféricas: gotículas e microcristais com profundidade de campo
 * (as fora de foco ficam maiores e mais tênues, como bokeh).
 */
export function Particles({ count, box = [9, 5.5, 5], pointer, light = false, focus = 4.6 }: ParticlesProps) {
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    let s = 1337;
    const rand = () => {
      s = (s * 16807) % 2147483647;
      return s / 2147483647;
    };
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rand() - 0.5) * box[0];
      positions[i * 3 + 1] = (rand() - 0.5) * box[1];
      positions[i * 3 + 2] = (rand() - 0.5) * box[2];
      seeds[i] = rand();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    return g;
  }, [count, box]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        uniforms: {
          uTime: { value: 0 },
          uPixelRatio: { value: 1 },
          uSize: { value: 34 },
          uFocus: { value: focus },
          uPointer: { value: new THREE.Vector2() },
          uBox: { value: new THREE.Vector3(...box) },
          uColor: { value: new THREE.Color("#bcdcf5") },
          uOpacity: { value: 0.75 },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [box, focus],
  );

  useEffect(() => {
    material.blending = light ? THREE.NormalBlending : THREE.AdditiveBlending;
    material.uniforms.uColor.value.set(light ? "#35577d" : "#bcdcf5");
    material.uniforms.uOpacity.value = light ? 0.4 : 0.75;
    material.needsUpdate = true;
  }, [material, light]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame((state, delta) => {
    material.uniforms.uTime.value += delta;
    material.uniforms.uPixelRatio.value = state.gl.getPixelRatio();
    const target = pointer.current;
    const u = material.uniforms.uPointer.value as THREE.Vector2;
    u.x += (-target.x * 0.5 - u.x) * 0.04;
    u.y += (target.y * 0.5 - u.y) * 0.04;
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}
