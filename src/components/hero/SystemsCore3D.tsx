"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { soundManager } from "@/lib/sound";
import { THEME_PALETTE, useResolvedTheme, type ThemeName } from "@/lib/theme";

interface ModuleData {
  id: string;
  name: string;
  type: "core" | "memory" | "bus" | "processor" | "gateway";
  position: [number, number, number];
  size: [number, number, number];
  rotation?: [number, number, number];
}

const MODULES: ModuleData[] = [
  // Central Core Processor
  { id: "core-alpha", name: "CENTRAL_KERNEL", type: "core", position: [0, 0, 0], size: [1.1, 1.1, 1.1] },
  // Surrounding Memory & Computing Units
  { id: "mod-01", name: "BUS_ROUTER_01", type: "bus", position: [1.6, 0.8, -0.4], size: [0.65, 0.35, 0.65] },
  { id: "mod-02", name: "ASYNC_WORKER", type: "processor", position: [-1.5, 0.9, 0.5], size: [0.55, 0.75, 0.55] },
  { id: "mod-03", name: "CACHE_L1", type: "memory", position: [0.8, -1.4, 0.7], size: [0.75, 0.4, 0.75] },
  { id: "mod-04", name: "GATEWAY_PROXY", type: "gateway", position: [-1.1, -1.2, -0.8], size: [0.6, 0.6, 0.4] },
  { id: "mod-05", name: "EVENT_STREAM", type: "bus", position: [0.2, 1.8, -0.5], size: [0.8, 0.25, 0.8] },
  { id: "mod-06", name: "STATE_REGISTRY", type: "processor", position: [-0.6, -1.9, 0.3], size: [0.5, 0.5, 0.5] },
];

interface NodeLook {
  color: string;
  emissive: string;
  emissiveIntensity: number;
  edge: string;
  edgeOpacity: number;
}

interface CorePalette {
  ambientIntensity: number;
  keyLight: string;
  keyIntensity: number;
  rimLight: string;
  rimIntensity: number;
  coreGlow: string;
  coreGlowIntensity: number;
  links: string;
  linksOpacity: number;
  rings: [string, number][];
  particles: string;
  particlesOpacity: number;
  module: NodeLook;
  core: NodeLook;
  hovered: NodeLook;
}

const LIGHT = THEME_PALETTE.light;
const DARK = THEME_PALETTE.dark;

/**
 * Day: machined white modules around a dark ink kernel. Night: dark modules on the
 * night surface with chartreuse edges, a glowing kernel and phosphor-like particles.
 * Colors are plain material props, so R3F updates the existing materials and lights
 * in place when the theme flips (no remount, no per-frame work).
 */
const CORE_PALETTES: Record<ThemeName, CorePalette> = {
  light: {
    ambientIntensity: 0.75,
    keyLight: "#FFFFFF",
    keyIntensity: 1.4,
    rimLight: LIGHT.accentStrong,
    rimIntensity: 0.6,
    coreGlow: LIGHT.accentStrong,
    coreGlowIntensity: 1.2,
    links: LIGHT.accentStrong,
    linksOpacity: 0.4,
    rings: [
      [LIGHT.accentStrong, 0.35],
      [LIGHT.primary, 0.25],
      [LIGHT.border, 0.6],
    ],
    particles: LIGHT.accentStrong,
    particlesOpacity: 0.65,
    module: { color: LIGHT.surface, emissive: LIGHT.surfaceMuted, emissiveIntensity: 0.15, edge: LIGHT.accentStrong, edgeOpacity: 0.65 },
    core: { color: LIGHT.primary, emissive: LIGHT.primary, emissiveIntensity: 0.15, edge: LIGHT.accentStrong, edgeOpacity: 0.65 },
    hovered: { color: LIGHT.accent, emissive: LIGHT.accentStrong, emissiveIntensity: 0.6, edge: LIGHT.primary, edgeOpacity: 1 },
  },
  dark: {
    ambientIntensity: 0.4,
    keyLight: DARK.primary,
    keyIntensity: 1.1,
    rimLight: DARK.accent,
    rimIntensity: 0.9,
    coreGlow: DARK.accent,
    coreGlowIntensity: 1.8,
    links: DARK.accent,
    linksOpacity: 0.32,
    rings: [
      [DARK.accent, 0.4],
      [DARK.primary, 0.12],
      [DARK.border, 0.9],
    ],
    particles: DARK.accentStrong,
    particlesOpacity: 0.7,
    module: { color: DARK.surfaceMuted, emissive: DARK.darkSection, emissiveIntensity: 0.35, edge: DARK.accent, edgeOpacity: 0.75 },
    core: { color: DARK.darkSection, emissive: DARK.accent, emissiveIntensity: 0.35, edge: DARK.accentStrong, edgeOpacity: 0.9 },
    hovered: { color: DARK.accentStrong, emissive: DARK.accent, emissiveIntensity: 0.7, edge: DARK.primary, edgeOpacity: 1 },
  },
};

