"use client";

import dynamic from "next/dynamic";
import styles from "./playground.module.scss";

// Load FetchPlayground client-side only (Matter.js + Canvas Confetti + Web Audio)
const FetchPlayground = dynamic(
  () => import("./FetchPlayground").then((mod) => mod.FetchPlayground),
  {
    ssr: false,
    loading: () => null,
  }
);

/**
 * Full-width bottom physics arena mounted in root layout.
 * Fixed to the bottom of the viewport spanning 100vw from left to right.
 * Houses the continuous Matter.js physics engine, procedural dog rig, and interactive ball.
 */
export function FloatingFetchBuddy() {
  return (
    <aside
      className={styles.bottomArena}
      aria-label="Bucky the Dog — Engineering Portfolio Mascot and Companion"
    >
      <FetchPlayground />
    </aside>
  );
}
