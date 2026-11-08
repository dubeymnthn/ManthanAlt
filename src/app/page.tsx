import { Navbar } from "@/components/layout/Navbar";
import { CustomCursor } from "@/components/shared/CustomCursor";
import { HeroSection } from "@/components/hero/HeroSection";

// The home page is the hero alone. Every other section lives on its own route
// (/work, /expertise, /experience, /about, /experiments, /contact), reached from the navbar.
export default function Home() {
  return (
    <>
      <CustomCursor />
      <Navbar />
      <main id="main-content" role="main">
        <HeroSection />
      </main>
    </>
  );
}
