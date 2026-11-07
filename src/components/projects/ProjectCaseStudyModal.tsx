"use client";

import { useEffect } from "react";
import { X, ArrowUpRight, CheckCircle2, AlertCircle, Layers } from "lucide-react";
import styles from "./ProjectCard.module.scss";
import { Project } from "@/data/projects";
import { soundManager } from "@/lib/sound";
import { ProjectArchitectureDiagram } from "./ProjectArchitectureDiagram";

interface ProjectCaseStudyModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectCaseStudyModal({ project, onClose }: ProjectCaseStudyModalProps) {
  useEffect(() => {
    if (!project) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        soundManager.playClick();
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className={styles.modalBackdrop} onClick={onClose} />

      <div className={styles.modalContainer}>
        {/* Modal Top Bar */}
        <div className={styles.modalHeader}>
          <div className={styles.modalMeta}>
            <span className={styles.modalIndex}>{project.index}</span>
            <span className={styles.modalDivider}>/</span>
            <span className={styles.modalCategory}>{project.category}</span>
            <span className={styles.modalStatus}>[{project.status.toUpperCase()}]</span>
          </div>

          <button
            type="button"
            className={styles.modalCloseBtn}
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            aria-label="Close Case Study"
          >
            <span>CLOSE</span>
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className={styles.modalBody}>
          <div className={styles.modalIntro}>
            <h3 id="modal-title" className={styles.modalTitle}>
              {project.title}
            </h3>
            <p className={styles.modalTagline}>{project.tagline}</p>
            <div className={styles.metaPills}>
              <span className={styles.metaPill}>ROLE: {project.role}</span>
              <span className={styles.metaPill}>TIMELINE: {project.timeline}</span>
            </div>
          </div>

          {/* Architecture Diagram Visualization */}
          <div className={styles.modalDiagramWrap}>
            <ProjectArchitectureDiagram type={project.schematicType} title={project.title} />
          </div>

          {/* Summary */}
          <div className={styles.modalSection}>
            <h4 className={styles.sectionTitle}>
              <Layers size={14} className={styles.iconAccent} />
              <span>SYSTEM ARCHITECTURE & OVERVIEW</span>
            </h4>
            <p className={styles.sectionParagraph}>{project.summary}</p>
            <p className={styles.sectionParagraph}>{project.architecture.description}</p>
          </div>

          {/* Execution Pipeline Flow */}
          <div className={styles.modalSection}>
            <h4 className={styles.sectionTitle}>
              <span>EXECUTION LIFECYCLE FLOW</span>
            </h4>
            <div className={styles.flowList}>
              {project.architecture.flow.map((step, idx) => (
                <div key={idx} className={styles.flowItem}>
                  <span className={styles.flowIndex}>0{idx + 1}</span>
                  <span className={styles.flowText}>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Component Roles */}
          <div className={styles.modalSection}>
            <h4 className={styles.sectionTitle}>
              <span>CORE ARCHITECTURAL COMPONENTS</span>
            </h4>
            <div className={styles.componentsGrid}>
              {project.architecture.components.map((comp, idx) => (
                <div key={idx} className={styles.componentCard}>
                  <div className={styles.compHead}>
                    <span className={styles.compName}>{comp.name}</span>
                    <span className={styles.compTech}>{comp.tech}</span>
                  </div>
                  <p className={styles.compRole}>{comp.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Challenges & Solutions */}
          <div className={styles.modalSection}>
            <h4 className={styles.sectionTitle}>
              <span>ENGINEERING CHALLENGES & RESOLUTION</span>
            </h4>
            <div className={styles.challengesGrid}>
              {project.challenges.map((ch, idx) => (
                <div key={idx} className={styles.challengeCard}>
                  <div className={styles.chHeading}>
                    <AlertCircle size={14} className={styles.chIconAlert} />
                    <span className={styles.chTitle}>{ch.title}</span>
                  </div>
                  <p className={styles.chDesc}>{ch.description}</p>
                  <div className={styles.chSolution}>
                    <div className={styles.solHeading}>
                      <CheckCircle2 size={13} className={styles.solIconCheck} />
                      <span>ENGINEERING SOLUTION</span>
                    </div>
                    <p className={styles.solText}>{ch.solution}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Technology Matrix */}
          <div className={styles.modalSection}>
            <h4 className={styles.sectionTitle}>
              <span>STACK MATRIX</span>
            </h4>
            <div className={styles.techTagsRow}>
              {project.technologies.map((t) => (
                <span key={t} className={styles.techTag}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Links & CTA Bar */}
          <div className={styles.modalFooter}>
            {project.links.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target={link.isExternal ? "_blank" : undefined}
                rel={link.isExternal ? "noopener noreferrer" : undefined}
                className={idx === 0 ? styles.modalPrimaryLink : styles.modalSecondaryLink}
                onMouseEnter={() => soundManager.playHover()}
                onClick={() => soundManager.playClick()}
              >
                <span>{link.label.toUpperCase()}</span>
                <ArrowUpRight size={14} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
