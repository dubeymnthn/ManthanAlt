"use client";

import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Environment, Lightformer, Line } from "@react-three/drei";
import * as THREE from "three";
import { useRouter } from "next/navigation";
import { soundManager } from "@/lib/sound";
import { HERO_CHAIN_ORDER, HERO_PRODUCTS, type HeroProduct } from "./heroProducts";
import {
  DravyamSculpture,
  FinancialScraperSculpture,
  Plinth,
  RideAggregatorSculpture,
  StoryforgeSculpture,
  WallyTalkySculpture,
} from "./sculptures";

// World-space extent the composition is designed for; the camera backs off on
// narrow canvases so the five sculptures always fit.
const WORLD_W = 9.4;
const WORLD_H = 6.7;
const SILVER = "#BFC3C0";

const SCULPTURES: Record<string, () => ReactNode> = {
  "wally-talky": () => <WallyTalkySculpture />,
  "storyforge-ai": () => <StoryforgeSculpture />,
  dravyam: () => <DravyamSculpture />,
  "ride-aggregator": () => <RideAggregatorSculpture />,
  "financial-data-scraper": () => <FinancialScraperSculpture />,
};

// ----------------------------------------------------------------------------
// Studio rig: procedural softbox environment (no network HDRI) so aluminium,
// ceramic and glass pick up believable reflections.
// ----------------------------------------------------------------------------
function StudioLighting() {
  return (
    <>
      <ambientLight intensity={0.28} />
      <directionalLight position={[3, 6, 7]} intensity={1.05} color="#FFFFFF" />
      <Environment resolution={256} frames={1}>
        {/* Studio cove: broad soft-grey base so satin metals never reflect black */}
        <mesh scale={60}>
          <sphereGeometry args={[1, 32, 16]} />
          <meshBasicMaterial color="#B9BDBA" side={THREE.BackSide} />
        </mesh>
        <Lightformer form="rect" intensity={3.2} color="#FFFFFF" position={[0, 6, 2]} rotation={[Math.PI / 2, 0, 0]} scale={[14, 8, 1]} />
        <Lightformer form="rect" intensity={2.4} color="#FFFFFF" position={[-7, 2, 3]} rotation={[0, Math.PI / 2.3, 0]} scale={[8, 5, 1]} />
        <Lightformer form="rect" intensity={2.0} color="#F1ECE2" position={[7, 1, -2]} rotation={[0, -Math.PI / 2.2, 0]} scale={[8, 4, 1]} />
        <Lightformer form="rect" intensity={1.4} color="#FFFFFF" position={[0, 1, 8]} rotation={[0, Math.PI, 0]} scale={[10, 4, 1]} />
        <Lightformer form="rect" intensity={0.8} color="#D9DAD6" position={[0, -5, 1]} rotation={[-Math.PI / 2, 0, 0]} scale={[14, 10, 1]} />
      </Environment>
    </>
  );
}

// Narrow canvases (phones) compress the horizontal spread instead of shrinking everything.
function layoutFactor(width: number, height: number) {
  return THREE.MathUtils.clamp(width / Math.max(height, 1) / 1.19, 0.68, 1);
}

