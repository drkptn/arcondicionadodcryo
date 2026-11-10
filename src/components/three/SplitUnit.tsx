"use client";

import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { asset } from "@/config/site";
import { createDisplayTexture } from "./displayTexture";

export const MODEL_URL = asset("/models/split.glb");
const FLAP_MAX = THREE.MathUtils.degToRad(40);

type SplitUnitProps = {
  /** Abertura da aleta: 0 fechada · 1 aberta. */
  flap?: number;
  /** Temperatura exibida no display. */
  temperature?: number;
  displayOn?: boolean;
  /** Intensidade do fluxo de ar (0 desliga). */
  airflow?: number;
  light?: boolean;
};

const AIR_VERT = /* glsl */ `
  attribute float aSeed;
  varying vec2 vUv;
  varying float vSeed;
  void main() {
    vUv = uv;
    vSeed = aSeed;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const AIR_FRAG = /* glsl */ `
  uniform float uTime;
  uniform float uIntensity;
  uniform vec3 uColor;
  varying vec2 vUv;
  varying float vSeed;
  void main() {
    float speed = 0.16 + vSeed * 0.12;
    float t = fract(vUv.x * 0.85 - uTime * speed + vSeed * 7.31);
    float pulse = smoothstep(0.0, 0.4, t) * smoothstep(1.0, 0.5, t);
    float fade = smoothstep(0.0, 0.1, vUv.x) * smoothstep(1.0, 0.35, vUv.x);
    float edge = pow(1.0 - abs(vUv.y * 2.0 - 1.0), 1.6);
    float alpha = pulse * fade * edge * uIntensity;
    if (alpha < 0.003) discard;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

/** Fitas que representam o ar frio saindo pela aleta — movimento lento e discreto. */
function buildAirflowGeometry(count: number) {
  const positions: number[] = [];
  const uvs: number[] = [];
  const seeds: number[] = [];
  const indices: number[] = [];
  const SEG = 28;
  let offset = 0;
  for (let i = 0; i < count; i++) {
    const u = count === 1 ? 0.5 : i / (count - 1);
    const x0 = (u - 0.5) * 0.74;
    const seed = (Math.sin(i * 12.9898) * 43758.5453) % 1;
    const s = Math.abs(seed);
    const spread = 1.0 + s * 0.25;
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(x0, -0.118, 0.085),
      new THREE.Vector3(x0 * 1.03, -0.21, 0.19),
      new THREE.Vector3(x0 * 1.1 * spread, -0.42, 0.3 + s * 0.05),
      new THREE.Vector3(x0 * 1.22 * spread + (s - 0.5) * 0.08, -0.7, 0.36 + s * 0.08),
      new THREE.Vector3(x0 * 1.36 * spread + (s - 0.5) * 0.14, -1.02, 0.36 + s * 0.1),
    ]);
    const width = 0.005 + s * 0.007;
    for (let j = 0; j <= SEG; j++) {
      const t = j / SEG;
      const p = curve.getPoint(t);
      const w = width * (1 + t * 2.2);
      positions.push(p.x - w, p.y, p.z, p.x + w, p.y, p.z);
      uvs.push(t, 0, t, 1);
      seeds.push(s, s);
      if (j < SEG) {
        const a = offset + j * 2;
        indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
    }
    offset += (SEG + 1) * 2;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setAttribute("aSeed", new THREE.Float32BufferAttribute(seeds, 1));
  geometry.setIndex(indices);
  return geometry;
}

/**
 * Unidade interna (split hi-wall) — modelo GLB próprio (tools/3d).
 * Controla materiais, abertura da aleta, display e fluxo de ar.
 */
export function SplitUnit({ flap = 0.6, temperature = 22, displayOn = true, airflow = 1, light = false }: SplitUnitProps) {
  const gltf = useGLTF(MODEL_URL, false);
  const flapRef = useRef<THREE.Object3D | null>(null);
  const flapValue = useRef(0);
  const airValue = useRef(0);

  const display = useMemo(() => createDisplayTexture(temperature), []); // eslint-disable-line react-hooks/exhaustive-deps

  const materials = useMemo(
    () => ({
      AC_Body: new THREE.MeshStandardMaterial({ color: "#e6ebf0", roughness: 0.48, metalness: 0.0 }),
      AC_Panel: new THREE.MeshPhysicalMaterial({
        color: "#f3f6f9",
        roughness: 0.16,
        metalness: 0.0,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
      }),
      AC_Metal: new THREE.MeshStandardMaterial({ color: "#c5d0dc", roughness: 0.22, metalness: 1.0 }),
      AC_Dark: new THREE.MeshStandardMaterial({ color: "#04060a", roughness: 0.62 }),
      AC_Vane: new THREE.MeshStandardMaterial({ color: "#0e131b", roughness: 0.5 }),
      AC_Display: new THREE.MeshBasicMaterial({
        map: display.texture,
        transparent: true,
        toneMapped: false,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -4,
      }),
    }),
    [display],
  );

  const airMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: AIR_VERT,
        fragmentShader: AIR_FRAG,
        uniforms: {
          uTime: { value: 0 },
          uIntensity: { value: 0 },
          uColor: { value: new THREE.Color("#bfe0ff") },
        },
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );
  const airGeometry = useMemo(() => buildAirflowGeometry(15), []);

  const model = useMemo(() => {
    const root = gltf.scene.clone(true);
    root.traverse((object) => {
      if (object.name === "Split_Flap") flapRef.current = object;
      const mesh = object as THREE.Mesh;
      if (!mesh.isMesh) return;
      const name = (mesh.material as THREE.Material).name as keyof typeof materials;
      if (materials[name]) mesh.material = materials[name];
    });
    return root;
  }, [gltf.scene, materials]);

  useEffect(() => {
    display.set(temperature);
  }, [display, temperature]);

  useEffect(() => {
    materials.AC_Display.opacity = displayOn ? 1 : 0;
  }, [materials, displayOn]);

  useEffect(() => {
    // No tema claro o ar vira um azul profundo translúcido (mistura normal).
    airMaterial.blending = light ? THREE.NormalBlending : THREE.AdditiveBlending;
    airMaterial.uniforms.uColor.value.set(light ? "#2d5f9e" : "#bfe0ff");
    airMaterial.needsUpdate = true;
  }, [airMaterial, light]);

  useEffect(
    () => () => {
      Object.values(materials).forEach((material) => material.dispose());
      airMaterial.dispose();
      airGeometry.dispose();
      display.dispose();
    },
    [materials, airMaterial, airGeometry, display],
  );

  useFrame((_, delta) => {
    const k = 1 - Math.exp(-delta * 4);
    flapValue.current += (flap - flapValue.current) * k;
    if (flapRef.current) flapRef.current.rotation.x = flapValue.current * FLAP_MAX;
    // o ar só flui com a aleta aberta
    const targetAir = airflow * THREE.MathUtils.smoothstep(flapValue.current, 0.15, 0.55);
    airValue.current += (targetAir - airValue.current) * k;
    airMaterial.uniforms.uIntensity.value = airValue.current * (light ? 0.5 : 0.62);
    airMaterial.uniforms.uTime.value += delta;
  });

  return (
    <group>
      <primitive object={model} />
      <mesh geometry={airGeometry} material={airMaterial} frustumCulled={false} renderOrder={5} />
    </group>
  );
}

useGLTF.preload(MODEL_URL, false);
