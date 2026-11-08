"use client";

import { useId, type CSSProperties } from "react";
import styles from "./ProjectCard.module.scss";

/**
 * Theme-aware schematic palette. Colors resolve through CSS custom properties applied as
 * inline styles (style props accept var(); SVG presentation attributes do not), so every
 * diagram follows the day/night theme instantly without re-rendering.
 */
const DIAGRAM_COLORS = {
  grid: "var(--color-border)",
  node: "var(--color-surface)",
  nodeCore: "var(--color-surface-muted)",
  line: "var(--color-border)",
  accent: "var(--accent-muted)",
  textPrimary: "var(--text-primary)",
  textSecondary: "var(--text-secondary)",
  textTertiary: "var(--text-tertiary)",
} as const;

/** Shared element styles (hoisted so diagrams do not allocate style objects per render). */
const S = {
  gridDot: { fill: DIAGRAM_COLORS.grid },
  node: { fill: DIAGRAM_COLORS.node, stroke: DIAGRAM_COLORS.line },
  nodeCore: { fill: DIAGRAM_COLORS.nodeCore, stroke: DIAGRAM_COLORS.accent },
  nodeAccent: { fill: DIAGRAM_COLORS.node, stroke: DIAGRAM_COLORS.accent },
  link: { stroke: DIAGRAM_COLORS.line },
  linkAccent: { stroke: DIAGRAM_COLORS.accent },
  textAccent: { fill: DIAGRAM_COLORS.accent },
  textPrimary: { fill: DIAGRAM_COLORS.textPrimary },
  textSecondary: { fill: DIAGRAM_COLORS.textSecondary },
  textTertiary: { fill: DIAGRAM_COLORS.textTertiary },
} satisfies Record<string, CSSProperties>;

export type SchematicType =
  | "wally-talky"
  | "storyforge-ai"
  | "dravyam"
  | "ride-aggregator"
  | "financial-scraper"
  | "offline-games"
  | "claude-explorer"
  | "ai-diary"
  | "system-beaver"
  | "project-brain"
  | "mcp-token-server";

interface ArchitectureDiagramProps {
  type: SchematicType;
  title: string;
}

