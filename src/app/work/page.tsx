import type { Metadata } from "next";
import { SectionPage } from "@/components/layout/SectionPage";
import { createSectionMetadata } from "@/components/layout/sectionMetadata";
import { SelectedWork } from "@/components/projects/SelectedWork";
import { personalData } from "@/data/personal";

export const metadata: Metadata = createSectionMetadata(
  "/work",
  `Eleven completed projects by ${personalData.name}: real-time voice, inventory SaaS, mobility platforms, generative AI audio, local LLMs and developer tooling.`
);

export default function WorkPage() {
  return (
    <SectionPage href="/work">
      <SelectedWork />
    </SectionPage>
  );
}