function ResponsiveCamera() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);

  useEffect(() => {
    const aspect = size.width / Math.max(size.height, 1);
    const tanHalf = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const worldW = WORLD_W * layoutFactor(size.width, size.height);
    const z = Math.max(worldW / 2 / (tanHalf * aspect), WORLD_H / 2 / tanHalf);
    camera.position.set(0, 0, z);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  return null;
}

// Soft contact shadow (one shared radial-gradient texture, no shadow maps).
let shadowTexture: THREE.CanvasTexture | null = null;
function getShadowTexture() {
  if (shadowTexture) return shadowTexture;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, "rgba(32,35,33,0.5)");
  grad.addColorStop(0.55, "rgba(32,35,33,0.16)");
  grad.addColorStop(1, "rgba(32,35,33,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  shadowTexture = new THREE.CanvasTexture(c);
  shadowTexture.colorSpace = THREE.SRGBColorSpace;
  return shadowTexture;
}

// ----------------------------------------------------------------------------
// One product: tilted presentation plinth, gentle sway, hover response.
// ----------------------------------------------------------------------------
interface ShellProps {
  product: HeroProduct;
  hovered: boolean;
  reduced: boolean;
  onHover: (p: HeroProduct | null) => void;
  onOpen: (p: HeroProduct) => void;
  wasDragged: () => boolean;
}

function SculptureShell({ product, hovered, reduced, onHover, onOpen, wasDragged }: ShellProps) {
  const gl = useThree((s) => s.gl);
  const spin = useRef<THREE.Group>(null);
  const lift = useRef<THREE.Group>(null);
  const haloMat = useRef<THREE.MeshBasicMaterial>(null);
  const shadow = useMemo(() => getShadowTexture(), []);

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;

    if (spin.current) {
      // Idle sway; settles to face the viewer while hovered.
      const target =
        hovered || reduced
          ? 0
          : Math.sin(t * product.sway.speed + product.sway.phase) * product.sway.amp;
      spin.current.rotation.y += (target - spin.current.rotation.y) * (1 - Math.exp(-d * 3));
    }
    if (lift.current) {
      const s = lift.current.scale.x + ((hovered ? 1.06 : 1) - lift.current.scale.x) * (1 - Math.exp(-d * 8));
      lift.current.scale.setScalar(s);
    }
    if (haloMat.current) {
      haloMat.current.opacity += ((hovered ? 0.85 : 0) - haloMat.current.opacity) * (1 - Math.exp(-d * 8));
    }
  });

  const handleOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onHover(product);
    gl.domElement.style.cursor = "pointer";
  };
  const handleOut = () => {
    onHover(null);
    gl.domElement.style.cursor = "";
  };
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (wasDragged()) return;
    onOpen(product);
  };

  return (
    <group position={product.position} scale={product.scale}>
      <group ref={lift} rotation={[0.3, 0, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.13, 0]} scale={1.7} raycast={() => null}>
          <planeGeometry args={[2, 2]} />
          <meshBasicMaterial map={shadow} transparent depthWrite={false} toneMapped={false} />
        </mesh>

        {/* Hover highlight: a fine champagne halo around the plinth */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} raycast={() => null}>
          <ringGeometry args={[1.07, 1.1, 96]} />
          <meshBasicMaterial ref={haloMat} color="#B6B2A9" transparent opacity={0} depthWrite={false} toneMapped={false} />
        </mesh>

        <group ref={spin}>
          <Plinth radius={1} />
          {SCULPTURES[product.id]()}
        </group>

        {/* Generous invisible hit volume so thin parts never flicker the hover */}
        <mesh
          position={[0, 0.5, 0]}
          onPointerOver={handleOver}
          onPointerOut={handleOut}
          onClick={handleClick}
        >
          <cylinderGeometry args={[1.08, 1.08, 1.4, 24]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>
    </group>
  );
}

// ----------------------------------------------------------------------------
// Scene
// ----------------------------------------------------------------------------
interface ProductSculptures3DProps {
  onHoverProduct: (product: HeroProduct | null) => void;
  hoveredProductId: string | null;
  reducedMotion: boolean;
  /** DOM label elements (owned by the canvas wrapper) that this scene positions each frame. */
  labelRefs: { current: Record<string, HTMLElement | null> };
}

