export interface Project {
  id: string;
  index: string;
  title: string;
  tagline: string;
  summary: string;
  role: string;
  timeline: string;
  status: "Production" | "Active Tool" | "Completed" | "Shipped";
  technologies: string[];
  category: "Mobile & Real-Time" | "AI & Audio" | "Automation & Scraping" | "Developer Tooling";
  highlights: string[];
  challenges: {
    title: string;
    description: string;
    solution: string;
  }[];
  architecture: {
    description: string;
    flow: string[];
    components: {
      name: string;
      tech: string;
      role: string;
    }[];
  };
  metrics?: {
    label: string;
    value: string;
  }[];
  links: {
    label: string;
    url: string;
    isExternal: boolean;
    type: "github" | "live" | "case-study";
  }[];
  schematicType: "realtime" | "ai-pipeline" | "data-pipeline" | "mcp-proxy";
}

export const projectsData: Project[] = [
  {
    id: "wally-talky",
    index: "01",
    title: "Wally Talky",
    tagline: "Ultra-low latency push-to-talk voice messaging application.",
    summary:
      "A high-concurrency push-to-talk voice messaging platform engineered with Flutter for the mobile client and Fastify on Node.js. Delivers instant audio transmission, real-time presence indicators, signed audio storage pipelines, and resilient background notifications.",
    role: "Full-Stack Engineer — Mobile Client & Backend Systems Architecture",
    timeline: "2024",
    status: "Production",
    category: "Mobile & Real-Time",
    technologies: [
      "Flutter",
      "Dart",
      "Fastify",
      "TypeScript",
      "PostgreSQL",
      "Prisma",
      "Socket.IO",
      "Firebase Cloud Messaging",
      "Redis",
      "AWS S3",
    ],
    highlights: [
      "Sub-100ms real-time channel presence tracking using optimized WebSocket connection pools.",
      "Chunked audio streaming pipeline with signed pre-authenticated upload URLs for secure instant playback.",
      "High-throughput Fastify backend handling thousands of concurrent channel state broadcasts.",
      "Dual-channel messaging: ephemeral live push-to-talk audio bursts alongside persistent history.",
      "Fine-grained user moderation, participant blocking, and granular channel access controls.",
      "Silent high-priority FCM notification wakeup for background call-ringing on Android devices.",
    ],
    challenges: [
      {
        title: "Microphone Audio Latency & Cross-Platform Buffer Jitter",
        description:
          "Capturing raw audio on Android devices without audio thread locking or perceptual delay before socket streaming.",
        solution:
          "Engineered a native audio buffer pipeline with pre-allocated memory rings in Dart/Flutter, streaming OPUS-encoded slices over binary WebSocket frames directly to Fastify.",
      },
      {
        title: "Connection Resiliency Across Mobile Network Handoffs",
        description:
          "Handling cellular-to-Wi-Fi network transitions without dropping audio playback or disconnecting channel presence.",
        solution:
          "Implemented stateful session heartbeats with Redis-backed reconnection tokens, ensuring idempotent packet delivery and zero-downtime stream continuation.",
      },
      {
        title: "Secure Temporary Storage Without Exposing Bucket Credentials",
        description:
          "Allowing mobile clients to upload voice notes instantly while guaranteeing authorization and expiration.",
        solution:
          "Architected signed URL generation with HMAC validation on Fastify, streaming audio directly to S3 lifecycle-managed buckets that automatically expire unpersisted bursts.",
      },
    ],
    architecture: {
      description:
        "Event-driven hybrid architecture coupling WebSocket full-duplex control frames with stateless REST endpoints and asynchronous Redis pub/sub for channel broadcast fanout.",
      flow: [
        "Flutter PTT Button Pressed → Audio recorded into native ring buffer",
        "Binary WebSocket packet streamed to Fastify Gateway",
        "Redis Pub/Sub fans out presence and audio slice to active channel peers",
        "Background peers awakened via Firebase Cloud Messaging high-priority data payloads",
        "Persistent notes written via Prisma ORM to PostgreSQL with S3 audio references",
      ],
      components: [
        { name: "Client App", tech: "Flutter / Dart", role: "UI, audio capture, waveform rendering, local SQLite cache" },
        { name: "API Gateway", tech: "Fastify / TypeScript", role: "Authentication, rate limiting, request validation" },
        { name: "Real-Time Engine", tech: "Socket.IO / Redis", role: "Sub-second room state, voice frame distribution" },
        { name: "Persistence Layer", tech: "PostgreSQL / Prisma", role: "Relational data, user identity, channel ACLs" },
      ],
    },
    metrics: [
      { label: "AUDIO LATENCY", value: "< 120ms" },
      { label: "STREAM PROTOCOL", value: "Binary WSS" },
      { label: "ORCHESTRATION", value: "Redis Pub/Sub" },
    ],
    links: [
      { label: "View Architecture", url: "#wally-talky", isExternal: false, type: "case-study" },
      { label: "GitHub Repository", url: "https://github.com/manthandubey", isExternal: true, type: "github" },
    ],
    schematicType: "realtime",
  },
  {
    id: "storyforge-ai",
    index: "02",
    title: "StoryForge AI",
    tagline: "AI-powered Hindi audio drama production studio & multi-agent workflow.",
    summary:
      "A generative audio drama production workspace converting initial narrative seeds into multi-character scripts, localized Hindi dialogue, distinct voice syntheses, and master audio tracks via structured LLM orchestration and Gemini multimodal APIs.",
    role: "Lead Full-Stack & AI Pipeline Engineer",
    timeline: "2024",
    status: "Active Tool",
    category: "AI & Audio",
    technologies: [
      "React",
      "TypeScript",
      "Google Gemini",
      "Text-to-Speech API",
      "Node.js",
      "Audio Web API",
      "Tailwind / SCSS",
      "Ffmpeg.wasm",
    ],
    highlights: [
      "End-to-end idea-to-master workflow: logline → beat sheet → multi-act script → scene breakdown.",
      "Character persona builder with dialect traits, emotional ranges, and custom voice profile assignment.",
      "Hindi & Hinglish script generation with cultural nuance, dramatic pacing, and audio cue annotations.",
      "Dynamic voice allocation mapping distinct TTS timbre, pitch, and speech rates to character dialog lines.",
      "Multi-track audio timeline editor for reviewing, splicing, and re-synthesizing individual dialogue takes.",
      "Automated scene audio composition with background ambience and sound-effect ducking.",
    ],
    challenges: [
      {
        title: "Maintaining Narrative Coherence Across Long-Form Scripts",
        description:
          "LLMs tend to forget character quirks, tone shifts, and plot constraints over multi-scene scripts.",
        solution:
          "Built a recursive context manager that passes a structured 'Story Bible' schema into Gemini structured prompts, maintaining immutable character cards and beat progression across turns.",
      },
      {
        title: "Localized Hindi Phonetics and Dialogue Naturalism",
        description:
          "Standard TTS models sound robotic and mispronounce conversational Hindi idioms and mixed English terms.",
        solution:
          "Constructed a phonetic normalization preprocessor and SSML tag injector that optimizes stress marks and punctuation pauses before dispatching to the TTS engine.",
      },
    ],
    architecture: {
      description:
        "Multi-stage agent pipeline orchestrating story ideation, dialogue structuring, phonetic tokenization, and multi-track audio assembly.",
      flow: [
        "Prompt Ingestion: User enters theme, genre, duration, and tone",
        "Story Engine (Gemini Pro): Generates beat outline and cast specifications",
        "Script Generator: Outputs strict JSON with speaker IDs and emotional inflection metadata",
        "Phonetic Parser: Cleans Hindi text into SSML-formatted chunks",
        "Synthesis & Assembly: Parallel TTS synthesis into client-side audio buffers for mastering",
      ],
      components: [
        { name: "Studio UI", tech: "React / TypeScript", role: "Multi-track timeline, script editor, waveform visualizer" },
        { name: "Orchestration", tech: "Google Gemini 1.5", role: "Script generation, dialog nuance, scene pacing" },
        { name: "Speech Engine", tech: "Cloud TTS / SSML", role: "Hindi dialect synthesis, pitch & cadence modulation" },
        { name: "Audio Engine", tech: "Web Audio API / WASM", role: "Buffer concatenation, background track mixing" },
      ],
    },
    metrics: [
      { label: "PIPELINE SPEED", value: "3x vs Manual" },
      { label: "SCRIPT PRECISION", value: "Strict JSON" },
      { label: "AUDIO SYNTH", value: "Multi-Voice" },
    ],
    links: [
      { label: "View Architecture", url: "#storyforge-ai", isExternal: false, type: "case-study" },
      { label: "GitHub Repository", url: "https://github.com/manthandubey", isExternal: true, type: "github" },
    ],
    schematicType: "ai-pipeline",
  },
  {
    id: "financial-data-automation",
    index: "03",
    title: "Financial Data Automation",
    tagline: "Automated institutional financial data harvesting, parsing, and ledger reconciliation.",
    summary:
      "A high-resilience data automation suite engineered to extract, reconcile, and validate complex financial reports, trading ledgers, F&O contract notes, and banking statements from diverse formats (PDFs, raw spreadsheets, and secure portals) into structured MongoDB schemas.",
    role: "Backend & Data Automation Engineer",
    timeline: "2023 – 2024",
    status: "Production",
    category: "Automation & Scraping",
    technologies: [
      "Node.js",
      "Python",
      "MongoDB",
      "Selenium",
      "Pandas",
      "PDFPlumber",
      "ExcelJS",
      "Docker",
    ],
    highlights: [
      "Automated extraction of multi-page encrypted banking statements and broker contract notes.",
      "Fault-tolerant Selenium scraper navigation handling dynamic 2FA checkpoints and token renewal.",
      "Comprehensive tabular PDF extraction parsing non-standard multi-column trade ledgers with 99.8% accuracy.",
      "F&O (Futures & Options) trade normalization calculating realized/unrealized P&L and brokerage charges.",
      "High-speed batch processing converting thousands of transaction rows into validated JSON records.",
      "Automated balance reconciliation alerting on transaction discrepancies or missing voucher trails.",
    ],
    challenges: [
      {
        title: "Inconsistent and Flawed Multi-Page PDF Formatting",
        description:
          "Financial institutions export statements with irregular margins, hidden watermarks, and shifting column alignments.",
        solution:
          "Engineered a hybrid parser combining regex coordinate boundary detection with Python PDFPlumber, dynamically determining grid intersections and bounding boxes per statement template.",
      },
      {
        title: "Dynamic Portal Navigation & Anti-Bot Mitigations",
        description:
          "Web portals frequently alter DOM selectors, introduce modal interruptions, and flag automated navigation.",
        solution:
          "Implemented human-mimicking viewport interactions with adaptive selector fallbacks, configurable wait queues, and session cookies persistence.",
      },
    ],
    architecture: {
      description:
        "Data ingestion and normalization pipeline with worker queue segregation, document schema validators, and reconciliation audits.",
      flow: [
        "Headless Scraping Daemon logs into configured portal with encrypted credentials",
        "Document Harvester downloads encrypted PDF / Excel statements",
        "Document Decryption & Parsing Engine isolates balance tables and trade tickets",
        "Normalization Worker reconciles debits/credits against historic ledger indexes",
        "Verified records written to MongoDB with comprehensive audit logging",
      ],
      components: [
        { name: "Crawler Bot", tech: "Python / Selenium", role: "Portal authentication, session maintenance, download capture" },
        { name: "Parser Service", tech: "Python / Pandas / PDFPlumber", role: "OCR, coordinate extraction, tabular cleansing" },
        { name: "Orchestrator", tech: "Node.js / Express", role: "Job queuing, audit tracking, error monitoring" },
        { name: "Data Warehouse", tech: "MongoDB", role: "Timeseries records, validated ledgers, user portfolios" },
      ],
    },
    metrics: [
      { label: "PARSING ACCURACY", value: "99.8%" },
      { label: "DOCUMENTS", value: "PDF & XLSX" },
      { label: "PROCESSING", value: "Batch & Event" },
    ],
    links: [
      { label: "View Architecture", url: "#financial-data-automation", isExternal: false, type: "case-study" },
      { label: "GitHub Repository", url: "https://github.com/manthandubey", isExternal: true, type: "github" },
    ],
    schematicType: "data-pipeline",
  },
  {
    id: "mcp-token-server",
    index: "04",
    title: "MCP Token Server",
    tagline: "Local authentication token capture, bridge proxy, and integration utility.",
    summary:
      "A developer utility and local bridge server adhering to Model Context Protocol (MCP) concepts. Captures session tokens and headers securely from active browser sessions via a lightweight companion Chrome extension, making authenticated developer workflows and AI tooling seamlessly integrated without manual cookie copy-pasting.",
    role: "Creator & Systems Architect",
    timeline: "2024",
    status: "Shipped",
    category: "Developer Tooling",
    technologies: [
      "Node.js",
      "Express",
      "Chrome Extension (Manifest V3)",
      "TypeScript",
      "Model Context Protocol",
      "Local IPC",
      "Crypto",
    ],
    highlights: [
      "Manifest V3 Chrome Extension capturing targeted session cookies and bearer tokens upon user trigger.",
      "Local Express HTTP/IPC daemon running on localhost with CORS restriction and origin validation.",
      "Zero plain-text disk storage: tokens stored in encrypted in-memory cache with configurable TTL.",
      "Standardized MCP (Model Context Protocol) tool exposure allowing AI agents to query current auth context.",
      "One-click refresh bridge keeping local testing sessions continuously authenticated against staging APIs.",
      "Clean developer CLI with visual token telemetry and instantaneous token revocation.",
    ],
    challenges: [
      {
        title: "Secure Local Inter-Process Communication",
        description:
          "Preventing malicious local scripts or websites from querying the token server without proper authentication.",
        solution:
          "Implemented one-time shared pre-shared secrets generated at daemon launch, paired with mandatory localhost origin headers and rate limiting.",
      },
      {
        title: "Manifest V3 Ephemeral Background Worker Constraints",
        description:
          "Service workers in MV3 terminate after idle periods, risking lost event listeners and connection timeouts.",
        solution:
          "Engineered declarativeNetRequest rule listeners and port-based keep-alive handshakes that cleanly wake up the service worker only upon authorized domain requests.",
      },
    ],
    architecture: {
      description:
        "Local sandbox architecture connecting browser extension runtime to a protected localhost MCP server via authenticated cryptographic handshakes.",
      flow: [
        "User opens developer target portal in Chrome",
        "Extension triggers header capture upon matched authorized host patterns",
        "Bearer tokens securely transmitted over encrypted localhost loopback socket",
        "MCP Token Server caches credentials in RAM with automatic TTL countdown",
        "IDE agents & CLI tools query localhost MCP endpoint to execute authenticated actions",
      ],
      components: [
        { name: "Browser Agent", tech: "Chrome MV3 / TypeScript", role: "Session cookie watcher, token extractor" },
        { name: "Bridge Daemon", tech: "Node.js / Express", role: "Local loopback proxy, secret key validation" },
        { name: "Security Layer", tech: "Node Crypto", role: "In-memory token encryption, memory-scrubbing on exit" },
        { name: "MCP Interface", tech: "MCP Protocol", role: "Tool definitions exposed to AI assistants & local CLI" },
      ],
    },
    metrics: [
      { label: "PROTOCOL", value: "Model Context" },
      { label: "TARGET", value: "Chrome MV3" },
      { label: "SECURITY", value: "RAM Encrypted" },
    ],
    links: [
      { label: "View Architecture", url: "#mcp-token-server", isExternal: false, type: "case-study" },
      { label: "GitHub Repository", url: "https://github.com/manthandubey", isExternal: true, type: "github" },
    ],
    schematicType: "mcp-proxy",
  },
];
