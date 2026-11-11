"use client";

import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { asset } from "@/config/site";
import { SplitController } from "./splitController";

export const MODEL_URL = asset("/models/split.glb");

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

/** Unidade interna (split hi-wall) — modelo GLB próprio, gerado em tools/3d. */
export function SplitUnit({ flap = 0.6, temperature = 22, displayOn = true, airflow = 1, light = false }: SplitUnitProps) {
  const gltf = useGLTF(MODEL_URL, false);
  const unit = useMemo(() => new SplitController(gltf.scene), [gltf.scene]);

  useEffect(() => () => unit.dispose(), [unit]);
  useEffect(() => unit.setTemperature(temperature), [unit, temperature]);
  useEffect(() => unit.setDisplay(displayOn), [unit, displayOn]);
  useEffect(() => unit.setLight(light), [unit, light]);
  useFrame((_, delta) => unit.update(delta, flap, airflow));

  return <primitive object={unit.root} />;
}

useGLTF.preload(MODEL_URL, false);