export function ProductSculptures3D({
  onHoverProduct,
  hoveredProductId,
  reducedMotion,
  labelRefs,
}: ProductSculptures3DProps) {
  const router = useRouter();
  const gl = useThree((s) => s.gl);
  const pointer = useThree((s) => s.pointer);
  const size = useThree((s) => s.size);
  const camera = useThree((s) => s.camera);
  const rig = useRef<THREE.Group>(null);
  const labelPoint = useMemo(() => new THREE.Vector3(), []);

  const kx = layoutFactor(size.width, size.height);
  const products = useMemo(
    () =>
      HERO_PRODUCTS.map((p) => ({
        ...p,
        position: [p.position[0] * kx, p.position[1], p.position[2]] as [number, number, number],
        labelDx: p.labelDx * kx,
      })),
    [kx]
  );

  const userRot = useRef({ x: 0, y: 0 });
  const drag = useRef({ active: false, id: -1, x: 0, y: 0, moved: 0, releasedAt: 0 });

  // Fine connecting line through the five plinths, in reading order.
  const linePoints = useMemo(() => {
    const pts = HERO_CHAIN_ORDER.map((id) => {
      const p = products.find((h) => h.id === id)!;
      return new THREE.Vector3(p.position[0], p.position[1] - 0.1, p.position[2] - 0.3);
    });
    return new THREE.CatmullRomCurve3(pts, false, "centripetal").getPoints(90);
  }, [products]);

  const open = (p: HeroProduct) => {
    soundManager.playClick();
    gl.domElement.style.cursor = "";
    router.push(p.route);
  };

  // Drag-to-rotate on the whole canvas (not just over meshes).
  useEffect(() => {
    const el = gl.domElement;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      drag.current = { ...drag.current, active: true, id: e.pointerId, x: e.clientX, y: e.clientY, moved: 0 };
    };
    const onMove = (e: PointerEvent) => {
      const d = drag.current;
      if (!d.active || e.pointerId !== d.id) return;
      const dx = e.clientX - d.x;
      const dy = e.clientY - d.y;
      d.moved += Math.abs(dx) + Math.abs(dy);
      d.x = e.clientX;
      d.y = e.clientY;
      if (d.moved > 6) {
        if (!el.hasPointerCapture(e.pointerId)) el.setPointerCapture(e.pointerId);
        userRot.current.y = THREE.MathUtils.clamp(userRot.current.y + dx * 0.004, -1, 1);
        userRot.current.x = THREE.MathUtils.clamp(userRot.current.x + dy * 0.003, -0.35, 0.35);
      }
    };
    const onUp = (e: PointerEvent) => {
      const d = drag.current;
      if (e.pointerId !== d.id) return;
      d.active = false;
      d.releasedAt = performance.now() / 1000;
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.style.cursor = "";
    };
  }, [gl]);

  useFrame((state, delta) => {
    const g = rig.current;
    if (!g) return;
    const d = Math.min(delta, 0.05);

    // After release the composition eases back to its resting art direction.
    if (!drag.current.active && performance.now() / 1000 - drag.current.releasedAt > 1.2) {
      const k = 1 - Math.exp(-d * 1.8);
      userRot.current.x -= userRot.current.x * k;
      userRot.current.y -= userRot.current.y * k;
    }

    const t = state.clock.elapsedTime;
    const idle = reducedMotion ? 0 : Math.sin(t * 0.12) * 0.07; // slow orbital drift
    const px = reducedMotion ? 0 : pointer.x;
    const py = reducedMotion ? 0 : pointer.y;
    const ty = idle + px * 0.12 + userRot.current.y;
    const tx = -py * 0.07 + userRot.current.x;
    const k = 1 - Math.exp(-d * 5);
    g.rotation.y += (ty - g.rotation.y) * k;
    g.rotation.x += (tx - g.rotation.x) * k;

    // Anchor each DOM label under its sculpture (plain DOM: no extra React roots).
    g.updateWorldMatrix(true, false);
    for (const p of products) {
      const el = labelRefs.current[p.id];
      if (!el) continue;
      labelPoint.set(p.position[0] + p.labelDx, p.position[1] - 0.98 * p.scale, p.position[2] + 0.2);
      g.localToWorld(labelPoint).project(camera);
      const x = (labelPoint.x * 0.5 + 0.5) * size.width;
      const y = (-labelPoint.y * 0.5 + 0.5) * size.height;
      el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -50%)`;
      el.style.opacity = "1";
      el.style.pointerEvents = "auto";
    }
  });

  return (
    <>
      <StudioLighting />
      <ResponsiveCamera />

      <group ref={rig}>
        <Line points={linePoints} color={SILVER} lineWidth={1} transparent opacity={0.8} />

        {products.map((product) => (
          <SculptureShell
            key={product.id}
            product={product}
            hovered={hoveredProductId === product.id}
            reduced={reducedMotion}
            onHover={onHoverProduct}
            onOpen={open}
            wasDragged={() => drag.current.moved > 6}
          />
        ))}

      </group>
    </>
  );
}
