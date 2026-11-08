import type { Metadata } from "next";
import { SectionPage } from "@/components/layout/SectionPage";
import { createSectionMetadata } from "@/components/layout/sectionMetadata";
import { ContactSection } from "@/components/contact/ContactSection";
import { personalData } from "@/data/personal";

export const metadata: Metadata = createSectionMetadata(
  "/contact",
  `Contact ${personalData.name}, a software engineer in India (IST, UTC+5:30) open to high-impact roles, product builds and architecture challenges.`
);

export default function ContactPage() {
  return (
    <SectionPage href="/contact">
      <ContactSection />
    </SectionPage>
  );
}
