import type { Metadata } from "next";
import { SectionPage } from "@/components/layout/SectionPage";
import { createSectionMetadata } from "@/components/layout/sectionMetadata";
import { SkillsExplorer } from "@/components/expertise/SkillsExplorer";
import { personalData } from "@/data/personal";

export const metadata: Metadata = createSectionMetadata(
  "/expertise",
  `The toolkit of ${personalData.name} as an interactive 3D constellation: full-stack web, distributed systems, mobile, databases, infrastructure and applied AI.`
);

export default function ExpertisePage() {
  return (
    <SectionPage href="/expertise">
      <SkillsExplorer />
    </SectionPage>
  );
}
