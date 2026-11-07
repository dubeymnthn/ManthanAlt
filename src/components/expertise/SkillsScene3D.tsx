"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { skillsData, SkillNode, SkillCategory } from "@/data/skills";
import { soundManager } from "@/lib/sound";

interface SkillsScene3DProps {
  selectedCategory: SkillCategory | "ALL";
  selectedSkill: SkillNode | null;
  onSelectSkill: (skill: SkillNode) => void;
}

const CATEGORY_COLORS: Record<SkillCategory, string> = {
  Frontend: "#C5F36B",
  Backend: "#879B67",
  Mobile: "#A3E635",
  Databases: "#4ADE80",
  "Infrastructure & DevOps": "#E2E8F0",
  "AI & Automation": "#FACC15",
};

export function SkillsScene3D({
  selectedCategory,
  selectedSkill,
  onSelectSkill,
}: SkillsScene3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const hoveredNodeRef = useRef<string | null>(null);

  // Filter skills based on selected category
  const activeSkills = useMemo(() => {
    if (selectedCategory === "ALL") return skillsData;
    return skillsData.filter((s) => s.category === selectedCategory);
  }, [selectedCategory]);

  // Generate connection lines between related skills
  const lineData = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const skillMap = new Map<string, SkillNode>();
    skillsData.forEach((s) => skillMap.set(s.id, s));

    const renderedPairs = new Set<string>();

    activeSkills.forEach((skill) => {
      skill.related.forEach((relId) => {
        const target = skillMap.get(relId);
        if (target) {
          const pairKey = [skill.id, target.id].sort().join("-");
          if (!renderedPairs.has(pairKey)) {
            renderedPairs.add(pairKey);
            points.push(new THREE.Vector3(...skill.position));
            points.push(new THREE.Vector3(...target.position));
          }
        }
      });
    });

    const geom = new THREE.BufferGeometry().setFromPoints(points);
    return geom;
  }, [activeSkills]);

  // Slow continuous rotation when user isn't dragging
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <>
      <OrbitControls
        enableZoom={true}
        minDistance={3.5}
        maxDistance={9.5}
        enablePan={false}
        autoRotate={false}
        dampingFactor={0.05}
      />

      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 7]} intensity={1.2} />
      <pointLight position={[0, 0, 0]} intensity={1.5} color="#C5F36B" distance={8} />

      <group ref={groupRef}>
        {/* Constellation Connection Grid */}
        <lineSegments geometry={lineData}>
          <lineBasicMaterial
            color="#879B67"
            opacity={0.3}
            transparent
            depthWrite={false}
          />
        </lineSegments>

        {/* 3D Skill Nodes */}
        {skillsData.map((skill) => {
          const isCategoryMatch =
            selectedCategory === "ALL" || skill.category === selectedCategory;
          const isSelected = selectedSkill?.id === skill.id;
          const isRelatedToSelected =
            selectedSkill?.related.includes(skill.id) || false;

          const nodeColor = isSelected
            ? "#ffffff"
            : isRelatedToSelected
            ? "#C5F36B"
            : CATEGORY_COLORS[skill.category] || "#999D92";

          const opacity = isCategoryMatch ? 1 : 0.15;
          const scale = isSelected ? 1.5 : isRelatedToSelected ? 1.25 : 1;

          return (
            <group
              key={skill.id}
              position={skill.position}
              scale={[scale, scale, scale]}
              onClick={(e) => {
                e.stopPropagation();
                soundManager.playNodeSelect();
                onSelectSkill(skill);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                hoveredNodeRef.current = skill.id;
                soundManager.playHover();
                document.body.style.cursor = "pointer";
              }}
              onPointerOut={() => {
                hoveredNodeRef.current = null;
                document.body.style.cursor = "auto";
              }}
            >
              {/* Core Skill Node */}
              <mesh>
                {skill.featured ? (
                  <octahedronGeometry args={[0.22, 0]} />
                ) : (
                  <boxGeometry args={[0.22, 0.22, 0.22]} />
                )}
                <meshStandardMaterial
                  color={nodeColor}
                  emissive={nodeColor}
                  emissiveIntensity={isSelected ? 0.8 : isRelatedToSelected ? 0.5 : 0.2}
                  roughness={0.2}
                  metalness={0.8}
                  transparent
                  opacity={opacity}
                />
              </mesh>

              {/* Orbital Ring on Selected */}
              {isSelected && (
                <mesh>
                  <ringGeometry args={[0.35, 0.38, 24]} />
                  <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
                </mesh>
              )}

              {/* Text Label in 3D Space for Featured or Selected */}
              {(skill.featured || isSelected || isRelatedToSelected) && isCategoryMatch && (
                <Html
                  position={[0, 0.38, 0]}
                  center
                  distanceFactor={8}
                  style={{
                    pointerEvents: "none",
                    fontFamily: "var(--font-ibm-plex-mono)",
                    fontSize: isSelected ? "11px" : "9px",
                    fontWeight: isSelected ? 700 : 500,
                    letterSpacing: "0.08em",
                    color: isSelected ? "#C5F36B" : "#F1F0E8",
                    backgroundColor: "rgba(17, 19, 16, 0.85)",
                    padding: "2px 6px",
                    border: `1px solid ${isSelected ? "#C5F36B" : "#30352D"}`,
                    whiteSpace: "nowrap",
                    transform: "translate3d(0, 0, 0)",
                    userSelect: "none",
                  }}
                >
                  {skill.name.toUpperCase()}
                </Html>
              )}
            </group>
          );
        })}
      </group>
    </>
  );
}
