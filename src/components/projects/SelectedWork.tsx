"use client";

import { useState } from "react";
import styles from "./SelectedWork.module.scss";
import { projectsData, Project } from "@/data/projects";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ProjectCard } from "./ProjectCard";
import { ProjectCaseStudyModal } from "./ProjectCaseStudyModal";
import { soundManager } from "@/lib/sound";

export function SelectedWork() {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<Project | null>(null);

  const categories = ["ALL", "Mobile & Real-Time", "AI & Audio", "Automation & Scraping", "Developer Tooling"];

  const filteredProjects =
    activeCategory === "ALL"
      ? projectsData
      : projectsData.filter((p) => p.category === activeCategory);

  const handleCategoryChange = (cat: string) => {
    soundManager.playClick();
    setActiveCategory(cat);
  };

  return (
    <section className={styles.section} id="work" aria-label="Selected Work">
      <div className={styles.container}>
        {/* Editorial Section Heading */}
        <SectionHeading
          index="01"
          tag="SELECTED WORK"
          title="Things I've built. Systems I've shipped."
          subtitle="A selection of high-concurrency applications, AI-driven audio pipelines, institutional data parsers, and developer tooling engineered for production."
        />

        {/* Category Filters Bar */}
        <div className={styles.filterBar}>
          <div className={styles.filterGroup}>
            <span className={styles.filterPrefix}>FILTER:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterActive : ""}`}
                onClick={() => handleCategoryChange(cat)}
                onMouseEnter={() => soundManager.playHover()}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
          <div className={styles.projectsCount}>
            <span>SHOWING: {filteredProjects.length} OF {projectsData.length} SYSTEMS</span>
          </div>
        </div>

        {/* Projects List */}
        <div className={styles.projectsList}>
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpenCaseStudy={setSelectedCaseStudy}
            />
          ))}
        </div>
      </div>

      {/* Case Study Modal */}
      <ProjectCaseStudyModal
        project={selectedCaseStudy}
        onClose={() => setSelectedCaseStudy(null)}
      />
    </section>
  );
}
