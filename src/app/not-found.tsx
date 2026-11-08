import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import styles from "./not-found.module.scss";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { navItems } from "@/data/navigation";
import { getProjectBySlug, projectsData } from "@/data/projects";

/** Quick links to notable case studies; indices come from the project registry so they never drift. */
const quickProjectLinks = [
  { slug: "wally-talky", label: "WALLY TALKY" },
  { slug: "storyforge-ai", label: "STORYFORGE AI" },
  { slug: "dravyam", label: "DRAVYAM" },
  { slug: "ride-aggregator", label: "RIDE AGGREGATOR" },
  { slug: "financial-data-scraper", label: "FINANCIAL SCRAPER" },
  { slug: "ai-diary", label: "AI DIARY" },
];

export default function NotFound() {
  const projectCount = projectsData.length;

  return (
    <div className={styles.notFoundWrapper}>
      <Navbar />
      <main className={styles.mainContent} role="main">
        <div className={styles.container}>
          <div className={styles.telemetryBadge}>
            <span className={styles.badgePulse} aria-hidden="true" />
            <span>SYSTEM DIAGNOSTIC: 404_ROUTE_NOT_FOUND</span>
          </div>

          <h1 className={styles.errorCode}>404</h1>
          <h2 className={styles.errorTitle}>Requested Route Not Found</h2>
          <p className={styles.errorDesc}>
            The system address or project identifier you requested does not exist in the active registry.
            All {projectCount} completed engineering projects are indexed in the work registry.
          </p>

          <div className={styles.actionRow}>
            <Link href="/work" className={styles.ctaPrimary}>
              <span>EXPLORE {projectCount} COMPLETED PROJECTS</span>
              <ArrowUpRight size={14} />
            </Link>
            <Link href="/" className={styles.ctaSecondary}>
              <ArrowLeft size={14} />
              <span>RETURN TO HOMEPAGE</span>
            </Link>
          </div>

          <nav className={styles.quickLinksSection} aria-label="Project case studies">
            <p className={styles.quickLinksTitle}>PROJECT REGISTRY</p>
            <ul className={styles.linksList}>
              {quickProjectLinks.map(({ slug, label }) => {
                const project = getProjectBySlug(slug);
                if (!project) return null;

                return (
                  <li key={project.slug}>
                    <Link href={`/projects/${project.slug}`}>
                      {project.index} {"//"} {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <nav
            className={styles.quickLinksSection}
            aria-label="Portfolio sections"
          >
            <p className={styles.quickLinksTitle}>SYSTEM NAVIGATION INDEX</p>
            <ul className={styles.linksList}>
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>
                    {item.index} {"//"} {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </main>
      <Footer />
    </div>
  );
}
