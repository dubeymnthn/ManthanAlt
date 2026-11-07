"use client";

import { useEffect, useState } from "react";
import {
  X,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Layers,
  Cpu,
  Target,
  Wrench,
  Sparkles,
  GitBranch,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import styles from "./ProjectCard.module.scss";
import { Project } from "@/data/projects";
import { soundManager } from "@/lib/sound";
import { ProjectArchitectureDiagram } from "./ProjectArchitectureDiagram";

interface ProjectCaseStudyModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectCaseStudyModal({ project, onClose }: ProjectCaseStudyModalProps) {
  const [deepDiveOpen, setDeepDiveOpen] = useState(true);

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
          {/* Project Introduction */}
          <div className={styles.modalIntro}>
            <h3 id="modal-title" className={styles.modalTitle}>
              {project.title}
            </h3>
            <p className={styles.modalSubtitle}>{project.subtitle}</p>
            <p className={styles.modalTagline}>&ldquo;{project.tagline}&rdquo;</p>
            <div className={styles.metaPills}>
              <span className={styles.metaPill}>ROLE: {project.role}</span>
              <span className={styles.metaPill}>TIMELINE: {project.timeline}</span>
              <span className={styles.metaPillStatus}>STATUS: {project.status.toUpperCase()}</span>
            </div>
          </div>

          {/* Architecture Diagram Visualization */}
          <div className={styles.modalDiagramWrap}>
            <ProjectArchitectureDiagram type={project.schematicType} title={project.title} />
          </div>

          {/* Problem Statement & Objective */}
          <div className={styles.modalSection}>
            <h4 className={styles.sectionTitle}>
              <Target size={14} className={styles.iconAccent} />
              <span>THE PROBLEM & OBJECTIVE</span>
            </h4>
            <p className={styles.sectionParagraph}>{project.problemStatement}</p>
          </div>

          {/* Product Overview */}
          <div className={styles.modalSection}>
            <h4 className={styles.sectionTitle}>
              <Layers size={14} className={styles.iconAccent} />
              <span>WHAT THE PRODUCT DOES</span>
            </h4>
            <p className={styles.sectionParagraph}>{project.fullDescription}</p>
          </div>

          {/* What I Actually Built (Engineering Contribution) */}
          <div className={styles.modalSection}>
            <h4 className={styles.sectionTitle}>
              <Wrench size={14} className={styles.iconAccent} />
              <span>WHAT I IMPLEMENTED</span>
            </h4>
            <div className={styles.contributionList}>
              {project.engineeringContribution.map((contrib, idx) => (
                <div key={idx} className={styles.contributionItem}>
                  <CheckCircle2 size={14} className={styles.iconAccent} />
                  <span>{contrib}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Implemented Features */}
          <div className={styles.modalSection}>
            <h4 className={styles.sectionTitle}>
              <Sparkles size={14} className={styles.iconAccent} />
              <span>KEY IMPLEMENTED CAPABILITIES</span>
            </h4>
            <div className={styles.featuresGrid}>
              {project.keyFeatures.map((feat, idx) => (
                <div key={idx} className={styles.featureCard}>
                  <span className={styles.featureIndex}>0{idx + 1}</span>
                  <p className={styles.featureText}>{feat}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Level 3: Expandable Technical Deep Dive (For complex architectures) */}
          {project.deepDive && (
            <div className={styles.deepDiveContainer}>
              <div
                className={styles.deepDiveHeader}
                onClick={() => {
                  soundManager.playClick();
                  setDeepDiveOpen(!deepDiveOpen);
                }}
              >
                <div className={styles.deepDiveTitleGroup}>
                  <Cpu size={15} className={styles.iconAccent} />
                  <div>
                    <h4 className={styles.deepDiveHeading}>
                      TECHNICAL DEEP DIVE: {project.deepDive.title.toUpperCase()}
                    </h4>
                    <p className={styles.deepDiveSub}>{project.deepDive.subtitle}</p>
                  </div>
                </div>
                <button type="button" className={styles.deepDiveToggleBtn} aria-label="Toggle technical deep dive">
                  {deepDiveOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              {deepDiveOpen && (
                <div className={styles.deepDiveBody}>
                  <ul className={styles.deepDiveNotes}>
                    {project.deepDive.architectureNotes.map((note, idx) => (
                      <li key={idx} className={styles.deepDiveNoteItem}>
                        <span className={styles.deepDiveBullet} />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>

                  {project.deepDive.codeHighlight && (
                    <div className={styles.codeHighlightBox}>
                      <div className={styles.codeHighlightHeader}>
                        <GitBranch size={12} className={styles.iconAccent} />
                        <span className={styles.codeFilename}>{project.deepDive.codeHighlight.filename}</span>
                      </div>
                      <p className={styles.codeDesc}>{project.deepDive.codeHighlight.description}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Execution Lifecycle Flow */}
          <div className={styles.modalSection}>
            <h4 className={styles.sectionTitle}>
              <span>SYSTEM ARCHITECTURE & EXECUTION FLOW</span>
            </h4>
            <p className={styles.sectionParagraph}>{project.architecture.description}</p>
            <div className={styles.flowList}>
              {project.architecture.flow.map((step, idx) => (
                <div key={idx} className={styles.flowItem}>
                  <span className={styles.flowIndex}>0{idx + 1}</span>
                  <span className={styles.flowText}>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Component Roles Matrix */}
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
              <span>ENGINEERING CHALLENGES & RESOLUTIONS</span>
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
                      <span>ENGINEERING RESOLUTION</span>
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
              <span>COMPLETE TECHNOLOGY STACK</span>
            </h4>
            <div className={styles.techTagsRow}>
              {project.technologies.map((t) => (
                <span key={t} className={styles.techTag}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Repository & Demo Bar */}
          <div className={styles.modalFooter}>
            {project.githubUrl ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.modalPrimaryLink}
                onMouseEnter={() => soundManager.playHover()}
                onClick={() => soundManager.playClick()}
              >
                <span>INSPECT GITHUB REPOSITORY</span>
                <ArrowUpRight size={14} />
              </a>
            ) : (
              <div className={styles.repoPendingNotice}>
                <span className={styles.repoDot} />
                <span>SOURCE CODE COMPLETED — GITHUB REPOSITORY LINK PENDING PUBLIC RELEASE</span>
              </div>
            )}

            {project.liveDemoUrl && (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.modalSecondaryLink}
                onMouseEnter={() => soundManager.playHover()}
                onClick={() => soundManager.playClick()}
              >
                <span>VIEW LIVE DEMO</span>
                <ArrowUpRight size={14} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
