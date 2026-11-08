"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { Edges, RoundedBox } from "@react-three/drei";

// ============================================================================
// Shared studio materials — satin aluminium, glazed ceramic, frosted glass,
// graphite and champagne metal. Everything is physically based; the look comes
// from the procedural studio environment in ProductSculptures3D.
// ============================================================================

const SILVER = "#BFC3C0";
const CHAMPAGNE = "#B6B2A9"; // brand champagne (halo, edges)
const CHAMPAGNE_METAL = "#CFCABF"; // lifted so the metal reads as champagne, not bronze, under the cove
const GRAPHITE = "#454A47";

export function Aluminium({ color = "#D4D7D5" }: { color?: string }) {
  return (
    <meshPhysicalMaterial
      color={color}
      metalness={1}
      roughness={0.34}
      anisotropy={0.65}
      envMapIntensity={1.05}
    />
  );
}

export function Ceramic({ color = "#FBFBFA" }: { color?: string }) {
  return (
    <meshPhysicalMaterial
      color={color}
      metalness={0}
      roughness={0.42}
      clearcoat={0.55}
      clearcoatRoughness={0.28}
    />
  );
}

export function Champagne({ opacity = 1 }: { opacity?: number }) {
  return (
    <meshPhysicalMaterial
      color={CHAMPAGNE_METAL}
      metalness={1}
      roughness={0.3}
      transparent={opacity < 1}
      opacity={opacity}
    />
  );
}

export function Silver({ opacity = 1 }: { opacity?: number }) {
  return (
    <meshPhysicalMaterial
      color={SILVER}
      metalness={1}
      roughness={0.28}
      transparent={opacity < 1}
      opacity={opacity}
    />
  );
}

export function Graphite() {
  return <meshPhysicalMaterial color={GRAPHITE} metalness={0.35} roughness={0.5} />;
}

export function FrostedGlass() {
  return (
    <meshPhysicalMaterial
      color="#F6F8F7"
      transparent
      opacity={0.6}
      roughness={0.4}
      metalness={0}
      clearcoat={1}
      clearcoatRoughness={0.18}
      depthWrite={false}
    />
  );
}

// ----------------------------------------------------------------------------
// Presentation plinth: glazed ceramic disc with a fine champagne inlay.
// Top surface sits at y = 0 so every sculpture builds upward from the origin.
// ----------------------------------------------------------------------------
export function Plinth({ radius = 1 }: { radius?: number }) {
  return (
    <group>
      <mesh position={[0, -0.06, 0]}>
        <cylinderGeometry args={[radius, radius * 1.015, 0.12, 72]} />
        <Ceramic />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]}>
        <ringGeometry args={[radius * 0.9, radius * 0.915, 96]} />
        <meshPhysicalMaterial color={CHAMPAGNE} metalness={1} roughness={0.3} />
      </mesh>
    </group>
  );
}

// ============================================================================
// 01 · WALLY TALKY — sculptural audio waveform in brushed aluminium,
// with fine concentric sound rings radiating behind it.
// ============================================================================
const WAVE_HEIGHTS = [0.16, 0.3, 0.52, 0.86, 0.58, 1.12, 0.62, 0.88, 0.5, 0.28, 0.15];

export function WallyTalkySculpture() {
  return (
    <group>
      {WAVE_HEIGHTS.map((h, i) => (
        <RoundedBox
          key={i}
          args={[0.088, h, 0.2]}
          radius={0.026}
          smoothness={3}
          position={[(i - 5) * 0.145, h / 2 + 0.004, 0.12]}
        >
          {i === 5 ? <Champagne /> : <Aluminium />}
        </RoundedBox>
      ))}

      {[0.44, 0.64, 0.84].map((r, i) => (
        <mesh key={r} position={[0, 0.012, -0.22]}>
          <torusGeometry args={[r, 0.007, 8, 96, Math.PI]} />
          {i === 0 ? <Champagne opacity={0.95} /> : <Silver opacity={i === 1 ? 0.65 : 0.4} />}
        </mesh>
      ))}
    </group>
  );
}

// ============================================================================
// 02 · STORYFORGE AI — layered frosted-glass cinematic panels with audio ribs.
// ============================================================================
const PANELS: { pos: [number, number, number]; rotY: number; size: [number, number] }[] = [
  { pos: [-0.2, 0.64, -0.32], rotY: 0.3, size: [0.78, 0.52] },
  { pos: [0.02, 0.57, -0.02], rotY: 0.06, size: [0.84, 0.56] },
  { pos: [0.24, 0.5, 0.28], rotY: -0.22, size: [0.78, 0.52] },
];
const RIB_HEIGHTS = [0.06, 0.12, 0.2, 0.1, 0.27, 0.16, 0.31, 0.12, 0.2, 0.08, 0.05];

