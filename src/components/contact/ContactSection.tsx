"use client";

import { useState } from "react";
import { Mail, FileText, Check, Copy, Send, ArrowUpRight } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/shared/Icons";
import styles from "./ContactSection.module.scss";
import { personalData } from "@/data/personal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { soundManager } from "@/lib/sound";

export function ContactSection() {
  const [copied, setCopied] = useState(false);
  const [subjectType, setSubjectType] = useState("Full-Stack Architecture & Development");
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [message, setMessage] = useState("");
  const [dispatched, setDispatched] = useState(false);

  const handleCopyEmail = () => {
    soundManager.playClick();
    navigator.clipboard.writeText(personalData.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playClick();

    // Construct mailto with prefilled details
    const mailtoUrl = `mailto:${personalData.email}?subject=${encodeURIComponent(
      `[Portfolio Inquiry - ${subjectType}] from ${senderName || "Visitor"}`
    )}&body=${encodeURIComponent(
      `Sender: ${senderName} (${senderEmail})\nProject Type: ${subjectType}\n\nMessage:\n${message}`
    )}`;

    window.location.href = mailtoUrl;
    setDispatched(true);
    setTimeout(() => setDispatched(false), 5000);
  };

  const inquiryTypes = [
    "Full-Stack Architecture & Development",
    "Real-Time / Mobile Engineering",
    "AI & Data Automation Pipeline",
    "Engineering Role / Opportunities",
  ];

  return (
    <section className={styles.section} id="contact" aria-label="Contact">
      <div className={styles.container}>
        <SectionHeading
          index="06"
          tag="LET'S BUILD SOMETHING"
          title={personalData.contactHeadline}
          subtitle={personalData.contactSubtext}
        />

        <div className={styles.contactGrid}>
          {/* Left Column: Direct Channels & Verified Coordinates */}
          <div className={styles.directCol}>
            {/* Quick Email Copy Box */}
            <div className={styles.emailCard}>
              <div className={styles.cardTop}>
                <span className={styles.cardTag}>PRIMARY DISPATCH ENDPOINT</span>
                <span className={styles.cardProtocol}>[PROTOCOL: SMTP]</span>
              </div>
              <a
                href={`mailto:${personalData.email}`}
                className={styles.emailAddress}
                onMouseEnter={() => soundManager.playHover()}
              >
                {personalData.email}
              </a>
              <div className={styles.emailActions}>
                <a
                  href={`mailto:${personalData.email}`}
                  className={styles.emailSendBtn}
                  onMouseEnter={() => soundManager.playHover()}
                >
                  <Mail size={14} />
                  <span>OPEN EMAIL CLIENT</span>
                </a>
                <button
                  type="button"
                  className={styles.copyBtn}
                  onClick={handleCopyEmail}
                  onMouseEnter={() => soundManager.playHover()}
                >
                  {copied ? <Check size={14} className={styles.checkIcon} /> : <Copy size={14} />}
                  <span>{copied ? "COPIED TO CLIPBOARD" : "COPY ADDRESS"}</span>
                </button>
              </div>
            </div>

            {/* Verification Links */}
            <div className={styles.socialGrid}>
              <a
                href={personalData.github}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLinkCard}
                onMouseEnter={() => soundManager.playHover()}
              >
                <div className={styles.socialTop}>
                  <GithubIcon size={18} className={styles.socialIcon} />
                  <ArrowUpRight size={14} className={styles.arrowIcon} />
                </div>
                <span className={styles.socialLabel}>GITHUB</span>
                <span className={styles.socialDetail}>@dubeymnthn</span>
              </a>

              <a
                href={personalData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLinkCard}
                onMouseEnter={() => soundManager.playHover()}
              >
                <div className={styles.socialTop}>
                  <LinkedinIcon size={18} className={styles.socialIcon} />
                  <ArrowUpRight size={14} className={styles.arrowIcon} />
                </div>
                <span className={styles.socialLabel}>LINKEDIN</span>
                <span className={styles.socialDetail}>in/dubeymnthn</span>
              </a>

              <a
                href={personalData.resumeUrl}
                download
                className={styles.socialLinkCard}
                onMouseEnter={() => soundManager.playHover()}
              >
                <div className={styles.socialTop}>
                  <FileText size={18} className={styles.socialIcon} />
                  <ArrowUpRight size={14} className={styles.arrowIcon} />
                </div>
                <span className={styles.socialLabel}>CURRICULUM VITAE</span>
                <span className={styles.socialDetail}>PDF FORMAT</span>
              </a>
            </div>

            {/* Station Status Box */}
            <div className={styles.statusBox}>
              <div className={styles.statusRow}>
                <span className={styles.statusPulse} />
                <span className={styles.statusTitle}>OPERATIONAL READINESS:</span>
                <span className={styles.statusVal}>OPEN FOR HIGH-IMPACT ENGAGEMENTS</span>
              </div>
              <p className={styles.statusNote}>
                Typical response window: within 24 hours. Located in IST (UTC+5:30), operating globally across distributed teams.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Dispatch Composer */}
          <div className={styles.formCol}>
            <form className={styles.contactForm} onSubmit={handleSubmit}>
              <div className={styles.formHeader}>
                <span className={styles.formTitle}>DIRECT MESSAGE DISPATCHER</span>
                <span className={styles.formSub}>DIRECT TO {personalData.email}</span>
              </div>

              {/* Inquiry Type Selector */}
              <div className={styles.formField}>
                <label className={styles.fieldLabel}>01 / SELECT INQUIRY DOMAIN</label>
                <div className={styles.typePills}>
                  {inquiryTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      className={`${styles.typePill} ${subjectType === type ? styles.typePillActive : ""}`}
                      onClick={() => {
                        soundManager.playClick();
                        setSubjectType(type);
                      }}
                      onMouseEnter={() => soundManager.playHover()}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Email Fields */}
              <div className={styles.fieldRow}>
                <div className={styles.formField}>
                  <label htmlFor="sender-name" className={styles.fieldLabel}>
                    02 / YOUR IDENTITY
                  </label>
                  <input
                    id="sender-name"
                    type="text"
                    required
                    placeholder="Name or Organization"
                    className={styles.formInput}
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                  />
                </div>

                <div className={styles.formField}>
                  <label htmlFor="sender-email" className={styles.fieldLabel}>
                    03 / RETURN TRANSMISSION ADDRESS
                  </label>
                  <input
                    id="sender-email"
                    type="email"
                    required
                    placeholder="email@example.com"
                    className={styles.formInput}
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Message Field */}
              <div className={styles.formField}>
                <label htmlFor="message-body" className={styles.fieldLabel}>
                  04 / PROJECT SCOPE & REQUIREMENTS
                </label>
                <textarea
                  id="message-body"
                  required
                  rows={5}
                  placeholder="Describe the architectural challenge, product requirements, or opportunity..."
                  className={styles.formTextarea}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              {/* Submit Dispatch */}
              <button
                type="submit"
                className={styles.submitBtn}
                onMouseEnter={() => soundManager.playHover()}
              >
                <Send size={14} />
                <span>DISPATCH VIA EMAIL CLIENT</span>
                <ArrowUpRight size={14} className={styles.btnArrow} />
              </button>

              {dispatched && (
                <div className={styles.dispatchedBanner}>
                  <Check size={14} />
                  <span>DEFAULT EMAIL CLIENT OPENED WITH PRE-FILLED INQUIRY.</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
