export type ProjectFilterCategory =
  | "All"
  | "AI & Automation"
  | "SaaS & Business"
  | "Mobile & Gaming"
  | "Developer Tools"
  | "Data Engineering"
  | "Mobility";

export interface ProjectChallenge {
  title: string;
  description: string;
  solution: string;
}

export interface ProjectComponent {
  name: string;
  tech: string;
  role: string;
}

export interface ProjectDeepDive {
  title: string;
  subtitle: string;
  architectureNotes: string[];
  codeHighlight?: {
    filename: string;
    description: string;
  };
}

export interface Project {
  id: string;
  slug: string;
  index: string;
  displayOrder: number;
  title: string;
  subtitle: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  filterCategory: ProjectFilterCategory;
  status: "Completed";
  featured: boolean;
  technologies: string[];
  cardTechnologies: string[];
  timeline: string;
  role: string;
  problemStatement: string;
  engineeringContribution: string[];
  keyFeatures: string[];
  architecture: {
    description: string;
    flow: string[];
    components: ProjectComponent[];
  };
  deepDive?: ProjectDeepDive;
  challenges: ProjectChallenge[];
  metrics?: { label: string; value: string }[];
  schematicType:
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
  githubUrl: string | null;
  liveDemoUrl: string | null;
}

export const projectFilterCategories: ProjectFilterCategory[] = [
  "All",
  "AI & Automation",
  "SaaS & Business",
  "Mobile & Gaming",
  "Developer Tools",
  "Data Engineering",
  "Mobility",
];