export function ProjectArchitectureDiagram({ type, title }: ArchitectureDiagramProps) {
  const baseId = useId();

  return (
    <div className={styles.diagramContainer} aria-label={`${title} Architecture Diagram`}>
      <div className={styles.diagramHeader}>
        <span className={styles.diagTitle}>ARCHITECTURAL SYSTEM SCHEMATIC</span>
        <span className={styles.diagType}>[{type.toUpperCase()}]</span>
      </div>

      <div className={styles.svgViewport}>
        {/* ================= 01. WALLY TALKY ================= */}
        {type === "wally-talky" && (
          <svg viewBox="0 0 460 260" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.diagramSvg}>
            <defs>
              <pattern id={`grid-${baseId}`} width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" style={S.gridDot} />
              </pattern>
            </defs>
            <rect width="460" height="260" fill={`url(#grid-${baseId})`} />

            {/* Flutter PTT Client Node */}
            <rect x="25" y="40" width="110" height="65" style={S.node} strokeWidth="1.5" />
            <text x="35" y="62" style={S.textAccent} fontSize="10" fontWeight="600">CLIENT: FLUTTER</text>
            <text x="35" y="78" style={S.textSecondary} fontSize="9">Native Ring Buffer</text>
            <text x="35" y="92" style={S.textTertiary} fontSize="8">OPUS / Binary Frames</text>

            {/* Fastify Gateway Node */}
            <rect x="175" y="40" width="110" height="65" style={S.nodeCore} strokeWidth="1.5" />
            <text x="185" y="62" style={S.textPrimary} fontSize="10" fontWeight="600">FASTIFY GATEWAY</text>
            <text x="185" y="78" style={S.textAccent} fontSize="9">Socket.IO Cluster</text>
            <text x="185" y="92" style={S.textTertiary} fontSize="8">HMAC Signed URLs</text>

            {/* Redis Fanout Bus */}
            <rect x="325" y="40" width="110" height="65" style={S.node} strokeWidth="1.5" />
            <text x="335" y="62" style={S.textAccent} fontSize="10" fontWeight="600">REDIS BUS</text>
            <text x="335" y="78" style={S.textSecondary} fontSize="9">Sub-100ms Pub/Sub</text>
            <text x="335" y="92" style={S.textTertiary} fontSize="8">Presence TTL</text>

            {/* Connectors */}
            <line x1="135" y1="72" x2="175" y2="72" style={S.linkAccent} strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="285" y1="72" x2="325" y2="72" style={S.linkAccent} strokeWidth="1.5" strokeDasharray="3 3" />

            {/* Bottom Row: Storage & FCM */}
            <rect x="75" y="155" width="130" height="65" style={S.node} strokeWidth="1.5" />
            <text x="85" y="177" style={S.textPrimary} fontSize="10" fontWeight="600">POSTGRES + S3</text>
            <text x="85" y="193" style={S.textSecondary} fontSize="9">Prisma ORM Vault</text>
            <text x="85" y="207" style={S.textTertiary} fontSize="8">Expiring Audio Notes</text>

            <rect x="255" y="155" width="130" height="65" style={S.node} strokeWidth="1.5" />
            <text x="265" y="177" style={S.textAccent} fontSize="10" fontWeight="600">FCM WAKEUP</text>
            <text x="265" y="193" style={S.textSecondary} fontSize="9">High-Priority Call Ring</text>
            <text x="265" y="207" style={S.textTertiary} fontSize="8">Android Bg Service</text>

            {/* Vertical Flow Links */}
            <line x1="230" y1="105" x2="140" y2="155" style={S.link} strokeWidth="1.5" />
            <line x1="230" y1="105" x2="320" y2="155" style={S.linkAccent} strokeWidth="1.5" strokeDasharray="2 2" />
          </svg>
        )}

        {/* ================= 02. STORYFORGE AI ================= */}
        {type === "storyforge-ai" && (
          <svg viewBox="0 0 460 260" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.diagramSvg}>
            <defs>
              <pattern id={`grid-${baseId}`} width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" style={S.gridDot} />
              </pattern>
            </defs>
            <rect width="460" height="260" fill={`url(#grid-${baseId})`} />

            {/* Prompt Seed */}
            <rect x="20" y="45" width="115" height="65" style={S.node} strokeWidth="1.5" />
            <text x="30" y="67" style={S.textAccent} fontSize="10" fontWeight="600">STORY SEED</text>
            <text x="30" y="83" style={S.textSecondary} fontSize="9">Genre & Characters</text>
            <text x="30" y="97" style={S.textTertiary} fontSize="8">Beat Constraints</text>

            {/* Gemini Multi-Agent & AntiSlop */}
            <rect x="170" y="45" width="120" height="65" style={S.nodeCore} strokeWidth="1.5" />
            <text x="180" y="67" style={S.textPrimary} fontSize="10" fontWeight="600">GEMINI ENGINE</text>
            <text x="180" y="83" style={S.textAccent} fontSize="9">AntiSlopDirector</text>
            <text x="180" y="97" style={S.textTertiary} fontSize="8">JSON Speaker Tokens</text>

            {/* SSML Phonetics */}
            <rect x="325" y="45" width="115" height="65" style={S.node} strokeWidth="1.5" />
            <text x="335" y="67" style={S.textAccent} fontSize="10" fontWeight="600">SSML NORMALIZER</text>
            <text x="335" y="83" style={S.textSecondary} fontSize="9">Hindi Dialects</text>
            <text x="335" y="97" style={S.textTertiary} fontSize="8">Prosody & Pauses</text>

            <line x1="135" y1="77" x2="170" y2="77" style={S.linkAccent} strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="290" y1="77" x2="325" y2="77" style={S.linkAccent} strokeWidth="1.5" strokeDasharray="3 3" />

            {/* Multi-Track Audio Engine */}
            <rect x="95" y="155" width="270" height="65" style={S.nodeAccent} strokeWidth="1.5" />
            <text x="110" y="177" style={S.textPrimary} fontSize="10" fontWeight="600">MULTI-TRACK TIMELINE MIXER (WASM)</text>
            <text x="110" y="193" style={S.textAccent} fontSize="9">Voice Synthesis → Background Ambiance Ducking</text>
            <text x="110" y="207" style={S.textTertiary} fontSize="8">Take Auditioning & Waveform Scrubbing</text>

            <line x1="382" y1="110" x2="230" y2="155" style={S.linkAccent} strokeWidth="1.5" />
          </svg>
        )}

        {/* ================= 03. DRAVYAM — GODOWNOS ================= */}
        {type === "dravyam" && (
          <svg viewBox="0 0 460 260" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.diagramSvg}>
            <defs>
              <pattern id={`grid-${baseId}`} width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" style={S.gridDot} />
              </pattern>
            </defs>
            <rect width="460" height="260" fill={`url(#grid-${baseId})`} />

            {/* Godown Owner Console */}
            <rect x="25" y="40" width="115" height="65" style={S.node} strokeWidth="1.5" />
            <text x="35" y="62" style={S.textAccent} fontSize="10" fontWeight="600">OWNER CONSOLE</text>
            <text x="35" y="78" style={S.textSecondary} fontSize="9">Multi-Godown Mgmt</text>
            <text x="35" y="92" style={S.textTertiary} fontSize="8">Visibility Policies</text>

            {/* Double-Entry Ledger Core */}
            <rect x="175" y="40" width="115" height="65" style={S.nodeCore} strokeWidth="1.5" />
            <text x="185" y="62" style={S.textPrimary} fontSize="10" fontWeight="600">STOCK LEDGER</text>
            <text x="185" y="78" style={S.textAccent} fontSize="9">Avail = Hand - Res</text>
            <text x="185" y="92" style={S.textTertiary} fontSize="8">Prisma ORM (28+ Tbl)</text>

            {/* Visibility & Pricing Engine */}
            <rect x="325" y="40" width="115" height="65" style={S.node} strokeWidth="1.5" />
            <text x="335" y="62" style={S.textAccent} fontSize="10" fontWeight="600">VISIBILITY ENGINE</text>
            <text x="335" y="78" style={S.textSecondary} fontSize="9">Backend-Enforced</text>
            <text x="335" y="92" style={S.textTertiary} fontSize="8">Custom Price Tiers</text>

            <line x1="140" y1="72" x2="175" y2="72" style={S.linkAccent} strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="290" y1="72" x2="325" y2="72" style={S.linkAccent} strokeWidth="1.5" strokeDasharray="3 3" />

            {/* Retailer Portal */}
            <rect x="75" y="155" width="145" height="65" style={S.nodeAccent} strokeWidth="1.5" />
            <text x="85" y="177" style={S.textPrimary} fontSize="10" fontWeight="600">RETAILER PORTAL</text>
            <text x="85" y="193" style={S.textAccent} fontSize="9">Permitted Stock Only</text>
            <text x="85" y="207" style={S.textTertiary} fontSize="8">Enquiry-to-Order Queue</text>

            {/* BullMQ Workers */}
            <rect x="255" y="155" width="145" height="65" style={S.node} strokeWidth="1.5" />
            <text x="265" y="177" style={S.textAccent} fontSize="10" fontWeight="600">BULLMQ QUEUES</text>
            <text x="265" y="193" style={S.textSecondary} fontSize="9">Inventory Reconciler</text>
            <text x="265" y="207" style={S.textTertiary} fontSize="8">TallyPrime Desktop Sync</text>

            <line x1="382" y1="105" x2="150" y2="155" style={S.linkAccent} strokeWidth="1.5" strokeDasharray="2 2" />
            <line x1="232" y1="105" x2="327" y2="155" style={S.link} strokeWidth="1.5" />
          </svg>
        )}

        {/* ================= 04. MULTI-PLATFORM RIDE AGGREGATOR ================= */}
        {type === "ride-aggregator" && (
          <svg viewBox="0 0 460 260" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.diagramSvg}>
            <defs>
              <pattern id={`grid-${baseId}`} width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" style={S.gridDot} />
              </pattern>
            </defs>
            <rect width="460" height="260" fill={`url(#grid-${baseId})`} />

            {/* Mobility Stream Inputs */}
            <rect x="25" y="30" width="95" height="35" style={S.node} strokeWidth="1" />
            <text x="35" y="52" style={S.textAccent} fontSize="9" fontWeight="600">RAPIDO FEED</text>

            <rect x="25" y="75" width="95" height="35" style={S.node} strokeWidth="1" />
            <text x="35" y="97" style={S.textPrimary} fontSize="9" fontWeight="600">UBER FEED</text>

            <rect x="25" y="120" width="95" height="35" style={S.node} strokeWidth="1" />
            <text x="35" y="142" style={S.textAccent} fontSize="9" fontWeight="600">PORTER FREIGHT</text>

            {/* Coordination & Normalization Layer */}
            <rect x="160" y="45" width="130" height="90" style={S.nodeCore} strokeWidth="1.5" />
            <text x="170" y="70" style={S.textPrimary} fontSize="10" fontWeight="600">COORDINATION LAYER</text>
            <text x="170" y="88" style={S.textAccent} fontSize="9">Schema Normalization</text>
            <text x="170" y="104" style={S.textSecondary} fontSize="8">Spatial Radius Match</text>
            <text x="170" y="118" style={S.textTertiary} fontSize="8">Deadhead Minimizer</text>

            <line x1="120" y1="47" x2="160" y2="70" style={S.linkAccent} strokeWidth="1" />
            <line x1="120" y1="92" x2="160" y2="90" style={S.linkAccent} strokeWidth="1" />
            <line x1="120" y1="137" x2="160" y2="110" style={S.linkAccent} strokeWidth="1" />

            {/* Unified Driver Workflow */}
            <rect x="325" y="55" width="115" height="70" style={S.node} strokeWidth="1.5" />
            <text x="335" y="80" style={S.textAccent} fontSize="10" fontWeight="600">DRIVER CONSOLE</text>
            <text x="335" y="96" style={S.textPrimary} fontSize="9">Corridor Route</text>
            <text x="335" y="110" style={S.textTertiary} fontSize="8">Single Tap Actions</text>

            <line x1="290" y1="90" x2="325" y2="90" style={S.linkAccent} strokeWidth="1.5" strokeDasharray="3 3" />

            {/* Operational Boundaries */}
            <rect x="110" y="170" width="240" height="55" style={S.nodeAccent} strokeWidth="1" />
            <text x="125" y="192" style={S.textPrimary} fontSize="9" fontWeight="600">GEOPOLYGON OPERATIONAL BOUNDARIES</text>
            <text x="125" y="208" style={S.textAccent} fontSize="8">Eliminating Unprofitable Long-Distance Deadhead Transit</text>
          </svg>
        )}

        {/* ================= 05. FINANCIAL DATA SCRAPER ================= */}
        {type === "financial-scraper" && (
          <svg viewBox="0 0 460 260" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.diagramSvg}>
            <defs>
              <pattern id={`grid-${baseId}`} width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" style={S.gridDot} />
              </pattern>
            </defs>
            <rect width="460" height="260" fill={`url(#grid-${baseId})`} />

            {/* Headless Crawler */}
            <rect x="25" y="45" width="115" height="65" style={S.node} strokeWidth="1.5" />
            <text x="35" y="67" style={S.textAccent} fontSize="10" fontWeight="600">SELENIUM CRAWLER</text>
            <text x="35" y="83" style={S.textSecondary} fontSize="9">2FA Session Bridge</text>
            <text x="35" y="97" style={S.textTertiary} fontSize="8">Encrypted Portal Auth</text>

            {/* Coordinate Density Parser */}
            <rect x="175" y="45" width="120" height="65" style={S.nodeCore} strokeWidth="1.5" />
            <text x="185" y="67" style={S.textPrimary} fontSize="10" fontWeight="600">PDFPLUMBER ENGINE</text>
            <text x="185" y="83" style={S.textAccent} fontSize="9">X-Density Clustering</text>
            <text x="185" y="97" style={S.textTertiary} fontSize="8">99.8% Grid Accuracy</text>

            {/* Reconciliation */}
            <rect x="330" y="45" width="105" height="65" style={S.node} strokeWidth="1.5" />
            <text x="340" y="67" style={S.textAccent} fontSize="10" fontWeight="600">F&O LEDGER</text>
            <text x="340" y="83" style={S.textSecondary} fontSize="9">P&L Normalizer</text>
            <text x="340" y="97" style={S.textTertiary} fontSize="8">Voucher Auditing</text>

            <line x1="140" y1="77" x2="175" y2="77" style={S.linkAccent} strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="295" y1="77" x2="330" y2="77" style={S.linkAccent} strokeWidth="1.5" strokeDasharray="3 3" />

            {/* MongoDB Warehouse */}
            <rect x="120" y="155" width="220" height="65" style={S.nodeAccent} strokeWidth="1.5" />
            <text x="135" y="177" style={S.textPrimary} fontSize="10" fontWeight="600">MONGODB DOCUMENT WAREHOUSE</text>
            <text x="135" y="193" style={S.textAccent} fontSize="9">Time-Series Trade Records & Tax Audits</text>
            <text x="135" y="207" style={S.textTertiary} fontSize="8">High-Throughput Batch Writes</text>

            <line x1="235" y1="110" x2="235" y2="155" style={S.linkAccent} strokeWidth="1.5" />
          </svg>
        )}

        {/* ================= 06. OFFLINE GAMES HUB ================= */}
        {type === "offline-games" && (
          <svg viewBox="0 0 460 260" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.diagramSvg}>
            <defs>
              <pattern id={`grid-${baseId}`} width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" style={S.gridDot} />
              </pattern>
            </defs>
            <rect width="460" height="260" fill={`url(#grid-${baseId})`} />

            {/* Native Android UI */}
            <rect x="25" y="45" width="115" height="65" style={S.node} strokeWidth="1.5" />
            <text x="35" y="67" style={S.textAccent} fontSize="10" fontWeight="600">ANDROID UI</text>
            <text x="35" y="83" style={S.textSecondary} fontSize="9">Game Catalogue</text>
            <text x="35" y="97" style={S.textTertiary} fontSize="8">SurfaceView Host</text>

            {/* JNI Bridge */}
            <rect x="175" y="45" width="115" height="65" style={S.nodeCore} strokeWidth="1.5" />
            <text x="185" y="67" style={S.textPrimary} fontSize="10" fontWeight="600">NDK / JNI BRIDGE</text>
            <text x="185" y="83" style={S.textAccent} fontSize="9">Zero-Copy Lifecycle</text>
            <text x="185" y="97" style={S.textTertiary} fontSize="8">Touch Input Vector</text>

            {/* C++ Game Engine Core */}
            <rect x="325" y="45" width="115" height="65" style={S.node} strokeWidth="1.5" />
            <text x="335" y="67" style={S.textAccent} fontSize="10" fontWeight="600">C++ ENGINE CORE</text>
            <text x="335" y="83" style={S.textSecondary} fontSize="9">OpenGL ES 60 FPS</text>
            <text x="335" y="97" style={S.textTertiary} fontSize="8">Spatial Partitioning</text>

            <line x1="140" y1="77" x2="175" y2="77" style={S.linkAccent} strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="290" y1="77" x2="325" y2="77" style={S.linkAccent} strokeWidth="1.5" strokeDasharray="3 3" />

            {/* Compressed Offline Storage */}
            <rect x="110" y="155" width="240" height="65" style={S.nodeAccent} strokeWidth="1.5" />
            <text x="125" y="177" style={S.textPrimary} fontSize="10" fontWeight="600">COMPRESSED ASSET PIPELINE + SQLITE</text>
            <text x="125" y="193" style={S.textAccent} fontSize="9">Zero Network Dependency: 100% Offline Game Runtime</text>
            <text x="125" y="207" style={S.textTertiary} fontSize="8">Local High-Score & Level Persistence</text>

            <line x1="232" y1="110" x2="232" y2="155" style={S.linkAccent} strokeWidth="1.5" />
          </svg>
        )}

        {/* ================= 07. CLAUDE CODE HISTORY EXPLORER ================= */}
        {type === "claude-explorer" && (
          <svg viewBox="0 0 460 260" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.diagramSvg}>
            <defs>
              <pattern id={`grid-${baseId}`} width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" style={S.gridDot} />
              </pattern>
            </defs>
            <rect width="460" height="260" fill={`url(#grid-${baseId})`} />

            {/* Transcript JSONL */}
            <rect x="25" y="45" width="115" height="65" style={S.node} strokeWidth="1.5" />
            <text x="35" y="67" style={S.textAccent} fontSize="10" fontWeight="600">JSONL LOGS</text>
            <text x="35" y="83" style={S.textSecondary} fontSize="9">Trajectory Files</text>
            <text x="35" y="97" style={S.textTertiary} fontSize="8">Stream Tokenizer</text>

            {/* Session Indexer */}
            <rect x="175" y="45" width="115" height="65" style={S.nodeCore} strokeWidth="1.5" />
            <text x="185" y="67" style={S.textPrimary} fontSize="10" fontWeight="600">SESSION INDEXER</text>
            <text x="185" y="83" style={S.textAccent} fontSize="9">Step Parsing</text>
            <text x="185" y="97" style={S.textTertiary} fontSize="8">Tool Call Extraction</text>

            {/* Full-Text Search */}
            <rect x="325" y="45" width="115" height="65" style={S.node} strokeWidth="1.5" />
            <text x="335" y="67" style={S.textAccent} fontSize="10" fontWeight="600">IN-MEMORY INDEX</text>
            <text x="335" y="83" style={S.textSecondary} fontSize="9">Full-Text Search</text>
            <text x="335" y="97" style={S.textTertiary} fontSize="8">Token Filtering</text>

            <line x1="140" y1="77" x2="175" y2="77" style={S.linkAccent} strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="290" y1="77" x2="325" y2="77" style={S.linkAccent} strokeWidth="1.5" strokeDasharray="3 3" />

            {/* Timeline & Diff Viewer */}
            <rect x="105" y="155" width="250" height="65" style={S.nodeAccent} strokeWidth="1.5" />
            <text x="120" y="177" style={S.textPrimary} fontSize="10" fontWeight="600">INTERACTIVE STEP TIMELINE + DIFF VIEWER</text>
            <text x="120" y="193" style={S.textAccent} fontSize="9">Auditing Decisions, Thinking Chains & File Edits</text>
            <text x="120" y="207" style={S.textTertiary} fontSize="8">Zero Cloud Upload: 100% Local Trajectory Parsing</text>

            <line x1="232" y1="110" x2="232" y2="155" style={S.linkAccent} strokeWidth="1.5" />
          </svg>
        )}

        {/* ================= 08. AI DIARY ================= */}
        {type === "ai-diary" && (
          <svg viewBox="0 0 460 260" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.diagramSvg}>
            <defs>
              <pattern id={`grid-${baseId}`} width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" style={S.gridDot} />
              </pattern>
            </defs>
            <rect width="460" height="260" fill={`url(#grid-${baseId})`} />

            {/* Markdown Diary UI */}
            <rect x="25" y="45" width="115" height="65" style={S.node} strokeWidth="1.5" />
            <text x="35" y="67" style={S.textAccent} fontSize="10" fontWeight="600">DIARY UI</text>
            <text x="35" y="83" style={S.textSecondary} fontSize="9">Markdown Journal</text>
            <text x="35" y="97" style={S.textTertiary} fontSize="8">Calendar Index</text>

            {/* Encrypted SQLite */}
            <rect x="175" y="45" width="115" height="65" style={S.nodeCore} strokeWidth="1.5" />
            <text x="185" y="67" style={S.textPrimary} fontSize="10" fontWeight="600">ENCRYPTED DB</text>
            <text x="185" y="83" style={S.textAccent} fontSize="9">SQLCipher Vault</text>
            <text x="185" y="97" style={S.textTertiary} fontSize="8">Zero Cloud Storage</text>

            {/* Local Vector Engine */}
            <rect x="325" y="45" width="115" height="65" style={S.node} strokeWidth="1.5" />
            <text x="335" y="67" style={S.textAccent} fontSize="10" fontWeight="600">VECTOR ENGINE</text>
            <text x="335" y="83" style={S.textSecondary} fontSize="9">Cosine Similarity</text>
            <text x="335" y="97" style={S.textTertiary} fontSize="8">Local Embeddings</text>

            <line x1="140" y1="77" x2="175" y2="77" style={S.linkAccent} strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="290" y1="77" x2="325" y2="77" style={S.linkAccent} strokeWidth="1.5" strokeDasharray="3 3" />

            {/* Ollama Local LLM */}
            <rect x="110" y="155" width="240" height="65" style={S.nodeAccent} strokeWidth="1.5" />
            <text x="125" y="177" style={S.textPrimary} fontSize="10" fontWeight="600">ON-DEVICE INFERENCE (OLLAMA)</text>
            <text x="125" y="193" style={S.textAccent} fontSize="9">Conversational Retrieval Across Personal Memory</text>
            <text x="125" y="207" style={S.textTertiary} fontSize="8">Complete Data Privacy / Offline Execution</text>

            <line x1="382" y1="110" x2="230" y2="155" style={S.linkAccent} strokeWidth="1.5" />
          </svg>
        )}

        {/* ================= 09. SYSTEM BEAVER ================= */}
        {type === "system-beaver" && (
          <svg viewBox="0 0 460 260" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.diagramSvg}>
            <defs>
              <pattern id={`grid-${baseId}`} width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" style={S.gridDot} />
              </pattern>
            </defs>
            <rect width="460" height="260" fill={`url(#grid-${baseId})`} />

            {/* Visual Architecture Canvas */}
            <rect x="25" y="45" width="115" height="65" style={S.node} strokeWidth="1.5" />
            <text x="35" y="67" style={S.textAccent} fontSize="10" fontWeight="600">VISUAL CANVAS</text>
            <text x="35" y="83" style={S.textSecondary} fontSize="9">Typed Node Editor</text>
            <text x="35" y="97" style={S.textTertiary} fontSize="8">Service Boundaries</text>

            {/* Directed Graph Engine */}
            <rect x="175" y="45" width="115" height="65" style={S.nodeCore} strokeWidth="1.5" />
            <text x="185" y="67" style={S.textPrimary} fontSize="10" fontWeight="600">GRAPH ENGINE</text>
            <text x="185" y="83" style={S.textAccent} fontSize="9">Dependency Blast</text>
            <text x="185" y="97" style={S.textTertiary} fontSize="8">Topological Cycles</text>

            {/* Contract Validator */}
            <rect x="325" y="45" width="115" height="65" style={S.node} strokeWidth="1.5" />
            <text x="335" y="67" style={S.textAccent} fontSize="10" fontWeight="600">CONTRACT RULES</text>
            <text x="335" y="83" style={S.textSecondary} fontSize="9">REST / gRPC / WSS</text>
            <text x="335" y="97" style={S.textTertiary} fontSize="8">Schema Matching</text>

            <line x1="140" y1="77" x2="175" y2="77" style={S.linkAccent} strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="290" y1="77" x2="325" y2="77" style={S.linkAccent} strokeWidth="1.5" strokeDasharray="3 3" />

            {/* Git-Versionable Architecture Blueprint */}
            <rect x="110" y="155" width="240" height="65" style={S.nodeAccent} strokeWidth="1.5" />
            <text x="125" y="177" style={S.textPrimary} fontSize="10" fontWeight="600">VERSIONED ARCHITECTURE MANIFESTS</text>
            <text x="125" y="193" style={S.textAccent} fontSize="9">Human-Readable YAML/JSON Stored in Git Repos</text>
            <text x="125" y="207" style={S.textTertiary} fontSize="8">Moving Beyond Static Whiteboard Drawings</text>

            <line x1="232" y1="110" x2="232" y2="155" style={S.linkAccent} strokeWidth="1.5" />
          </svg>
        )}

        {/* ================= 10. PROJECT BRAIN ================= */}
        {type === "project-brain" && (
          <svg viewBox="0 0 460 260" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.diagramSvg}>
            <defs>
              <pattern id={`grid-${baseId}`} width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" style={S.gridDot} />
              </pattern>
            </defs>
            <rect width="460" height="260" fill={`url(#grid-${baseId})`} />

            {/* Technical Specs & ADRs */}
            <rect x="25" y="45" width="115" height="65" style={S.node} strokeWidth="1.5" />
            <text x="35" y="67" style={S.textAccent} fontSize="10" fontWeight="600">SPECS & ADRs</text>
            <text x="35" y="83" style={S.textSecondary} fontSize="9">Architecture Decisions</text>
            <text x="35" y="97" style={S.textTertiary} fontSize="8">Decision Context</text>

            {/* Bidirectional Linking */}
            <rect x="175" y="45" width="115" height="65" style={S.nodeCore} strokeWidth="1.5" />
            <text x="185" y="67" style={S.textPrimary} fontSize="10" fontWeight="600">LINK ENGINE</text>
            <text x="185" y="83" style={S.textAccent} fontSize="9">Bidirectional Edges</text>
            <text x="185" y="97" style={S.textTertiary} fontSize="8">Backlink Resolution</text>

            {/* Knowledge Graph UI */}
            <rect x="325" y="45" width="115" height="65" style={S.node} strokeWidth="1.5" />
            <text x="335" y="67" style={S.textAccent} fontSize="10" fontWeight="600">KNOWLEDGE MAP</text>
            <text x="335" y="83" style={S.textSecondary} fontSize="9">Cluster Traversal</text>
            <text x="335" y="97" style={S.textTertiary} fontSize="8">Task Context Link</text>

            <line x1="140" y1="77" x2="175" y2="77" style={S.linkAccent} strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="290" y1="77" x2="325" y2="77" style={S.linkAccent} strokeWidth="1.5" strokeDasharray="3 3" />

            {/* PostgreSQL Graph Store */}
            <rect x="110" y="155" width="240" height="65" style={S.nodeAccent} strokeWidth="1.5" />
            <text x="125" y="177" style={S.textPrimary} fontSize="10" fontWeight="600">POSTGRESQL RELATIONAL GRAPH STORAGE</text>
            <text x="125" y="193" style={S.textAccent} fontSize="9">Preventing Engineering Context Decay Across Sprints</text>
            <text x="125" y="207" style={S.textTertiary} fontSize="8">Prisma ORM Node & Adjacency Tables</text>

            <line x1="232" y1="110" x2="232" y2="155" style={S.linkAccent} strokeWidth="1.5" />
          </svg>
        )}

        {/* ================= 11. MCP TOKEN SERVER ================= */}
        {type === "mcp-token-server" && (
          <svg viewBox="0 0 460 260" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.diagramSvg}>
            <defs>
              <pattern id={`grid-${baseId}`} width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" style={S.gridDot} />
              </pattern>
            </defs>
            <rect width="460" height="260" fill={`url(#grid-${baseId})`} />

            {/* Chrome MV3 Extension */}
            <rect x="25" y="45" width="115" height="65" style={S.node} strokeWidth="1.5" />
            <text x="35" y="67" style={S.textAccent} fontSize="10" fontWeight="600">CHROME EXTENSION</text>
            <text x="35" y="83" style={S.textSecondary} fontSize="9">Manifest V3 Hook</text>
            <text x="35" y="97" style={S.textTertiary} fontSize="8">Cookie & Bearer Tap</text>

            {/* Encrypted Loopback Socket */}
            <rect x="175" y="45" width="120" height="65" style={S.nodeCore} strokeWidth="1.5" />
            <text x="185" y="67" style={S.textPrimary} fontSize="10" fontWeight="600">MCP TOKEN SERVER</text>
            <text x="185" y="83" style={S.textAccent} fontSize="9">Express Local IPC</text>
            <text x="185" y="97" style={S.textTertiary} fontSize="8">RAM-Encrypted Cache</text>

            {/* MCP Tools Protocol */}
            <rect x="330" y="45" width="105" height="65" style={S.node} strokeWidth="1.5" />
            <text x="340" y="67" style={S.textAccent} fontSize="10" fontWeight="600">MCP CLIENTS</text>
            <text x="340" y="83" style={S.textSecondary} fontSize="9">IDE & AI Agents</text>
            <text x="340" y="97" style={S.textTertiary} fontSize="8">Zero Copy-Paste</text>

            <line x1="140" y1="77" x2="175" y2="77" style={S.linkAccent} strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="295" y1="77" x2="330" y2="77" style={S.linkAccent} strokeWidth="1.5" strokeDasharray="3 3" />

            {/* Security Architecture */}
            <rect x="110" y="155" width="240" height="65" style={S.nodeAccent} strokeWidth="1.5" />
            <text x="125" y="177" style={S.textPrimary} fontSize="10" fontWeight="600">SECURITY & TTL LIFECYCLE</text>
            <text x="125" y="193" style={S.textAccent} fontSize="9">Ephemeral Memory Scrubbing + CORS Sandboxing</text>
            <text x="125" y="207" style={S.textTertiary} fontSize="8">Pre-Shared Secret Handshake</text>

            <line x1="235" y1="110" x2="235" y2="155" style={S.linkAccent} strokeWidth="1.5" />
          </svg>
        )}
      </div>

      <div className={styles.diagramFooter}>
        <span>COMPONENTS: VERIFIED</span>
        <span>SPEC: COMPLETED CODEBASE</span>
      </div>
    </div>
  );
}
