"use client";

import { useState, useMemo } from "react";
import { Search, X, ArrowUpRight, RotateCcw } from "lucide-react";
import styles from "./SkillsExplorer.module.scss";
import { skillsData, skillCategories, SkillNode, SkillCategory } from "@/data/skills";
import { soundManager } from "@/lib/sound";

interface SkillSearchProps {
  onSelectSkill: (skill: SkillNode) => void;
  selectedSkill: SkillNode | null;
}

export function SkillSearch({ onSelectSkill, selectedSkill }: SkillSearchProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<SkillCategory | "ALL">("ALL");

  const filteredSkills = useMemo(() => {
    const q = query.trim().toLowerCase();

    return skillsData.filter((skill) => {
      // Category filter
      const matchesCategory =
        activeCategory === "ALL" || skill.category === activeCategory;

      if (!matchesCategory) return false;
      if (!q) return true;

      // Match name
      if (skill.name.toLowerCase().includes(q)) return true;

      // Match category
      if (skill.category.toLowerCase().includes(q)) return true;

      // Match description
      if (skill.description.toLowerCase().includes(q)) return true;

      // Match related tags
      if (skill.related.some((r) => r.toLowerCase().includes(q))) return true;

      return false;
    });
  }, [query, activeCategory]);

  const handleClear = () => {
    soundManager.playClick();
    setQuery("");
    setActiveCategory("ALL");
  };

  return (
    <div className={styles.searchSection}>
      {/* Search Bar Controls */}
      <div className={styles.searchHeader}>
        <div className={styles.searchInputWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search technologies, categories, or descriptions (e.g. 'PostgreSQL', 'React', 'Fastify', 'LLM')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search skills"
          />
          {query && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={() => setQuery("")}
              aria-label="Clear search input"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <div className={styles.categoryFilters}>
          <button
            type="button"
            className={`${styles.catPill} ${activeCategory === "ALL" ? styles.catPillActive : ""}`}
            onClick={() => {
              soundManager.playClick();
              setActiveCategory("ALL");
            }}
          >
            ALL [{skillsData.length}]
          </button>
          {skillCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`${styles.catPill} ${activeCategory === cat.id ? styles.catPillActive : ""}`}
              onClick={() => {
                soundManager.playClick();
                setActiveCategory(cat.id);
              }}
              onMouseEnter={() => soundManager.playHover()}
            >
              {cat.id.toUpperCase()} [{cat.count}]
            </button>
          ))}
        </div>
      </div>

      {/* Results Metadata */}
      <div className={styles.resultsMeta}>
        <span>
          MATCHING TECHNOLOGIES: <strong className={styles.metaCount}>{filteredSkills.length}</strong>
        </span>
        {(query || activeCategory !== "ALL") && (
          <button type="button" className={styles.resetFiltersBtn} onClick={handleClear}>
            <RotateCcw size={12} />
            <span>RESET FILTERS</span>
          </button>
        )}
      </div>

      {/* Skills Grid or Empty State */}
      {filteredSkills.length > 0 ? (
        <div className={styles.skillsGrid}>
          {filteredSkills.map((skill) => {
            const isSelected = selectedSkill?.id === skill.id;
            return (
              <div
                key={skill.id}
                className={`${styles.skillCard} ${isSelected ? styles.skillCardSelected : ""}`}
                onClick={() => {
                  soundManager.playClick();
                  onSelectSkill(skill);
                }}
                onMouseEnter={() => soundManager.playHover()}
              >
                <div className={styles.cardTop}>
                  <span className={styles.cardCat}>{skill.category.toUpperCase()}</span>
                  <span className={styles.cardArrow}>
                    <ArrowUpRight size={14} />
                  </span>
                </div>
                <h5 className={styles.cardName}>{skill.name}</h5>
                <p className={styles.cardDesc}>{skill.description}</p>
                <div className={styles.cardRelated}>
                  {skill.related.slice(0, 3).map((r) => (
                    <span key={r} className={styles.relTag}>
                      #{r}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p className={styles.emptyTitle}>NO MATCHING TECHNOLOGIES FOUND</p>
          <p className={styles.emptySubtitle}>
            No entries matched your query &ldquo;{query}&rdquo;.
          </p>
          <button type="button" className={styles.emptyResetBtn} onClick={handleClear}>
            <span>RESET SEARCH FILTERS</span>
          </button>
        </div>
      )}
    </div>
  );
}
