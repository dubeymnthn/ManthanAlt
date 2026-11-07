"use client";

import { ArrowUpRight, Code, Layers } from "lucide-react";
import styles from "./ProjectCard.module.scss";
import { Project } from "@/data/projects";
import { soundManager } from "@/lib/sound";
import { ProjectArchitectureDiagram } from "./ProjectArchitectureDiagram";

interface ProjectCardProps {
  project: Project;
  onOpenCaseStudy: (project: Project) => void;
}

export function ProjectCard({ project, onOpenCaseStudy }: ProjectCardProps) {
  return (
    <article className={styles.projectCard}>
      {/* Editorial Card Header */}
      <div className={styles.cardHeader}>
        <div className={styles.headerMeta}>
          <span className={styles.projectIndex}>{project.index}</span>
          <span className={styles.metaDivider}>/</span>
          <span className={styles.category}>{project.category}</span>
          <span className={styles.statusBadge}>[{project.status.toUpperCase()}]</span>
        </div>
        <span className={styles.timeline}>{project.timeline}</span>
      </div>

      {/* Main Grid: Info + Visual Schematic */}
      <div className={styles.cardContentGrid}>
        {/* Left: Project Details & Thesis */}
        <div className={styles.cardInfoCol}>
          <h3 className={styles.projectTitle}>{project.title}</h3>
          <p className={styles.projectTagline}>{project.tagline}</p>
          <p className={styles.projectSummary}>{project.summary}</p>

          {/* Highlights List */}
          <div className={styles.highlightsContainer}>
            <span className={styles.highlightsTitle}>SYSTEM HIGHLIGHTS:</span>
            <ul className={styles.highlightsList}>
              {project.highlights.slice(0, 3).map((hl, i) => (
                <li key={i} className={styles.highlightItem}>
                  <span className={styles.bullet} />
                  <span>{hl}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack Pills */}
          <div className={styles.techPillRow}>
            {project.technologies.slice(0, 6).map((tech) => (
              <span key={tech} className={styles.techPill}>
                {tech}
              </span>
            ))}
            {project.technologies.length > 6 && (
              <span className={styles.techMore}>+{project.technologies.length - 6} more</span>
            )}
          </div>

          {/* Actions */}
          <div className={styles.actionRow}>
            <button
              type="button"
              className={styles.caseStudyBtn}
              onClick={() => {
                soundManager.playClick();
                onOpenCaseStudy(project);
              }}
              onMouseEnter={() => soundManager.playHover()}
            >
              <Layers size={14} />
              <span>INSPECT ARCHITECTURE & CASE STUDY</span>
              <ArrowUpRight size={14} className={styles.btnArrow} />
            </button>

            <a
              href="https://github.com/manthandubey"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.githubLink}
              title="View Source on GitHub"
              onMouseEnter={() => soundManager.playHover()}
            >
              <Code size={14} />
              <span>SOURCE</span>
            </a>
          </div>
        </div>

        {/* Right: Architectural Schematic Diagram */}
        <div
          className={styles.cardDiagramCol}
          onClick={() => {
            soundManager.playClick();
            onOpenCaseStudy(project);
          }}
          title="Click to view full architecture & case study"
        >
          <ProjectArchitectureDiagram type={project.schematicType} title={project.title} />
          <div className={styles.diagramHoverOverlay}>
            <span className={styles.expandLabel}>CLICK TO EXPAND CASE STUDY</span>
          </div>
        </div>
      </div>
    </article>
  );
}
