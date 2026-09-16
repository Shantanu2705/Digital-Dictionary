import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/sections/HeroSection";
import { BrandStatementSection } from "@/sections/BrandStatementSection";
import { ServicesSection } from "@/sections/ServicesSection";
import { WhyUsSection } from "@/sections/WhyUsSection";
import { ClientsSection } from "@/sections/ClientsSection";
import { AllBrandLogosSection } from "@/sections/AllBrandLogosSection";
import { ProcessSection } from "@/sections/ProcessSection";
import { CtaSection } from "@/sections/CtaSection";

export default function Home() {
  return (
    <main className="flex min-h-[500vh] flex-col items-center w-full overflow-x-hidden pt-0">
      {/* We add ample height (e.g. min-h-[500vh] or we just let sections define it) 
          Wait, the original page relied on normal document flow. We should let sections define height, 
          but if it's too short for a 600-frame animation, the animation scrolls too fast. 
          Let's just use normal document flow. If it's long, it scrolls nicely. */}
      
      <Navbar />
      
      {/* All Sections */}
      <HeroSection />
      <BrandStatementSection />
      <ServicesSection />
      <WhyUsSection />
      <ClientsSection />
      <AllBrandLogosSection />
      <ProcessSection />
      <CtaSection />
      
      <Footer />
    </main>
  );
}
