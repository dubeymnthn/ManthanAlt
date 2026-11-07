"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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
import { lockScroll, unlockScroll } from "@/lib/scrollLock";
import { ProjectArchitectureDiagram } from "./ProjectArchitectureDiagram";

interface ProjectCaseStudyModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectCaseStudyModal({ project, onClose }: ProjectCaseStudyModalProps) {
  const [deepDiveOpen, setDeepDiveOpen] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Synchronous lock and unlock lifecycle
  useEffect(() => {
    if (!project) return;

    // 1. Lock background document scroll & pause Lenis
    lockScroll();

    // 2. Focus modal dialog for immediate keyboard and screen reader accessibility
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const focusTimer = setTimeout(() => {
      containerRef.current?.focus();
    }, 10);

    // 3. Complete keyboard scrolling and escape handlers
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        soundManager.playClick();
        onClose();
        return;
      }

      const body = bodyRef.current;
      if (!body) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        body.scrollBy({ top: 80, behavior: "smooth" });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        body.scrollBy({ top: -80, behavior: "smooth" });
      } else if (e.key === "PageDown" || (e.key === " " && !e.shiftKey)) {
        e.preventDefault();
        body.scrollBy({ top: body.clientHeight * 0.85, behavior: "smooth" });
      } else if (e.key === "PageUp" || (e.key === " " && e.shiftKey)) {
        e.preventDefault();
        body.scrollBy({ top: -body.clientHeight * 0.85, behavior: "smooth" });
      } else if (e.key === "Home") {
        e.preventDefault();
        body.scrollTo({ top: 0, behavior: "smooth" });
      } else if (e.key === "End") {
        e.preventDefault();
        body.scrollTo({ top: body.scrollHeight, behavior: "smooth" });
      }
    };

    window.addEventListener("keydown", onKeyDown, { passive: false });

    return () => {
      clearTimeout(focusTimer);
      unlockScroll();
      window.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus();
    };
  }, [project, onClose]);

  // Forward wheel events anywhere inside container to body
  const handleContainerWheel = useCallback((e: React.WheelEvent) => {
    e.stopPropagation();
    const body = bodyRef.current;
    if (body && !body.contains(e.target as Node)) {
      body.scrollTop += e.deltaY;
    }
  }, []);

  if (!project) return null;

  return (
    <div
      className={styles.modalOverlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      data-lenis-prevent="true"
      onWheel={(e) => e.stopPropagation()}
    >
      {/* Backdrop with click-to-close and touch/wheel isolation */}
      <div
        className={styles.modalBackdrop}
        onClick={onClose}
        onWheel={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        onTouchMove={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      />

      <div
        ref={containerRef}
        className={styles.modalContainer}
        tabIndex={-1}
        data-lenis-prevent="true"
        onWheel={handleContainerWheel}
      >
        {/* Modal Top Bar (Fixed / Sticky Header) */}
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

        {/* Modal Scrollable Content Body */}
        <div
          ref={bodyRef}
          className={styles.modalBody}
          tabIndex={0}
          role="region"
          aria-label={`${project.title} detailed documentation`}
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
        >
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

          {/* Technical Deep Dive */}
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
