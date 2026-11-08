export interface PersonalData {
  name: string;
  shortName: string;
  role: string;
  title: string;
  location: string;
  timezone: string;
  availableForWork: boolean;
  availabilityNote: string;
  heroHeadline: {
    line1: string;
    line2: string;
    line3: string;
  };
  heroBio: string;
  aboutHeadline: string;
  aboutText: string[];
  interests: {
    id: string;
    title: string;
    category: string;
    description: string;
    icon: string;
  }[];
  contactHeadline: string;
  contactSubtext: string;
  email: string;
  github: string;
  linkedin: string;
  resumeUrl: string;
  systemSpecs: {
    label: string;
    value: string;
  }[];
  professionalHighlights: {
    label: string;
    detail?: string;
  }[];
}

export const personalData: PersonalData = {
  name: "Manthan Dubey",
  shortName: "M / MANTHAN DUBEY",
  role: "Software Engineer / Full-Stack Developer / Product Builder",
  title: "Software Engineer",
  location: "India",
  timezone: "Asia/Kolkata",
  availableForWork: true,
  availabilityNote: "Available for high-impact roles & systems",
  heroHeadline: {
    line1: "I build systems.",
    line2: "I create products.",
    line3: "I solve problems.",
  },
  heroBio:
    "I'm a software engineer working across frontend, backend, infrastructure and emerging AI technologies. I enjoy taking ideas from architecture to working products.",
  aboutHeadline: "Curious by nature. Engineer by profession.",
  aboutText: [
    "I'm interested in how things work beneath the surface — from software architecture and distributed systems to automation and artificial intelligence.",
    "I enjoy experimenting with technologies, building useful products, and turning complex ideas into practical solutions.",
    "For me, engineering is not just about writing code. It's about understanding problems and designing systems that solve them.",
  ],
  interests: [
    {
      id: "product-eng",
      title: "Product Engineering",
      category: "Full Lifecycle",
      description: "Translating ambiguous requirements into resilient, user-centered digital applications with high polish.",
      icon: "Layers",
    },
    {
      id: "sys-arch",
      title: "Software Architecture",
      category: "Systems",
      description: "Designing decoupled, event-driven, and horizontally scalable backends with clear contract boundaries.",
      icon: "Cpu",
    },
    {
      id: "ai-exp",
      title: "AI Experimentation",
      category: "Intelligence",
      description: "Orchestrating agentic workflows, LLM tool-calling with MCP, and localized model fine-tuning and inference.",
      icon: "Sparkles",
    },
    {
      id: "automation",
      title: "Automation & Scraping",
      category: "Reliability",
      description: "Engineering headless data pipelines, resilient document parsers, and browser-driven extraction engines.",
      icon: "Cog",
    },
    {
      id: "open-source",
      title: "Open-Source Tech",
      category: "Ecosystem",
      description: "Contributing to developer tooling, community standards, and modern TypeScript and Dart ecosystems.",
      icon: "GitBranch",
    },
    {
      id: "creative-dev",
      title: "Creative Development",
      category: "Experience",
      description: "Crafting real-time WebGL graphics, custom shaders, and interactive physics-based web experiences.",
      icon: "Eye",
    },
  ],
  contactHeadline: "Have an interesting problem? Let's talk.",
  contactSubtext: "Whether you have a product to build, an architectural challenge to tackle, or an opportunity to discuss, my inbox is open.",
  email: "manthan1181999@gmail.com",
  github: "https://github.com/dubeymnthn",
  linkedin: "https://www.linkedin.com/in/dubeymnthn",
  resumeUrl: "/resume-manthan-dubey.pdf",
  systemSpecs: [
    { label: "CORE FOCUS", value: "Full-Stack & Systems" },
    { label: "PRIMARY STACK", value: "Node, TS, React, Python" },
    { label: "LOCAL NODE", value: "IST (UTC +5:30)" },
    { label: "ARCHITECTURE", value: "Distributed & Modular" },
  ],
  professionalHighlights: [
    { label: "11 Products Built", detail: "End-to-End" },
    { label: "Full-Stack Engineering", detail: "Web & Mobile" },
    { label: "AI & Automation", detail: "Agents & Pipelines" },
    { label: "Product Engineering", detail: "Architecture to Launch" },
  ],
};
