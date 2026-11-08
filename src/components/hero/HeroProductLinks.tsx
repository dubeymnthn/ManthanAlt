import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import styles from "./HeroSection.module.scss";
import { HERO_PRODUCTS } from "./heroProducts";

/**
 * 2D fallback for the 3D sculptures (no WebGL / render failure).
 * Keeps every case study one click away, in the same label language.
 */
export function HeroProductLinks() {
  return (
    <nav className={styles.fallbackNav} aria-label="Featured products">
      <ul className={styles.fallbackList}>
        {HERO_PRODUCTS.map((p) => (
          <li key={p.id}>
            <Link href={p.route} className={styles.projectTag}>
              <span className={styles.tagIndex}>{p.index}</span>
              <span className={styles.tagBody}>
                <span className={styles.tagName}>{p.name}</span>
                <span className={styles.tagCategory}>{p.category}</span>
              </span>
              <ArrowUpRight size={12} className={styles.tagArrow} aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
