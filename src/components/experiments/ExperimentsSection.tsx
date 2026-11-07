"use client";

import { Terminal, FlaskConical } from "lucide-react";
import styles from "./ExperimentsSection.module.scss";
import { experimentsData, ExperimentItem } from "@/data/experiments";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { soundManager } from "@/lib/sound";

export function ExperimentsSection() {
  return (
    <section className={styles.section} id="experiments" aria-label="Experiments Lab">
      <div className={styles.container}>
        <SectionHeading
          index="06"
          tag="EXPERIMENT LAB"
          title="Curiosity in code. Continuous technical inquiry."
          subtitle="Beyond client and production deliverables, I maintain an active workbench experimenting with local LLM quantization, MCP protocols, generative audio synthesis, and custom WebGL shaders."
        />

        <div className={styles.experimentsGrid}>
          {experimentsData.map((exp: ExperimentItem) => (
            <div
              key={exp.id}
              className={styles.experimentCard}
              onMouseEnter={() => soundManager.playHover()}
            >
              {/* Top Meta Bar */}
              <div className={styles.cardHeader}>
                <div className={styles.codeBadge}>
                  <FlaskConical size={13} className={styles.flaskIcon} />
                  <span>{exp.code}</span>
                  <span className={styles.sep}>/</span>
                  <span className={styles.category}>{exp.category.toUpperCase()}</span>
                </div>
                <span
                  className={`${styles.statusBadge} ${
                    exp.status === "Working prototype"
                      ? styles.statusActive
                      : exp.status === "Active research"
                      ? styles.statusBenchmarked
                      : exp.status === "Completed experiment"
                      ? styles.statusShipped
                      : styles.statusExploration
                  }`}
                >
                  [{exp.status.toUpperCase()}]
                </span>
              </div>

              {/* Title & Summary */}
              <h3 className={styles.cardTitle}>{exp.title}</h3>
              <p className={styles.cardSummary}>{exp.summary}</p>

              {/* Terminal / Code Snippet */}
              {exp.terminalSnippet && (
                <div className={styles.terminalWindow}>
                  <div className={styles.terminalBar}>
                    <Terminal size={11} className={styles.termIcon} />
                    <span>DEBUG_CONSOLE</span>
                  </div>
                  <pre className={styles.terminalText}>
                    <code>{exp.terminalSnippet}</code>
                  </pre>
                </div>
              )}

              {/* Findings */}
              <div className={styles.findingsBox}>
                <span className={styles.findingsLabel}>KEY FINDING:</span>
                <p className={styles.findingsText}>{exp.findings}</p>
              </div>

              {/* Tech Tags */}
              <div className={styles.techPills}>
                {exp.tech.map((t) => (
                  <span key={t} className={styles.techPill}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
