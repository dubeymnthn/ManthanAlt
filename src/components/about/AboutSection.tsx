"use client";

import { Layers, Cpu, Sparkles, Cog, GitBranch, Eye, Terminal } from "lucide-react";
import styles from "./AboutSection.module.scss";
import { personalData } from "@/data/personal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { soundManager } from "@/lib/sound";

const iconMap: Record<string, React.ReactNode> = {
  Layers: <Layers size={18} />,
  Cpu: <Cpu size={18} />,
  Sparkles: <Sparkles size={18} />,
  Cog: <Cog size={18} />,
  GitBranch: <GitBranch size={18} />,
  Eye: <Eye size={18} />,
};

export function AboutSection() {
  return (
    <section className={styles.section} id="about" aria-label="About Me">
      <div className={styles.container}>
        <SectionHeading
          index="04"
          tag="THE PERSON BEHIND THE CODE"
          title={personalData.aboutHeadline}
        />

        {/* Editorial Composition Grid */}
        <div className={styles.editorialGrid}>
          {/* Left: Deep Technical Narrative */}
          <div className={styles.narrativeCol}>
            <div className={styles.quoteBox}>
              <span className={styles.quoteMarker}>&ldquo;</span>
              <p className={styles.featuredLead}>{personalData.aboutText[0]}</p>
            </div>

            <p className={styles.bodyParagraph}>{personalData.aboutText[1]}</p>
            <p className={styles.bodyParagraph}>{personalData.aboutText[2]}</p>

            {/* Engineering Principles Manifesto */}
            <div className={styles.manifestoBox}>
              <div className={styles.manifestoHeader}>
                <Terminal size={14} className={styles.manifestoIcon} />
                <span>CORE ENGINEERING PRINCIPLES</span>
              </div>
              <div className={styles.principlesList}>
                <div className={styles.principleItem}>
                  <span className={styles.principleNum}>01</span>
                  <div>
                    <h4 className={styles.principleTitle}>Resilience Before Premature Polish</h4>
                    <p className={styles.principleDesc}>
                      A distributed system that fails gracefully under latency pressure is superior to one that is fragile but superficially sleek.
                    </p>
                  </div>
                </div>
                <div className={styles.principleItem}>
                  <span className={styles.principleNum}>02</span>
                  <div>
                    <h4 className={styles.principleTitle}>Strict Contract Boundaries</h4>
                    <p className={styles.principleDesc}>
                      Strong types, OpenAPI contracts, and schema serialization ensure services scale independently without brittle coupling.
                    </p>
                  </div>
                </div>
                <div className={styles.principleItem}>
                  <span className={styles.principleNum}>03</span>
                  <div>
                    <h4 className={styles.principleTitle}>Automation as Leverage</h4>
                    <p className={styles.principleDesc}>
                      Repetitive manual tasks are engineering debt. If a workflow runs more than three times, it deserves a script or automated pipeline.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Technical Interests & Focus Domains */}
          <div className={styles.interestsCol}>
            <div className={styles.interestsHeader}>
              <span className={styles.interestsTag}>TECHNICAL FOCUS AREAS</span>
              <span className={styles.interestsCount}>[06 DOMAINS]</span>
            </div>

            <div className={styles.interestsGrid}>
              {personalData.interests.map((item) => (
                <div
                  key={item.id}
                  className={styles.interestCard}
                  onMouseEnter={() => soundManager.playHover()}
                >
                  <div className={styles.interestTop}>
                    <div className={styles.interestIcon}>
                      {iconMap[item.icon] || <Cpu size={18} />}
                    </div>
                    <span className={styles.interestCategory}>{item.category.toUpperCase()}</span>
                  </div>
                  <h4 className={styles.interestTitle}>{item.title}</h4>
                  <p className={styles.interestDesc}>{item.description}</p>
                </div>
              ))}
            </div>

            {/* Quick Developer Environment Spec */}
            <div className={styles.envSpecCard}>
              <div className={styles.envHeader}>
                <span className={styles.envDot} />
                <span>ENGINEERING RIG & ENVIRONMENT</span>
              </div>
              <div className={styles.envSpecs}>
                <div className={styles.envRow}>
                  <span className={styles.envKey}>OS / KERNEL</span>
                  <span className={styles.envVal}>Linux x86_64</span>
                </div>
                <div className={styles.envRow}>
                  <span className={styles.envKey}>PRIMARY RUNTIME</span>
                  <span className={styles.envVal}>Node.js v24 / TypeScript / Python</span>
                </div>
                <div className={styles.envRow}>
                  <span className={styles.envKey}>LOCAL AI RUNNER</span>
                  <span className={styles.envVal}>Ollama / Qwen-2.5-Coder / Gemini</span>
                </div>
                <div className={styles.envRow}>
                  <span className={styles.envKey}>TARGET DEPLOY</span>
                  <span className={styles.envVal}>Docker / AWS / Edge Serverless</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
