"use client";

import dynamic from "next/dynamic";
import { ArrowDown, ArrowUpRight, Cpu } from "lucide-react";
import styles from "./HeroSection.module.scss";
import { personalData } from "@/data/personal";
import { soundManager } from "@/lib/sound";
import { useWebGLSupport } from "@/hooks/useWebGLSupport";
import { WebGLFallback } from "@/components/shared/WebGLFallback";

const SystemsCoreCanvas = dynamic(
  () => import("./SystemsCoreCanvas").then((mod) => mod.SystemsCoreCanvas),
  {
    ssr: false,
    loading: () => <WebGLFallback label="INITIALIZING 3D ENGINE..." />,
  }
);

export function HeroSection() {
  const hasWebGL = useWebGLSupport();

  return (
    <section className={styles.hero} id="hero" aria-label="Introduction">
      <div className={styles.container}>
        {/* Left Side: Editorial Typography & Systems Thesis */}
        <div className={styles.editorialCol}>
          {/* Metadata Tag */}
          <div className={styles.metaBadge}>
            <span className={styles.metaTag}>SOFTWARE ENGINEER</span>
            <span className={styles.metaSlash}>/</span>
            <span className={styles.metaLocation}>INDIA</span>
            <span className={styles.metaStatus}>[IST: UTC+5:30]</span>
          </div>

          {/* Monumental Editorial Headline */}
          <h1 className={styles.headline}>
            <span className={styles.headlineLine}>{personalData.heroHeadline.line1}</span>
            <span className={styles.headlineLine}>{personalData.heroHeadline.line2}</span>
            <span className={styles.headlineHighlight}>{personalData.heroHeadline.line3}</span>
          </h1>

          {/* Supporting Engineering Bio */}
          <p className={styles.supportingCopy}>{personalData.heroBio}</p>

          {/* Primary Action Buttons */}
          <div className={styles.ctaRow}>
            <a
              href="#work"
              className={styles.primaryCta}
              onMouseEnter={() => soundManager.playHover()}
              onClick={() => soundManager.playClick()}
            >
              <span>EXPLORE MY WORK</span>
              <ArrowDown size={14} className={styles.ctaIcon} />
            </a>

            <a
              href="#contact"
              className={styles.secondaryCta}
              onMouseEnter={() => soundManager.playHover()}
              onClick={() => soundManager.playClick()}
            >
              <span>LET&apos;S TALK</span>
              <ArrowUpRight size={14} className={styles.ctaIcon} />
            </a>
          </div>

          {/* Micro Telemetry / Technical System Specs */}
          <div className={styles.systemSpecsGrid}>
            {personalData.systemSpecs.map((spec, i) => (
              <div key={i} className={styles.specItem}>
                <span className={styles.specLabel}>{spec.label}</span>
                <span className={styles.specValue}>{spec.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: The Digital Systems Core 3D Centerpiece */}
        <div className={styles.sceneCol}>
          <div className={styles.sceneWrapper}>
            <div className={styles.sceneHeader}>
              <div className={styles.sceneTitle}>
                <Cpu size={13} className={styles.sceneIcon} />
                <span>DIGITAL SYSTEMS CORE</span>
              </div>
              <span className={styles.sceneStatus}>[INTERACTIVE / WEBGL]</span>
            </div>

            <div className={styles.sceneViewport}>
              {hasWebGL ? <SystemsCoreCanvas /> : <WebGLFallback label="SYSTEMS CORE 2D FALLBACK" />}
            </div>

            <div className={styles.sceneFooter}>
              <span>DRAG / HOVER TO INSPECT KERNEL</span>
              <span>STATE: SYNCHRONIZED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Anchor */}
      <div className={styles.scrollAnchor}>
        <a href="#work" className={styles.scrollLink} aria-label="Scroll to Selected Work">
          <span className={styles.scrollText}>SCROLL TO EXPLORE</span>
          <span className={styles.scrollLine} />
        </a>
      </div>
    </section>
  );
}
