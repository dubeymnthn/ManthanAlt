export interface ExperimentItem {
  id: string;
  code: string;
  title: string;
  category: string;
  status: "Active" | "Benchmarked" | "Shipped Tool" | "Research";
  summary: string;
  tech: string[];
  findings: string;
  terminalSnippet?: string;
}

export const experimentsData: ExperimentItem[] = [
  {
    id: "exp-01",
    code: "EXP-01",
    title: "Local LLM Inference & Quantization Benchmarks",
    category: "AI Runtime",
    status: "Benchmarked",
    summary:
      "Benchmarking local inference speed and context degradation across 4-bit, 8-bit, and 16-bit GGUF quants on consumer hardware.",
    tech: ["Ollama", "Llama.cpp", "Qwen 2.5", "Mistral", "Python"],
    findings:
      "4-bit quantized Qwen-2.5-Coder maintains >94% syntactic accuracy for TypeScript generation while running at 32 tok/s locally.",
    terminalSnippet: "$ ollama run qwen2.5-coder:7b-instruct-q4_K_M --verbose",
  },
  {
    id: "exp-02",
    code: "EXP-02",
    title: "Model Context Protocol (MCP) Custom Server Adapter",
    category: "Agent Protocols",
    status: "Shipped Tool",
    summary:
      "Engineered lightweight JSON-RPC MCP servers exposing file-system watchers, headless scrapers, and database inspectors to LLMs.",
    tech: ["MCP SDK", "Node.js", "TypeScript", "JSON-RPC"],
    findings:
      "Decoupled tool schemas drastically reduce hallucination rates in multi-step file manipulation tasks compared to inline prompting.",
    terminalSnippet: "$ agy mcp inspect --server local-token-bridge",
  },
  {
    id: "exp-03",
    code: "EXP-03",
    title: "Autonomous Multi-Actor Audio Script Synthesizer",
    category: "Generative Audio",
    status: "Active",
    summary:
      "Experimental multi-agent pipeline directing distinct character voices, emotional modulation, and ambient sound effects from raw text stories.",
    tech: ["Gemini Multimodal", "Web Audio API", "SSML", "Ffmpeg"],
    findings:
      "Dynamic SSML injection with sentence-boundary emotional weighting reduces monotonic synthesized cadence in dialogue.",
    terminalSnippet: "[STORYFORGE_DAEMON] Segmenting Act 2 Scene 3 (Hindi Dialect)",
  },
  {
    id: "exp-04",
    code: "EXP-04",
    title: "Resilient Headless Scraping & PDF Coordinate Heuristics",
    category: "Automation",
    status: "Shipped Tool",
    summary:
      "Dynamic bounding-box algorithm calculating table column boundaries in unformatted financial statements using statistical whitespace clustering.",
    tech: ["Python", "PDFPlumber", "Pandas", "Regex"],
    findings:
      "Replaced brittle fixed-coordinate grids with adaptive X-histogram density clustering, eliminating parsing failures on multi-bank layouts.",
    terminalSnippet: ">>> parse_statement_tables(stream, heuristic='x_density')",
  },
  {
    id: "exp-05",
    code: "EXP-05",
    title: "Real-Time Procedural 3D Mesh Deformation via WebGL Shaders",
    category: "Creative Dev",
    status: "Research",
    summary:
      "Custom GLSL vertex and fragment shaders simulating mathematical flow fields and kinetic module systems at locked 60 FPS.",
    tech: ["Three.js", "GLSL", "React Three Fiber", "Web Audio"],
    findings:
      "Offloading vertex displacement to GPU vertex shaders reduced JS thread CPU utilization from 28% to < 3% on high-density meshes.",
    terminalSnippet: "gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);",
  },
  {
    id: "exp-06",
    code: "EXP-06",
    title: "Low-Overhead Event Loop Telemetry for Microservices",
    category: "Distributed Systems",
    status: "Active",
    summary:
      "Lightweight Node.js diagnostics sidecar tracking V8 garbage collection spikes and event-loop lag with zero synthetic overhead.",
    tech: ["Node.js perf_hooks", "Prometheus", "Grafana", "Docker"],
    findings:
      "Capturing histogram percentiles (p99 event-loop delay) detects thread starvation 4x faster than standard CPU threshold alarms.",
    terminalSnippet: "perf_hooks.monitorEventLoopDelay({ resolution: 20 })",
  },
];
