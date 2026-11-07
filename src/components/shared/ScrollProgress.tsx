"use client";

import { useEffect, useState } from "react";
import styles from "./ScrollProgress.module.scss";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight =
            document.documentElement.scrollHeight - window.innerHeight;
          if (totalHeight > 0) {
            setProgress((window.scrollY / totalHeight) * 100);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={styles.progressBar}
      style={{ transform: `scaleX(${progress / 100})` }}
      aria-hidden="true"
    />
  );
}
