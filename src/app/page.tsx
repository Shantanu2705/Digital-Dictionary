import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/sections/HeroSection";
import { BrandStatementSection } from "@/sections/BrandStatementSection";
import { ServicesSection } from "@/sections/ServicesSection";
import { WhyUsSection } from "@/sections/WhyUsSection";

import { ClientsSection } from "@/sections/ClientsSection";
import { ProcessSection } from "@/sections/ProcessSection";
import { CtaSection } from "@/sections/CtaSection";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Navbar />
      <HeroSection />
      <BrandStatementSection />
      <ServicesSection />
      <WhyUsSection />

      <ClientsSection />
      <ProcessSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
