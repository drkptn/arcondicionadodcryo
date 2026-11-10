"use client";

import { Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useRef, useState } from "react";
import * as THREE from "three";
import { Particles } from "./Particles";
import { SplitUnit } from "./SplitUnit";

type PointerRef = React.RefObject<{ x: number; y: number; active: boolean }>;

type HeroSceneProps = {
  temperature: number;
  light: boolean;
  /** Renderiza apenas enquanto o hero está visível. */
  active: boolean;
  /** Versão otimizada (celulares): menos partículas e resolução menor. */
  lite: boolean;
  pointer: PointerRef;
  onReady: () => void;
};

/** Softboxes procedurais — nenhum HDRI externo é baixado. */
export function StudioEnvironment({ light }: { light: boolean }) {
  return (
    <Environment key={light ? "light" : "dark"} resolution={256} frames={1}>
      <color attach="background" args={[light ? "#b9cbdc" : "#03060c"]} />
      <Lightformer form="rect" intensity={light ? 3.2 : 4.2} color="#ffffff" position={[-4, 4, 4]} scale={[7, 3.5, 1]} target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={light ? 1.6 : 2.6} color="#8fc0f2" position={[5, 1, -3]} scale={[5, 7, 1]} target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={light ? 1.2 : 1.1} color="#3f78c4" position={[0, -4, 2]} scale={[9, 2.5, 1]} target={[0, 0, 0]} />
      <Lightformer form="circle" intensity={light ? 1.4 : 2.2} color="#dcecff" position={[0.5, 2.5, -5]} scale={[4, 4, 1]} target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={light ? 0.8 : 0.5} color="#ffffff" position={[-6, -1, -1]} scale={[2, 6, 1]} target={[0, 0, 0]} />
    </Environment>
  );
}

function Rig({ temperature, light, lite, pointer, onReady }: Omit<HeroSceneProps, "active">) {
  const group = useRef<THREE.Group>(null);
  const cursorLight = useRef<THREE.PointLight>(null);
  const glow = useRef<THREE.Mesh>(null);
  const viewport = useThree((state) => state.viewport);
  const ready = useRef(false);
  const intro = useRef(0);

  const portrait = viewport.aspect < 0.85;
  const compact = viewport.aspect < 1.25;
  // largura do aparelho ≈ 0.92 u — ocupa uma fração da largura visível
  const scale = portrait
    ? (viewport.width * 0.86) / 0.92
    : compact
      ? (viewport.width * 0.56) / 0.92
      : Math.min((viewport.width * 0.47) / 0.92, 2.5);
  const baseX = portrait ? 0 : compact ? viewport.width * 0.16 : viewport.width * 0.215;
  const baseY = portrait ? viewport.height * 0.2 : viewport.height * 0.085;

  // colder => fluxo mais intenso e aleta mais aberta
  const cold = THREE.MathUtils.clamp((26 - temperature) / 9, 0, 1);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    if (!ready.current) {
      ready.current = true;
      onReady();
    }
    intro.current = Math.min(1, intro.current + delta * 0.55);
    const ease = 1 - Math.pow(1 - intro.current, 4);
    const t = state.clock.elapsedTime;
    const p = pointer.current;
    const k = 1 - Math.exp(-delta * 3.2);
    const scroll = Math.min(1.4, window.scrollY / Math.max(1, window.innerHeight));

    const targetRotY = -0.5 + p.x * 0.3 + (1 - ease) * 0.9;
    const targetRotX = -0.2 + p.y * -0.13 - scroll * 0.22;
    g.rotation.y += (targetRotY - g.rotation.y) * k;
    g.rotation.x += (targetRotX - g.rotation.x) * k;
    g.rotation.z = Math.sin(t * 0.45) * 0.014;

    const floatY = Math.sin(t * 0.75) * 0.05;
    const targetX = baseX + p.x * 0.07;
    const targetY = baseY + floatY - p.y * 0.05 + scroll * viewport.height * 0.2 - (1 - ease) * 0.7;
    g.position.x += (targetX - g.position.x) * k;
    g.position.y += (targetY - g.position.y) * k;
    const s = scale * (0.86 + 0.14 * ease);
    g.scale.setScalar(s);

    if (cursorLight.current) {
      const l = cursorLight.current;
      l.position.x += (baseX + p.x * viewport.width * 0.42 - l.position.x) * k;
      l.position.y += (baseY - p.y * viewport.height * 0.36 - l.position.y) * k;
    }
    if (glow.current) {
      const m = glow.current.material as THREE.MeshBasicMaterial;
      m.opacity = (light ? 0.0 : 0.16 + cold * 0.2) * ease * (0.85 + Math.sin(t * 0.9) * 0.15);
      glow.current.position.set(g.position.x, g.position.y - 0.62 * s, -0.4);
      glow.current.scale.set(3.4 * s, 1.5 * s, 1);
    }
  });

  return (
    <>
      <StudioEnvironment light={light} />
      <ambientLight intensity={light ? 0.75 : 0.22} color={light ? "#ffffff" : "#9fc3ea"} />
      <directionalLight position={[-3.5, 4.5, 4]} intensity={light ? 1.6 : 1.9} color="#ffffff" />
      <directionalLight position={[4, -1.5, 2]} intensity={light ? 0.25 : 0.55} color="#5d95d6" />
      <pointLight ref={cursorLight} position={[0, 0, 1.7]} intensity={light ? 2 : 5.5} distance={5} decay={2} color="#bfe1ff" />

      {/* piscina de ar frio sob o aparelho */}
      <mesh ref={glow} renderOrder={-1}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={getGlowTexture()} transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} color="#5c9be0" />
      </mesh>

      <group ref={group} position={[baseX, baseY - 0.7, 0]} rotation={[-0.2, 0.4, 0]}>
        <SplitUnit flap={0.45 + cold * 0.55} temperature={temperature} airflow={0.55 + cold * 0.75} light={light} />
      </group>

      <Particles count={lite ? 70 : 220} pointer={pointer} light={light} box={[viewport.width * 1.35, viewport.height * 1.3, 5]} />
    </>
  );
}

let glowTexture: THREE.Texture | null = null;
function getGlowTexture() {
  if (!glowTexture) {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.35, "rgba(255,255,255,0.42)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    glowTexture = new THREE.CanvasTexture(canvas);
  }
  return glowTexture;
}

/** Cena do hero: split 3D flutuante com paralaxe, luz que segue o cursor, ar frio e partículas. */
export default function HeroScene({ temperature, light, active, lite, pointer, onReady }: HeroSceneProps) {
  const [dpr, setDpr] = useState(lite ? 1.4 : 1.75);
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, dpr]}
      camera={{ fov: 30, position: [0, 0, 4.6], near: 0.1, far: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
      aria-hidden
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} flipflops={2} />
      <Suspense fallback={null}>
        <Rig temperature={temperature} light={light} lite={lite} pointer={pointer} onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
