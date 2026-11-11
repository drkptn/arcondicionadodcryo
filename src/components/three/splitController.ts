import * as THREE from "three";
import { createDisplayTexture } from "./displayTexture";

const FLAP_MAX = THREE.MathUtils.degToRad(40);

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
    float fade = smoothstep(0.0, 0.1, vUv.x) * smoothstep(1.0, 0.25, vUv.x);
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
    const s = Math.abs((Math.sin(i * 12.9898) * 43758.5453) % 1);
    const spread = 1.0 + s * 0.25;
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(x0, -0.118, 0.085),
      new THREE.Vector3(x0 * 1.03, -0.21, 0.19),
      new THREE.Vector3(x0 * 1.1 * spread, -0.42, 0.3 + s * 0.05),
      new THREE.Vector3(x0 * 1.2 * spread + (s - 0.5) * 0.08, -0.62, 0.36 + s * 0.08),
      new THREE.Vector3(x0 * 1.3 * spread + (s - 0.5) * 0.12, -0.84, 0.37 + s * 0.1),
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
 * Controla uma instância da unidade interna (split hi-wall): materiais, abertura da
 * aleta, display de temperatura e fluxo de ar. É three.js puro — o componente
 * <SplitUnit> apenas o conecta ao React.
 */
export class SplitController {
  readonly root = new THREE.Group();
  private flap: THREE.Object3D | null = null;
  private flapValue = 0;
  private airValue = 0;
  private light = false;
  private display = createDisplayTexture(22);
  private disposables: { dispose: () => void }[] = [];
  private displayMaterial: THREE.MeshBasicMaterial;
  private airMaterial: THREE.ShaderMaterial;

  constructor(source: THREE.Object3D) {
    const materials: Record<string, THREE.Material> = {
      AC_Body: new THREE.MeshStandardMaterial({ color: "#e6ebf0", roughness: 0.48, metalness: 0 }),
      AC_Panel: new THREE.MeshPhysicalMaterial({ color: "#f3f6f9", roughness: 0.16, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.08 }),
      AC_Metal: new THREE.MeshStandardMaterial({ color: "#c5d0dc", roughness: 0.22, metalness: 1 }),
      AC_Dark: new THREE.MeshStandardMaterial({ color: "#04060a", roughness: 0.62 }),
      AC_Vane: new THREE.MeshStandardMaterial({ color: "#0e131b", roughness: 0.5 }),
    };
    this.displayMaterial = new THREE.MeshBasicMaterial({
      map: this.display.texture,
      transparent: true,
      toneMapped: false,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -4,
    });
    materials.AC_Display = this.displayMaterial;

    const model = source.clone(true);
    model.traverse((object) => {
      if (object.name === "Split_Flap") this.flap = object;
      const mesh = object as THREE.Mesh;
      if (!mesh.isMesh) return;
      const replacement = materials[(mesh.material as THREE.Material).name];
      if (replacement) mesh.material = replacement;
    });

    this.airMaterial = new THREE.ShaderMaterial({
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
    });
    const airGeometry = buildAirflowGeometry(15);
    const air = new THREE.Mesh(airGeometry, this.airMaterial);
    air.frustumCulled = false;
    air.renderOrder = 5;

    this.root.add(model, air);
    this.disposables.push(...Object.values(materials), this.airMaterial, airGeometry, this.display);
  }

  setTemperature(value: number) {
    this.display.set(value);
  }

  setDisplay(on: boolean) {
    this.displayMaterial.opacity = on ? 1 : 0;
  }

  /** No tema claro o ar vira um azul translúcido (mistura normal em vez de aditiva). */
  setLight(light: boolean) {
    this.light = light;
    this.airMaterial.blending = light ? THREE.NormalBlending : THREE.AdditiveBlending;
    (this.airMaterial.uniforms.uColor.value as THREE.Color).set(light ? "#6ea5dc" : "#bfe0ff");
    this.airMaterial.needsUpdate = true;
  }

  /** Chamado a cada quadro. `flap`: 0 fechada · 1 aberta. `airflow`: intensidade do ar. */
  update(delta: number, flap: number, airflow: number) {
    const k = 1 - Math.exp(-delta * 4);
    this.flapValue += (flap - this.flapValue) * k;
    if (this.flap) this.flap.rotation.x = this.flapValue * FLAP_MAX;
    // o ar só flui com a aleta aberta
    const target = airflow * THREE.MathUtils.smoothstep(this.flapValue, 0.15, 0.55);
    this.airValue += (target - this.airValue) * k;
    this.airMaterial.uniforms.uIntensity.value = this.airValue * (this.light ? 0.42 : 0.5);
    this.airMaterial.uniforms.uTime.value += delta;
  }

  dispose() {
    this.disposables.forEach((item) => item.dispose());
  }
}
