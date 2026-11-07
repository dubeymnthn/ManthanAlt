export interface ExperienceItem {
  id: string;
  index: string;
  company: string;
  role: string;
  location: string;
  type: string;
  period: {
    start: string;
    end: string;
    duration?: string;
  };
  overview: string;
  responsibilities: string[];
  keyContributions: string[];
  technologies: string[];
}

export const experienceData: ExperienceItem[] = [
  {
    id: "perfios",
    index: "01",
    company: "IHX — A Perfios Company",
    role: "Software Engineer",
    location: "Bengaluru, India",
    type: "Full-Time",
    period: {
      start: "March 2026",
      end: "Present",
      duration: "Current",
    },
    overview:
      "Engineering full-stack healthcare data exchange and claims integration platforms at IHX (part of Perfios), connecting healthcare providers, insurers, and clinical data systems with high-reliability microservices.",
    responsibilities: [
      "Developing responsive, high-performance web applications and internal tools using React and modern frontend standards.",
      "Architecting and maintaining Node.js backend microservices to handle structured health insurance data and document exchanges.",
      "Collaborating with product, compliance, and infrastructure engineers to build resilient, schema-validated API interfaces.",
      "Diagnosing data integration edge cases across heterogeneous clinical formats to ensure end-to-end data integrity.",
    ],
    keyContributions: [
      "Engineered full-stack features for healthcare claims processing and verification portals.",
      "Implemented modular service boundaries and structured error handling for distributed data ingestion workflows.",
      "Standardized API validation layers to intercept malformed payload schemas prior to persistence.",
    ],
    technologies: [
      "React",
      "Node.js",
      "TypeScript",
      "REST APIs",
      "PostgreSQL",
      "Docker",
      "Microservices",
      "Git",
    ],
  },
  {
    id: "ibm-objectwin",
    index: "02",
    company: "IBM / ObjectWin (Client: ANZ Bank)",
    role: "Contract Software Developer",
    location: "Bengaluru, India",
    type: "Contract",
    period: {
      start: "June 2025",
      end: "March 2026",
      duration: "10 mos (Released Mar 13)",
    },
    overview:
      "Contract software development engagement delivered via ObjectWin Technologies for IBM, focusing on middleware solutions, payment integration services, and enterprise API gateways for ANZ Bank.",
    responsibilities: [
      "Developed and supported Node.js-based middleware services (MU2) to orchestrate payment and settlement workflows.",
      "Integrated backend enterprise services to onboard institutional clients onto the unified payments platform.",
      "Configured API routing, payload transformations, and security policies using IBM DataPower gateways.",
      "Conducted production deployments and coordinated release management tasks using IBM UrbanCode Deploy (UDeploy) and Connect:Direct.",
    ],
    keyContributions: [
      "Built resilient integration services bridging core banking APIs with external payment channels.",
      "Implemented automated transformation policies and header validations within API gateway layers.",
      "Managed scheduled release gates and production rollouts with strict adherence to change management procedures.",
    ],
    technologies: [
      "Node.js",
      "IBM DataPower",
      "IBM UrbanCode Deploy",
      "Connect:Direct",
      "REST APIs",
      "JavaScript",
      "Enterprise CI/CD",
      "Linux",
    ],
  },
  {
    id: "karkinos",
    index: "03",
    company: "Karkinos Healthcare",
    role: "Associate Software Developer",
    location: "Kochi / Bengaluru, India",
    type: "Full-Time",
    period: {
      start: "Dec 2022",
      end: "Jan 2025",
      duration: "2 yrs 2 mos",
    },
    overview:
      "Core engineering contributions across distributed digital oncology platforms, diagnostic workflow tools, and clinical consultation portals connecting partner hospitals, clinics, and laboratory networks.",
    responsibilities: [
      "Developed and maintained healthcare web applications using React.js on the frontend and Node.js/Express for backend microservices.",
      "Implemented centralized Redux state management across multi-step clinical consultation forms and diagnostic ordering screens.",
      "Constructed RESTful API endpoints and MongoDB data models for structured patient records, consultation notes, and appointment schedules.",
      "Built a Progressive Web Application (PWA) with offline caching and mobile-first responsive layouts for field clinical staff.",
      "Integrated third-party APIs including ABHA (Ayushman Bharat Health Account) biometric authentication modules.",
    ],
    keyContributions: [
      "Delivered clinical consultation and diagnostic tracking features used daily across distributed cancer care partner centres.",
      "Engineered service-level caching strategies and database indexing that tangibly reduced endpoint response latency.",
      "Established containerized deployment workflows using Docker and AWS for predictable development and staging environments.",
    ],
    technologies: [
      "React",
      "Node.js",
      "Express",
      "Redux",
      "MongoDB",
      "Docker",
      "AWS (EC2, S3)",
      "PWA",
      "REST APIs",
    ],
  },
];