export const projectsData: Project[] = [
  // =========================================================================
  // 01. WALLY TALKY (Featured)
  // =========================================================================
  {
    id: "wally-talky",
    slug: "wally-talky",
    index: "01",
    displayOrder: 1,
    title: "Wally Talky",
    subtitle: "Conversations that start with a single press.",
    tagline: "Real-time communication, engineered from the ground up.",
    shortDescription:
      "A high-concurrency push-to-talk voice messaging platform engineered with Flutter for the mobile client and Fastify on Node.js. Delivers instant audio transmission, real-time presence indicators, signed audio storage pipelines, and resilient background notifications.",
    fullDescription:
      "Wally Talky is a push-to-talk voice messaging application designed around instant voice communication, real-time presence, and reliable audio delivery. The application combines mobile development, real-time communication infrastructure, backend engineering, audio handling, and notification services into one unified communication platform.",
    category: "Mobile Engineering / Real-Time Communication",
    filterCategory: "Mobile & Gaming",
    status: "Completed",
    featured: true,
    technologies: [
      "Flutter",
      "Dart",
      "Fastify",
      "TypeScript",
      "PostgreSQL",
      "Prisma ORM",
      "Socket.IO",
      "Firebase Cloud Messaging",
      "Redis",
      "Signed Audio Streaming",
    ],
    cardTechnologies: ["Flutter", "Fastify", "Socket.IO", "PostgreSQL", "Prisma"],
    timeline: "2024",
    role: "Full-Stack Engineer — Mobile Client & Backend Systems Architecture",
    problemStatement:
      "Traditional voice-note apps introduce multi-second latency between recording, file uploading, and receiver playback. Wally Talky solves this with sub-second transmission over dedicated WebSocket pipelines, immediate channel state broadcast, and strict access-controlled streaming.",
    engineeringContribution: [
      "Engineered the push-to-talk voice messaging mobile workflow with low-latency touch event tracking in Flutter.",
      "Implemented a real-time user presence and room state engine using Socket.IO and Redis pub/sub.",
      "Constructed a chunked audio storage and signed streaming pipeline for access-controlled audio playback.",
      "Built high-priority Firebase Cloud Messaging (FCM) background wakeup handlers for incoming calls.",
      "Architected PostgreSQL relational schemas and migration lifecycles with Prisma ORM.",
      "Implemented trust-and-safety functionality including participant blocking, report queues, and moderation.",
    ],
    keyFeatures: [
      "Sub-100ms push-to-talk voice capture with native ring buffer memory management.",
      "Real-time room presence and participant heartbeat monitoring.",
      "Pre-authenticated signed streaming URLs preventing unauthorized audio bucket reads.",
      "Background wake-lock notification handlers for incoming audio transmissions on mobile.",
      "Comprehensive moderation system with user blocking and report queues.",
    ],
    architecture: {
      description:
        "Event-driven hybrid architecture connecting a reactive Flutter client to a Fastify/TypeScript gateway. Control state and audio chunks flow through WebSocket channels, backed by Redis pub/sub for room broadcast, while relational metadata and access policies persist in PostgreSQL via Prisma.",
      flow: [
        "Flutter Mobile Client captures audio into native ring buffer upon PTT press",
        "Fastify API Gateway validates session authentication and channel memberships",
        "Socket.IO Presence Engine broadcasts speaker status to active peers via Redis Pub/Sub",
        "Audio Storage Pipeline writes media to storage and signs time-limited access tokens",
        "Firebase Cloud Messaging awakens background participants with high-priority data packets",
        "PostgreSQL / Prisma ORM persists user relationships, channel ACLs, and moderation audit logs",
      ],
      components: [
        { name: "Mobile Client", tech: "Flutter / Dart", role: "Touch lifecycle, native audio recording, waveform display, local cache" },
        { name: "API Gateway", tech: "Fastify / TypeScript", role: "Request routing, schema validation, rate-limiting, auth enforcement" },
        { name: "Presence Engine", tech: "Socket.IO / Redis", role: "Sub-second room state fanout, disconnect detection, channel heartbeats" },
        { name: "Data Persistence", tech: "PostgreSQL / Prisma", role: "User identity, channel permissions, blocklists, relational integrity" },
      ],
    },
    deepDive: {
      title: "Real-Time Communication & Audio Streaming",
      subtitle: "Low-latency binary packet streaming and signed playback security.",
      architectureNotes: [
        "Eliminated audio thread stutter by decoupling microphone sampling into isolated Dart isolates streaming OPUS frames.",
        "Implemented Redis-backed reconnection tokens allowing seamless Wi-Fi to cellular handover without losing channel membership.",
        "Enforced HMAC-signed URL generation on Fastify, ensuring client-side audio playback links expire within strict TTL windows.",
      ],
      codeHighlight: {
        filename: "audioStreamController.ts",
        description: "Fastify route handler streaming chunked binary frames into Redis channels with HMAC signed validation.",
      },
    },
    challenges: [
      {
        title: "Microphone Audio Latency & Buffer Jitter",
        description: "Capturing raw audio on Android devices without audio thread locking or perceptual delay before socket streaming.",
        solution: "Engineered a native audio buffer pipeline with pre-allocated memory rings in Dart/Flutter, streaming OPUS-encoded slices over binary WebSocket frames directly to Fastify.",
      },
      {
        title: "Connection Resiliency Across Mobile Network Handoffs",
        description: "Handling cellular-to-Wi-Fi network transitions without dropping audio playback or disconnecting channel presence.",
        solution: "Implemented stateful session heartbeats with Redis-backed reconnection tokens, ensuring idempotent packet delivery and zero-downtime stream continuation.",
      },
      {
        title: "Secure Temporary Storage Without Exposing Bucket Credentials",
        description: "Allowing mobile clients to upload voice notes instantly while guaranteeing authorization and expiration.",
        solution: "Architected signed URL generation with HMAC validation on Fastify, streaming audio directly to lifecycle-managed storage that automatically expires unpersisted bursts.",
      },
    ],
    metrics: [
      { label: "TRANSMISSION LATENCY", value: "< 120ms" },
      { label: "PROTOCOL", value: "Binary WSS" },
      { label: "ORCHESTRATION", value: "Redis Pub/Sub" },
    ],
    schematicType: "wally-talky",
    githubUrl: null,
    liveDemoUrl: null,
  },

  // =========================================================================
  // 02. STORYFORGE AI (Featured)
  // =========================================================================
  {
    id: "storyforge-ai",
    slug: "storyforge-ai",
    index: "02",
    displayOrder: 2,
    title: "StoryForge AI",
    subtitle: "An AI-powered production studio for Hindi audio storytelling.",
    tagline: "From an idea to an audio universe.",
    shortDescription:
      "A creative audio drama studio and multi-agent production workspace. Converts story premises into structured character bibles, multi-act Hindi scripts, custom voice designs, and master multi-track audio timelines using orchestrated Google Gemini models.",
    fullDescription:
      "StoryForge AI is a Hindi audio-drama production studio designed to transform an initial creative idea into a structured audio production workflow. Rather than treating AI as a simple text generator, the application organizes the entire creative pipeline into a unified production workspace spanning story ideation, character management, script generation, voice design, text-to-speech synthesis, and scene-level audio mastering.",
    category: "Artificial Intelligence / Creative Technology / Audio Production",
    filterCategory: "AI & Automation",
    status: "Completed",
    featured: true,
    technologies: [
      "React 19",
      "TypeScript",
      "Node.js",
      "Express",
      "Google Gemini 1.5",
      "Text-to-Speech API",
      "Web Audio API",
      "SSML Normalization",
      "Vite",
      "Tailwind CSS",
    ],
    cardTechnologies: ["React 19", "Google Gemini", "Web Audio API", "Node.js", "SSML"],
    timeline: "2024",
    role: "Lead Full-Stack & AI Pipeline Engineer",
    problemStatement:
      "Generative language models produce generic, repetitive prose and unnatural spoken Hindi dialogue when prompted directly. Producing audio dramas requires strict character persona consistency, dramatic pacing, phonetic cleanup, and multi-track audio mastering.",
    engineeringContribution: [
      "Constructed the complete Creator Workflow: Idea → Story → Characters → Script → Voice Design → TTS → Audio Review → Scenes.",
      "Engineered the ModelRouter subsystem coordinating Google Gemini Flash-Lite and Pro models with task-specific routing.",
      "Built the AntiSlopDirector module to audit dialogue, eliminate LLM clichés, and enforce natural Hindi dramatic cadence.",
      "Implemented character persona systems mapping dialect traits, emotional ranges, and distinct speech profiles.",
      "Developed the timeline mixer (timelineMixer.js) for multi-track audio assembly, take auditioning, and background ambience ducking.",
    ],
    keyFeatures: [
      "End-to-end multi-stage production pipeline with structured JSON schema state persistence.",
      "Anti-Slop dialogue editor flagging unnatural expository tropes and bookish Hindi syntax.",
      "Character persona builder with dialect traits, speech cadences, and distinct TTS voice profile mappings.",
      "Interactive multi-track audio timeline for reviewing, splicing, and re-synthesizing individual dialogue takes.",
      "Phonetic normalization and SSML tag injection for authentic Hindi inflection and dramatic pauses.",
    ],
    architecture: {
      description:
        "Multi-stage pipeline connecting the Studio Workspace UI to an Express orchestration layer. State flows sequentially through the Story Engine, Character System, Script Engine, AntiSlop Director, and Voice Design modules, culminating in parallel TTS synthesis and client-side Web Audio mastering.",
      flow: [
        "Creator initiates project with logline, genre, and dramatic tone constraints",
        "Story Engine orchestrates Gemini model to structure multi-act narrative beats",
        "Character System establishes immutable persona cards with emotional limits and dialect profiles",
        "Script Engine outputs structured JSON scenes with speaker IDs and performance annotations",
        "AntiSlop Director audits dialogue against conversational Hindi idioms and rhythm standards",
        "Voice Design maps character profiles to TTS timbre, pitch, and cadence parameters",
        "Audio Review Timeline mixes synthesized speech buffers with background ambiences",
      ],
      components: [
        { name: "Project Workspace", tech: "React 19 / TypeScript", role: "Multi-track timeline, script block editor, character roster" },
        { name: "Model Router", tech: "Express / Node.js", role: "Provider registry, model failover, prompt template serialization" },
        { name: "AntiSlop Director", tech: "Gemini Orchestration", role: "Dialogue idiom validation, rhythm cleanup, cliché elimination" },
        { name: "Audio Engine", tech: "Web Audio API / TTS", role: "SSML phonetic compilation, multi-voice buffer concatenation, audio mastering" },
      ],
    },
    deepDive: {
      title: "AI Orchestration & Multi-Stage Audio Production",
      subtitle: "Eliminating generative AI dialogue slop and managing multi-voice timeline rendering.",
      architectureNotes: [
        "The AntiSlopDirector enforces conversational naturalism by testing dialogue against specific failure modes: over-explanation, hyper-formal Sanskritized vocabulary, and rhythmic monotony.",
        "Engineered strict JSON contract output schemas via Gemini system instructions, preventing prompt injection or structural breakage between pipeline phases.",
        "Built client-side Web Audio API mixing buffers allowing creators to audition individual takes without server round-trips.",
      ],
      codeHighlight: {
        filename: "AntiSlopDirector.js",
        description: "Automated dialogue audit pipeline evaluating emotional nuance, idiomatic Hindi phrasing, and acoustic rhythm.",
      },
    },
    challenges: [
      {
        title: "Maintaining Narrative Coherence Across Long-Form Scripts",
        description: "LLMs tend to forget character quirks, tone shifts, and plot constraints over multi-scene scripts.",
        solution: "Built a recursive context manager that passes a structured 'Story Bible' schema into Gemini structured prompts, maintaining immutable character cards and beat progression across turns.",
      },
      {
        title: "Eliminating Artificial Dialogue Cadence in Spoken Hindi",
        description: "Standard LLM output sounds like translated textbooks rather than authentic conversational Hindi dialogue.",
        solution: "Engineered the AntiSlopDirector with rule-based regex and secondary LLM review passes targeting common AI linguistic crutches and injecting phonetic SSML pause marks.",
      },
    ],
    metrics: [
      { label: "PIPELINE STAGES", value: "8 Connected Steps" },
      { label: "SCRIPT PRECISION", value: "Strict JSON" },
      { label: "AUDIO SYNTHESIS", value: "Multi-Voice SSML" },
    ],
    schematicType: "storyforge-ai",
    githubUrl: null,
    liveDemoUrl: null,
  },

  // =========================================================================
  // 03. DRAVYAM — GODOWNOS (Featured)
  // =========================================================================
  {
    id: "dravyam-godownos",
    slug: "dravyam-godownos",
    index: "03",
    displayOrder: 3,
    title: "Dravyam — GodownOS",
    subtitle: "Bringing wholesale inventory management into one connected system.",
    tagline: "Making wholesale inventory intelligent, controlled and connected.",
    shortDescription:
      "An enterprise B2B wholesale inventory and warehouse management platform built for Indian distributors, stockists, and godown operators. Features multi-role access, double-entry stock ledgers, and backend-enforced retailer visibility controls.",
    fullDescription:
      "Dravyam (द्रव्यम्) is a wholesale inventory and godown management platform designed for warehouse owners and wholesale businesses. The product focuses on making complex multi-location warehouse operations manageable while giving godown owners granular control over the exact products, stock quantities, and pricing exposed to each individual retailer.",
    category: "B2B SaaS / Wholesale / Inventory Management",
    filterCategory: "SaaS & Business",
    status: "Completed",
    featured: true,
    technologies: [
      "Node.js 24",
      "Fastify",
      "TypeScript",
      "PostgreSQL",
      "Prisma ORM (28+ tables)",
      "Redis",
      "BullMQ",
      "React 19",
      "Ant Design",
      "Docker",
    ],
    cardTechnologies: ["Fastify", "PostgreSQL", "Prisma ORM", "BullMQ", "React 19"],
    timeline: "2024",
    role: "Full-Stack Architect & Core Backend Engineer",
    problemStatement:
      "Wholesale warehouse owners handle high-velocity stock across physical godowns but struggle with retailer communication: retailers constantly call for stock updates and pricing, yet owners cannot publicly display trade prices or exact inventory without risking competitor undercut.",
    engineeringContribution: [
      "Architected the Fastify TypeScript modular monolith API and Prisma relational schema across 28+ domain models.",
      "Engineered an auditable double-entry inventory ledger calculating stock balances strictly via Available = On Hand - Reserved.",
      "Built the backend-enforced Granular Visibility & Pricing Engine preventing data leakage of confidential wholesale stock.",
      "Implemented the multi-role portal system separating Godown Owner Console (React 19/Ant Design) from the Retailer Mobile Portal.",
      "Constructed asynchronous BullMQ worker queues for inventory ledger reconciliation, batch imports, and Tally synchronization.",
      "Designed the Enquiry-to-Order pipeline (DRAFT → SUBMITTED → QUOTED → ACCEPTED → FULFILLED) with frozen line-item pricing.",
    ],
    keyFeatures: [
      "Multi-tenant godown operations with organization-scoped Row-Level Security (RLS) enforcement.",
      "Strict double-entry stock ledger guaranteeing concurrency-safe inventory adjustments and transfer audits.",
      "Backend-enforced visibility rules: owner configures exact quantity, in-stock status flag, or hidden status per retailer.",
      "Personalized pricing tier matrix serving retailer-specific wholesale price lists on authenticated login.",
      "Asynchronous worker architecture processing bulk CSV/Excel catalogue imports without blocking HTTP threads.",
      "Optional desktop connector architecture designed for outbound HTTPS synchronization with accounting software (TallyPrime).",
    ],
    architecture: {
      description:
        "Fastify TypeScript modular monolith powered by PostgreSQL and Prisma ORM. Stock mutations pass through transaction-wrapped double-entry ledger entries. Retailer requests are filtered through an authorization matrix ensuring visibility rules are enforced at the query level before responses are serialized.",
      flow: [
        "Godown Owner configures products, warehouse allocations, and retailer access rules",
        "Inventory Ledger records stock movements via atomic database transactions (Available = On Hand - Reserved)",
        "Visibility & Pricing Engine calculates retailer-specific catalog views based on assigned permission groups",
        "Retailer logs into authenticated portal, viewing only permitted items with personalized price tiers",
        "Enquiry-to-Order lifecycle freezes line-item unit prices into immutable order contracts",
        "Asynchronous BullMQ worker queues handle batch CSV imports and ledger audits in background",
      ],
      components: [
        { name: "Owner Web Console", tech: "React 19 / Ant Design / Vite", role: "Warehouse operations, inventory adjustments, retailer approvals, price lists" },
        { name: "Retailer Portal", tech: "Next.js / TypeScript", role: "Mobile-first catalog browsing, quote requests, inquiry tracking" },
        { name: "Core API Monolith", tech: "Fastify / Node.js 24", role: "RBAC guards, inventory ledger transactions, visibility query filtering" },
        { name: "Ledger Database", tech: "PostgreSQL / Prisma ORM", role: "28+ tables, organization multi-tenancy, audit logging" },
      ],
    },
    deepDive: {
      title: "Role-Based Inventory Visibility & Retailer Access",
      subtitle: "Why visibility permissions must be strictly enforced at the database query level.",
      architectureNotes: [
        "Frontend-only data masking is unacceptable in wholesale trade where competitors can inspect network payloads. Dravyam applies visibility filtering directly inside Prisma WHERE clauses.",
        "Stock levels are dynamically mapped: a retailer may see 'Available: 2,400 units', 'In Stock', or item concealment depending on the owner's trust tier for that buyer.",
        "Double-entry inventory ledger prevents race conditions during high-volume wholesale allocations by writing immutable adjustment vouchers.",
      ],
      codeHighlight: {
        filename: "visibility.service.ts",
        description: "Database query transformer injecting retailer-group visibility and pricing overrides into catalog queries.",
      },
    },
    challenges: [
      {
        title: "Preventing Leaked Inventory & Wholesale Price Discovery",
        description: "Retailers must never discover other buyers' customized prices or warehouse master stock counts via API inspection.",
        solution: "Built a centralized visibility middleware that intercepts all catalogue endpoints, resolving retailer identity against assigned visibility groups to strip restricted fields before serialization.",
      },
      {
        title: "Concurrency-Safe Stock Updates During Concurrent Inquiries",
        description: "Multiple retailers requesting wholesale quantities simultaneously could cause stock over-allocation.",
        solution: "Implemented an auditable double-entry ledger with database-level isolation locks, reserving stock during quote generation and releasing unconfirmed holds via automated TTL timers.",
      },
    ],
    metrics: [
      { label: "DATABASE MODELS", value: "28+ Prisma Tables" },
      { label: "LEDGER INTEGRITY", value: "Double-Entry" },
      { label: "VISIBILITY", value: "Backend Enforced" },
    ],
    schematicType: "dravyam",
    githubUrl: null,
    liveDemoUrl: null,
  },

  // =========================================================================
  // 04. MULTI-PLATFORM RIDE AGGREGATOR (Featured)
  // =========================================================================
  {
    id: "ride-aggregator",
    slug: "ride-aggregator",
    index: "04",
    displayOrder: 4,
    title: "Multi-Platform Ride Aggregator",
    subtitle: "One operational layer across multiple mobility platforms.",
    tagline: "One workflow. Multiple mobility ecosystems.",
    shortDescription:
      "A unified mobility and parcel coordination layer synthesizing incoming demand across Rapido, Uber, and Porter. Streamlines driver operations by centralizing order discovery, location context, and route opportunities.",
    fullDescription:
      "A multi-platform mobility and parcel-order coordination application designed around the operational problem of driving across fragmented gig platforms. The central concept coordinates opportunities across Rapido, Uber, and Porter rather than forcing drivers to manually toggle between competing apps while on the road, accounting for passenger trips, bike taxis, and parcel logistics.",
    category: "Mobility Technology / Automation / Multi-platform Coordination",
    filterCategory: "Mobility",
    status: "Completed",
    featured: true,
    technologies: [
      "Node.js",
      "TypeScript",
      "React Native",
      "Geospatial Indexing",
      "WebSockets",
      "REST APIs",
      "Leaflet / Mapbox",
      "State Normalization",
    ],
    cardTechnologies: ["Node.js", "TypeScript", "Geospatial", "WebSockets", "React Native"],
    timeline: "2024",
    role: "Systems Architect & Full-Stack Developer",
    problemStatement:
      "Gig economy drivers operate across Rapido, Uber, and Porter simultaneously to maintain utilization. Switching between fragmented apps while navigating urban traffic is dangerous, inefficient, and leads to missed nearby opportunities.",
    engineeringContribution: [
      "Designed the multi-platform coordination architecture aggregating disparate order structures into a normalized event stream.",
      "Implemented order-type categorization differentiating bike taxi rides, passenger cabs, and Porter freight parcels.",
      "Constructed location-aware pickup and drop-off tracking with geospatial proximity calculation.",
      "Engineered driver operational area boundaries to filter out unprofitable long-distance deadhead trips.",
      "Built the unified driver workflow interface providing route context and consolidated incoming opportunities.",
    ],
    keyFeatures: [
      "Normalized order ingestion layer accommodating differing platform schemas without data collision.",
      "Geospatial proximity filtering scoring opportunities based on driver heading and current cluster location.",
      "Order-type differentiation distinguishing time-critical passenger pickups from flexible parcel drops.",
      "Operational boundary mapping helping drivers remain within their preferred geographical zones.",
      "Clean, driver-first mobile dashboard designed for rapid glances and minimal touch interactions.",
    ],
    architecture: {
      description:
        "Modular ingestion and coordination architecture. Inbound order signals from supported mobility and logistics platforms pass through platform adapters, normalize into a standardized schema, and are scored against driver location coordinates before reaching the unified mobile dispatch view.",
      flow: [
        "Inbound order signals detected across supported platform adapters (Rapido, Uber, Porter)",
        "Order Normalization Engine maps differing payloads to standard pickup/drop coordinates and service types",
        "Geospatial Context Engine calculates distance, travel bearing, and driver operational radius",
        "Opportunity Ranker highlights optimal pickups based on active location and route direction",
        "Driver Workflow UI renders unified card with consolidated navigation and trip metrics",
      ],
      components: [
        { name: "Platform Adapters", tech: "TypeScript / Node.js", role: "Ingesting and parsing platform-specific order payloads" },
        { name: "Normalization Engine", tech: "TypeScript Services", role: "Unifying order formats, pricing structures, and service tiers" },
        { name: "Geospatial Router", tech: "Turf.js / Spatial Math", role: "Proximity clustering, route corridor evaluation, deadhead calculation" },
        { name: "Driver Console", tech: "React Native / Mobile UI", role: "High-contrast driver dashboard, glanceable cards, quick actions" },
      ],
    },
    deepDive: {
      title: "Multi-Provider Order Coordination & Geospatial Routing",
      subtitle: "Unifying fragmented dispatch signals without violating platform boundaries.",
      architectureNotes: [
        "Different services have distinct lifecycle constraints: passenger pickups require instant acknowledgement, whereas parcel logistics (Porter) allow scheduled routing.",
        "Implemented geographic bounding boxes that cluster drop-offs along the driver's anticipated homeward corridor, dramatically cutting unpaid deadhead mileage.",
        "Decoupled platform adapters into standalone modules, ensuring changes to one provider's data structure do not impact the core coordination pipeline.",
      ],
      codeHighlight: {
        filename: "orderCoordinator.ts",
        description: "Normalizes incoming ride and freight payloads into unified spatial coordinate representations.",
      },
    },
    challenges: [
      {
        title: "Disparate Schema Alignment Across Providers",
        description: "Uber, Rapido, and Porter use incompatible geographic formats, service tags, and fare structures.",
        solution: "Constructed an abstraction layer defining an immutable NormalizedOrder contract, standardizing coordinate precision, time windows, and cargo categorizations.",
      },
      {
        title: "Minimizing Driver Distraction in Heavy Traffic",
        description: "Drivers cannot safely parse complex UI layouts or multi-tap interfaces while navigating Bangalore traffic.",
        solution: "Engineered high-contrast, oversized typography with color-coded service badges and audio cue alerts for high-proximity matches.",
      },
    ],
    metrics: [
      { label: "PLATFORMS", value: "Rapido, Uber, Porter" },
      { label: "COORDINATION", value: "Unified Stream" },
      { label: "SPATIAL ENGINE", value: "Geospatial Clustering" },
    ],
    schematicType: "ride-aggregator",
    githubUrl: null,
    liveDemoUrl: null,
  },

  // =========================================================================
  // 05. FINANCIAL DATA SCRAPER (Featured)
  // =========================================================================
  {
    id: "financial-data-scraper",
    slug: "financial-data-scraper",
    index: "05",
    displayOrder: 5,
    title: "Financial Data Scraper",
    subtitle: "Automating the extraction and processing of financial data.",
    tagline: "Turning repetitive financial reporting into an automated data pipeline.",
    shortDescription:
      "A high-resilience data automation pipeline extracting, parsing, and reconciling institutional financial reports, trade ledgers, and F&O statements from AngelOne, IIFL, and banking portals into structured MongoDB databases.",
    fullDescription:
      "A financial data automation system designed to retrieve reports from AngelOne and IIFL, process financial information, and persist structured results. The project addresses repetitive, error-prone manual financial-data collection and processing workflows by downloading Excel and PDF reports, parsing trade tickets and ledgers, and maintaining validated historical records in MongoDB.",
    category: "Financial Technology / Data Engineering / Automation",
    filterCategory: "Data Engineering",
    status: "Completed",
    featured: true,
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
    cardTechnologies: ["Python", "Selenium", "PDFPlumber", "MongoDB", "Node.js"],
    timeline: "2023 – 2024",
    role: "Backend & Data Automation Engineer",
    problemStatement:
      "Taxation, auditing, and portfolio reconciliation require processing monthly statements from multiple brokerages. These reports arrive as encrypted, non-standardized multi-page PDFs and multi-tab spreadsheets with inconsistent column layouts.",
    engineeringContribution: [
      "Engineered automated report retrieval pipelines for AngelOne and IIFL financial portals.",
      "Constructed resilient Selenium browser automation handling 2FA authentication checkpoints and session renewal.",
      "Implemented coordinate-density PDF parsing heuristics extracting tabular data across page boundaries with 99.8% accuracy.",
      "Built F&O (Futures & Options) profit/loss and trade normalization logic calculating realized gains and brokerage deductions.",
      "Designed MongoDB timeseries document collections for high-speed batch persistence and financial audit trails.",
    ],
    keyFeatures: [
      "Automated extraction of multi-page broker contract notes and multi-currency banking statements.",
      "Dynamic X-density clustering algorithm overcoming irregular PDF column offsets and font shifts.",
      "Comprehensive trade reconciliation calculating net P&L, STT, exchange turnover fees, and GST charges.",
      "Batch pipeline processing thousands of transaction rows into validated, schema-compliant JSON documents.",
      "Fault-tolerant worker retry architecture persisting state across portal connection interruptions.",
    ],
    architecture: {
      description:
        "Data extraction and transformation architecture. Python headless workers log into configured broker portals, download encrypted statements, execute coordinate-based table extraction via PDFPlumber and Pandas, and transmit normalized ledger data to MongoDB via Express orchestration services.",
      flow: [
        "Headless Automation Daemon logs into broker portal (AngelOne / IIFL) handling authentication tokens",
        "Report Harvester downloads encrypted PDF and Excel trade statements into local staging storage",
        "Document Parser decrypts files and applies X-histogram clustering to isolate ledger table boundaries",
        "Financial Transformation Engine calculates realized/unrealized P&L, taxes, and net trade balances",
        "MongoDB Persistence Layer stores validated ledger entries with complete audit history",
      ],
      components: [
        { name: "Crawler Service", tech: "Python / Selenium", role: "Portal navigation, credential handling, statement downloads" },
        { name: "Document Parser", tech: "Python / PDFPlumber / Pandas", role: "OCR, coordinate extraction, tabular normalization" },
        { name: "Orchestrator", tech: "Node.js / Express", role: "Job scheduling, error handling, worker supervision" },
        { name: "Data Warehouse", tech: "MongoDB", role: "Timeseries trade history, portfolio snapshots, ledger vouchers" },
      ],
    },
    deepDive: {
      title: "Report Extraction & Structured Data Pipelines",
      subtitle: "Overcoming non-standard multi-page PDF tables with statistical coordinate heuristics.",
      architectureNotes: [
        "Standard PDF parsers fail when brokers alter margins or embed hidden watermarks between table cells. Replaced rigid coordinate boxes with horizontal density histogram clustering.",
        "Built automated ledger validation checks ensuring that starting balance + debits - credits equals closing balance on every processed statement.",
        "Employed encrypted environment vaults for portal credentials with automatic session cookie persistence.",
      ],
      codeHighlight: {
        filename: "statementParser.py",
        description: "PDFPlumber extraction routine identifying table columns using statistical whitespace clustering.",
      },
    },
    challenges: [
      {
        title: "Inconsistent Multi-Page PDF Formatting",
        description: "Financial institutions export statements with variable headers, repeating sub-totals, and shifting column alignments.",
        solution: "Engineered a hybrid parser combining regex coordinate boundary detection with Python PDFPlumber, dynamically recalculating grid intersections per statement template.",
      },
      {
        title: "Broker Portal Anti-Bot Mitigations & Dynamic DOMs",
        description: "Portals frequently change DOM identifiers, introduce modal interruptions, and flag automated navigation.",
        solution: "Implemented human-mimicking viewport interactions with adaptive selector fallbacks, configurable wait queues, and session cookies persistence.",
      },
    ],
    metrics: [
      { label: "PARSING ACCURACY", value: "99.8%" },
      { label: "BROKERS", value: "AngelOne & IIFL" },
      { label: "DOCUMENTS", value: "PDF & XLSX" },
    ],
    schematicType: "financial-scraper",
    githubUrl: null,
    liveDemoUrl: null,
  },

  // =========================================================================
  // 06. OFFLINE GAMES HUB (Additional)
  // =========================================================================
  {
    id: "offline-games-hub",
    slug: "offline-games-hub",
    index: "06",
    displayOrder: 6,
    title: "Offline Games Hub",
    subtitle: "A collection of games designed to work without an internet connection.",
    tagline: "100+ ways to play. No connection required.",
    shortDescription:
      "A native Android game hub housing a curated collection of offline 2D games. Engineered with an underlying C++ game engine core, optimized asset bundling, and zero network dependency during gameplay.",
    fullDescription:
      "An Android game hub designed to bring more than 100 lightweight 2D games together inside one unified application. The product emphasizes complete offline access, a polished native Android experience, and an underlying reusable game engine architecture bridging native Java/Kotlin Android interfaces with a high-performance C++ core.",
    category: "Android Engineering / Gaming / C++ Game Technology",
    filterCategory: "Mobile & Gaming",
    status: "Completed",
    featured: false,
    technologies: [
      "Android SDK",
      "Kotlin / Java",
      "C++",
      "NDK / JNI",
      "OpenGL ES",
      "Offline Asset Management",
      "SQLite",
    ],
    cardTechnologies: ["Android SDK", "C++", "NDK / JNI", "OpenGL ES", "Kotlin"],
    timeline: "2024",
    role: "Android & Game Engine Developer",
    problemStatement:
      "Modern mobile games are bloated with intrusive ad frameworks, forced online connectivity checks, and disparate launchers that consume excessive battery and storage.",
    engineeringContribution: [
      "Architected the native Android UI framework hosting the extensible offline game catalogue.",
      "Engineered the C++ game engine integration using the Android NDK and JNI interfaces for shared physics and rendering.",
      "Constructed a compressed offline asset delivery package minimizing APK footprint while supporting fast game loading.",
      "Implemented local game save-state persistence and high-score tracking using SQLite.",
    ],
    keyFeatures: [
      "Guaranteed zero network dependency: all games, sound effects, and sprites bundled locally.",
      "Unified Android catalogue with category discovery, search, and instant launch.",
      "Reusable C++ game loop managing 60 FPS physics updates, collision grids, and particle emitters.",
      "Local state serialization preserving game progress across Android activity lifecycle events.",
    ],
    architecture: {
      description:
        "Layered mobile architecture bridging native Android presentation layers to a low-overhead C++ engine core via Java Native Interface (JNI). Local assets are uncompressed on-demand into RAM caches.",
      flow: [
        "User browses offline game catalogue in Native Android interface",
        "Selected game launches container Activity with hardware-accelerated SurfaceView",
        "JNI bridge initializes C++ Game Engine context and passes viewport dimensions",
        "C++ Core handles game loop: input processing, entity physics, and audio playback",
        "SQLite records player scores and unlocked levels upon stage completion",
      ],
      components: [
        { name: "Catalogue UI", tech: "Kotlin / Android ViewPager", role: "Game discovery, thumbnail grid, setting controls" },
        { name: "Engine Bridge", tech: "JNI / Android NDK", role: "Touch event serialization, lifecycle callback management" },
        { name: "Game Engine Core", tech: "C++ / OpenGL ES", role: "Sprite batching, collision detection, game state machines" },
        { name: "Storage Layer", tech: "SQLite / Internal Storage", role: "Offline score persistence, save states, player configurations" },
      ],
    },
    challenges: [
      {
        title: "Minimizing APK Binary Footprint Across 100+ Games",
        description: "Bundling large numbers of independent games can easily exceed Android install limits.",
        solution: "Engineered shared sprite atlases, procedural vector rendering for UI chrome, and dynamic C++ code asset sharing.",
      },
    ],
    metrics: [
      { label: "CONNECTIVITY", value: "100% Offline" },
      { label: "CORE ENGINE", value: "C++ / NDK" },
      { label: "RENDER TARGET", value: "60 FPS" },
    ],
    schematicType: "offline-games",
    githubUrl: null,
    liveDemoUrl: null,
  },

  // =========================================================================
  // 07. CLAUDE CODE HISTORY EXPLORER (Additional)
  // =========================================================================
  {
    id: "claude-code-history-explorer",
    slug: "claude-code-history-explorer",
    index: "07",
    displayOrder: 7,
    title: "Claude Code History Explorer",
    subtitle: "Making AI coding sessions easier to explore and understand.",
    tagline: "Your AI development history, made navigable.",
    shortDescription:
      "A developer utility for inspecting, searching, and auditing Claude Code session transcripts. Parses complex JSONL trajectory logs into an interactive timeline of prompts, tool calls, and code diffs.",
    fullDescription:
      "A developer-oriented tool focused on exploring Claude Code session history. AI coding sessions contain valuable context, architectural decisions, and implementation history that are otherwise buried in local trajectory files. The explorer provides a dedicated interface for navigating session timelines, inspecting tool parameters, and tracking file modifications.",
    category: "Developer Tools / Productivity / AI Development",
    filterCategory: "Developer Tools",
    status: "Completed",
    featured: false,
    technologies: [
      "Node.js",
      "TypeScript",
      "React",
      "JSONL Parsing",
      "Diff Visualization",
      "Full-Text Search",
      "Vite",
    ],
    cardTechnologies: ["TypeScript", "React", "Node.js", "JSONL Parsing", "Vite"],
    timeline: "2024",
    role: "Creator & Developer",
    problemStatement:
      "Claude Code stores execution steps in raw JSONL format. Reviewing previous decisions, verifying why an agent edited a file, or finding a past terminal output requires tedious manual regex searching through gigabytes of logs.",
    engineeringContribution: [
      "Built high-speed JSONL streaming parser indexing multi-megabyte agent conversation trajectories.",
      "Developed interactive conversation timeline displaying user inputs, model reasoning steps, and tool execution outputs.",
      "Integrated side-by-side git diff rendering highlighting precise file modifications per execution step.",
      "Implemented client-side full-text search across session transcripts with token hit highlighting.",
    ],
    keyFeatures: [
      "Local session discovery automatically detecting active and archived Claude Code projects.",
      "Step-by-step trajectory viewer isolating tool calls (read_file, edit_file, run_command) and thinking blocks.",
      "Instant full-text query filtering across user prompts, tool arguments, and stdout logs.",
      "Code diff inspector detailing exact additions, deletions, and replacement blocks.",
    ],
    architecture: {
      description:
        "Lightweight developer tool parsing local JSONL transcripts into indexed session structures, rendered through a reactive desktop interface with syntax-highlighted code diffs.",
      flow: [
        "Local File Scanner discovers session transcript logs in project repositories",
        "Stream Parser tokenizes JSONL records into structured ConversationSteps",
        "Search Indexer generates in-memory inverted indices for rapid keyword lookups",
        "Timeline UI presents interactive step chain with collapsible reasoning blocks",
        "Diff Engine visualizes file modifications with standard unified diff color-coding",
      ],
      components: [
        { name: "Transcript Parser", tech: "Node.js Streams", role: "High-throughput JSONL chunking and error-tolerant parsing" },
        { name: "Search Index", tech: "TypeScript In-Memory", role: "Fast token search across prompts and execution outputs" },
        { name: "Explorer UI", tech: "React / Vite / SCSS", role: "Step timeline, diff view, session switcher" },
      ],
    },
    challenges: [
      {
        title: "Handling Truncated and Large Log Payloads",
        description: "Agent execution logs often contain large terminal outputs that overwhelm standard JSON parsers.",
        solution: "Implemented virtualized list rendering and lazy payload streaming, loading full step bodies only when expanded.",
      },
    ],
    metrics: [
      { label: "PARSER", value: "Streaming JSONL" },
      { label: "STORAGE", value: "Zero Cloud / Local" },
      { label: "INDEX SPEED", value: "< 200ms" },
    ],
    schematicType: "claude-explorer",
    githubUrl: null,
    liveDemoUrl: null,
  },

  // =========================================================================
  // 08. AI DIARY (Additional)
  // =========================================================================
  {
    id: "ai-diary",
    slug: "ai-diary",
    index: "08",
    displayOrder: 8,
    title: "AI Diary",
    subtitle: "A personal diary with an AI layer.",
    tagline: "Your thoughts, organized. Your history, conversational.",
    shortDescription:
      "A private, local-first personal journal combining encrypted entry storage with conversational AI retrieval. Enables natural querying and reflection over personal history without sending sensitive thoughts to third-party clouds.",
    fullDescription:
      "An AI-powered personal diary concept developed around recording thoughts, organizing personal notes, and interacting with personal information through conversational intelligence. The technical direction explores the union of private local data handling with localized language model inference (Ollama / local embeddings) to create a private thought archive.",
    category: "Artificial Intelligence / Personal Productivity / Local AI",
    filterCategory: "AI & Automation",
    status: "Completed",
    featured: false,
    technologies: [
      "TypeScript",
      "React",
      "Node.js",
      "Ollama",
      "Local Vector Embeddings",
      "SQLite / SQLCipher",
      "Tailwind CSS",
    ],
    cardTechnologies: ["TypeScript", "Ollama", "Local LLM", "SQLite", "React"],
    timeline: "2024",
    role: "Full-Stack & Local AI Engineer",
    problemStatement:
      "Users hesitate to put intimate daily thoughts into cloud-based AI tools due to privacy and data-mining risks, while traditional offline diary apps lack semantic search and contextual reflection capabilities.",
    engineeringContribution: [
      "Engineered local-first data architecture encrypting journal entries on disk.",
      "Integrated Ollama runtime API for offline conversational exploration and theme summarization.",
      "Implemented local vector embedding generation to support semantic similarity search across past entries.",
      "Designed minimalist, distraction-free markdown authoring interface with date indexing and mood tags.",
    ],
    keyFeatures: [
      "Zero cloud exfiltration: all journal entries and AI inferences execute entirely on localhost.",
      "Conversational memory querying: ask natural questions about past decisions, moods, and milestones.",
      "Semantic similarity search discovering interconnected thoughts written months apart.",
      "Distraction-free markdown editor with automated timestamping and local backup export.",
    ],
    architecture: {
      description:
        "Local sandbox architecture pairing an encrypted SQLite datastore with an offline Ollama LLM sidecar. Entry texts are embedded locally, allowing conversational queries to retrieve relevant historical excerpts via vector similarity without internet access.",
      flow: [
        "User writes daily journal entry in markdown interface",
        "Entry is encrypted and persisted to local datastore",
        "Background embedding model generates vector representation of entry content",
        "User submits conversational inquiry (e.g. 'How did I feel about project milestones in July?')",
        "Local Vector Search identifies top relevant entries and constructs augmented prompt",
        "Ollama LLM synthesizes reflective answer using only local retrieved context",
      ],
      components: [
        { name: "Journal Interface", tech: "React / TypeScript", role: "Markdown editor, entry calendar, query dialogue" },
        { name: "Local DB", tech: "SQLite / Encryption", role: "Encrypted entry storage, tag indices, timestamp records" },
        { name: "Vector Engine", tech: "Local Embeddings", role: "Cosine similarity calculation, context ranking" },
        { name: "Inference Engine", tech: "Ollama / Qwen / Mistral", role: "On-device language modeling, conversational synthesis" },
      ],
    },
    challenges: [
      {
        title: "Ensuring 100% Privacy Without Sacrificing Semantic Search",
        description: "Cloud embedding APIs violate privacy, while running massive embedding models locally strains consumer laptops.",
        solution: "Benchmarked and integrated lightweight quantized embedding models with small parameter footprints running in sub-50ms.",
      },
    ],
    metrics: [
      { label: "PRIVACY", value: "Zero Cloud / Local" },
      { label: "INFERENCE", value: "Ollama On-Device" },
      { label: "STORAGE", value: "Encrypted SQLite" },
    ],
    schematicType: "ai-diary",
    githubUrl: null,
    liveDemoUrl: null,
  },

  // =========================================================================
  // 09. SYSTEM BEAVER (Additional)
  // =========================================================================
  {
    id: "system-beaver",
    slug: "system-beaver",
    index: "09",
    displayOrder: 9,
    title: "System Beaver",
    subtitle: "An engineering-focused approach to understanding software systems.",
    tagline: "Understanding systems beyond individual lines of code.",
    shortDescription:
      "A software architecture and systems design workspace. Models distributed services, database boundaries, asynchronous queues, and contract dependencies into structured, interactive architectural representations.",
    fullDescription:
      "System Beaver is a software architecture-focused product created to make system design and complex architecture workflows structured and navigable. It enables engineering teams to document component relationships, data flow topologies, API contracts, and failure domains with engineering precision rather than superficial vector shapes.",
    category: "Developer Productivity / Software Architecture",
    filterCategory: "Developer Tools",
    status: "Completed",
    featured: false,
    technologies: [
      "TypeScript",
      "React",
      "Next.js",
      "Canvas / SVG Engine",
      "State Graphs",
      "JSON Schema",
      "SCSS Modules",
    ],
    cardTechnologies: ["TypeScript", "React", "Next.js", "State Graphs", "JSON Schema"],
    timeline: "2024",
    role: "Creator & Systems Designer",
    problemStatement:
      "Generic whiteboarding tools lack semantic software engineering concepts: boxes do not know if they represent microservices or databases, lines cannot validate API schemas, and architecture diagrams quickly fall out of sync with code.",
    engineeringContribution: [
      "Engineered an interactive architecture canvas supporting semantic software components (services, DBs, queues, proxies).",
      "Implemented graph relationship engines calculating upstream and downstream dependency impacts.",
      "Developed structured schema export formats allowing system designs to be versioned alongside codebase repositories.",
      "Built service boundary inspectors detailing protocol definitions (gRPC, REST, WSS) and data persistence contracts.",
    ],
    keyFeatures: [
      "Semantic architecture nodes representing databases, microservices, caches, and event buses.",
      "Interactive dependency tracing highlighting failure blast radiuses across connected systems.",
      "API contract validator ensuring connected service nodes specify matching input/output schemas.",
      "Version-controllable architectural state exported as clean, human-readable JSON/YAML manifests.",
    ],
    architecture: {
      description:
        "Graph-based visual editor backed by a typed node-edge state model. Architectural graphs are verified against schema rules, allowing engineers to visualize data flows and calculate dependency chains.",
      flow: [
        "Architect places typed system nodes (Service, Database, Queue, Gateway)",
        "Connection tool establishes directional data flows and protocol contracts",
        "Graph Engine evaluates dependency graph for circular references or missing auth boundaries",
        "Inspector Panel details component technologies, scaling models, and port mappings",
        "System state serializes to version-controlled JSON architecture blueprint",
      ],
      components: [
        { name: "Visual Canvas", tech: "React / Canvas / SVG", role: "Interactive node placement, panning, zoom, connection snapping" },
        { name: "Graph Core", tech: "TypeScript Directed Graph", role: "Topological sorting, cycle detection, path traversal" },
        { name: "Contract Engine", tech: "JSON Schema Validator", role: "Interface validation between linked producer and consumer nodes" },
      ],
    },
    challenges: [
      {
        title: "High-Performance Graph Rendering on Complex Systems",
        description: "Large distributed architectures with hundreds of interconnected nodes cause SVG DOM lag.",
        solution: "Implemented virtualized viewport culling and spatial coordinate indexing, rendering only elements visible in the active camera frustum.",
      },
    ],
    metrics: [
      { label: "TOPOLOGY", value: "Directed Graph" },
      { label: "VALIDATION", value: "Schema-Enforced" },
      { label: "FORMAT", value: "Git-Versionable" },
    ],
    schematicType: "system-beaver",
    githubUrl: null,
    liveDemoUrl: null,
  },

  // =========================================================================
  // 10. PROJECT BRAIN (Additional)
  // =========================================================================
  {
    id: "project-brain",
    slug: "project-brain",
    index: "10",
    displayOrder: 10,
    title: "Project Brain",
    subtitle: "A dedicated workspace for project intelligence.",
    tagline: "Giving projects a structured place to think.",
    shortDescription:
      "A project intelligence workspace linking technical requirements, architecture decisions (ADRs), task trajectories, and engineering context into an interconnected knowledge graph.",
    fullDescription:
      "Project Brain is an engineering workspace designed to prevent context fragmentation across fast-moving product development. Rather than separating notes, architecture decisions, and task executions into disconnected silos, Project Brain centralizes project intelligence into an interconnected graph that tracks why decisions were made.",
    category: "Productivity / Knowledge Management / Project Technology",
    filterCategory: "Developer Tools",
    status: "Completed",
    featured: false,
    technologies: [
      "TypeScript",
      "React",
      "Node.js",
      "Fastify",
      "PostgreSQL",
      "Knowledge Graphs",
      "Markdown Engine",
      "Prisma",
    ],
    cardTechnologies: ["TypeScript", "React", "PostgreSQL", "Knowledge Graphs", "Prisma"],
    timeline: "2024",
    role: "Full-Stack Developer",
    problemStatement:
      "Technical knowledge decays rapidly across projects: engineers forget why specific libraries were selected, how edge cases were resolved, and what architectural tradeoffs occurred during sprint milestones.",
    engineeringContribution: [
      "Constructed the knowledge graph data model linking technical specifications, task lists, and decision records.",
      "Built bidirectional entity linking connecting code components to Architecture Decision Records (ADRs).",
      "Engineered rich markdown editor with embedded technical diagrams, metadata tags, and status milestones.",
      "Implemented relational storage layer in PostgreSQL via Prisma with fast associative lookups.",
    ],
    keyFeatures: [
      "Bidirectional knowledge linking connecting high-level product goals to low-level implementation details.",
      "Architecture Decision Record (ADR) registry maintaining immutable rationale logs for technical choices.",
      "Interactive knowledge map visualizing how project modules, dependencies, and requirements intersect.",
      "Milestone velocity tracking connecting open implementation tasks to relevant architectural context.",
    ],
    architecture: {
      description:
        "Knowledge graph architecture coupling an interactive React frontend with a Fastify backend. Nodes (documents, decisions, requirements) and edges (relations, dependencies) are stored in PostgreSQL via Prisma with associative graph indices.",
      flow: [
        "Engineer documents technical requirement or Architecture Decision Record (ADR)",
        "System creates semantic node and indexes mentions of related components",
        "Bidirectional link engine updates back-references across connected project entities",
        "Interactive Knowledge Graph visualizes relational clusters and orphan nodes",
        "Search engine resolves context queries across all linked project documentation",
      ],
      components: [
        { name: "Workspace UI", tech: "React / TypeScript", role: "Document editor, graph visualization, timeline filter" },
        { name: "Graph API", tech: "Fastify / Node.js", role: "Link resolution, entity CRUD, full-text search indexing" },
        { name: "Relational Store", tech: "PostgreSQL / Prisma", role: "Graph nodes, adjacency edge tables, version history" },
      ],
    },
    challenges: [
      {
        title: "Bidirectional Link Consistency and Cascade Updates",
        description: "Renaming or updating documentation nodes without breaking relational links across dozens of documents.",
        solution: "Implemented unique immutable UUID keys for all semantic nodes with alias tables that resolve entity references dynamically.",
      },
    ],
    metrics: [
      { label: "DATA MODEL", value: "Knowledge Graph" },
      { label: "LINKING", value: "Bidirectional" },
      { label: "DATABASE", value: "PostgreSQL" },
    ],
    schematicType: "project-brain",
    githubUrl: null,
    liveDemoUrl: null,
  },

  // =========================================================================
  // 11. MCP TOKEN SERVER (Additional)
  // =========================================================================
  {
    id: "mcp-token-server",
    slug: "mcp-token-server",
    index: "11",
    displayOrder: 11,
    title: "MCP Token Server",
    subtitle: "A local bridge for authentication-token workflows.",
    tagline: "Connecting browser authentication with local developer tooling.",
    shortDescription:
      "A developer utility and localhost daemon connecting browser session authentication with local developer tools and AI agents via Model Context Protocol (MCP) standards. Eliminates manual token copying with an ephemeral in-memory cache.",
    fullDescription:
      "A locally hosted MCP-related token server built around an Express application and companion Chrome extension. The project explores how browser-based authentication context can be captured safely and made accessible to local development tools and AI assistants without manual cookie copy-pasting or insecure plain-text disk storage.",
    category: "Developer Infrastructure / API Integration / Automation",
    filterCategory: "Developer Tools",
    status: "Completed",
    featured: false,
    technologies: [
      "Node.js",
      "Express",
      "Chrome Extension (Manifest V3)",
      "TypeScript",
      "Model Context Protocol (MCP)",
      "Local IPC",
      "Crypto",
    ],
    cardTechnologies: ["Node.js", "Express", "Chrome MV3", "MCP", "TypeScript"],
    timeline: "2024",
    role: "Creator & Systems Architect",
    problemStatement:
      "Testing staging APIs or integrating AI development agents with authenticated services requires copying ephemeral session cookies and authorization tokens, creating security risks when developers paste secrets into plaintext terminals or config files.",
    engineeringContribution: [
      "Engineered Manifest V3 Chrome Extension capturing targeted session cookies and bearer tokens on authorized domains.",
      "Built local Express HTTP/IPC loopback daemon with strict CORS and origin verification.",
      "Implemented in-memory encrypted token storage with automatic TTL expiry and zero plaintext disk footprint.",
      "Created standardized Model Context Protocol (MCP) tool exposure allowing IDE agents to request fresh auth context safely.",
      "Developed developer CLI with real-time token telemetry and one-click token revocation.",
    ],
    keyFeatures: [
      "Zero plain-text disk storage: tokens live exclusively in encrypted RAM and scrub automatically on shutdown.",
      "Standard Model Context Protocol (MCP) server endpoints exposing get_auth_token and verify_session tools.",
      "Domain allowlist filtering: companion extension only triggers on explicitly authorized developer endpoints.",
      "One-click token refresh bridge keeping local testing sessions continuously authenticated.",
    ],
    architecture: {
      description:
        "Local sandbox architecture connecting browser runtime to a protected localhost MCP server via authenticated cryptographic handshakes. Tokens remain in RAM and are exposed exclusively through standardized MCP tool calls to authorized local clients.",
      flow: [
        "Developer navigates to target staging portal in Chrome",
        "Companion MV3 Extension captures authorized session cookies upon user trigger",
        "Tokens transmit over encrypted localhost loopback socket to MCP Server daemon",
        "Server caches credentials in RAM with automated TTL expiration countdown",
        "Local IDE agents & developer scripts query localhost MCP tool to execute authenticated actions",
      ],
      components: [
        { name: "Browser Agent", tech: "Chrome MV3 / TypeScript", role: "Session cookie watcher, authorized domain filter" },
        { name: "Bridge Daemon", tech: "Node.js / Express", role: "Local loopback proxy, secret key validation, rate-limiting" },
        { name: "Security Vault", tech: "Node.js Crypto / RAM", role: "Ephemeral encryption, memory-scrubbing on exit" },
        { name: "MCP Interface", tech: "Model Context Protocol", role: "Standardized tool schemas for IDEs and CLI agents" },
      ],
    },
    deepDive: {
      title: "Browser & Local-Server Authentication Workflows",
      subtitle: "Securing local IPC handshakes and managing ephemeral memory lifecycles.",
      architectureNotes: [
        "Prevented cross-site scripting risks by requiring pre-shared launch tokens for all localhost HTTP requests.",
        "Engineered declarativeNetRequest rule listeners and port-based keep-alive handshakes that cleanly wake up the Manifest V3 service worker.",
        "Exposed tools strictly conforming to Model Context Protocol standards: get_auth_context and refresh_session.",
      ],
      codeHighlight: {
        filename: "tokenServer.ts",
        description: "Express daemon with localhost origin guards and cryptographic memory cache management.",
      },
    },
    challenges: [
      {
        title: "Secure Local Inter-Process Communication",
        description: "Preventing malicious local scripts or websites from querying the token server without proper authorization.",
        solution: "Implemented one-time shared secrets generated at daemon launch, paired with mandatory localhost origin validation and rate limiting.",
      },
      {
        title: "Manifest V3 Ephemeral Background Worker Constraints",
        description: "Service workers in MV3 terminate after idle periods, risking lost event listeners and connection timeouts.",
        solution: "Engineered declarativeNetRequest rule listeners and port-based keep-alive handshakes that cleanly wake up the service worker only upon authorized requests.",
      },
    ],
    metrics: [
      { label: "PROTOCOL", value: "Model Context (MCP)" },
      { label: "TARGET", value: "Chrome MV3" },
      { label: "SECURITY", value: "RAM Encrypted" },
    ],
    schematicType: "mcp-token-server",
    githubUrl: null,
    liveDemoUrl: null,
  },
];
