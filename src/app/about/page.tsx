import type { Metadata } from "next";
import { SectionPage } from "@/components/layout/SectionPage";
import { createSectionMetadata } from "@/components/layout/sectionMetadata";
import { AboutSection } from "@/components/about/AboutSection";
import { personalData } from "@/data/personal";

export const metadata: Metadata = createSectionMetadata(
  "/about",
  `About ${personalData.name}, a software engineer drawn to how things work beneath the surface: architecture, distributed systems, automation and AI.`
);

export default function AboutPage() {
  return (
    <SectionPage href="/about">
      <AboutSection />
    </SectionPage>
  );
}
