"use client";

import Link from "next/link";
import { ArrowUpRight, Layers, CheckCircle2 } from "lucide-react";
import styles from "./ProjectCard.module.scss";
import { Project } from "@/data/projects";
import { soundManager } from "@/lib/sound";
import { ProjectArchitectureDiagram } from "./ProjectArchitectureDiagram";

interface ProjectCardProps {
  project: Project;
  onOpenCaseStudy?: (project: Project) => void;
  compact?: boolean;
}

export function ProjectCard({ project, compact = false }: ProjectCardProps) {
  if (compact) {
    return (
      <article
        className={styles.compactCard}
        onMouseEnter={() => soundManager.playHover()}
      >
        <div className={styles.compactTop}>
          <div className={styles.compactMeta}>
            <span className={styles.compactIndex}>{project.index}</span>
            <span className={styles.metaDivider}>/</span>
            <span className={styles.compactCategory}>{project.category.split("/")[0].trim()}</span>
          </div>
          <span className={styles.compactStatusBadge}>[COMPLETED]</span>
        </div>

        <Link
          href={`/projects/${project.slug}`}
          onClick={() => soundManager.playClick()}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <h4 className={styles.compactTitle}>{project.title}</h4>
        </Link>
        <p className={styles.compactTagline}>{project.subtitle}</p>

        <p className={styles.compactSummary}>{project.shortDescription}</p>

        <div className={styles.compactTechRow}>
          {project.cardTechnologies.slice(0, 4).map((tech) => (
            <span key={tech} className={styles.techPill}>
              {tech}
            </span>
          ))}
        </div>

        <div className={styles.compactAction}>
          <Link
            href={`/projects/${project.slug}`}
            className={styles.compactBtn}
            onClick={() => soundManager.playClick()}
          >
            <span>EXPLORE PROJECT</span>
            <ArrowUpRight size={13} className={styles.btnArrow} />
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article className={styles.projectCard}>
      {/* Editorial Card Header */}
      <div className={styles.cardHeader}>
        <div className={styles.headerMeta}>
          <span className={styles.projectIndex}>{project.index}</span>
          <span className={styles.metaDivider}>/</span>
          <span className={styles.category}>{project.category.toUpperCase()}</span>
          <span className={styles.statusBadge}>[STATUS: {project.status.toUpperCase()}]</span>
        </div>
        <span className={styles.timeline}>{project.timeline}</span>
      </div>

      {/* Main Grid: Info + Visual Schematic */}
      <div className={styles.cardContentGrid}>
        {/* Left: Project Details & Storytelling */}
        <div className={styles.cardInfoCol}>
          <div className={styles.titleBlock}>
            <Link
              href={`/projects/${project.slug}`}
              onClick={() => soundManager.playClick()}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <h3 className={styles.projectTitle}>{project.title}</h3>
            </Link>
            <p className={styles.projectSubtitle}>{project.subtitle}</p>
          </div>

          <p className={styles.projectTagline}>&ldquo;{project.tagline}&rdquo;</p>
          <p className={styles.projectSummary}>{project.shortDescription}</p>

          {/* Key Implemented Capabilities */}
          <div className={styles.highlightsContainer}>
            <span className={styles.highlightsTitle}>KEY IMPLEMENTED CAPABILITIES:</span>
            <ul className={styles.highlightsList}>
              {project.keyFeatures.slice(0, 3).map((feat, i) => (
                <li key={i} className={styles.highlightItem}>
                  <CheckCircle2 size={13} className={styles.checkBullet} />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack Pills (Up to 5) */}
          <div className={styles.techPillRow}>
            {project.cardTechnologies.slice(0, 5).map((tech) => (
              <span key={tech} className={styles.techPill}>
                {tech}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className={styles.actionRow}>
            <Link
              href={`/projects/${project.slug}`}
              className={styles.caseStudyBtn}
              onClick={() => soundManager.playClick()}
              onMouseEnter={() => soundManager.playHover()}
            >
              <Layers size={14} />
              <span>EXPLORE PROJECT & CASE STUDY</span>
              <ArrowUpRight size={14} className={styles.btnArrow} />
            </Link>
          </div>
        </div>

        {/* Right: Architectural Schematic Diagram */}
        <Link
          href={`/projects/${project.slug}`}
          className={styles.cardDiagramCol}
          onClick={() => soundManager.playClick()}
          title={`Click to explore ${project.title} full architecture and case study`}
        >
          <ProjectArchitectureDiagram type={project.schematicType} title={project.title} />
          <div className={styles.diagramHoverOverlay}>
            <span className={styles.expandLabel}>CLICK TO EXPLORE FULL CASE STUDY</span>
          </div>
        </Link>
      </div>
    </article>
  );
}
