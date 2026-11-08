"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Sparkles, Layers, Cpu, Box } from "lucide-react";
import styles from "./HeroSection.module.scss";
import { personalData } from "@/data/personal";
import { soundManager } from "@/lib/sound";
import { useWebGLSupport } from "@/hooks/useWebGLSupport";
import { HeroProductLinks } from "./HeroProductLinks";

const Hero3DUniverseCanvas = dynamic(
  () => import("./Hero3DUniverseCanvas").then((mod) => mod.Hero3DUniverseCanvas),
  {
    ssr: false,
    // The portrait is already on screen; nothing should flash while the scene loads.
    loading: () => null,
  }
);

const HIGHLIGHT_ICONS = [
  <Box key="1" size={13} className={styles.highlightIcon} />,
  <Layers key="2" size={13} className={styles.highlightIcon} />,
  <Sparkles key="3" size={13} className={styles.highlightIcon} />,
  <Cpu key="4" size={13} className={styles.highlightIcon} />,
];

export function HeroSection() {
  const hasWebGL = useWebGLSupport();

  return (
    <section className={styles.hero} id="hero" aria-label="Introduction">
      <div className={styles.container}>
        {/* Left Side (40-45%): Editorial Typography & Engineering Highlights */}
        <div className={styles.editorialCol}>
          {/* Header Block: Metadata + Headline */}
          <div className={styles.headerBlock}>
            <div className={styles.metaBadge}>
              <span className={styles.metaTag}>SOFTWARE ENGINEER</span>
              <span className={styles.metaSlash}>/</span>
              <span className={styles.metaLocation}>INDIA</span>
              <span className={styles.metaNode}>[IST: UTC+5:30]</span>
            </div>

            <h1 className={styles.headline}>
              <span className={styles.headlineLine}>I build systems.</span>
              <span className={styles.headlineLine}>I create products.</span>
              <span className={styles.headlineHighlight}>I solve problems.</span>
            </h1>
          </div>

          {/* Details Block: Bio + CTAs + Professional Highlights */}
          <div className={styles.detailsBlock}>
            <p className={styles.supportingCopy}>{personalData.heroBio}</p>

            <div className={styles.ctaRow}>
              <Link
                href="/work"
                className={styles.primaryCta}
                onMouseEnter={() => soundManager.playHover()}
                onClick={() => soundManager.playClick()}
              >
                <span>EXPLORE MY WORK</span>
                <ArrowRight size={14} className={styles.ctaIcon} />
              </Link>

              <Link
                href="/contact"
                className={styles.secondaryCta}
                onMouseEnter={() => soundManager.playHover()}
                onClick={() => soundManager.playClick()}
              >
                <span>LET&apos;S TALK</span>
                <ArrowUpRight size={14} className={styles.ctaIcon} />
              </Link>
            </div>

            <div className={styles.highlightsContainer}>
              <span className={styles.highlightsLabel}>ENGINEERING PROFILE</span>
              <div className={styles.highlightsGrid}>
                {personalData.professionalHighlights.map((item, i) => (
                  <div key={i} className={styles.highlightItem}>
                    <div className={styles.highlightHeader}>
                      {HIGHLIGHT_ICONS[i % HIGHLIGHT_ICONS.length]}
                      <span className={styles.highlightName}>{item.label}</span>
                    </div>
                    {item.detail && <span className={styles.highlightDetail}>{item.detail}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side (55-60%): Manthan's Portrait & Interactive 3D Product Universe */}
        <div className={styles.universeCol}>
          <div className={styles.universeStage}>
            {/* Studio set: warm-grey arch panel + the real photograph, softly faded at the crop */}
            <div className={styles.portraitStack}>
              <div className={styles.studioPanel} aria-hidden="true" />
              <div className={styles.portraitWrapper}>
                <Image
                  src="/images/manthan-portrait.png"
                  alt="Manthan Dubey — Software Engineer"
                  width={1024}
                  height={935}
                  sizes="(max-width: 768px) 70vw, 460px"
                  priority
                  className={styles.portraitImg}
                />
              </div>
            </div>

            {/* Five interactive product sculptures (WebGL) or a 2D link fallback */}
            {hasWebGL && (
              <div className={styles.canvasLayer}>
                <Hero3DUniverseCanvas />
              </div>
            )}
          </div>
          {!hasWebGL && <HeroProductLinks />}
        </div>
      </div>
    </section>
  );
}