function GlassPanel({ pos, rotY, size }: (typeof PANELS)[number]) {
  const [w, h] = size;
  return (
    <group position={pos} rotation={[0, rotY, 0]}>
      <RoundedBox args={[w, h, 0.03]} radius={0.012} smoothness={3} renderOrder={2}>
        <FrostedGlass />
        <Edges color={CHAMPAGNE} threshold={20} />
      </RoundedBox>
      {/* Film-gate rails along the top and bottom edge */}
      {[h / 2 - 0.045, -h / 2 + 0.045].map((y) => (
        <mesh key={y} position={[0, y, 0.02]}>
          <boxGeometry args={[w * 0.9, 0.014, 0.008]} />
          <Graphite />
        </mesh>
      ))}
    </group>
  );
}

export function StoryforgeSculpture() {
  return (
    <group>
      {PANELS.map((p, i) => (
        <GlassPanel key={i} {...p} />
      ))}

      {/* Audio structure: a row of slim ribs along the front of the plinth */}
      {RIB_HEIGHTS.map((h, i) => (
        <RoundedBox
          key={i}
          args={[0.05, h, 0.07]}
          radius={0.015}
          smoothness={2}
          position={[(i - 5) * 0.1, h / 2 + 0.004, 0.66]}
        >
          {i === 6 ? <Champagne /> : <Graphite />}
        </RoundedBox>
      ))}
    </group>
  );
}

// ============================================================================
// 03 · DRAVYAM — miniature architectural warehouse in white ceramic and aluminium.
// ============================================================================
const ROOF_ANGLE = Math.atan2(0.22, 0.45);

export function DravyamSculpture() {
  const wallShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.45, 0);
    s.lineTo(0.45, 0);
    s.lineTo(0.45, 0.5);
    s.lineTo(0, 0.72);
    s.lineTo(-0.45, 0.5);
    s.closePath();
    return s;
  }, []);
  const wallGeo = useMemo(
    () => new THREE.ExtrudeGeometry(wallShape, { depth: 0.8, bevelEnabled: false }),
    [wallShape]
  );
  useEffect(() => () => wallGeo.dispose(), [wallGeo]);

  const slabOffset = 0.02;
  const nx = -Math.sin(ROOF_ANGLE) * slabOffset;
  const ny = Math.cos(ROOF_ANGLE) * slabOffset;

  return (
    <group position={[-0.12, 0, 0]}>
      <mesh geometry={wallGeo} position={[0, 0, -0.45]}>
        <Ceramic />
      </mesh>

      {/* Aluminium roof pitches with a ridge cap */}
      <mesh position={[-0.225 + nx, 0.61 + ny, 0]} rotation={[0, 0, ROOF_ANGLE]}>
        <boxGeometry args={[0.58, 0.03, 0.9]} />
        <Aluminium />
      </mesh>
      <mesh position={[0.225 - nx, 0.61 + ny, 0]} rotation={[0, 0, -ROOF_ANGLE]}>
        <boxGeometry args={[0.58, 0.03, 0.9]} />
        <Aluminium />
      </mesh>
      <mesh position={[0, 0.745, 0]}>
        <boxGeometry args={[0.05, 0.03, 0.92]} />
        <Champagne />
      </mesh>

      {/* Loading-bay shutter */}
      <mesh position={[0, 0.17, 0.356]}>
        <boxGeometry args={[0.36, 0.34, 0.012]} />
        <Graphite />
      </mesh>
      {[0.06, 0.13, 0.2, 0.27].map((y) => (
        <mesh key={y} position={[0, y, 0.364]}>
          <boxGeometry args={[0.34, 0.008, 0.008]} />
          <Silver />
        </mesh>
      ))}

      {/* Inventory crates staged beside the dock */}
      <RoundedBox args={[0.17, 0.17, 0.17]} radius={0.012} position={[0.62, 0.085, 0.12]}>
        <Champagne />
      </RoundedBox>
      <RoundedBox args={[0.17, 0.17, 0.17]} radius={0.012} position={[0.62, 0.085, 0.32]}>
        <Ceramic />
      </RoundedBox>
      <RoundedBox args={[0.17, 0.17, 0.17]} radius={0.012} position={[0.62, 0.255, 0.22]}>
        <Aluminium />
      </RoundedBox>
    </group>
  );
}

// ============================================================================
// 04 · RIDE AGGREGATOR — connected geographic nodes over contoured terrain,
// linked by fine metallic route paths.
// ============================================================================
type Node3 = { p: [number, number]; h: number; r: number; tone: "champagne" | "aluminium" | "ceramic" };

const NODES: Node3[] = [
  { p: [-0.52, -0.12], h: 0.34, r: 0.07, tone: "champagne" },
  { p: [-0.12, 0.42], h: 0.46, r: 0.05, tone: "aluminium" },
  { p: [0.3, -0.3], h: 0.3, r: 0.05, tone: "ceramic" },
  { p: [0.58, 0.22], h: 0.4, r: 0.06, tone: "champagne" },
  { p: [0.02, -0.58], h: 0.26, r: 0.045, tone: "aluminium" },
];
const ROUTES: [number, number][] = [
  [0, 1],
  [1, 3],
  [3, 2],
  [2, 4],
  [4, 0],
  [0, 2],
  [1, 2],
];

