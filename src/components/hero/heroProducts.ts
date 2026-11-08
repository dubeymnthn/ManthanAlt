// Plain data for the five hero product sculptures. Deliberately free of three.js
// imports so the 2D fallback can use it without pulling in the WebGL bundle.

export interface HeroProduct {
  id: string;
  index: string;
  name: string;
  category: string;
  /** Case-study route (must exist under /projects/[slug]). */
  route: string;
  /** World-space position of the sculpture's plinth centre. */
  position: [number, number, number];
  scale: number;
  /** Horizontal nudge (world units) of the label, keeping it inside the canvas. */
  labelDx: number;
  /** Idle sway: radians amplitude, speed multiplier, phase offset. */
  sway: { amp: number; speed: number; phase: number };
}

export const HERO_PRODUCTS: HeroProduct[] = [
  {
    id: "wally-talky",
    index: "01",
    name: "WALLY TALKY",
    category: "Real-time Communication",
    route: "/projects/wally-talky",
    position: [-2.95, 1.85, 0],
    scale: 0.82,
    labelDx: 0.25,
    sway: { amp: 0.32, speed: 0.34, phase: 0.0 },
  },
  {
    id: "storyforge-ai",
    index: "02",
    name: "STORYFORGE AI",
    category: "AI Audio Production",
    route: "/projects/storyforge-ai",
    position: [2.95, 2.2, -0.1],
    scale: 0.82,
    labelDx: -0.25,
    sway: { amp: 0.3, speed: 0.3, phase: 1.7 },
  },
  {
    id: "dravyam",
    index: "03",
    name: "DRAVYAM",
    category: "Wholesale Systems",
    route: "/projects/dravyam",
    position: [-3.5, -1.0, 0.1],
    scale: 0.9,
    labelDx: 0.3,
    sway: { amp: 0.34, speed: 0.28, phase: 3.1 },
  },
  {
    id: "ride-aggregator",
    index: "04",
    name: "RIDE AGGREGATOR",
    category: "Multi-platform Mobility",
    route: "/projects/ride-aggregator",
    position: [3.5, 0.2, 0.1],
    scale: 0.95,
    labelDx: -0.3,
    sway: { amp: 0.3, speed: 0.36, phase: 4.4 },
  },
  {
    id: "financial-data-scraper",
    index: "05",
    name: "FINANCIAL DATA SCRAPER",
    category: "Data Engineering",
    route: "/projects/financial-data-scraper",
    position: [3.4, -2.05, 0.15],
    scale: 0.78,
    labelDx: -0.3,
    sway: { amp: 0.28, speed: 0.32, phase: 5.6 },
  },
];

/** Order in which the fine connecting line passes through the sculptures. */
export const HERO_CHAIN_ORDER = [
  "dravyam",
  "wally-talky",
  "storyforge-ai",
  "ride-aggregator",
  "financial-data-scraper",
] as const;
