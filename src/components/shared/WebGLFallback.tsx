"use client";

import styles from "./WebGLFallback.module.scss";

// Colors come from theme tokens via CSS classes (this SVG is server-rendered as the
// dynamic() loading state, so a JS palette would mismatch on hydration at night).

export function WebGLFallback({ label = "SYSTEMS ARCHITECTURE" }: { label?: string }) {
  return (
    <div className={styles.fallbackContainer}>
      <svg
        className={styles.schematicSvg}
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Systems Architecture Schematic"
      >
        {/* Concentric Measurement Rings */}
        <circle cx="200" cy="200" r="160" className={styles.guide} strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="200" cy="200" r="120" className={styles.guide} strokeWidth="1" />
        <circle cx="200" cy="200" r="80" className={styles.orbit} strokeWidth="1.5" strokeDasharray="6 3" />
        <circle cx="200" cy="200" r="40" className={styles.accentStroke} strokeWidth="1.5" />

        {/* Center Node */}
        <rect x="185" y="185" width="30" height="30" className={styles.node} strokeWidth="2" />
        <circle cx="200" cy="200" r="4" className={styles.core} />

        {/* Peripheral Satellite Nodes */}
        <line x1="200" y1="40" x2="200" y2="185" className={styles.spoke} strokeWidth="1" />
        <circle cx="200" cy="40" r="6" className={styles.node} strokeWidth="1.5" />

        <line x1="200" y1="215" x2="200" y2="360" className={styles.spoke} strokeWidth="1" />
        <circle cx="200" cy="360" r="6" className={styles.node} strokeWidth="1.5" />

        <line x1="40" y1="200" x2="185" y2="200" className={styles.spoke} strokeWidth="1" />
        <circle cx="40" cy="200" r="6" className={styles.node} strokeWidth="1.5" />

        <line x1="215" y1="200" x2="360" y2="200" className={styles.spoke} strokeWidth="1" />
        <circle cx="360" cy="200" r="6" className={styles.node} strokeWidth="1.5" />

        {/* Diagonal Crosshair Links */}
        <line x1="87" y1="87" x2="175" y2="175" className={styles.guide} strokeWidth="1" />
        <rect x="80" y="80" width="14" height="14" className={styles.node} strokeWidth="1" />

        <line x1="313" y1="87" x2="225" y2="175" className={styles.guide} strokeWidth="1" />
        <rect x="306" y="80" width="14" height="14" className={styles.node} strokeWidth="1" />

        <line x1="87" y1="313" x2="175" y2="225" className={styles.guide} strokeWidth="1" />
        <rect x="80" y="306" width="14" height="14" className={styles.node} strokeWidth="1" />

        <line x1="313" y1="313" x2="225" y2="225" className={styles.guide} strokeWidth="1" />
        <rect x="306" y="306" width="14" height="14" className={styles.node} strokeWidth="1" />
      </svg>
      <div className={styles.caption}>
        <span className={styles.dot} />
        <span className={styles.text}>{label}</span>
      </div>
    </div>
  );
}
