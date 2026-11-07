"use client";

import { ArrowUp, Mail, FileText } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/shared/Icons";
import styles from "./Footer.module.scss";
import { personalData } from "@/data/personal";
import { navItems } from "@/data/navigation";
import { soundManager } from "@/lib/sound";

export function Footer() {
  const scrollToTop = () => {
    soundManager.playClick();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.container}>
        {/* Top Rule with System Telemetry */}
        <div className={styles.telemetryRow}>
          <div className={styles.telemetryItem}>
            <span className={styles.dot} />
            <span className={styles.label}>SYS:</span>
            <span className={styles.value}>ONLINE / REACT THREE FIBER / NEXT 15</span>
          </div>
          <div className={styles.telemetryItem}>
            <span className={styles.label}>TIMEZONE:</span>
            <span className={styles.value}>IST (UTC+5:30)</span>
          </div>
          <div className={styles.telemetryItem}>
            <span className={styles.label}>LOCATION:</span>
            <span className={styles.value}>INDIA</span>
          </div>
          <button
            type="button"
            className={styles.backToTopBtn}
            onClick={scrollToTop}
            aria-label="Back to top"
          >
            <span>RETURN TO TOP</span>
            <ArrowUp size={14} />
          </button>
        </div>

        {/* Main Grid */}
        <div className={styles.mainGrid}>
          {/* Column 1: Monogram and Editorial Philosophy */}
          <div className={styles.brandCol}>
            <div className={styles.logoMark}>
              <span className={styles.monogram}>M</span>
              <span className={styles.author}>{personalData.name.toUpperCase()}</span>
            </div>
            <p className={styles.tagline}>
              Engineering resilient distributed architectures, real-time audio systems, and intelligent automated workflows.
            </p>
            <div className={styles.availabilityBadge}>
              <span className={styles.pulse} />
              <span>{personalData.availabilityNote}</span>
            </div>
          </div>

          {/* Column 2: Navigation Index */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>INDEX</h4>
            <ul className={styles.linkList}>
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={styles.linkItem}
                    onMouseEnter={() => soundManager.playHover()}
                    onClick={() => soundManager.playClick()}
                  >
                    <span className={styles.num}>{item.index}</span>
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Direct Connect */}
          <div className={styles.connectCol}>
            <h4 className={styles.colTitle}>TRANSMIT</h4>
            <div className={styles.contactItem}>
              <span className={styles.contactType}>DIRECT DISPATCH</span>
              <a
                href={`mailto:${personalData.email}`}
                className={styles.emailLink}
                onMouseEnter={() => soundManager.playHover()}
              >
                {personalData.email}
              </a>
            </div>

            <div className={styles.socialButtons}>
              <a
                href={personalData.github}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialBtn}
                title="GitHub"
              >
                <GithubIcon size={15} />
                <span>GITHUB</span>
              </a>
              <a
                href={personalData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialBtn}
                title="LinkedIn"
              >
                <LinkedinIcon size={15} />
                <span>LINKEDIN</span>
              </a>
              <a
                href={`mailto:${personalData.email}`}
                className={styles.socialBtn}
                title="Email"
              >
                <Mail size={15} />
                <span>EMAIL</span>
              </a>
              <a
                href={personalData.resumeUrl}
                download
                className={styles.socialBtn}
                title="Resume"
              >
                <FileText size={15} />
                <span>RESUME</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Distinctive Editorial Sign-off */}
        <div className={styles.bottomBar}>
          <div className={styles.motto}>
            <span>DESIGNED WITH INTENT.</span>
            <span className={styles.mottoHighlight}>BUILT WITH CODE.</span>
          </div>
          <div className={styles.copyright}>
            <span>© 2026 {personalData.name.toUpperCase()}</span>
            <span className={styles.separator}>—</span>
            <span>ALL RIGHTS RESERVED</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
