"use client";

import { useState, useMemo } from "react";
import { Search, X, RotateCcw, Sparkles, FolderGit2 } from "lucide-react";
import styles from "./SelectedWork.module.scss";
import { projectsData, projectFilterCategories, Project, ProjectFilterCategory } from "@/data/projects";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ProjectCard } from "./ProjectCard";
import { ProjectCaseStudyModal } from "./ProjectCaseStudyModal";
import { soundManager } from "@/lib/sound";

export function SelectedWork() {
  const [activeCategory, setActiveCategory] = useState<ProjectFilterCategory>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<Project | null>(null);

  // Filter projects based on category and search query
  const filteredProjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return projectsData.filter((project) => {
      // Category match
      const matchesCategory =
        activeCategory === "All" || project.filterCategory === activeCategory;

      if (!matchesCategory) return false;
      if (!q) return true;

      // Match title, subtitle, tagline, description, category, or technologies
      if (project.title.toLowerCase().includes(q)) return true;
      if (project.subtitle.toLowerCase().includes(q)) return true;
      if (project.tagline.toLowerCase().includes(q)) return true;
      if (project.shortDescription.toLowerCase().includes(q)) return true;
      if (project.category.toLowerCase().includes(q)) return true;
      if (project.technologies.some((t) => t.toLowerCase().includes(q))) return true;

      return false;
    });
  }, [activeCategory, searchQuery]);

  const featuredList = useMemo(() => {
    return filteredProjects.filter((p) => p.featured);
  }, [filteredProjects]);

  const additionalList = useMemo(() => {
    return filteredProjects.filter((p) => !p.featured);
  }, [filteredProjects]);

  const isFiltering = activeCategory !== "All" || searchQuery.trim().length > 0;

  const handleCategoryChange = (cat: ProjectFilterCategory) => {
    soundManager.playClick();
    setActiveCategory(cat);
  };

  const handleClearFilters = () => {
    soundManager.playClick();
    setActiveCategory("All");
    setSearchQuery("");
  };

  return (
    <section className={styles.section} id="work" aria-label="Selected Work">
      <div className={styles.container}>
        {/* Editorial Section Heading */}
        <SectionHeading
          index="01"
          tag="SELECTED WORK"
          title="Things I've built. Systems I've shipped."
          subtitle="A comprehensive body of 11 completed engineering projects spanning real-time voice infrastructure, enterprise inventory SaaS, mobility coordination, generative AI audio, local LLMs, and developer tooling."
        />

        {/* Search & Category Filter Controls */}
        <div className={styles.filterControlPanel}>
          {/* Search Input */}
          <div className={styles.searchBarWrap}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              className={styles.projectSearchInput}
              placeholder="Search 11 completed projects by name, technology, or domain (e.g. 'Fastify', 'Gemini', 'Dravyam', 'Ollama', 'Selenium')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search projects"
            />
            {searchQuery && (
              <button
                type="button"
                className={styles.clearSearchBtn}
                onClick={() => setSearchQuery("")}
                aria-label="Clear project search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className={styles.categoryPillsRow}>
            {projectFilterCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`${styles.filterPill} ${activeCategory === cat ? styles.filterPillActive : ""}`}
                onClick={() => handleCategoryChange(cat)}
                onMouseEnter={() => soundManager.playHover()}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Telemetry Status Bar */}
          <div className={styles.filterStatusBar}>
            <div className={styles.statusCount}>
              <span className={styles.statusDot} />
              <span>
                DISPLAYING: <strong className={styles.countNumber}>{filteredProjects.length}</strong> OF{" "}
                {projectsData.length} COMPLETED PROJECTS
              </span>
            </div>

            {isFiltering && (
              <button
                type="button"
                className={styles.resetFiltersBtn}
                onClick={handleClearFilters}
              >
                <RotateCcw size={12} />
                <span>RESET ALL FILTERS</span>
              </button>
            )}
          </div>
        </div>

        {/* Content Presentation */}
        {filteredProjects.length > 0 ? (
          <>
            {/* If filtering: show unified list */}
            {isFiltering ? (
              <div className={styles.unifiedList}>
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onOpenCaseStudy={setSelectedCaseStudy}
                    compact={!project.featured}
                  />
                ))}
              </div>
            ) : (
              <>
                {/* 1. FEATURED SYSTEMS SHOWCASE */}
                <div className={styles.featuredSection}>
                  <div className={styles.subheadRow}>
                    <div className={styles.subheadTitleGroup}>
                      <Sparkles size={14} className={styles.subheadIcon} />
                      <h3 className={styles.subheadTitle}>FEATURED SYSTEMS & PLATFORMS</h3>
                    </div>
                    <span className={styles.subheadMeta}>[05 CORE ARCHITECTURES]</span>
                  </div>

                  <div className={styles.featuredList}>
                    {featuredList.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onOpenCaseStudy={setSelectedCaseStudy}
                        compact={false}
                      />
                    ))}
                  </div>
                </div>

                {/* 2. ADDITIONAL SYSTEMS & DEVELOPER TOOLING DIRECTORY */}
                <div className={styles.additionalSection}>
                  <div className={styles.subheadRow}>
                    <div className={styles.subheadTitleGroup}>
                      <FolderGit2 size={14} className={styles.subheadIcon} />
                      <h3 className={styles.subheadTitle}>ADDITIONAL SYSTEMS & DEVELOPER TOOLING</h3>
                    </div>
                    <span className={styles.subheadMeta}>[06 COMPLETED PROJECTS]</span>
                  </div>

                  <p className={styles.additionalDesc}>
                    Additional completed software engineering projects spanning local AI inference, native Android gaming engines, transcript parsers, and Model Context Protocol tooling.
                  </p>

                  <div className={styles.additionalGrid}>
                    {additionalList.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onOpenCaseStudy={setSelectedCaseStudy}
                        compact={true}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          <div className={styles.emptyResultsState}>
            <p className={styles.emptyTitle}>NO MATCHING PROJECTS FOUND</p>
            <p className={styles.emptySubtitle}>
              No completed project matched your query &ldquo;{searchQuery}&rdquo; in category &ldquo;{activeCategory}&rdquo;.
            </p>
            <button
              type="button"
              className={styles.emptyResetBtn}
              onClick={handleClearFilters}
            >
              <span>RESET SEARCH FILTERS</span>
            </button>
          </div>
        )}
      </div>

      {/* Case Study Modal */}
      <ProjectCaseStudyModal
        project={selectedCaseStudy}
        onClose={() => setSelectedCaseStudy(null)}
      />
    </section>
  );
}
