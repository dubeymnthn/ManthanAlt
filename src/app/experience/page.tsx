import type { Metadata } from "next";
import { SectionPage } from "@/components/layout/SectionPage";
import { createSectionMetadata } from "@/components/layout/sectionMetadata";
import { ExperienceTimeline } from "@/components/experience/ExperienceTimeline";
import { personalData } from "@/data/personal";

export const metadata: Metadata = createSectionMetadata(
  "/experience",
  `Professional experience of ${personalData.name}: scalable backend services, full-stack clinical applications and mission-critical financial systems.`
);

export default function ExperiencePage() {
  return (
    <SectionPage href="/experience">
      <ExperienceTimeline />
    </SectionPage>
  );
}
