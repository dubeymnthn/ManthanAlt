# Manthan Dubey — Premium 3D Interactive Portfolio

> **Digital Craft — Systems in Motion**  
> An award-winning personal portfolio engineered for **Manthan Dubey — Software Engineer / Full-Stack Developer / Product Builder**.

Built with Next.js 15 App Router, React 19, TypeScript, Three.js, React Three Fiber (R3F v9), SCSS Modules, and Web Audio API.

---

## ✦ Art Direction & Design System

- **Design Philosophy**: Swiss Editorial Design meets Modern Brutalism & Minimalist Technical Aesthetics.
- **Color System**:
  - Background: `#111310` (Obsidian)
  - Elevated Surface: `#191C18`
  - Elevated Hover: `#222620`
  - Primary Text: `#F1F0E8` (Alabaster)
  - Secondary Text: `#999D92` (Sage Olive)
  - Accent: `#C5F36B` (Electric Chartreuse)
  - Muted Accent: `#879B67`
  - Technical Borders: `#30352D`
- **Typography**:
  - `Space Grotesk`: Oversized editorial display headlines.
  - `Manrope`: Body copy, descriptions, and primary navigation.
  - `IBM Plex Mono`: Technical labels, timestamps, section indexes (`01 / SELECTED WORK`), and architecture metadata.

---

## ✦ Website Architecture & Sections

1. **Header / Navigation**
   - Fixed editorial navigation bar with blur backdrop on scroll.
   - Brand monogram (`M / MANTHAN DUBEY`).
   - Configurable availability pulse (`● AVAILABLE FOR OPPORTUNITIES`).
   - Live real-time Indian Standard Time station clock (`IST UTC+5:30`).
   - Tactile procedural Web Audio synthesizer toggle (mute / unmute).
   - Responsive mobile navigation drawer.

2. **Hero — The Digital Systems Core**
   - Monumental editorial typography: *"I build systems. I create products. I solve problems."*
   - Interactive 3D Centerpiece built with **React Three Fiber**:
     - Procedurally generated interconnected geometric modules (machined processors, memory caches, bus routers).
     - Orbiting telemetry rings and pulsing data packets.
     - Smooth pointer dampening and hover module inspection.
     - Graceful 2D SVG architectural blueprint fallback for non-WebGL environments.
   - Real-time station telemetry HUD.

3. **01 / Selected Work (11 Completed Projects)**
   - Three-level presentation model (Project Cards, Case Study Drawer, Technical Deep Dives).
   - **Featured Systems (5 Core Architectures)**:
     - **01. Wally Talky**: Push-to-talk voice messaging (Flutter, Fastify, Socket.IO, PostgreSQL, Prisma, Redis, FCM).
     - **02. StoryForge AI**: Generative Hindi audio drama production studio (React 19, Google Gemini, ModelRouter, AntiSlopDirector, Web Audio API).
     - **03. Dravyam — GodownOS**: Wholesale inventory & godown SaaS (Fastify, PostgreSQL, Prisma ORM 28+ tables, BullMQ, double-entry stock ledger, backend-enforced retailer visibility).
     - **04. Multi-Platform Ride Aggregator**: Mobility & parcel logistics coordination layer (Rapido, Uber, Porter, geospatial indexing, route context).
     - **05. Financial Data Scraper**: Institutional report harvesting & ledger reconciliation (Python, Selenium 2FA, PDFPlumber X-density clustering, MongoDB).
   - **Additional Systems & Tools Directory (6 Completed Projects)**:
     - **06. Offline Games Hub**: Native Android container with C++ OpenGL ES 2D game engine (100% offline runtime).
     - **07. Claude Code History Explorer**: Local developer tool parsing JSONL agent trajectories into interactive diff timelines.
     - **08. AI Diary**: Local-first encrypted personal journal with on-device Ollama conversational retrieval (zero cloud leakage).
     - **09. System Beaver**: Software architecture workspace modeling semantic components, blast radiuses, and contract schemas.
     - **10. Project Brain**: Project intelligence repository linking specs, ADRs, and task execution graphs.
     - **11. MCP Token Server**: Local authentication bridge connecting browser tokens to IDEs via Model Context Protocol.
   - Real-time search engine and 7 category filters (`All`, `AI & Automation`, `SaaS & Business`, `Mobile & Gaming`, `Developer Tools`, `Data Engineering`, `Mobility`).
   - Interactive SVG architectural schematics for every project.
   - Comprehensive **Case Study Modal** detailing real engineering challenges, execution flowcharts, component roles, and technical deep dives.