function NodeTone({ tone }: { tone: Node3["tone"] }) {
  if (tone === "champagne") return <Champagne />;
  if (tone === "ceramic") return <Ceramic />;
  return <Aluminium />;
}

export function RideAggregatorSculpture() {
  const routeGeos = useMemo(
    () =>
      ROUTES.map(([a, b]) => {
        const A = NODES[a];
        const B = NODES[b];
        const p0 = new THREE.Vector3(A.p[0], A.h, A.p[1]);
        const p2 = new THREE.Vector3(B.p[0], B.h, B.p[1]);
        const p1 = p0.clone().add(p2).multiplyScalar(0.5);
        p1.y += 0.1 + p0.distanceTo(p2) * 0.16;
        return new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(p0, p1, p2), 28, 0.009, 6, false);
      }),
    []
  );
  useEffect(() => () => routeGeos.forEach((g) => g.dispose()), [routeGeos]);

  return (
    <group>
      {/* Contour layers read as a miniature topographic relief */}
      {[
        { r: 0.76, y: 0.02, c: [0.0, 0.0], tone: "#F3F4F2" },
        { r: 0.54, y: 0.056, c: [0.06, 0.04], tone: "#EDEEEC" },
        { r: 0.32, y: 0.092, c: [0.14, 0.0], tone: "#E7E9E6" },
      ].map((l) => (
        <mesh key={l.r} position={[l.c[0], l.y, l.c[1]]} scale={[1, 1, 0.9]}>
          <cylinderGeometry args={[l.r, l.r, 0.036, 64]} />
          <Ceramic color={l.tone} />
        </mesh>
      ))}

      {NODES.map((n, i) => (
        <group key={i} position={[n.p[0], 0, n.p[1]]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.11, 0]}>
            <ringGeometry args={[n.r * 1.5, n.r * 1.8, 40]} />
            <Graphite />
          </mesh>
          <mesh position={[0, n.h / 2, 0]}>
            <cylinderGeometry args={[0.012, 0.012, n.h, 12]} />
            <Aluminium />
          </mesh>
          <mesh position={[0, n.h, 0]}>
            <sphereGeometry args={[n.r, 32, 24]} />
            <NodeTone tone={n.tone} />
          </mesh>
        </group>
      ))}

      {routeGeos.map((g, i) => (
        <mesh key={i} geometry={g}>
          <Champagne />
        </mesh>
      ))}
    </group>
  );
}

// ============================================================================
// 05 · FINANCIAL DATA SCRAPER — stepped metallic tiers: extract, transform,
// load. Structured columns rise from the top tier; conduits link the stages.
// ============================================================================
const COLUMNS = [
  [0.1, 0.18, 0.12],
  [0.18, 0.3, 0.2],
  [0.28, 0.5, 0.34],
  [0.4, 0.7, 0.46],
];

export function FinancialScraperSculpture() {
  const pins = (y: number, hx: number, hz: number) =>
    [
      [-hx, hz],
      [hx, hz],
      [-hx, -hz],
      [hx, -hz],
    ].map(([x, z], i) => (
      <mesh key={`${y}-${i}`} position={[x, y, z]}>
        <cylinderGeometry args={[0.02, 0.02, 0.06, 16]} />
        <Champagne />
      </mesh>
    ));

  return (
    <group>
      {/* Tier 1 — extract */}
      <RoundedBox args={[1.5, 0.08, 0.86]} radius={0.015} smoothness={3} position={[0, 0.04, 0]}>
        <Graphite />
      </RoundedBox>
      {pins(0.11, 0.6, 0.3)}
      {/* Tier 2 — transform */}
      <RoundedBox args={[1.32, 0.06, 0.74]} radius={0.014} smoothness={3} position={[0, 0.17, 0]}>
        <Aluminium />
      </RoundedBox>
      {pins(0.23, 0.52, 0.26)}
      {/* Tier 3 — load (frosted glass) */}
      <RoundedBox args={[1.14, 0.06, 0.62]} radius={0.014} smoothness={3} position={[0, 0.29, 0]} renderOrder={2}>
        <FrostedGlass />
        <Edges color={CHAMPAGNE} threshold={20} />
      </RoundedBox>

      {/* Data conduits along the stepped front edges */}
      {[
        { y: 0.09, z: 0.45, len: 1.5 },
        { y: 0.21, z: 0.39, len: 1.32 },
        { y: 0.33, z: 0.33, len: 1.14 },
      ].map((r) => (
        <mesh key={r.y} position={[0, r.y, r.z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.011, 0.011, r.len, 16]} />
          <Champagne />
        </mesh>
      ))}

      {/* Structured columns */}
      {COLUMNS.map((col, xi) =>
        col.map((h, zi) => (
          <RoundedBox
            key={`${xi}-${zi}`}
            args={[0.1, h, 0.1]}
            radius={0.012}
            smoothness={2}
            position={[(xi - 1.5) * 0.22, 0.32 + h / 2, (zi - 1) * 0.19]}
          >
            {xi === 3 && zi === 1 ? <Champagne /> : <Aluminium color="#E4E7E5" />}
          </RoundedBox>
        ))
      )}
    </group>
  );
}
