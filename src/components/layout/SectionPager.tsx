"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import styles from "./SectionPage.module.scss";
import { getAdjacentNavItems, getNavTitle, pageSequence } from "@/data/navigation";
import { cn } from "@/lib/utils";
import { soundManager } from "@/lib/sound";

interface SectionPagerProps {
  /** Route of the page the pager is rendered on, e.g. "/work". */
  currentHref: string;
}

const linkSounds = {
  onMouseEnter: () => soundManager.playHover(),
  onClick: () => soundManager.playClick(),
};

/** Compact PREV / NEXT navigator plus an index track of every page in the 01-07 sequence. */
export function SectionPager({ currentHref }: SectionPagerProps) {
  const { prev, next } = getAdjacentNavItems(currentHref);
  const current = pageSequence.find((item) => item.href === currentHref);
  const total = String(pageSequence.length).padStart(2, "0");

  return (
    <nav className={styles.pager} aria-label="Section pages">
      <div className={styles.pagerInner}>
        <div className={styles.pagerHead}>
          <p className={styles.pagerLabel}>
            <span>CONTINUE READING</span>
            <span className={styles.pagerSlash} aria-hidden="true">
              {"//"}
            </span>
            <span aria-hidden="true">
              <strong>{current?.index}</strong> / {total}
            </span>
          </p>

          <ol className={styles.track}>
            {pageSequence.map((item) => {
              const title = getNavTitle(item);

              if (item.href === currentHref) {
                return (
                  <li key={item.href}>
                    <span
                      className={cn(styles.trackLink, styles.trackLinkActive)}
                      aria-current="page"
                      title={title}
                    >
                      <span aria-hidden="true">{item.index}</span>
                      <span className={styles.srOnly}>{title} (current page)</span>
                    </span>
                  </li>
                );
              }

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={styles.trackLink}
                    aria-label={`${item.index} ${title}`}
                    title={title}
                    {...linkSounds}
                  >
                    {item.index}
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>

        <div className={styles.pagerGrid}>
          <Link
            href={prev.href}
            rel="prev"
            className={cn(styles.pagerLink, styles.pagerPrev)}
            {...linkSounds}
          >
            <span className={styles.pagerDir}>
              <ArrowLeft size={13} className={styles.pagerArrow} aria-hidden="true" />
              <span>PREVIOUS</span>
              <span className={styles.pagerIndex}>{prev.index}</span>
            </span>
            <span className={styles.pagerTitle}>{getNavTitle(prev)}</span>
            {prev.summary && <span className={styles.pagerSummary}>{prev.summary}</span>}
          </Link>

          <Link
            href={next.href}
            rel="next"
            className={cn(styles.pagerLink, styles.pagerNext)}
            {...linkSounds}
          >
            <span className={styles.pagerDir}>
              <span className={styles.pagerIndex}>{next.index}</span>
              <span>NEXT</span>
              <ArrowRight size={13} className={styles.pagerArrow} aria-hidden="true" />
            </span>
            <span className={styles.pagerTitle}>{getNavTitle(next)}</span>
            {next.summary && <span className={styles.pagerSummary}>{next.summary}</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
}
