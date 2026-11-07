"use client";

import { useState } from "react";
import { Building2, Calendar, MapPin, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import styles from "./ExperienceTimeline.module.scss";
import { experienceData, ExperienceItem } from "@/data/experience";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { soundManager } from "@/lib/sound";

export function ExperienceTimeline() {
  const [expandedId, setExpandedId] = useState<string>(experienceData[0].id);

  const toggleExpand = (id: string) => {
    soundManager.playClick();
    setExpandedId(expandedId === id ? "" : id);
  };

  return (
    <section className={styles.section} id="experience" aria-label="Professional Experience">
      <div className={styles.container}>
        <SectionHeading
          index="03"
          tag="EXPERIENCE"
          title="Where I've contributed."
          subtitle="A track record of engineering scalable backend services, full-stack clinical applications, and mission-critical financial systems across leading organizations."
        />

        <div className={styles.timeline}>
          {experienceData.map((exp: ExperienceItem) => {
            const isExpanded = expandedId === exp.id;

            return (
              <div
                key={exp.id}
                className={`${styles.timelineCard} ${isExpanded ? styles.cardActive : ""}`}
              >
                {/* Header Row */}
                <div
                  className={styles.cardHeader}
                  onClick={() => toggleExpand(exp.id)}
                  onMouseEnter={() => soundManager.playHover()}
                >
                  <div className={styles.headerLeft}>
                    <span className={styles.index}>{exp.index}</span>
                    <div className={styles.titleGroup}>
                      <h3 className={styles.roleTitle}>{exp.role}</h3>
                      <div className={styles.companyMeta}>
                        <span className={styles.companyName}>
                          <Building2 size={13} className={styles.iconInline} />
                          {exp.company}
                        </span>
                        <span className={styles.metaDivider}>/</span>
                        <span className={styles.location}>
                          <MapPin size={12} className={styles.iconInline} />
                          {exp.location}
                        </span>
                        <span className={styles.metaDivider}>/</span>
                        <span className={styles.tenureType}>[{exp.type}]</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.headerRight}>
                    <div className={styles.periodTag}>
                      <Calendar size={13} />
                      <span>{exp.period.start} — {exp.period.end}</span>
                    </div>
                    <button
                      type="button"
                      className={styles.expandToggle}
                      aria-label={isExpanded ? "Collapse experience item" : "Expand experience item"}
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div className={styles.cardBody}>
                    <p className={styles.overviewText}>{exp.overview}</p>

                    {/* Responsibilities */}
                    <div className={styles.detailBlock}>
                      <h4 className={styles.blockTitle}>CORE RESPONSIBILITIES:</h4>
                      <ul className={styles.bulletsList}>
                        {exp.responsibilities.map((resp, i) => (
                          <li key={i} className={styles.bulletItem}>
                            <span className={styles.bulletDot} />
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Key Contributions */}
                    <div className={styles.detailBlock}>
                      <h4 className={styles.blockTitle}>VERIFIED CONTRIBUTIONS:</h4>
                      <ul className={styles.bulletsList}>
                        {exp.keyContributions.map((contrib, i) => (
                          <li key={i} className={styles.bulletItem}>
                            <CheckCircle size={14} className={styles.contribIcon} />
                            <span>{contrib}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Technologies */}
                    <div className={styles.techStackRow}>
                      <span className={styles.techLabel}>SYSTEM STACK:</span>
                      <div className={styles.techTags}>
                        {exp.technologies.map((t) => (
                          <span key={t} className={styles.techBadge}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
