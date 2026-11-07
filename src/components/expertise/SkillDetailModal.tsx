"use client";

import { X, ArrowRight, Layers, Tag } from "lucide-react";
import styles from "./SkillsExplorer.module.scss";
import { SkillNode, skillsData } from "@/data/skills";
import { soundManager } from "@/lib/sound";

interface SkillDetailModalProps {
  skill: SkillNode | null;
  onClose: () => void;
  onSelectSkill: (skill: SkillNode) => void;
}

export function SkillDetailModal({
  skill,
  onClose,
  onSelectSkill,
}: SkillDetailModalProps) {
  if (!skill) return null;

  const relatedNodes = skillsData.filter((s) => skill.related.includes(s.id));

  return (
    <div className={styles.detailDrawer} role="region" aria-label="Skill Detail Panel">
      <div className={styles.drawerHeader}>
        <div className={styles.drawerMeta}>
          <Tag size={13} className={styles.drawerIcon} />
          <span className={styles.categoryLabel}>{skill.category.toUpperCase()}</span>
          <span className={styles.drawerSep}>/</span>
          <span className={styles.nodeStatus}>NODE: INSPECTED</span>
        </div>
        <button
          type="button"
          className={styles.drawerCloseBtn}
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          aria-label="Close Skill Details"
        >
          <X size={15} />
        </button>
      </div>

      <div className={styles.drawerBody}>
        <h4 className={styles.skillTitle}>{skill.name}</h4>
        <p className={styles.skillDesc}>{skill.description}</p>

        {/* Architectural Context */}
        <div className={styles.contextBox}>
          <span className={styles.contextLabel}>SYSTEM IMPLEMENTATION CONTEXT:</span>
          <p className={styles.contextText}>
            Used across production services for enterprise systems, data pipelines, and responsive client architectures.
          </p>
        </div>

        {/* Connected / Related Technologies */}
        {relatedNodes.length > 0 && (
          <div className={styles.relatedGroup}>
            <span className={styles.relatedTitle}>
              <Layers size={13} />
              <span>CONNECTED MESH NODES ({relatedNodes.length}):</span>
            </span>
            <div className={styles.relatedPills}>
              {relatedNodes.map((rel) => (
                <button
                  key={rel.id}
                  type="button"
                  className={styles.relatedBtn}
                  onClick={() => {
                    soundManager.playClick();
                    onSelectSkill(rel);
                  }}
                  onMouseEnter={() => soundManager.playHover()}
                >
                  <span>{rel.name}</span>
                  <ArrowRight size={12} className={styles.relArrow} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
