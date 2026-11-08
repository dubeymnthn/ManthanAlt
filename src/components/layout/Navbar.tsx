"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Volume2, VolumeX, ArrowUpRight } from "lucide-react";
import styles from "./Navbar.module.scss";
import { personalData } from "@/data/personal";
import { navItems } from "@/data/navigation";
import { formatTimeIST } from "@/lib/utils";
import { soundManager } from "@/lib/sound";
import { getGlobalLenis } from "@/lib/scrollLock";

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [isMuted, setIsMuted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    setMounted(true);
    setCurrentTime(formatTimeIST());

    const timer = setInterval(() => {
      setCurrentTime(formatTimeIST());
    }, 1000);

    const onScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearInterval(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Set up IntersectionObserver to track active section when on homepage
  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection("");
      return;
    }

    const sectionIds = ["work", "expertise", "experience", "about", "experiments", "contact"];
    const sectionElements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sectionElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-80px 0px -55% 0px",
        threshold: 0.1,
      }
    );

    sectionElements.forEach((el) => observer.observe(el));

    return () => {
      sectionElements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [pathname]);

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundManager.setMuted(next);
    if (!next) {
      soundManager.playClick();
    }
  };

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      soundManager.playClick();
      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
      }

      // If we are already on homepage and target is an anchor on homepage
      if (pathname === "/" && href.startsWith("/#")) {
        e.preventDefault();
        const hash = href.replace("/", ""); // e.g. "#work"
        const targetId = hash.replace("#", "");
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          window.history.pushState(null, "", hash);
          setActiveSection(targetId);
          const lenis = getGlobalLenis();
          if (lenis) {
            lenis.scrollTo(targetElement, { offset: -80 });
          } else {
            const top = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({ top, behavior: "smooth" });
          }
        }
      }
    },
    [mobileMenuOpen, pathname]
  );

  return (
    <header
      className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}
      role="banner"
    >
      <div className={styles.navContainer}>
        {/* Brand Monogram */}
        <div className={styles.brandGroup}>
          <Link
            href="/"
            className={styles.brandLink}
            onMouseEnter={() => soundManager.playHover()}
            onClick={() => soundManager.playClick()}
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
              const itemSectionId = item.href.replace("/#", "");
              const isActive = pathname === "/" && activeSection === itemSectionId;

              return (
                <li key={item.href} className={styles.navItem}>
                  <Link
                    href={item.href}
                    className={`${styles.navLink} ${isActive ? styles.activeNav : ""}`}
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
          {mounted && (
            <div className={styles.timeTicker} title="Local IST Station Time (UTC+5:30)">
              <span className={styles.timeLabel}>IST</span>
              <span className={styles.timeValue}>{currentTime}</span>
            </div>
          )}

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
            href="/#contact"
            className={styles.navCta}
            onMouseEnter={() => soundManager.playHover()}
            onClick={(e) => handleNavClick(e, "/#contact")}
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
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`${styles.mobileDrawer} ${mobileMenuOpen ? styles.mobileOpen : ""}`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className={styles.mobileDrawerInner}>
          <div className={styles.mobileMetaRow}>
            <span>LOCATION: INDIA (IST)</span>
            <span>SYSTEM: ONLINE</span>
          </div>

          <nav className={styles.mobileNavLinks} aria-label="Mobile Navigation">
            {navItems.map((item) => {
              const itemSectionId = item.href.replace("/#", "");
              const isActive = pathname === "/" && activeSection === itemSectionId;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.mobileNavLink} ${isActive ? styles.activeMobileNav : ""}`}
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
