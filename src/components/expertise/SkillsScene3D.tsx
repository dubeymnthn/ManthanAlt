"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { skillsData, SkillNode, SkillCategory } from "@/data/skills";
import { soundManager } from "@/lib/sound";
import { THEME_PALETTE, useResolvedTheme, type ThemeName } from "@/lib/theme";

interface SkillsScene3DProps {
  selectedCategory: SkillCategory | "ALL";
  selectedSkill: SkillNode | null;
  onSelectSkill: (skill: SkillNode) => void;
}

interface ConstellationPalette {
  categories: Record<SkillCategory, string>;
  fallbackNode: string;
  selectedNode: string;
  relatedNode: string;
  /** Emissive tint for selected and related nodes. */
  highlightGlow: string;
  emissiveIntensity: { selected: number; related: number; idle: number };
  links: string;
  linksOpacity: number;
  selectionRing: string;
  ambientIntensity: number;
  keyLight: string;
  keyIntensity: number;
  coreGlow: string;
  coreGlowIntensity: number;
}

const LIGHT = THEME_PALETTE.light;
const DARK = THEME_PALETTE.dark;

/**
 * Day: deep ink/forest nodes on ivory. Night: luminous category hues on the night
 * surface with a chartreuse glow. Material and light colors are plain props, so R3F
 * updates them in place when the theme flips.
 */
const CONSTELLATION_PALETTES: Record<ThemeName, ConstellationPalette> = {
  light: {
    categories: {
      Frontend: LIGHT.primary,
      Backend: LIGHT.accentStrong,
      Mobile: "#376E37",
      Databases: "#285E52",
      "Infrastructure & DevOps": "#4A6B5D",
      "AI & Automation": "#5E7E38",
    },
    fallbackNode: LIGHT.secondary,
    selectedNode: LIGHT.primary,
    relatedNode: LIGHT.accentStrong,
    highlightGlow: LIGHT.accentStrong,
    emissiveIntensity: { selected: 0.6, related: 0.4, idle: 0.1 },
    links: LIGHT.accentStrong,
    linksOpacity: 0.35,
    selectionRing: LIGHT.accentStrong,
    ambientIntensity: 0.75,
    keyLight: "#FFFFFF",
    keyIntensity: 1.4,
    coreGlow: LIGHT.accentStrong,
    coreGlowIntensity: 1.2,
  },
  dark: {
    categories: {
      Frontend: DARK.primary,
      Backend: DARK.accent,
      Mobile: "#7CC47F",
      Databases: "#6CC3AE",
      "Infrastructure & DevOps": "#9FB8AB",
      "AI & Automation": "#D4D97A",
    },
    fallbackNode: DARK.secondary,
    selectedNode: "#F4F7F1",
    relatedNode: DARK.accentStrong,
    highlightGlow: DARK.accent,
    emissiveIntensity: { selected: 0.6, related: 0.45, idle: 0.22 },
    links: DARK.accent,
    linksOpacity: 0.28,
    selectionRing: DARK.accentStrong,
    ambientIntensity: 0.45,
    keyLight: DARK.primary,
    keyIntensity: 1.1,
    coreGlow: DARK.accent,
    coreGlowIntensity: 1.6,
  },
};

export function SkillsScene3D({
  selectedCategory,
  selectedSkill,
  onSelectSkill,
}: SkillsScene3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const hoveredNodeRef = useRef<string | null>(null);
  const palette = CONSTELLATION_PALETTES[useResolvedTheme()];

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

      <ambientLight intensity={palette.ambientIntensity} />
      <directionalLight position={[5, 10, 7]} intensity={palette.keyIntensity} color={palette.keyLight} />
      <pointLight position={[0, 0, 0]} intensity={palette.coreGlowIntensity} color={palette.coreGlow} distance={8} />

      <group ref={groupRef}>
        {/* Constellation Connection Grid */}
        <lineSegments geometry={lineData}>
          <lineBasicMaterial
            color={palette.links}
            opacity={palette.linksOpacity}
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
            ? palette.selectedNode
            : isRelatedToSelected
            ? palette.relatedNode
            : palette.categories[skill.category] || palette.fallbackNode;

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
                  emissive={isSelected || isRelatedToSelected ? palette.highlightGlow : nodeColor}
                  emissiveIntensity={
                    isSelected
                      ? palette.emissiveIntensity.selected
                      : isRelatedToSelected
                      ? palette.emissiveIntensity.related
                      : palette.emissiveIntensity.idle
                  }
                  roughness={0.25}
                  metalness={0.5}
                  transparent
                  opacity={opacity}
                />
              </mesh>

              {/* Orbital Ring on Selected */}
              {isSelected && (
                <mesh>
                  <ringGeometry args={[0.35, 0.38, 24]} />
                  <meshBasicMaterial color={palette.selectionRing} side={THREE.DoubleSide} />
                </mesh>
              )}

              {/* Text Label in 3D Space for Featured or Selected (real DOM: themed via CSS tokens) */}
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
                    color: isSelected ? "var(--accent-muted)" : "var(--text-primary)",
                    backgroundColor: "var(--surface-glass-strong)",
                    padding: "3px 7px",
                    border: `1px solid ${isSelected ? "var(--accent-muted)" : "var(--border-color)"}`,
                    boxShadow: "var(--shadow-label)",
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
