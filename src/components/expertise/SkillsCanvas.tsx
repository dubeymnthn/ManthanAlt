"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { SkillsScene3D } from "./SkillsScene3D";
import { SkillNode, SkillCategory } from "@/data/skills";
import styles from "./SkillsExplorer.module.scss";

interface SkillsCanvasProps {
  selectedCategory: SkillCategory | "ALL";
  selectedSkill: SkillNode | null;
  onSelectSkill: (skill: SkillNode) => void;
}

export function SkillsCanvas({
  selectedCategory,
  selectedSkill,
  onSelectSkill,
}: SkillsCanvasProps) {
  return (
    <div className={styles.canvasContainer}>
      <Canvas
        camera={{ position: [0, 1.5, 7.5], fov: 48 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <SkillsScene3D
            selectedCategory={selectedCategory}
            selectedSkill={selectedSkill}
            onSelectSkill={onSelectSkill}
          />
        </Suspense>
      </Canvas>

      {/* 3D Viewport Controls Guide */}
      <div className={styles.viewportHint} aria-hidden="true">
        <span className={styles.hintDot} />
        <span>ORBIT: DRAG TO ROTATE / SCROLL TO ZOOM / CLICK NODE TO INSPECT</span>
      </div>
    </div>
  );
}
