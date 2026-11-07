"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { soundManager } from "@/lib/sound";

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
      {/* Ambient and Specular Lighting tuned for Light Editorial surfaces */}
      <ambientLight intensity={0.75} />
      <directionalLight position={[6, 8, 5]} intensity={1.4} color="#ffffff" />
      <directionalLight position={[-6, -4, -4]} intensity={0.6} color="#72953F" />
      <pointLight position={[0, 0, 0]} intensity={1.2} color="#72953F" distance={4} />

      {/* Interconnecting Wireframe Guides */}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color="#72953F" opacity={0.4} transparent depthWrite={false} />
      </lineSegments>

      {/* Floating Orbital Rings */}
      <mesh ref={ringRef1} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[2.4, 0.012, 16, 80]} />
        <meshBasicMaterial color="#72953F" opacity={0.35} transparent />
      </mesh>
      <mesh ref={ringRef2} rotation={[-Math.PI / 3, Math.PI / 6, 0]}>
        <torusGeometry args={[2.7, 0.009, 16, 80]} />
        <meshBasicMaterial color="#1D2921" opacity={0.25} transparent />
      </mesh>
      <mesh ref={ringRef3} rotation={[Math.PI / 6, -Math.PI / 4, 0]}>
        <torusGeometry args={[3.0, 0.007, 16, 80]} />
        <meshBasicMaterial color="#DDE4D9" opacity={0.6} transparent />
      </mesh>

      {/* Floating Particles (Data Packets) */}
      <points ref={particlesRef} geometry={particles}>
        <pointsMaterial size={0.035} color="#72953F" transparent opacity={0.65} sizeAttenuation />
      </points>

      {/* Modules */}
      {MODULES.map((mod) => {
        const isHovered = hoveredId === mod.id;
        const isCore = mod.id === "core-alpha";

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
                color={isHovered ? "#B7DB72" : isCore ? "#1D2921" : "#FFFFFF"}
                metalness={0.3}
                roughness={0.35}
                emissive={isHovered ? "#72953F" : isCore ? "#1D2921" : "#EEF2E9"}
                emissiveIntensity={isHovered ? 0.6 : 0.15}
              />
            </mesh>

            {/* Wireframe Outline for Architectural Technical Aesthetic */}
            <lineSegments>
              <edgesGeometry
                args={[
                  isCore
                    ? new THREE.OctahedronGeometry(0.855, 0)
                    : new THREE.BoxGeometry(
                        mod.size[0] + 0.015,
                        mod.size[1] + 0.015,
                        mod.size[2] + 0.015
                      ),
                ]}
              />
              <lineBasicMaterial
                color={isHovered ? "#1D2921" : isCore ? "#72953F" : "#72953F"}
                opacity={isHovered ? 1 : 0.65}
                transparent
              />
            </lineSegments>
          </group>
        );
      })}
    </group>
  );
}