4. **02 / Technical Expertise — 3D Skills Explorer**
   - **3D Skills Constellation**: Interactive 3D node network connecting related technologies across 6 core domains.
   - Interactive category switching isolates clusters in 3D space.
   - Live real-time search engine: instantaneous fuzzy filtering across technologies, categories, descriptions, and related tags.
   - Accessible searchable grid with zero fake proficiency percentages.

5. **03 / Experience — Professional Timeline**
   - Verified career history:
     - **Perfios** — Associate Software Developer / Software Engineer
     - **IBM / ObjectWin** — Contract Software Developer (ANZ Bank digital banking project)
     - **Karkinos Healthcare Pvt. Ltd.** — Associate Software Developer (Dec 2022 – Jan 2025)
   - Factual breakdown: company, tenure, technical focus, verified contributions, and stack tags.

6. **04 / The Person Behind the Code**
   - Swiss editorial composition highlighting engineering philosophy.
   - 6 Core focus areas (Product Engineering, Software Architecture, AI Experimentation, Automation, Open Source, Creative Development).
   - Developer environment and workstation specs.

7. **05 / The Experiment Lab**
   - Showcase of continuous technical inquiry:
     - Local LLM quantization benchmarks (Qwen 2.5, Ollama).
     - Model Context Protocol (MCP) custom server adapters.
     - Multi-agent dialogue synthesis and SSML prosody.
     - Headless PDF coordinate density heuristics.
     - Real-time GLSL vertex shader deformations.
     - Low-overhead event loop telemetry sidecars.

8. **06 / Contact & Direct Dispatcher**
   - One-click copy email button with real-time clipboard feedback.
   - Interactive message composer allowing recruiters and collaborators to select inquiry domains.
   - Direct links to GitHub, LinkedIn, and PDF resume.
   - Distinctive footer: `DESIGNED WITH INTENT. BUILT WITH CODE. © 2026 MANTHAN DUBEY`.

---

## ✦ Technical Highlights & Performance

- **Zero Layout Shifts**: Font loading via `next/font/google` preloads glyph subsets.
- **Client-Side Audio Synthesis**: Procedural Web Audio API sound effects without external audio assets.
- **Lenis Smooth Scrolling**: Hardware-accelerated, disabled automatically on reduced-motion and mobile touch devices.
- **Production Build Ready**: Statically prerendered pages generating in `< 4s` with zero build warnings.

---

## ✦ Getting Started

### Prerequisites

- Node.js `v20+` or `v24+`
- `pnpm` (or `npm`)

### Installation

\`\`\`bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the portfolio.

### Production Build

\`\`\`bash
# Build production bundle
pnpm build

# Start production server
pnpm start
\`\`\`

---

## ✦ Customization Guide

All portfolio content is decoupled into TypeScript data modules inside `src/data/`:
- `personal.ts`: Name, bio, contact email, availability, and social handles.
- `projects.ts`: Project details, architecture flow, challenges, and links.
- `skills.ts`: 3D node positions, categories, descriptions, and relations.
- `experience.ts`: Work experience, responsibilities, and contributions.
- `experiments.ts`: Technical workbench experiments and benchmarks.
- `navigation.ts`: Header navigation items.

---

© 2026 Manthan Dubey. Designed with intent. Built with code.
