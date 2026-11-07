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
    company: "Perfios",
    role: "Associate Software Developer / Software Engineer",
    location: "India",
    type: "Full-Time",
    period: {
      start: "2025",
      end: "Present",
      duration: "Current",
    },
    overview:
      "Engineering core fintech data platforms, transaction intelligence engines, and automated document verification workflows serving major financial institutions.",
    responsibilities: [
      "Building resilient data ingestion services that extract and normalize complex bank statements and financial data formats.",
      "Developing microservices and RESTful API endpoints adhering to enterprise security, auditability, and compliance standards.",
      "Collaborating with product managers and infrastructure teams to ensure fault-tolerant processing of high-volume financial documents.",
      "Investigating and resolving edge cases in financial parsing algorithms, ensuring zero discrepancy in statement reconciliation.",
    ],
    keyContributions: [
      "Engineered high-throughput statement parsing pipelines processing disparate banking statement layouts.",
      "Implemented structured validation schemas to catch and isolate corrupted transaction rows prior to database ingestion.",
      "Contributed to internal engineering standards for API error handling and structured observability logging.",
    ],
    technologies: [
      "Node.js",
      "TypeScript",
      "Python",
      "REST APIs",
      "PostgreSQL",
      "MongoDB",
      "Docker",
      "Microservices",
    ],
  },
  {
    id: "ibm-objectwin",
    index: "02",
    company: "IBM / ObjectWin",
    role: "Contract Software Developer",
    location: "Remote / Bengaluru, India",
    type: "Contract (ANZ Bank Project)",
    period: {
      start: "2024",
      end: "2024",
      duration: "Project Engagement",
    },
    overview:
      "Enterprise banking software engineering engagement on behalf of IBM via ObjectWin, delivering critical development for the ANZ Bank digital banking platform.",
    responsibilities: [
      "Developed secure financial service integration modules within a strict compliance and enterprise governance framework.",
      "Implemented backend services interfacing with core banking systems and distributed identity services.",
      "Authored unit and integration test suites satisfying rigorous banking code coverage and security verification standards.",
      "Participated in architectural reviews and sprint deliveries within a global, distributed financial engineering team.",
    ],
    keyContributions: [
      "Successfully integrated multi-tier API services adhering to banking-grade security and authentication protocols.",
      "Refactored legacy transaction data handling modules to improve execution speed and eliminate race conditions.",
      "Maintained zero-defect releases during critical sprint audit gates.",
    ],
    technologies: [
      "TypeScript",
      "Node.js",
      "Java / Spring Services",
      "REST APIs",
      "Enterprise CI/CD",
      "Docker",
      "Git / JIRA",
    ],
  },
  {
    id: "karkinos",
    index: "03",
    company: "Karkinos Healthcare Pvt. Ltd.",
    role: "Associate Software Developer",
    location: "Kochi / Bengaluru, India",
    type: "Full-Time",
    period: {
      start: "Dec 2022",
      end: "Jan 2025",
      duration: "2 yrs 2 mos",
    },
    overview:
      "Healthcare technology engineering focused on distributed digital oncology platforms, diagnostic workflow tools, and clinical data systems connecting hospitals, clinics, and laboratory networks.",
    responsibilities: [
      "Architected and maintained full-stack web and mobile features for clinical consultation and patient record management.",
      "Designed and optimized relational and document schemas for diagnostic orders, lab results, and patient histories.",
      "Constructed reliable notification and real-time status dispatchers between lab technicians and consulting doctors.",
      "Ensured stringent HIPAA / data confidentiality practices across all API endpoints and database operations.",
    ],
    keyContributions: [
      "Developed key components of the oncology care pathway platform used by clinicians across partner medical centres.",
      "Reduced diagnostic report turnaround bottlenecks by automating laboratory workflow handoffs and notification triggers.",
      "Spearheaded UI refactoring and component standardization across patient and doctor-facing portals.",
    ],
    technologies: [
      "JavaScript",
      "TypeScript",
      "React",
      "Node.js",
      "Express",
      "PostgreSQL",
      "MongoDB",
      "Docker",
      "AWS",
    ],
  },
];
