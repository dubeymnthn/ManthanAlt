import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/shared/ScrollProgress";
import { CustomCursor } from "@/components/shared/CustomCursor";
import { HeroSection } from "@/components/hero/HeroSection";
import { SelectedWork } from "@/components/projects/SelectedWork";
import { SkillsExplorer } from "@/components/expertise/SkillsExplorer";
import { ExperienceTimeline } from "@/components/experience/ExperienceTimeline";
import { AboutSection } from "@/components/about/AboutSection";
import { ExperimentsSection } from "@/components/experiments/ExperimentsSection";
import { ContactSection } from "@/components/contact/ContactSection";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <CustomCursor />
      <Navbar />
      <main id="main-content" role="main">
        <HeroSection />
        <SelectedWork />
        <SkillsExplorer />
        <ExperienceTimeline />
        <AboutSection />
        <ExperimentsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
