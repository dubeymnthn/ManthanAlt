import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import styles from "./SectionPage.module.scss";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionPager } from "@/components/layout/SectionPager";
import { ScrollProgress } from "@/components/shared/ScrollProgress";
import { CustomCursor } from "@/components/shared/CustomCursor";
import { getNavItem, getNavTitle, homeNavItem, pageSequence } from "@/data/navigation";
import { cn } from "@/lib/utils";

interface SectionPageProps {
  /** Route of the page, e.g. "/work". Must match an entry in navItems. */
  href: string;
  children: ReactNode;
}

/**
 * Shell for the dedicated section pages (/work, /expertise, ...). Same composition as the homepage
 * (scroll progress, cursor, navbar, main, footer), plus a breadcrumb masthead that clears the fixed
 * navbar and a PREV / NEXT pager that walks the 01-07 page sequence.
 */
export function SectionPage({ href, children }: SectionPageProps) {
  const item = getNavItem(href);
  if (!item) {
    throw new Error(`SectionPage: no navigation item is registered for "${href}"`);
  }

  const position = pageSequence.indexOf(item);
  const total = String(pageSequence.length).padStart(2, "0");

  return (
    <>
      <ScrollProgress />
      <CustomCursor />
      <Navbar />
      <main id="main-content" role="main" className={styles.main}>
        <header className={styles.masthead}>
          <div className={styles.trail}>
            <Link href={homeNavItem.href} className={styles.crumbLink}>
              <ArrowLeft size={13} aria-hidden="true" />
              <span>{homeNavItem.label}</span>
            </Link>
            <span className={styles.crumbDivider} aria-hidden="true">
              /
            </span>
            <h1 className={styles.pageTitle}>
              <span className={styles.pageIndex} aria-hidden="true">
                {item.index}
              </span>
              <span>{getNavTitle(item)}</span>
            </h1>
          </div>

          <p className={styles.position}>
            <span className={styles.meter} aria-hidden="true">
              {pageSequence.map((page, i) => (
                <span
                  key={page.href}
                  className={cn(styles.meterTick, i <= position && styles.meterTickOn)}
                />
              ))}
            </span>
            <span aria-hidden="true">
              {item.index} / {total}
            </span>
            <span className={styles.srOnly}>
              Page {position + 1} of {pageSequence.length}
            </span>
          </p>
        </header>

        <div className={styles.content}>{children}</div>

        <SectionPager currentHref={href} />
      </main>
      <Footer />
    </>
  );
}
