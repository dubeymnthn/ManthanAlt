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

3. **01 / Selected Work**
   - Asymmetric editorial project grid.
   - Showcases 4 systems:
     - **Wally Talky**: Push-to-talk voice messaging (Flutter, Fastify, Socket.IO, PostgreSQL, Redis).
     - **StoryForge AI**: Multi-agent Hindi audio drama production studio (React, TS, Google Gemini, TTS).
     - **Financial Data Automation**: Institutional financial data extraction (Node.js, Python, MongoDB, Selenium).
     - **MCP Token Server**: Local authentication-token capture bridge & MCP proxy.
   - Custom architectural system schematics (data flows, ring buffers, token bridges).
   - Interactive full-screen **Case Study Modal** with engineering challenges, execution flowcharts, and component matrices.

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
