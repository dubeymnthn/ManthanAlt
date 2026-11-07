"use client";

import { useEffect, useState } from "react";
import styles from "./CustomCursor.module.scss";

export function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable if hover pointer is fine
    const hasHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!hasHover || prefersReducedMotion) return;
    setMounted(true);

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (
        target?.closest("a") ||
        target?.closest("button") ||
        target?.closest("[data-interactive]") ||
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA"
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [isVisible]);

  if (!mounted || !isVisible) return null;

  return (
    <>
      <div
        className={`${styles.cursorDot} ${isHovering ? styles.hovering : ""}`}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        }}
        aria-hidden="true"
      />
      <div
        className={`${styles.cursorRing} ${isHovering ? styles.ringHovering : ""}`}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        }}
        aria-hidden="true"
      />
    </>
  );
}
