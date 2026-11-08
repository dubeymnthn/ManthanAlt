import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import styles from "./not-found.module.scss";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <div className={styles.notFoundWrapper}>
      <Navbar />
      <main className={styles.mainContent} role="main">
        <div className={styles.container}>
          <div className={styles.telemetryBadge}>
            <span className={styles.badgePulse} aria-hidden="true" />
            <span>SYSTEM DIAGNOSTIC: 404_ROUTE_NOT_FOUND</span>
          </div>

          <h1 className={styles.errorCode}>404</h1>
          <h2 className={styles.errorTitle}>Requested Route Not Found</h2>
          <p className={styles.errorDesc}>
            The system address or project identifier you requested does not exist in the active registry.
            All 11 completed engineering projects are indexed on the main portfolio ledger.
          </p>

          <div className={styles.actionRow}>
            <Link href="/#work" className={styles.ctaPrimary}>
              <span>EXPLORE 11 COMPLETED PROJECTS</span>
              <ArrowUpRight size={14} />
            </Link>
            <Link href="/" className={styles.ctaSecondary}>
              <ArrowLeft size={14} />
              <span>RETURN TO HOMEPAGE</span>
            </Link>
          </div>

          <div className={styles.quickLinksSection}>
            <p className={styles.quickLinksTitle}>SYSTEM NAVIGATION INDEX</p>
            <ul className={styles.linksList}>
              <li>
                <Link href="/projects/wally-talky">01 // WALLY TALKY</Link>
              </li>
              <li>
                <Link href="/projects/storyforge-ai">02 // STORYFORGE AI</Link>
              </li>
              <li>
                <Link href="/projects/dravyam">03 // DRAVYAM</Link>
              </li>
              <li>
                <Link href="/projects/ride-aggregator">04 // RIDE AGGREGATOR</Link>
              </li>
              <li>
                <Link href="/projects/financial-data-scraper">05 // FINANCIAL SCRAPER</Link>
              </li>
              <li>
                <Link href="/projects/ai-diary">07 // AI DIARY</Link>
              </li>
              <li>
                <Link href="/#expertise">08 // EXPERTISE</Link>
              </li>
              <li>
                <Link href="/#contact">09 // CONTACT</Link>
              </li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
