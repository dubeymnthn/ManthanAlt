"use client";

import { Component, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import Link from "next/link";
import clsx from "clsx";
import { ArrowUpRight } from "lucide-react";
import { soundManager } from "@/lib/sound";
import { ProductSculptures3D } from "./ProductSculptures3D";
import { HeroProductLinks } from "./HeroProductLinks";
import { HERO_PRODUCTS, type HeroProduct } from "./heroProducts";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import styles from "./HeroSection.module.scss";

/** If WebGL passes the feature check but still fails at runtime, fall back to 2D links. */
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <HeroProductLinks /> : this.props.children;
  }
}

export function Hero3DUniverseCanvas() {
  const [hovered, setHovered] = useState<HeroProduct | null>(null);
  const [inView, setInView] = useState(true);
  const reducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<Record<string, HTMLElement | null>>({});

  // Stop rendering while the hero is off-screen.
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const handleHover = useCallback((p: HeroProduct | null) => setHovered(p), []);

  return (
    <div
      ref={containerRef}
      className={styles.canvasContainer}
      role="group"
      aria-label="Interactive 3D sculptures of five products. Drag to rotate, select one to open its case study."
    >
      <SceneBoundary>
        <Canvas
          camera={{ position: [0, 0, 9.5], fov: 40, near: 0.1, far: 50 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            toneMapping: THREE.NeutralToneMapping,
          }}
          dpr={[1, 1.75]}
          frameloop={inView ? "always" : "never"}
        >
          <Suspense fallback={null}>
            <ProductSculptures3D
              onHoverProduct={handleHover}
              hoveredProductId={hovered?.id ?? null}
              reducedMotion={reducedMotion}
              labelRefs={labelRefs}
            />
          </Suspense>
        </Canvas>
      </SceneBoundary>

      {/* Clear, linkable project labels — positioned each frame by the scene */}
      <div className={styles.labelLayer}>
        {HERO_PRODUCTS.map((p) => (
          <Link
            key={p.id}
            href={p.route}
            ref={(el) => {
              labelRefs.current[p.id] = el;
            }}
            className={clsx(styles.projectTag, styles.projectTagFloating, hovered?.id === p.id && styles.tagActive)}
            onMouseEnter={() => {
              handleHover(p);
              soundManager.playHover();
            }}
            onMouseLeave={() => handleHover(null)}
            onFocus={() => handleHover(p)}
            onBlur={() => handleHover(null)}
            onClick={() => soundManager.playClick()}
          >
            <span className={styles.tagIndex}>{p.index}</span>
            <span className={styles.tagBody}>
              <span className={styles.tagName}>{p.name}</span>
              <span className={styles.tagCategory}>{p.category}</span>
            </span>
            <ArrowUpRight size={12} className={styles.tagArrow} aria-hidden="true" />
          </Link>
        ))}
      </div>

      <div className={styles.sceneCue} aria-hidden="true">
        <span className={styles.cueDot} />
        <span className={styles.cueText}>Drag to rotate / select an object to open the case study</span>
      </div>
    </div>
  );
}
