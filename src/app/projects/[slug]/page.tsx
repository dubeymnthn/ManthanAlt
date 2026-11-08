import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Cpu,
  Layers,
  ShieldCheck,
  Code2,
  Terminal,
  FolderGit2,
} from "lucide-react";
import styles from "./ProjectDetailPage.module.scss";
import {
  getAllProjectSlugs,
  getProjectBySlug,
  getAdjacentProjects,
} from "@/data/projects";
import { personalData } from "@/data/personal";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProjectArchitectureDiagram } from "@/components/projects/ProjectArchitectureDiagram";

export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found — Manthan Dubey",
    };
  }

  return {
    title: `${project.title} — Engineering Case Study | ${personalData.name}`,
    description: `${project.subtitle} ${project.shortDescription}`,
    openGraph: {
      title: `${project.title} — ${project.subtitle}`,
      description: project.shortDescription,
      type: "article",
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const { prev, next } = getAdjacentProjects(project.slug);

  return (
    <div className={styles.pageWrapper}>
      <Navbar />

      <main className={styles.mainContent} role="main">
        <div className={styles.container}>
          {/* Top Bar: Back & Breadcrumb */}
          <div className={styles.topBar}>
            <Link href="/#work" className={styles.backBtn}>
              <ArrowLeft size={14} />
              <span>RETURN TO ALL PROJECTS</span>
            </Link>

            <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
              <Link href="/" className={styles.crumbLink}>
                INDEX
              </Link>
              <span className={styles.divider}>/</span>
              <Link href="/#work" className={styles.crumbLink}>
                WORK
              </Link>
              <span className={styles.divider}>/</span>
              <span className={styles.crumbActive}>{project.title.toUpperCase()}</span>
            </nav>
          </div>

          {/* Hero Header */}
          <header className={styles.heroHeader}>
            <div className={styles.metaRow}>
              <span className={styles.indexBadge}>PROJECT {project.index}</span>
              <span className={styles.divider}>/</span>
              <span className={styles.categoryBadge}>{project.category.toUpperCase()}</span>
              <span className={styles.divider}>/</span>
              <span className={styles.statusCompleted}>
                <span className={styles.statusPulse} aria-hidden="true" />
                <span>COMPLETED SYSTEM</span>
              </span>
            </div>

            <h1 className={styles.title}>{project.title}</h1>
            <p className={styles.subtitle}>{project.subtitle}</p>

            {project.tagline && (
              <div className={styles.taglineBox}>
                <span>&ldquo;{project.tagline}&rdquo;</span>
              </div>
            )}
          </header>

          {/* Key Specs Telemetry Bar */}
          <div className={styles.specsBar}>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>ENGINEERING ROLE</span>
              <span className={styles.specValue}>{project.role}</span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>TIMELINE / STAGE</span>
              <span className={styles.specValue}>{project.timeline}</span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>SYSTEM DOMAIN</span>
              <span className={styles.specValue}>{project.filterCategory}</span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>IMPLEMENTATION STATE</span>
              <span className={styles.specValue}>VERIFIED COMPLETE</span>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className={styles.contentGrid}>
            {/* Left Main Column */}
            <div className={styles.leftCol}>
              {/* 1. Problem & Architectural Overview */}
              <section className={styles.sectionBlock}>
                <div className={styles.sectionHeader}>
                  <Cpu size={18} className={styles.sectionIcon} />
                  <h2 className={styles.sectionTitle}>SYSTEM OVERVIEW & PURPOSE</h2>
                  <span className={styles.sectionSubtitle}>[01 // SCOPE]</span>
                </div>
                <div className={styles.prose}>
                  <p>{project.fullDescription}</p>
                </div>
              </section>

              {/* 2. Architecture & Pipeline Schematic */}
              <section className={styles.architectureCard}>
                <div className={styles.sectionHeader}>
                  <Layers size={18} className={styles.sectionIcon} />
                  <h2 className={styles.sectionTitle}>ARCHITECTURAL SCHEMATIC & PIPELINE</h2>
                  <span className={styles.sectionSubtitle}>[02 // TOPOLOGY]</span>
                </div>

                <p className={styles.diagramCaption}>
                  {project.architecture.description}
                </p>

                <div className={styles.diagramContainer}>
                  <ProjectArchitectureDiagram
                    type={project.schematicType}
                    title={project.title}
                  />
                </div>

                {/* Execution Flow Steps */}
                <h3 className={styles.sectionTitle} style={{ fontSize: "1rem", marginTop: "2rem" }}>
                  DATA & TRANSACTION FLOW
                </h3>
                <div className={styles.flowList}>
                  {project.architecture.flow.map((step, idx) => (
                    <div key={idx} className={styles.flowItem}>
                      <span className={styles.flowStepNum}>0{idx + 1}</span>
                      <p className={styles.flowText}>{step}</p>
                    </div>
                  ))}
                </div>

                {/* Core Architecture Components */}
                {project.architecture.components && project.architecture.components.length > 0 && (
                  <>
                    <h3 className={styles.sectionTitle} style={{ fontSize: "1rem", marginTop: "2.5rem" }}>
                      SUBSYSTEM BREAKDOWN
                    </h3>
                    <div className={styles.componentsGrid}>
                      {project.architecture.components.map((comp, idx) => (
                        <div key={idx} className={styles.componentCard}>
                          <span className={styles.componentName}>{comp.name}</span>
                          <span className={styles.componentTech}>{comp.tech}</span>
                          <p className={styles.componentRole}>{comp.role}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </section>

              {/* 3. Implemented Capabilities */}
              <section className={styles.sectionBlock}>
                <div className={styles.sectionHeader}>
                  <ShieldCheck size={18} className={styles.sectionIcon} />
                  <h2 className={styles.sectionTitle}>KEY IMPLEMENTED CAPABILITIES</h2>
                  <span className={styles.sectionSubtitle}>[03 // CAPABILITIES]</span>
                </div>

                <ul className={styles.bulletList}>
                  {project.keyFeatures.map((feature, idx) => (
                    <li key={idx} className={styles.bulletItem}>
                      <CheckCircle2 size={16} className={styles.checkBullet} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* 4. Engineering Contributions */}
              <section className={styles.sectionBlock}>
                <div className={styles.sectionHeader}>
                  <Terminal size={18} className={styles.sectionIcon} />
                  <h2 className={styles.sectionTitle}>INDIVIDUAL ENGINEERING CONTRIBUTIONS</h2>
                  <span className={styles.sectionSubtitle}>[04 // EXECUTION]</span>
                </div>

                <ul className={styles.bulletList}>
                  {project.engineeringContribution.map((contrib, idx) => (
                    <li key={idx} className={styles.bulletItem}>
                      <CheckCircle2 size={16} className={styles.checkBullet} />
                      <span>{contrib}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* 5. Deep Dive & Implementation Notes */}
              {project.deepDive && (
                <section className={styles.sectionBlock}>
                  <div className={styles.sectionHeader}>
                    <Code2 size={18} className={styles.sectionIcon} />
                    <h2 className={styles.sectionTitle}>{project.deepDive.title.toUpperCase()}</h2>
                    <span className={styles.sectionSubtitle}>[05 // DEEP DIVE]</span>
                  </div>

                  <p className={styles.subtitle} style={{ fontSize: "1rem", marginBottom: "1.5rem" }}>
                    {project.deepDive.subtitle}
                  </p>

                  <ul className={styles.bulletList}>
                    {project.deepDive.architectureNotes.map((note, idx) => (
                      <li key={idx} className={styles.bulletItem}>
                        <CheckCircle2 size={16} className={styles.checkBullet} />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>

                  {project.deepDive.codeHighlight && (
                    <div className={styles.codeHighlightBox}>
                      <div className={styles.codeHeader}>
                        <span>FILE: {project.deepDive.codeHighlight.filename}</span>
                        <span>CORE LOGIC</span>
                      </div>
                      <p className={styles.codeDesc}>
                        {project.deepDive.codeHighlight.description}
                      </p>
                    </div>
                  )}
                </section>
              )}

              {/* 6. Challenges & Engineering Solutions */}
              {project.challenges && project.challenges.length > 0 && (
                <section className={styles.sectionBlock}>
                  <div className={styles.sectionHeader}>
                    <Cpu size={18} className={styles.sectionIcon} />
                    <h2 className={styles.sectionTitle}>ENGINEERING CHALLENGES & RESOLUTIONS</h2>
                    <span className={styles.sectionSubtitle}>[06 // RESOLUTIONS]</span>
                  </div>

                  <div className={styles.challengesList}>
                    {project.challenges.map((c, idx) => (
                      <div key={idx} className={styles.challengeCard}>
                        <h3 className={styles.challengeTitle}>{c.title}</h3>
                        <p className={styles.challengeProblem}>{c.description}</p>
                        <p className={styles.challengeSolution}>
                          <strong>Solution: </strong>
                          {c.solution}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right Sidebar Column */}
            <aside className={styles.rightCol}>
              {/* Full Technology Stack */}
              <div className={styles.sidebarCard}>
                <h3 className={styles.sidebarTitle}>TECHNOLOGY STACK</h3>
                <div className={styles.techTags}>
                  {project.technologies.map((tech) => (
                    <span key={tech} className={styles.techTag}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Repository & Source Code Information */}
              <div className={styles.sidebarCard}>
                <h3 className={styles.sidebarTitle}>SOURCE CODE & REPO</h3>
                {project.githubUrl ? (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.backToWorkBtn}
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    <span>VIEW REPOSITORY</span>
                    <ArrowUpRight size={14} />
                  </a>
                ) : (
                  <div>
                    <p className={styles.repoNotice}>
                      This completed codebase is held in a private repository and scheduled for open-source publication on GitHub.
                    </p>
                    <div className={styles.repoBadge}>
                      <FolderGit2 size={13} />
                      <span>SOURCE CODE VERIFIED</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Live Demonstration Link */}
              {project.liveDemoUrl && (
                <div className={styles.sidebarCard}>
                  <h3 className={styles.sidebarTitle}>DEPLOYMENT</h3>
                  <a
                    href={project.liveDemoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.backToWorkBtn}
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    <span>OPEN LIVE DEMO</span>
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              )}

              {/* Quick Navigation back to work */}
              <div className={styles.sidebarCard}>
                <h3 className={styles.sidebarTitle}>WORK REGISTRY</h3>
                <Link
                  href="/#work"
                  className={styles.backBtn}
                  style={{ color: "var(--text-primary)" }}
                >
                  <ArrowLeft size={13} />
                  <span>VIEW ALL 11 PROJECTS</span>
                </Link>
              </div>
            </aside>
          </div>

          {/* Adjacent Project Navigation */}
          <nav className={styles.bottomNav} aria-label="Adjacent Projects">
            <div className={styles.bottomNavGrid}>
              <Link href={`/projects/${prev.slug}`} className={styles.adjacentLink}>
                <span className={styles.adjacentDir}>
                  <ArrowLeft size={12} />
                  <span>PREVIOUS PROJECT ({prev.index})</span>
                </span>
                <span className={styles.adjacentTitle}>{prev.title}</span>
                <span className={styles.adjacentCategory}>{prev.category}</span>
              </Link>

              <Link
                href={`/projects/${next.slug}`}
                className={styles.adjacentLink}
                style={{ textAlign: "right" }}
              >
                <span className={styles.adjacentDir} style={{ justifyContent: "flex-end" }}>
                  <span>NEXT PROJECT ({next.index})</span>
                  <ArrowRight size={12} />
                </span>
                <span className={styles.adjacentTitle}>{next.title}</span>
                <span className={styles.adjacentCategory}>{next.category}</span>
              </Link>
            </div>

            <div className={styles.backToWorkCta}>
              <Link href="/#work" className={styles.backToWorkBtn}>
                <ArrowLeft size={14} />
                <span>RETURN TO WORK INDEX</span>
              </Link>
            </div>
          </nav>
        </div>
      </main>

      <Footer />
    </div>
  );
}
