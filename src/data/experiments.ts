export type ExperimentStatus =
  | "Completed experiment"
  | "Working prototype"
  | "Active research"
  | "Technical exploration";

export interface ExperimentItem {
  id: string;
  code: string;
  title: string;
  category: string;
  status: ExperimentStatus;
  summary: string;
  tech: string[];
  findings: string;
  terminalSnippet?: string;
}

export const experimentsData: ExperimentItem[] = [
  {
    id: "exp-01",
    code: "EXP-01",
    title: "Local LLM Inference & Quantization Trade-offs",
    category: "AI Runtime",
    status: "Completed experiment",
    summary:
      "Evaluating local model execution and context retention across 4-bit, 8-bit, and 16-bit GGUF quantizations on local developer hardware.",
    tech: ["Ollama", "Llama.cpp", "Qwen 2.5", "Mistral", "Python"],
    findings:
      "4-bit quantized instruction models reliably preserve syntactic validity for TypeScript generation while fitting comfortably within consumer RAM budgets.",
    terminalSnippet: "$ ollama run qwen2.5-coder:7b-instruct-q4_K_M --verbose",
  },
  {
    id: "exp-02",
    code: "EXP-02",
    title: "Model Context Protocol (MCP) Custom Server Adapter",
    category: "Agent Protocols",
    status: "Working prototype",
    summary:
      "Engineered lightweight JSON-RPC MCP servers exposing file-system watchers, headless scrapers, and database inspectors to LLMs.",
    tech: ["MCP SDK", "Node.js", "TypeScript", "JSON-RPC"],
    findings:
      "Decoupled JSON-RPC tool contracts significantly improve tool-call determinism and schema validation during multi-turn file transformations.",
    terminalSnippet: "$ agy mcp inspect --server local-token-bridge",
  },
  {
    id: "exp-03",
    code: "EXP-03",
    title: "Autonomous Multi-Actor Audio Script Synthesizer",
    category: "Generative Audio",
    status: "Active research",
    summary:
      "Experimental multi-agent pipeline directing distinct character voices, emotional modulation, and ambient sound effects from raw text stories.",
    tech: ["Gemini Multimodal", "Web Audio API", "SSML", "Ffmpeg"],
    findings:
      "Structured SSML injection with sentence-boundary emotional pacing prevents monotonic cadence in multi-character dialogue generation.",
    terminalSnippet: "[STORYFORGE_DAEMON] Segmenting Act 2 Scene 3 (Hindi Dialect)",
  },
  {
    id: "exp-04",
    code: "EXP-04",
    title: "Resilient Headless Scraping & PDF Coordinate Heuristics",
    category: "Automation",
    status: "Working prototype",
    summary:
      "Dynamic bounding-box algorithm calculating table column boundaries in unformatted financial statements using statistical whitespace clustering.",
    tech: ["Python", "PDFPlumber", "Pandas", "Regex"],
    findings:
      "Replacing brittle fixed-coordinate grids with adaptive X-coordinate density clustering enables automated parsing of multi-page bank statements.",
    terminalSnippet: ">>> parse_statement_tables(stream, heuristic='x_density')",
  },
  {
    id: "exp-05",
    code: "EXP-05",
    title: "Real-Time Procedural 3D Mesh Deformation via WebGL Shaders",
    category: "Creative Dev",
    status: "Technical exploration",
    summary:
      "Custom GLSL vertex and fragment shaders simulating mathematical flow fields and kinetic module systems at smooth display refresh rates.",
    tech: ["Three.js", "GLSL", "React Three Fiber", "Web Audio"],
    findings:
      "Offloading trigonometric vertex displacement directly to GPU vertex shaders eliminates main-thread CPU bottlenecks during geometry animation.",
    terminalSnippet: "gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);",
  },
  {
    id: "exp-06",
    code: "EXP-06",
    title: "Low-Overhead Event Loop Telemetry for Microservices",
    category: "Distributed Systems",
    status: "Active research",
    summary:
      "Lightweight Node.js diagnostics sidecar tracking V8 garbage collection intervals and event-loop lag with minimal runtime footprint.",
    tech: ["Node.js perf_hooks", "Prometheus", "Grafana", "Docker"],
    findings:
      "Sampling event-loop delay percentiles via native perf_hooks surfaces I/O thread blocking earlier than aggregate process CPU alarms.",
    terminalSnippet: "perf_hooks.monitorEventLoopDelay({ resolution: 20 })",
  },
];
