export type SkillCategory =
  | "Frontend"
  | "Backend"
  | "Mobile"
  | "Databases"
  | "Infrastructure & DevOps"
  | "AI & Automation";

export interface UsedProjectRef {
  id: string;
  title: string;
}

export interface SkillNode {
  id: string;
  name: string;
  category: SkillCategory;
  categoryIndex: number;
  description: string;
  related: string[];
  usedInProjects?: UsedProjectRef[];
  // 3D coordinates in normalized space for the 3D Constellation
  position: [number, number, number];
  color?: string;
  featured?: boolean;
}

export const skillCategories: { id: SkillCategory; label: string; count: number }[] = [
  { id: "Frontend", label: "01 / FRONTEND", count: 9 },
  { id: "Backend", label: "02 / BACKEND", count: 5 },
  { id: "Mobile", label: "03 / MOBILE", count: 3 },
  { id: "Databases", label: "04 / DATABASES", count: 5 },
  { id: "Infrastructure & DevOps", label: "05 / INFRA & DEVOPS", count: 9 },
  { id: "AI & Automation", label: "06 / AI & AUTOMATION", count: 7 },
];

export const skillsData: SkillNode[] = [
  // --- 1. Frontend Engineering ---
  {
    id: "javascript",
    name: "JavaScript",
    category: "Frontend",
    categoryIndex: 0,
    description: "Core ECMAScript foundation, modern async patterns, DOM mechanics, and execution event loop.",
    related: ["typescript", "react", "node-js", "html"],
    usedInProjects: [
      {
            id: "wally-talky",
            title: "Wally Talky"
      },
      {
            id: "storyforge-ai",
            title: "StoryForge AI"
      },
      {
            id: "claude-code-history-explorer",
            title: "Claude Code History Explorer"
      }
],
    position: [-3.8, 1.8, 0.4],
    featured: true,
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "Frontend",
    categoryIndex: 0,
    description: "Strict static typing, generic utility types, conditional types, and robust cross-layer schemas.",
    related: ["javascript", "react", "next-js", "node-js", "fastify"],
    usedInProjects: [
      {
            id: "wally-talky",
            title: "Wally Talky"
      },
      {
            id: "dravyam-godownos",
            title: "Dravyam \u2014 GodownOS"
      },
      {
            id: "storyforge-ai",
            title: "StoryForge AI"
      },
      {
            id: "ride-aggregator",
            title: "Multi-Platform Ride Aggregator"
      },
      {
            id: "mcp-token-server",
            title: "MCP Token Server"
      },
      {
            id: "system-beaver",
            title: "System Beaver"
      }
],
    position: [-2.9, 2.5, 1.1],
    featured: true,
  },
  {
    id: "react",
    name: "React",
    category: "Frontend",
    categoryIndex: 0,
    description: "Component architecture, Server Components, custom hooks, reconciliation, and state orchestration.",
    related: ["next-js", "typescript", "javascript"],
    usedInProjects: [
      {
            id: "dravyam-godownos",
            title: "Dravyam \u2014 GodownOS"
      },
      {
            id: "storyforge-ai",
            title: "StoryForge AI"
      },
      {
            id: "ai-diary",
            title: "AI Diary"
      },
      {
            id: "system-beaver",
            title: "System Beaver"
      }
],
    position: [-2.1, 1.6, 0.2],
    featured: true,
  },
  {
    id: "next-js",
    name: "Next.js",
    category: "Frontend",
    categoryIndex: 0,
    description: "Production App Router, streaming SSR, static generation, route handlers, and edge middleware.",
    related: ["react", "typescript", "node-js"],
    usedInProjects: [
      {
            id: "dravyam-godownos",
            title: "Dravyam \u2014 GodownOS"
      },
      {
            id: "system-beaver",
            title: "System Beaver"
      },
      {
            id: "project-brain",
            title: "Project Brain"
      },
      {
            id: "claude-code-history-explorer",
            title: "Claude Code History Explorer"
      }
],
    position: [-1.4, 2.4, 0.8],
    featured: true,
  },
  {
    id: "vue-js",
    name: "Vue.js",
    category: "Frontend",
    categoryIndex: 0,
    description: "Composition API, reactive refs, single-file components, and custom composables.",
    related: ["nuxt-js", "javascript", "typescript"],
    usedInProjects: [
      {
            id: "offline-games-hub",
            title: "Offline Games Hub"
      }
],
    position: [-3.5, 0.7, -0.6],
  },
  {
    id: "nuxt-js",
    name: "Nuxt.js",
    category: "Frontend",
    categoryIndex: 0,
    description: "Full-stack Vue framework with universal rendering, file-based routing, and auto-imports.",
    related: ["vue-js", "typescript"],
    usedInProjects: [
      {
            id: "system-beaver",
            title: "System Beaver"
      }
],
    position: [-2.8, -0.1, -0.8],
  },
  {
    id: "html",
    name: "HTML",
    category: "Frontend",
    categoryIndex: 0,
    description: "Semantic document structure, accessibility (ARIA standards), and SEO foundation.",
    related: ["css", "javascript"],
    usedInProjects: [
      {
            id: "storyforge-ai",
            title: "StoryForge AI"
      },
      {
            id: "dravyam-godownos",
            title: "Dravyam \u2014 GodownOS"
      }
],
    position: [-4.2, 0.9, 0.2],
  },
  {
    id: "css",
    name: "CSS",
    category: "Frontend",
    categoryIndex: 0,
    description: "Modern CSS layout engines (Grid, Flexbox), custom properties, animations, and container queries.",
    related: ["scss", "html"],
    usedInProjects: [
      {
            id: "dravyam-godownos",
            title: "Dravyam \u2014 GodownOS"
      },
      {
            id: "system-beaver",
            title: "System Beaver"
      }
],
    position: [-3.4, 2.8, -0.4],
  },
  {
    id: "scss",
    name: "SCSS",
    category: "Frontend",
    categoryIndex: 0,
    description: "Modular styling architecture, mixins, nesting, BEM conventions, and design system variables.",
    related: ["css", "react"],
    usedInProjects: [
      {
            id: "claude-code-history-explorer",
            title: "Claude Code History Explorer"
      }
],
    position: [-2.4, 3.2, 0.1],
  },

  // --- 2. Backend Engineering ---
  {
    id: "node-js",
    name: "Node.js",
    category: "Backend",
    categoryIndex: 1,
    description: "High-concurrency event-driven runtime, streams, worker threads, and asynchronous I/O architectures.",
    related: ["express", "fastify", "typescript", "rest-apis"],
    usedInProjects: [
      {
            id: "wally-talky",
            title: "Wally Talky"
      },
      {
            id: "storyforge-ai",
            title: "StoryForge AI"
      },
      {
            id: "claude-code-history-explorer",
            title: "Claude Code History Explorer"
      },
      {
            id: "mcp-token-server",
            title: "MCP Token Server"
      }
],
    position: [0.3, 2.6, 0.6],
    featured: true,
  },
  {
    id: "express",
    name: "Express",
    category: "Backend",
    categoryIndex: 1,
    description: "Middleware pipelines, RESTful routing, authentication chains, and standard microservices.",
    related: ["node-js", "rest-apis", "fastify"],
    usedInProjects: [
      {
            id: "storyforge-ai",
            title: "StoryForge AI"
      }
],
    position: [0.9, 3.4, 0.2],
  },
  {
    id: "fastify",
    name: "Fastify",
    category: "Backend",
    categoryIndex: 1,
    description: "High-performance low-overhead web framework with JSON schema serialization and plugins.",
    related: ["node-js", "typescript", "rest-apis", "websockets"],
    usedInProjects: [
      {
            id: "wally-talky",
            title: "Wally Talky"
      },
      {
            id: "dravyam-godownos",
            title: "Dravyam \u2014 GodownOS"
      },
      {
            id: "ride-aggregator",
            title: "Multi-Platform Ride Aggregator"
      }
],
    position: [1.6, 2.7, 0.9],
    featured: true,
  },
  {
    id: "rest-apis",
    name: "REST APIs",
    category: "Backend",
    categoryIndex: 1,
    description: "Resource-oriented API design, idempotency, HTTP specification compliance, and OpenAPI schemas.",
    related: ["node-js", "fastify", "express", "websockets"],
    usedInProjects: [
      {
            id: "dravyam-godownos",
            title: "Dravyam \u2014 GodownOS"
      },
      {
            id: "financial-data-scraper",
            title: "Financial Data Scraper"
      },
      {
            id: "ride-aggregator",
            title: "Multi-Platform Ride Aggregator"
      }
],
    position: [1.1, 1.8, -0.4],
  },
  {
    id: "websockets",
    name: "WebSockets",
    category: "Backend",
    categoryIndex: 1,
    description: "Full-duplex real-time communication, binary frames, heartbeat reconnects, and socket rooms.",
    related: ["fastify", "node-js", "flutter"],
    usedInProjects: [
      {
            id: "wally-talky",
            title: "Wally Talky"
      }
],
    position: [2.1, 2.1, 0.5],
    featured: true,
  },

  // --- 3. Mobile Development ---
  {
    id: "flutter",
    name: "Flutter",
    category: "Mobile",
    categoryIndex: 2,
    description: "Multi-platform reactive UI framework, widget trees, render objects, and native platform channels.",
    related: ["dart", "android", "websockets"],
    usedInProjects: [
      {
            id: "wally-talky",
            title: "Wally Talky"
      },
      {
            id: "ride-aggregator",
            title: "Multi-Platform Ride Aggregator"
      }
],
    position: [3.4, 2.0, -0.8],
    featured: true,
  },
  {
    id: "dart",
    name: "Dart",
    category: "Mobile",
    categoryIndex: 2,
    description: "Object-oriented language with sound null safety, async streams, isolate concurrency, and AOT compilation.",
    related: ["flutter", "android"],
    usedInProjects: [
      {
            id: "wally-talky",
            title: "Wally Talky"
      },
      {
            id: "ride-aggregator",
            title: "Multi-Platform Ride Aggregator"
      }
],
    position: [3.8, 1.1, -0.2],
    featured: true,
  },
  {
    id: "android",
    name: "Android",
    category: "Mobile",
    categoryIndex: 2,
    description: "Native Android services, lifecycle management, audio buffers, background workers, and permissions.",
    related: ["flutter", "dart"],
    usedInProjects: [
      {
            id: "offline-games-hub",
            title: "Offline Games Hub"
      },
      {
            id: "wally-talky",
            title: "Wally Talky"
      }
],
    position: [2.8, 0.6, -1.2],
  },

  // --- 4. Databases ---
  {
    id: "postgresql",
    name: "PostgreSQL",
    category: "Databases",
    categoryIndex: 3,
    description: "Enterprise relational database, complex queries, ACID guarantees, indexes, JSONB, and connection pooling.",
    related: ["prisma", "typeorm", "mysql"],
    usedInProjects: [
      {
            id: "wally-talky",
            title: "Wally Talky"
      },
      {
            id: "dravyam-godownos",
            title: "Dravyam \u2014 GodownOS"
      },
      {
            id: "project-brain",
            title: "Project Brain"
      },
      {
            id: "ride-aggregator",
            title: "Multi-Platform Ride Aggregator"
      }
],
    position: [-2.2, -1.8, 0.7],
    featured: true,
  },
  {
    id: "mongodb",
    name: "MongoDB",
    category: "Databases",
    categoryIndex: 3,
    description: "Document datastore, aggregation pipelines, flexible schemas, indexing strategies, and time-series collections.",
    related: ["node-js", "postgresql"],
    usedInProjects: [
      {
            id: "financial-data-scraper",
            title: "Financial Data Scraper"
      }
],
    position: [-1.2, -2.5, 0.3],
    featured: true,
  },
  {
    id: "mysql",
    name: "MySQL",
    category: "Databases",
    categoryIndex: 3,
    description: "Structured query processing, relational normalization, InnoDB storage engine, and query optimization.",
    related: ["postgresql", "typeorm"],
    usedInProjects: [
      {
            id: "dravyam-godownos",
            title: "Dravyam \u2014 GodownOS"
      }
],
    position: [-3.1, -2.2, 0.1],
  },
  {
    id: "prisma",
    name: "Prisma",
    category: "Databases",
    categoryIndex: 3,
    description: "Next-generation TypeScript ORM, type-safe query generation, schema migrations, and relation modeling.",
    related: ["postgresql", "typescript", "fastify"],
    usedInProjects: [
      {
            id: "wally-talky",
            title: "Wally Talky"
      },
      {
            id: "dravyam-godownos",
            title: "Dravyam \u2014 GodownOS"
      },
      {
            id: "project-brain",
            title: "Project Brain"
      }
],
    position: [-1.8, -1.0, 1.2],
    featured: true,
  },
  {
    id: "typeorm",
    name: "TypeORM",
    category: "Databases",
    categoryIndex: 3,
    description: "Active Record and Data Mapper patterns, entity decorators, migration management, and multi-database support.",
    related: ["postgresql", "mysql", "typescript"],
    usedInProjects: [
      {
            id: "ride-aggregator",
            title: "Multi-Platform Ride Aggregator"
      }
],
    position: [-2.7, -1.2, -0.5],
  },

  // --- 5. Infrastructure & DevOps ---
  {
    id: "docker",
    name: "Docker",
    category: "Infrastructure & DevOps",
    categoryIndex: 4,
    description: "Containerization, multi-stage builds, Alpine optimizations, container networking, and Docker Compose orchestration.",
    related: ["aws", "ci-cd"],
    usedInProjects: [
      {
            id: "dravyam-godownos",
            title: "Dravyam \u2014 GodownOS"
      },
      {
            id: "financial-data-scraper",
            title: "Financial Data Scraper"
      }
],
    position: [0.2, -1.6, -0.6],
    featured: true,
  },
  {
    id: "aws",
    name: "AWS",
    category: "Infrastructure & DevOps",
    categoryIndex: 4,
    description: "Cloud computing infrastructure, IAM policies, VPC security, serverless runtimes, and managed services.",
    related: ["ec2", "s3", "cognito", "docker"],
    usedInProjects: [
      {
            id: "wally-talky",
            title: "Wally Talky"
      },
      {
            id: "dravyam-godownos",
            title: "Dravyam \u2014 GodownOS"
      }
],
    position: [0.9, -2.4, -0.1],
    featured: true,
  },
  {
    id: "ec2",
    name: "EC2",
    category: "Infrastructure & DevOps",
    categoryIndex: 4,
    description: "Virtual server configuration, autoscaling groups, security groups, SSH key management, and reverse proxies.",
    related: ["aws", "docker"],
    usedInProjects: [
      {
            id: "dravyam-godownos",
            title: "Dravyam \u2014 GodownOS"
      }
],
    position: [1.8, -2.8, 0.4],
  },
  {
    id: "s3",
    name: "S3",
    category: "Infrastructure & DevOps",
    categoryIndex: 4,
    description: "Object storage architecture, lifecycle policies, pre-signed URLs, bucket CORS policies, and asset distribution.",
    related: ["aws", "fastify"],
    usedInProjects: [
      {
            id: "wally-talky",
            title: "Wally Talky"
      }
],
    position: [1.6, -1.9, -0.8],
  },
  {
    id: "cognito",
    name: "Cognito",
    category: "Infrastructure & DevOps",
    categoryIndex: 4,
    description: "User identity pools, JWT authentication tokens, OAuth2 flows, and multi-factor authorization integration.",
    related: ["aws", "rest-apis"],
    usedInProjects: [
      {
            id: "wally-talky",
            title: "Wally Talky"
      }
],
    position: [0.4, -2.9, 0.8],
  },
  {
    id: "ci-cd",
    name: "CI/CD",
    category: "Infrastructure & DevOps",
    categoryIndex: 4,
    description: "Continuous integration pipelines, automated test suites, linting gates, and zero-downtime deployment workflows.",
    related: ["docker", "aws"],
    usedInProjects: [
      {
            id: "dravyam-godownos",
            title: "Dravyam \u2014 GodownOS"
      }
],
    position: [2.5, -2.2, 0.1],
  },
  {
    id: "grafana",
    name: "Grafana",
    category: "Infrastructure & DevOps",
    categoryIndex: 4,
    description: "Operational metric visualization, real-time telemetry dashboards, alert rule thresholds, and incident observability.",
    related: ["prometheus", "loki"],
    usedInProjects: [
      {
            id: "dravyam-godownos",
            title: "Dravyam \u2014 GodownOS"
      }
],
    position: [1.2, -0.9, -1.5],
  },
  {
    id: "prometheus",
    name: "Prometheus",
    category: "Infrastructure & DevOps",
    categoryIndex: 4,
    description: "Time-series metric scraping, PromQL queries, system health endpoints, and node exporters.",
    related: ["grafana", "loki"],
    usedInProjects: [
      {
            id: "dravyam-godownos",
            title: "Dravyam \u2014 GodownOS"
      }
],
    position: [2.2, -1.2, -1.2],
  },
  {
    id: "loki",
    name: "Loki",
    category: "Infrastructure & DevOps",
    categoryIndex: 4,
    description: "Log aggregation system, label indexing, LogQL queries, and high-efficiency distributed logging.",
    related: ["grafana", "prometheus"],
    usedInProjects: [
      {
            id: "dravyam-godownos",
            title: "Dravyam \u2014 GodownOS"
      }
],
    position: [1.8, -0.4, -1.8],
  },

  // --- 6. AI & Automation ---
  {
    id: "llm-integration",
    name: "LLM Integration",
    category: "AI & Automation",
    categoryIndex: 5,
    description: "Structured JSON output schemas, agentic tool invocation, contextual memory windowing, and RAG pipelines.",
    related: ["google-gemini", "ollama", "mcp", "prompt-engineering"],
    usedInProjects: [
      {
            id: "storyforge-ai",
            title: "StoryForge AI"
      },
      {
            id: "ai-diary",
            title: "AI Diary"
      },
      {
            id: "mcp-token-server",
            title: "MCP Token Server"
      }
],
    position: [2.9, 1.4, 1.2],
    featured: true,
  },
  {
    id: "google-gemini",
    name: "Google Gemini",
    category: "AI & Automation",
    categoryIndex: 5,
    description: "Multimodal API integration, 1.5 Pro long-context windows, system instructions, and audio-text workflows.",
    related: ["llm-integration", "prompt-engineering"],
    usedInProjects: [
      {
            id: "storyforge-ai",
            title: "StoryForge AI"
      }
],
    position: [3.6, 2.2, 0.8],
    featured: true,
  },
  {
    id: "ollama",
    name: "Ollama",
    category: "AI & Automation",
    categoryIndex: 5,
    description: "Local model execution, quantized model deployments, GPU acceleration, and low-latency offline inference.",
    related: ["llm-integration", "ai-workflows"],
    usedInProjects: [
      {
            id: "ai-diary",
            title: "AI Diary"
      }
],
    position: [3.3, 0.4, 1.5],
    featured: true,
  },
  {
    id: "mcp",
    name: "MCP",
    category: "AI & Automation",
    categoryIndex: 5,
    description: "Model Context Protocol architecture, building custom tools, resources, and local client-server adapters.",
    related: ["llm-integration", "ai-workflows", "node-js"],
    usedInProjects: [
      {
            id: "mcp-token-server",
            title: "MCP Token Server"
      }
],
    position: [2.2, 0.8, 1.8],
    featured: true,
  },
  {
    id: "prompt-engineering",
    name: "Prompt Engineering",
    category: "AI & Automation",
    categoryIndex: 5,
    description: "Few-shot calibration, structured output enforcement, reasoning chains, and deterministic response guardrails.",
    related: ["google-gemini", "llm-integration"],
    usedInProjects: [
      {
            id: "storyforge-ai",
            title: "StoryForge AI"
      }
],
    position: [3.8, -0.3, 1.1],
  },
  {
    id: "web-scraping",
    name: "Web Scraping",
    category: "AI & Automation",
    categoryIndex: 5,
    description: "Automated browser orchestration, headless Chrome, DOM reverse engineering, and resilient document extraction.",
    related: ["ai-workflows", "node-js"],
    usedInProjects: [
      {
            id: "financial-data-scraper",
            title: "Financial Data Scraper"
      }
],
    position: [1.5, 0.1, 1.4],
  },
  {
    id: "ai-workflows",
    name: "AI Workflows",
    category: "AI & Automation",
    categoryIndex: 5,
    description: "Multi-stage autonomous pipelines, document transformation, audio synthesis queues, and human-in-the-loop validation.",
    related: ["llm-integration", "mcp", "ollama"],
    usedInProjects: [
      {
            id: "storyforge-ai",
            title: "StoryForge AI"
      },
      {
            id: "ai-diary",
            title: "AI Diary"
      }
],
    position: [2.7, -0.6, 1.6],
    featured: true,
  },
];