export function SystemsCore3D({
  onHoverModule,
}: {
  onHoverModule?: (name: string | null) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);
  const ringRef3 = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { pointer } = useThree();
  const palette = CORE_PALETTES[useResolvedTheme()];

  // Create subtle connection lines between modules and the core
  const lineGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const corePos = new THREE.Vector3(0, 0, 0);

    MODULES.forEach((mod) => {
      if (mod.id !== "core-alpha") {
        points.push(corePos);
        points.push(new THREE.Vector3(...mod.position));
      }
    });

    // Interconnect between outer modules for a networked constellation effect
    points.push(new THREE.Vector3(...MODULES[1].position), new THREE.Vector3(...MODULES[2].position));
    points.push(new THREE.Vector3(...MODULES[2].position), new THREE.Vector3(...MODULES[4].position));
    points.push(new THREE.Vector3(...MODULES[3].position), new THREE.Vector3(...MODULES[4].position));
    points.push(new THREE.Vector3(...MODULES[1].position), new THREE.Vector3(...MODULES[5].position));

    const geom = new THREE.BufferGeometry().setFromPoints(points);
    return geom;
  }, []);

  // Procedural subtle background particle cloud (data packets)
  const particles = useMemo(() => {
    const count = 120;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 2.2 + Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return geom;
  }, []);

  // Source shapes for the wireframe outlines, created once (previously rebuilt on every render).
  const edgeSources = useMemo(
    () =>
      MODULES.map((mod) =>
        mod.id === "core-alpha"
          ? new THREE.OctahedronGeometry(0.855, 0)
          : new THREE.BoxGeometry(mod.size[0] + 0.015, mod.size[1] + 0.015, mod.size[2] + 0.015)
      ),
    []
  );

  // Animation frame loop with smooth dampening
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Smooth idle rotation
      groupRef.current.rotation.y += delta * 0.22;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        pointer.y * 0.35 + 0.1,
        0.05
      );
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        -pointer.x * 0.35,
        0.05
      );
    }

    if (ringRef1.current) ringRef1.current.rotation.z += delta * 0.18;
    if (ringRef2.current) ringRef2.current.rotation.x += delta * 0.12;
    if (ringRef3.current) ringRef3.current.rotation.y += delta * -0.15;

    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.05;
    }
  });

  const handlePointerOver = (name: string, id: string) => {
    setHoveredId(id);
    onHoverModule?.(name);
    soundManager.playHover();
  };

  const handlePointerOut = () => {
    setHoveredId(null);
    onHoverModule?.(null);
  };

  return (
    <group ref={groupRef}>
      {/* Lighting: bright editorial key by day; dim key with chartreuse rim and core glow by night */}
      <ambientLight intensity={palette.ambientIntensity} />
      <directionalLight position={[6, 8, 5]} intensity={palette.keyIntensity} color={palette.keyLight} />
      <directionalLight position={[-6, -4, -4]} intensity={palette.rimIntensity} color={palette.rimLight} />
      <pointLight position={[0, 0, 0]} intensity={palette.coreGlowIntensity} color={palette.coreGlow} distance={4} />

      {/* Interconnecting Wireframe Guides */}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color={palette.links} opacity={palette.linksOpacity} transparent depthWrite={false} />
      </lineSegments>

      {/* Floating Orbital Rings */}
      <mesh ref={ringRef1} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[2.4, 0.012, 16, 80]} />
        <meshBasicMaterial color={palette.rings[0][0]} opacity={palette.rings[0][1]} transparent />
      </mesh>
      <mesh ref={ringRef2} rotation={[-Math.PI / 3, Math.PI / 6, 0]}>
        <torusGeometry args={[2.7, 0.009, 16, 80]} />
        <meshBasicMaterial color={palette.rings[1][0]} opacity={palette.rings[1][1]} transparent />
      </mesh>
      <mesh ref={ringRef3} rotation={[Math.PI / 6, -Math.PI / 4, 0]}>
        <torusGeometry args={[3.0, 0.007, 16, 80]} />
        <meshBasicMaterial color={palette.rings[2][0]} opacity={palette.rings[2][1]} transparent />
      </mesh>

      {/* Floating Particles (Data Packets) */}
      <points ref={particlesRef} geometry={particles}>
        <pointsMaterial size={0.035} color={palette.particles} transparent opacity={palette.particlesOpacity} sizeAttenuation />
      </points>

      {/* Modules */}
      {MODULES.map((mod, index) => {
        const isHovered = hoveredId === mod.id;
        const isCore = mod.id === "core-alpha";
        const look = isHovered ? palette.hovered : isCore ? palette.core : palette.module;

        return (
          <group
            key={mod.id}
            position={mod.position}
            onPointerOver={(e) => {
              e.stopPropagation();
              handlePointerOver(mod.name, mod.id);
            }}
            onPointerOut={handlePointerOut}
          >
            {/* Base Machined Mesh */}
            <mesh>
              {isCore ? (
                <octahedronGeometry args={[0.85, 0]} />
              ) : (
                <boxGeometry args={mod.size} />
              )}
              <meshStandardMaterial
                color={look.color}
                metalness={0.3}
                roughness={0.35}
                emissive={look.emissive}
                emissiveIntensity={look.emissiveIntensity}
              />
            </mesh>

            {/* Wireframe Outline for Architectural Technical Aesthetic */}
            <lineSegments>
              <edgesGeometry args={[edgeSources[index]]} />
              <lineBasicMaterial color={look.edge} opacity={look.edgeOpacity} transparent />
            </lineSegments>
          </group>
        );
      })}
    </group>
  );
}
