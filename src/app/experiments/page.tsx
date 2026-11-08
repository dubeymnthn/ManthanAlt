import type { Metadata } from "next";
import { SectionPage } from "@/components/layout/SectionPage";
import { createSectionMetadata } from "@/components/layout/sectionMetadata";
import { ExperimentsSection } from "@/components/experiments/ExperimentsSection";
import { personalData } from "@/data/personal";

export const metadata: Metadata = createSectionMetadata(
  "/experiments",
  `The experiment lab of ${personalData.name}: local LLM quantization, Model Context Protocol tooling, generative audio synthesis and custom WebGL shaders.`
);

export default function ExperimentsPage() {
  return (
    <SectionPage href="/experiments">
      <ExperimentsSection />
    </SectionPage>
  );
}
