"use client";

import { ContactShadows, PerformanceMonitor } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useRef, useState } from "react";
import * as THREE from "three";
import type { FeatureView } from "@/config/content";
import { StudioEnvironment } from "./HeroScene";
import { SplitUnit } from "./SplitUnit";

export type Pose = {
  yaw: number;
  pitch: number;
  zoom: number;
  /** Deslocamento (em larguras do aparelho) para enquadrar um detalhe. */
  x: number;
  y: number;
  flap: number;
  airflow: number;
};

export const POSES: Record<FeatureView, Pose> = {
  design: { yaw: -0.58, pitch: -0.1, zoom: 1, x: 0, y: 0, flap: 0, airflow: 0 },
  eficiencia: { yaw: 0.0, pitch: 0.04, zoom: 0.96, x: 0, y: 0, flap: 0.3, airflow: 0.4 },
  inverter: { yaw: 0.55, pitch: -0.16, zoom: 1, x: 0, y: 0, flap: 0.55, airflow: 0.7 },
  ar: { yaw: -0.3, pitch: -0.62, zoom: 1.02, x: 0, y: 0.1, flap: 1, airflow: 1.35 },
  controle: { yaw: -0.5, pitch: -0.04, zoom: 1.75, x: -0.52, y: -0.08, flap: 0.3, airflow: 0.3 },
  silencio: { yaw: 0.22, pitch: 0.42, zoom: 1, x: 0, y: -0.04, flap: 0.12, airflow: 0.16 },
};

export type DragState = { yaw: number; pitch: number; dragging: boolean };

type ProductSceneProps = {
  view: FeatureView;
  light: boolean;
  active: boolean;
  lite: boolean;
  /** Rotação extra aplicada pelo usuário (arrastar / botões). */
  drag: React.RefObject<DragState>;
  temperature: number;
};

function Stage({ view, light, lite, drag, temperature }: Omit<ProductSceneProps, "active">) {
  const group = useRef<THREE.Group>(null);
  const viewport = useThree((state) => state.viewport);
  const pose = POSES[view];
  const base = Math.min((viewport.width * 0.6) / 0.92, (viewport.height * 0.92) / 0.5);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const k = 1 - Math.exp(-delta * 3.4);
    const t = state.clock.elapsedTime;
    const d = drag.current;
    // sem arrasto, o giro do usuário relaxa lentamente de volta à pose
    if (!d.dragging) {
      d.yaw *= 1 - Math.min(1, delta * 0.35);
      d.pitch *= 1 - Math.min(1, delta * 0.6);
    }
    const idle = d.dragging ? 0 : Math.sin(t * 0.42) * 0.06;
    g.rotation.y += (pose.yaw + d.yaw + idle - g.rotation.y) * k;
    g.rotation.x += (THREE.MathUtils.clamp(pose.pitch + d.pitch, -0.9, 0.75) - g.rotation.x) * k;
    const s = base * pose.zoom;
    g.scale.setScalar(g.scale.x + (s - g.scale.x) * k);
    g.position.x += (pose.x * 0.92 * s - g.position.x) * k;
    g.position.y += (0.06 * viewport.height + pose.y * s + Math.sin(t * 0.8) * 0.025 - g.position.y) * k;
  });

  return (
    <>
      <StudioEnvironment light={light} />
      <ambientLight intensity={light ? 0.8 : 0.25} color={light ? "#ffffff" : "#9fc3ea"} />
      <directionalLight position={[-3, 4.5, 4]} intensity={light ? 1.5 : 2.0} />
      <directionalLight position={[4, -1, 2.5]} intensity={light ? 0.3 : 0.6} color="#5d95d6" />
      <group ref={group} rotation={[0, -1.4, 0]} scale={base * 0.8}>
        <SplitUnit flap={pose.flap} airflow={pose.airflow} temperature={temperature} light={light} />
      </group>
      <ContactShadows
        position={[0, -viewport.height * 0.36, 0]}
        scale={viewport.width * 1.1}
        far={viewport.height}
        blur={2.6}
        opacity={light ? 0.34 : 0.62}
        resolution={lite ? 256 : 512}
        color={light ? "#1a3f75" : "#000010"}
      />
    </>
  );
}

/** Vitrine de produto: o split gira para destacar cada recurso e pode ser girado pelo usuário. */
export default function ProductScene({ view, light, active, lite, drag, temperature }: ProductSceneProps) {
  const [dpr, setDpr] = useState(lite ? 1.4 : 1.75);
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, dpr]}
      camera={{ fov: 28, position: [0, 0, 4.4], near: 0.1, far: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
      aria-hidden
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} flipflops={2} />
      <Suspense fallback={null}>
        <Stage view={view} light={light} lite={lite} drag={drag} temperature={temperature} />
      </Suspense>
    </Canvas>
  );
}
