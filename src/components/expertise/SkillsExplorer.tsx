"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import styles from "./SkillsExplorer.module.scss";
import { SkillCategory, SkillNode, skillCategories } from "@/data/skills";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SkillSearch } from "./SkillSearch";
import { SkillDetailModal } from "./SkillDetailModal";
import { soundManager } from "@/lib/sound";
import { useWebGLSupport } from "@/hooks/useWebGLSupport";
import { WebGLFallback } from "@/components/shared/WebGLFallback";

const SkillsCanvas = dynamic(
  () => import("./SkillsCanvas").then((mod) => mod.SkillsCanvas),
  {
    ssr: false,
    loading: () => <WebGLFallback label="LOADING 3D SKILLS CONSTELLATION..." />,
  }
);

export function SkillsExplorer() {
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | "ALL">("ALL");
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null);
  const hasWebGL = useWebGLSupport();

  const handleCategorySelect = (category: SkillCategory | "ALL") => {
    soundManager.playClick();
    setSelectedCategory(category);
  };

  return (
    <section className={styles.section} id="expertise" aria-label="Technical Expertise">
      <div className={styles.container}>
        {/* Section Heading */}
        <SectionHeading
          index="02"
          tag="TECHNICAL EXPERTISE"
          title="A toolkit for building complete products."
          subtitle="An interactive 3D technical constellation and categorized directory spanning full-stack web, distributed systems, mobile architectures, databases, infrastructure, and applied AI."
        />

        {/* 3D Visualization Wrapper */}
        <div className={styles.constellationBox}>
          {/* Constellation Header & Category Filters */}
          <div className={styles.boxHeader}>
            <div className={styles.boxTitle}>
              <span className={styles.dot} />
              <span>3D ARCHITECTURE CONSTELLATION</span>
            </div>

            <div className={styles.categoryPills}>
              <button
                type="button"
                className={`${styles.filterBtn} ${selectedCategory === "ALL" ? styles.activeFilter : ""}`}
                onClick={() => handleCategorySelect("ALL")}
              >
                ALL
              </button>
              {skillCategories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`${styles.filterBtn} ${selectedCategory === c.id ? styles.activeFilter : ""}`}
                  onClick={() => handleCategorySelect(c.id)}
                  onMouseEnter={() => soundManager.playHover()}
                >
                  {c.id.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* 3D Viewport */}
          <div className={styles.viewport}>
            {hasWebGL ? (
              <SkillsCanvas
                selectedCategory={selectedCategory}
                selectedSkill={selectedSkill}
                onSelectSkill={setSelectedSkill}
              />
            ) : (
              <WebGLFallback label="2D ARCHITECTURE VIEW" />
            )}

            {/* Active Skill Inspector Drawer Overlay */}
            {selectedSkill && (
              <SkillDetailModal
                skill={selectedSkill}
                onClose={() => setSelectedSkill(null)}
                onSelectSkill={setSelectedSkill}
              />
            )}
          </div>
        </div>

        {/* Searchable Skill Directory */}
        <SkillSearch
          onSelectSkill={setSelectedSkill}
          selectedSkill={selectedSkill}
        />
      </div>
    </section>
  );
}
