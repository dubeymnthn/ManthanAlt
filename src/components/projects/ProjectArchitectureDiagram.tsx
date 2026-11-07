"use client";

import { useId } from "react";
import styles from "./ProjectCard.module.scss";

interface ArchitectureDiagramProps {
  type: "realtime" | "ai-pipeline" | "data-pipeline" | "mcp-proxy";
  title: string;
}

export function ProjectArchitectureDiagram({ type, title }: ArchitectureDiagramProps) {
  const baseId = useId();

  return (
    <div className={styles.diagramContainer} aria-label={`${title} Architecture Diagram`}>
      <div className={styles.diagramHeader}>
        <span className={styles.diagTitle}>SYSTEM SCHEMATIC</span>
        <span className={styles.diagType}>[{type.toUpperCase()}]</span>
      </div>

      <div className={styles.svgViewport}>
        {type === "realtime" && (
          <svg viewBox="0 0 460 260" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.diagramSvg}>
            <defs>
              <pattern id={`grid-${baseId}`} width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="#30352D" />
              </pattern>
            </defs>
            <rect width="460" height="260" fill={`url(#grid-${baseId})`} />

            {/* Flutter PTT Client Node */}
            <rect x="25" y="40" width="110" height="65" fill="#191C18" stroke="#30352D" strokeWidth="1.5" />
            <text x="35" y="62" fill="#C5F36B" fontSize="10" fontFamily="var(--font-ibm-plex-mono)" fontWeight="600">CLIENT: FLUTTER</text>
            <text x="35" y="78" fill="#999D92" fontSize="9" fontFamily="var(--font-ibm-plex-mono)">Native Ring Buffer</text>
            <text x="35" y="92" fill="#6B7064" fontSize="8" fontFamily="var(--font-ibm-plex-mono)">OPUS / Binary Frames</text>

            {/* Fastify Gateway Node */}
            <rect x="175" y="40" width="110" height="65" fill="#191C18" stroke="#C5F36B" strokeWidth="1.5" />
            <text x="185" y="62" fill="#F1F0E8" fontSize="10" fontFamily="var(--font-ibm-plex-mono)" fontWeight="600">FASTIFY GATEWAY</text>
            <text x="185" y="78" fill="#C5F36B" fontSize="9" fontFamily="var(--font-ibm-plex-mono)">Socket.IO Cluster</text>
            <text x="185" y="92" fill="#6B7064" fontSize="8" fontFamily="var(--font-ibm-plex-mono)">HMAC Signed URLs</text>

            {/* Redis Fanout Bus */}
            <rect x="325" y="40" width="110" height="65" fill="#191C18" stroke="#30352D" strokeWidth="1.5" />
            <text x="335" y="62" fill="#C5F36B" fontSize="10" fontFamily="var(--font-ibm-plex-mono)" fontWeight="600">REDIS BUS</text>
            <text x="335" y="78" fill="#999D92" fontSize="9" fontFamily="var(--font-ibm-plex-mono)">Sub-100ms Pub/Sub</text>
            <text x="335" y="92" fill="#6B7064" fontSize="8" fontFamily="var(--font-ibm-plex-mono)">Presence TTL</text>

            {/* Connectors */}
            <line x1="135" y1="72" x2="175" y2="72" stroke="#C5F36B" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="285" y1="72" x2="325" y2="72" stroke="#C5F36B" strokeWidth="1.5" strokeDasharray="3 3" />

            {/* Bottom Row: Storage & FCM */}
            <rect x="75" y="155" width="130" height="65" fill="#191C18" stroke="#30352D" strokeWidth="1.5" />
            <text x="85" y="177" fill="#F1F0E8" fontSize="10" fontFamily="var(--font-ibm-plex-mono)" fontWeight="600">POSTGRES + S3</text>
            <text x="85" y="193" fill="#999D92" fontSize="9" fontFamily="var(--font-ibm-plex-mono)">Prisma ORM Vault</text>
            <text x="85" y="207" fill="#6B7064" fontSize="8" fontFamily="var(--font-ibm-plex-mono)">Expiring Audio Notes</text>

            <rect x="255" y="155" width="130" height="65" fill="#191C18" stroke="#30352D" strokeWidth="1.5" />
            <text x="265" y="177" fill="#C5F36B" fontSize="10" fontFamily="var(--font-ibm-plex-mono)" fontWeight="600">FCM WAKEUP</text>
            <text x="265" y="193" fill="#999D92" fontSize="9" fontFamily="var(--font-ibm-plex-mono)">High-Priority Call Ring</text>
            <text x="265" y="207" fill="#6B7064" fontSize="8" fontFamily="var(--font-ibm-plex-mono)">Android Bg Service</text>

            {/* Vertical Flow Links */}
            <line x1="230" y1="105" x2="140" y2="155" stroke="#30352D" strokeWidth="1.5" />
            <line x1="230" y1="105" x2="320" y2="155" stroke="#879B67" strokeWidth="1.5" strokeDasharray="2 2" />
          </svg>
        )}

        {type === "ai-pipeline" && (
          <svg viewBox="0 0 460 260" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.diagramSvg}>
            <defs>
              <pattern id={`grid-${baseId}`} width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="#30352D" />
              </pattern>
            </defs>
            <rect width="460" height="260" fill={`url(#grid-${baseId})`} />

            {/* Prompt Seed */}
            <rect x="20" y="45" width="115" height="65" fill="#191C18" stroke="#30352D" strokeWidth="1.5" />
            <text x="30" y="67" fill="#C5F36B" fontSize="10" fontFamily="var(--font-ibm-plex-mono)" fontWeight="600">STORY SEED</text>
            <text x="30" y="83" fill="#999D92" fontSize="9" fontFamily="var(--font-ibm-plex-mono)">Genre & Characters</text>
            <text x="30" y="97" fill="#6B7064" fontSize="8" fontFamily="var(--font-ibm-plex-mono)">Beat Constraints</text>

            {/* Gemini Multi-Agent */}
            <rect x="170" y="45" width="120" height="65" fill="#191C18" stroke="#C5F36B" strokeWidth="1.5" />
            <text x="180" y="67" fill="#F1F0E8" fontSize="10" fontFamily="var(--font-ibm-plex-mono)" fontWeight="600">GEMINI ENGINE</text>
            <text x="180" y="83" fill="#C5F36B" fontSize="9" fontFamily="var(--font-ibm-plex-mono)">Multi-Act Script</text>
            <text x="180" y="97" fill="#6B7064" fontSize="8" fontFamily="var(--font-ibm-plex-mono)">JSON Speaker Tokens</text>

            {/* SSML Phonetics */}
            <rect x="325" y="45" width="115" height="65" fill="#191C18" stroke="#30352D" strokeWidth="1.5" />
            <text x="335" y="67" fill="#C5F36B" fontSize="10" fontFamily="var(--font-ibm-plex-mono)" fontWeight="600">SSML NORMALIZER</text>
            <text x="335" y="83" fill="#999D92" fontSize="9" fontFamily="var(--font-ibm-plex-mono)">Hindi Dialects</text>
            <text x="335" y="97" fill="#6B7064" fontSize="8" fontFamily="var(--font-ibm-plex-mono)">Prosody & Pauses</text>

            <line x1="135" y1="77" x2="170" y2="77" stroke="#C5F36B" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="290" y1="77" x2="325" y2="77" stroke="#C5F36B" strokeWidth="1.5" strokeDasharray="3 3" />

            {/* Multi-Track Audio Engine */}
            <rect x="95" y="155" width="270" height="65" fill="#191C18" stroke="#879B67" strokeWidth="1.5" />
            <text x="110" y="177" fill="#F1F0E8" fontSize="10" fontFamily="var(--font-ibm-plex-mono)" fontWeight="600">MULTI-TRACK AUDIO MIXER (WEB AUDIO / WASM)</text>
            <text x="110" y="193" fill="#C5F36B" fontSize="9" fontFamily="var(--font-ibm-plex-mono)">Multi-Voice Synthesis → Background Ambiance Ducking</text>
            <text x="110" y="207" fill="#6B7064" fontSize="8" fontFamily="var(--font-ibm-plex-mono)">Real-Time Timeline Waveform Scrubbing</text>

            <line x1="382" y1="110" x2="230" y2="155" stroke="#C5F36B" strokeWidth="1.5" />
          </svg>
        )}

        {type === "data-pipeline" && (
          <svg viewBox="0 0 460 260" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.diagramSvg}>
            <defs>
              <pattern id={`grid-${baseId}`} width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="#30352D" />
              </pattern>
            </defs>
            <rect width="460" height="260" fill={`url(#grid-${baseId})`} />

            {/* Headless Crawler */}
            <rect x="25" y="45" width="115" height="65" fill="#191C18" stroke="#30352D" strokeWidth="1.5" />
            <text x="35" y="67" fill="#C5F36B" fontSize="10" fontFamily="var(--font-ibm-plex-mono)" fontWeight="600">SELENIUM CRAWLER</text>
            <text x="35" y="83" fill="#999D92" fontSize="9" fontFamily="var(--font-ibm-plex-mono)">2FA Session Bridge</text>
            <text x="35" y="97" fill="#6B7064" fontSize="8" fontFamily="var(--font-ibm-plex-mono)">Encrypted Portal Auth</text>

            {/* Coordinate Density Parser */}
            <rect x="175" y="45" width="120" height="65" fill="#191C18" stroke="#C5F36B" strokeWidth="1.5" />
            <text x="185" y="67" fill="#F1F0E8" fontSize="10" fontFamily="var(--font-ibm-plex-mono)" fontWeight="600">PDFPLUMBER ENGINE</text>
            <text x="185" y="83" fill="#C5F36B" fontSize="9" fontFamily="var(--font-ibm-plex-mono)">X-Density Clustering</text>
            <text x="185" y="97" fill="#6B7064" fontSize="8" fontFamily="var(--font-ibm-plex-mono)">99.8% Grid Accuracy</text>

            {/* Reconciliation */}
            <rect x="330" y="45" width="105" height="65" fill="#191C18" stroke="#30352D" strokeWidth="1.5" />
            <text x="340" y="67" fill="#C5F36B" fontSize="10" fontFamily="var(--font-ibm-plex-mono)" fontWeight="600">F&O LEDGER</text>
            <text x="340" y="83" fill="#999D92" fontSize="9" fontFamily="var(--font-ibm-plex-mono)">P&L Normalizer</text>
            <text x="340" y="97" fill="#6B7064" fontSize="8" fontFamily="var(--font-ibm-plex-mono)">Voucher Auditing</text>

            <line x1="140" y1="77" x2="175" y2="77" stroke="#C5F36B" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="295" y1="77" x2="330" y2="77" stroke="#C5F36B" strokeWidth="1.5" strokeDasharray="3 3" />

            {/* MongoDB Warehouse */}
            <rect x="120" y="155" width="220" height="65" fill="#191C18" stroke="#879B67" strokeWidth="1.5" />
            <text x="135" y="177" fill="#F1F0E8" fontSize="10" fontFamily="var(--font-ibm-plex-mono)" fontWeight="600">MONGODB DOCUMENT WAREHOUSE</text>
            <text x="135" y="193" fill="#C5F36B" fontSize="9" fontFamily="var(--font-ibm-plex-mono)">Time-Series Trade Records & Tax Audits</text>
            <text x="135" y="207" fill="#6B7064" fontSize="8" fontFamily="var(--font-ibm-plex-mono)">High-Throughput Batch Writes</text>

            <line x1="235" y1="110" x2="235" y2="155" stroke="#C5F36B" strokeWidth="1.5" />
          </svg>
        )}

        {type === "mcp-proxy" && (
          <svg viewBox="0 0 460 260" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.diagramSvg}>
            <defs>
              <pattern id={`grid-${baseId}`} width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="#30352D" />
              </pattern>
            </defs>
            <rect width="460" height="260" fill={`url(#grid-${baseId})`} />

            {/* Chrome MV3 Extension */}
            <rect x="25" y="45" width="115" height="65" fill="#191C18" stroke="#30352D" strokeWidth="1.5" />
            <text x="35" y="67" fill="#C5F36B" fontSize="10" fontFamily="var(--font-ibm-plex-mono)" fontWeight="600">CHROME EXTENSION</text>
            <text x="35" y="83" fill="#999D92" fontSize="9" fontFamily="var(--font-ibm-plex-mono)">Manifest V3 Hook</text>
            <text x="35" y="97" fill="#6B7064" fontSize="8" fontFamily="var(--font-ibm-plex-mono)">Cookie & Bearer Tap</text>

            {/* Encrypted Loopback Socket */}
            <rect x="175" y="45" width="120" height="65" fill="#191C18" stroke="#C5F36B" strokeWidth="1.5" />
            <text x="185" y="67" fill="#F1F0E8" fontSize="10" fontFamily="var(--font-ibm-plex-mono)" fontWeight="600">MCP TOKEN SERVER</text>
            <text x="185" y="83" fill="#C5F36B" fontSize="9" fontFamily="var(--font-ibm-plex-mono)">Express Local IPC</text>
            <text x="185" y="97" fill="#6B7064" fontSize="8" fontFamily="var(--font-ibm-plex-mono)">RAM-Encrypted Cache</text>

            {/* MCP Tools Protocol */}
            <rect x="330" y="45" width="105" height="65" fill="#191C18" stroke="#30352D" strokeWidth="1.5" />
            <text x="340" y="67" fill="#C5F36B" fontSize="10" fontFamily="var(--font-ibm-plex-mono)" fontWeight="600">MCP CLIENTS</text>
            <text x="340" y="83" fill="#999D92" fontSize="9" fontFamily="var(--font-ibm-plex-mono)">IDE & AI Agents</text>
            <text x="340" y="97" fill="#6B7064" fontSize="8" fontFamily="var(--font-ibm-plex-mono)">Zero Copy-Paste</text>

            <line x1="140" y1="77" x2="175" y2="77" stroke="#C5F36B" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="295" y1="77" x2="330" y2="77" stroke="#C5F36B" strokeWidth="1.5" strokeDasharray="3 3" />

            {/* Security Architecture */}
            <rect x="110" y="155" width="240" height="65" fill="#191C18" stroke="#879B67" strokeWidth="1.5" />
            <text x="125" y="177" fill="#F1F0E8" fontSize="10" fontFamily="var(--font-ibm-plex-mono)" fontWeight="600">SECURITY & TTL LIFECYCLE</text>
            <text x="125" y="193" fill="#C5F36B" fontSize="9" fontFamily="var(--font-ibm-plex-mono)">Ephemeral Memory Scrubbing + CORS Sandboxing</text>
            <text x="125" y="207" fill="#6B7064" fontSize="8" fontFamily="var(--font-ibm-plex-mono)">Pre-Shared Secret Handshake</text>

            <line x1="235" y1="110" x2="235" y2="155" stroke="#C5F36B" strokeWidth="1.5" />
          </svg>
        )}
      </div>

      <div className={styles.diagramFooter}>
        <span>COMPONENTS: VERIFIED</span>
        <span>SPEC: PRODUCTION CODEBASE</span>
      </div>
    </div>
  );
}
