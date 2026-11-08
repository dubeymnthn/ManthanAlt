"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Volume2, VolumeX, ArrowUpRight } from "lucide-react";
import styles from "./Navbar.module.scss";
import { personalData } from "@/data/personal";
import { navItems, getNavMatch } from "@/data/navigation";
import { cn, formatTimeIST } from "@/lib/utils";
import { soundManager } from "@/lib/sound";
import { getGlobalLenis } from "@/lib/scrollLock";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

/*
 * Every page renders its own <Navbar />, so it remounts on each route change. Values that live
 * outside React (wall clock, mute flag) are read through useSyncExternalStore: after a client-side
 * navigation they are correct on the first render instead of popping in a frame later.
 */
function subscribeClock(onTick: () => void) {
  const timer = window.setInterval(onTick, 1000);
  return () => window.clearInterval(timer);
}
const getClockSnapshot = () => formatTimeIST();
const getServerClockSnapshot = () => "";

const muteListeners = new Set<() => void>();
function subscribeMute(onChange: () => void) {
  muteListeners.add(onChange);
  return () => {
    muteListeners.delete(onChange);
  };
}
const getMutedSnapshot = () => soundManager.getMuted();
const getServerMutedSnapshot = () => false;

function setSoundMuted(muted: boolean) {
  soundManager.setMuted(muted);
  muteListeners.forEach((notify) => notify());
}

/** Plain primary-button clicks only; modified clicks keep their new-tab / new-window behavior. */
function isPlainClick(e: React.MouseEvent) {
  return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
}

function scrollPageToTop() {
  const lenis = getGlobalLenis();
  if (lenis) {
    lenis.scrollTo(0);
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function toAriaCurrent(match: ReturnType<typeof getNavMatch>) {
  if (match === "page") return "page" as const;
  if (match === "section") return "true" as const;
  return undefined;
}

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentTime = useSyncExternalStore(subscribeClock, getClockSnapshot, getServerClockSnapshot);
  const isMuted = useSyncExternalStore(subscribeMute, getMutedSnapshot, getServerMutedSnapshot);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Close the drawer on every route change (link clicks, back/forward, programmatic navigation)
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Escape closes the open drawer
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileMenuOpen]);

  const toggleSound = () => {
    const next = !isMuted;
    setSoundMuted(next);
    if (!next) {
      soundManager.playClick();
    }
  };

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      soundManager.playClick();
      setMobileMenuOpen(false);

      // Already on this page: glide back to the top instead of re-navigating
      if (href === pathname && isPlainClick(e)) {
        e.preventDefault();
        scrollPageToTop();
      }
    },
    [pathname]
  );

  return (
    <header className={cn(styles.header, isScrolled && styles.scrolled)} role="banner">
      <div className={styles.navContainer}>
        {/* Brand Monogram */}
        <div className={styles.brandGroup}>
          <Link
            href="/"
            className={styles.brandLink}
            onMouseEnter={() => soundManager.playHover()}
            onClick={(e) => handleNavClick(e, "/")}
          >
            <span className={styles.monogram}>M</span>
            <span className={styles.brandDivider}>/</span>
            <span className={styles.fullName}>{personalData.name.toUpperCase()}</span>
          </Link>

          {/* Availability Status Indicator */}
          {personalData.availableForWork && (
            <div className={styles.statusIndicator} title={personalData.availabilityNote}>
              <span className={styles.statusPulse} aria-hidden="true" />
              <span className={styles.statusText}>AVAILABLE FOR WORK</span>
            </div>
          )}
        </div>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav} aria-label="Main Navigation">
          <ul className={styles.navList}>
            {navItems.map((item) => {
              const match = getNavMatch(pathname, item);

              return (
                <li key={item.href} className={styles.navItem}>
                  <Link
                    href={item.href}
                    className={cn(styles.navLink, match && styles.activeNav)}
                    aria-current={toAriaCurrent(match)}
                    onMouseEnter={() => soundManager.playHover()}
                    onClick={(e) => handleNavClick(e, item.href)}
                  >
                    <span className={styles.navIndex}>{item.index}</span>
                    <span className={styles.navLabel}>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Technical Controls & Clock */}
        <div className={styles.utilityGroup}>
          {/* Local IST Time */}
          {currentTime && (
            <div className={styles.timeTicker} title="Local IST Station Time (UTC+5:30)">
              <span className={styles.timeLabel}>IST</span>
              <span className={styles.timeValue}>{currentTime}</span>
            </div>
          )}

          {/* Day / Night Theme Toggle */}
          <ThemeToggle />

          {/* Audio Feedback Toggle */}
          <button
            type="button"
            className={styles.iconButton}
            onClick={toggleSound}
            aria-label={isMuted ? "Enable sound effects" : "Mute sound effects"}
            title={isMuted ? "Enable sound effects" : "Mute sound effects"}
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          {/* Quick CTA */}
          <Link
            href="/contact"
            className={styles.navCta}
            onMouseEnter={() => soundManager.playHover()}
            onClick={(e) => handleNavClick(e, "/contact")}
          >
            <span>TALK</span>
            <ArrowUpRight size={13} />
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className={styles.mobileToggle}
            onClick={() => {
              soundManager.playClick();
              setMobileMenuOpen((open) => !open);
            }}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        id="mobile-navigation"
        className={cn(styles.mobileDrawer, mobileMenuOpen && styles.mobileOpen)}
        aria-hidden={!mobileMenuOpen}
        inert={!mobileMenuOpen}
        data-lenis-prevent="true"
      >
        <div className={styles.mobileDrawerInner}>
          <div className={styles.mobileMetaRow}>
            <span>LOCATION: INDIA (IST)</span>
            <span>SYSTEM: ONLINE</span>
          </div>

          <nav className={styles.mobileNavLinks} aria-label="Mobile Navigation">
            {navItems.map((item) => {
              const match = getNavMatch(pathname, item);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(styles.mobileNavLink, match && styles.activeMobileNav)}
                  aria-current={toAriaCurrent(match)}
                  onClick={(e) => handleNavClick(e, item.href)}
                >
                  <span className={styles.mobileNavIndex}>{item.index}</span>
                  <span className={styles.mobileNavLabel}>{item.label}</span>
                  <ArrowUpRight size={16} className={styles.mobileNavArrow} />
                </Link>
              );
            })}
          </nav>

          <div className={styles.mobileDrawerFooter}>
            <p className={styles.mobileEmail}>{personalData.email}</p>
            <div className={styles.mobileSocials}>
              <a href={personalData.github} target="_blank" rel="noopener noreferrer">
                GITHUB
              </a>
              <span className={styles.divider}>/</span>
              <a href={personalData.linkedin} target="_blank" rel="noopener noreferrer">
                LINKEDIN
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
