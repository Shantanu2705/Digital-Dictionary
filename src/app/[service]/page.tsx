import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ParticleBackground } from "@/components/ParticleBackground";
import { ServiceEnquiryModal } from "@/components/ServiceEnquiryModal";
import Image from "next/image";
import fs from "fs";
import path from "path";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Sparkles } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ service: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.service;
  const title = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${title} Services`,
    description: `Expert ${title} services by Digital Dictionary. Elevate your brand with our premium digital solutions and strategic marketing approach.`,
    keywords: [
      `${title}`,
      `${title} Services`,
      `${title} Agency`,
      `Premium ${title}`,
      "Digital Dictionary Services"
    ],
    openGraph: {
      title: `${title} Services | Digital Dictionary`,
      description: `Expert ${title} services by Digital Dictionary. Elevate your brand with our premium digital solutions.`,
      url: `https://digitaldictionary.in/${slug}`,
      type: "website",
    },
    alternates: {
      canonical: `/${slug}`,
    }
  };
}

function getFallbackImage(slug: string) {
  const s = slug.toLowerCase();
  if (s.includes('commercial') || s.includes('video') || s.includes('script') || s.includes('production')) return '/video_hero.jpg';
  if (s.includes('photography') || s.includes('shoot') || s.includes('image')) return '/photography_hero.jpg';
  if (s.includes('hosting') || s.includes('server') || s.includes('domain')) return '/hosting_hero.jpg';
  if (s.includes('app') || s.includes('ios') || s.includes('android')) return '/app_hero.jpg';
  if (s.includes('software') || s.includes('saas') || s.includes('crm') || s.includes('erp')) return '/software_hero.jpg';
  if (s.includes('design') || s.includes('ui') || s.includes('wireframe') || s.includes('prototype') || s.includes('logo')) return '/design_hero.jpg';
  if (s.includes('web') || s.includes('ecommerce') || s.includes('portal')) return '/webdev_hero.jpg';
  if (s.includes('marketing') || s.includes('seo') || s.includes('ads')) return '/marketing_hero.jpg';
  
  return '/service_hero.jpg';
}

export default async function GenericServicePage({ params }: { params: Promise<{ service: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.service;
  
  const title = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const customImagePath = path.join(process.cwd(), 'public', `${slug}.jpg`);
  const imageSrc = fs.existsSync(customImagePath) ? `/${slug}.jpg` : getFallbackImage(slug);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-[#FAFAF8] overflow-hidden relative">
      <Navbar />
      
      <div className="fixed inset-0 pointer-events-none z-0">
        <ParticleBackground />
      </div>

      {/* Ambient gold glow */}
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none" />
      
      {/* Hero Section */}
      <section className="w-full pt-44 pb-20 relative z-10 border-b border-[#E5E5E2]">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <span className="text-xs uppercase tracking-widest font-bold text-[#A67C22] inline-block mb-4">
            Digital Solutions &middot; Specialized Capability
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] mb-8 max-w-4xl mx-auto uppercase text-[#101010] font-serif">
            Premium {title} <br />
            <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#E8D18A] to-[#A67C22]">
              Services
            </span>
          </h1>
          <div className="bg-white border border-[#E5E5E2] rounded-2xl p-6 max-w-3xl mx-auto shadow-2xs mb-14">
            <p className="text-base md:text-lg text-[#1B1B1B]/80 font-normal leading-relaxed">
              We deliver state-of-the-art solutions tailored to elevate your brand. 
              Our {title} services are built on data-driven strategies and luxury design principles.
            </p>
          </div>

          <div className="relative w-full max-w-5xl mx-auto aspect-[21/9] rounded-2xl overflow-hidden shadow-md border border-[#E5E5E2]">
             <Image 
               src={imageSrc} 
               alt={`${title} Services`}
               fill
               className="object-cover"
               priority
             />
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="w-full py-20 relative z-10 bg-[#F2F2F0] border-b border-[#E5E5E2]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 md:p-10 rounded-2xl bg-white border border-[#E5E5E2] text-left shadow-xs hover:-translate-y-1 hover:border-[#D4AF37] transition-all duration-300">
               <div className="w-10 h-10 rounded-xl bg-[#F2F2F0] flex items-center justify-center text-[#A67C22] mb-6 border border-[#E5E5E2]">
                 <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
               </div>
               <h3 className="text-xl font-bold text-[#101010] mb-3 tracking-tight uppercase">Strategic Approach</h3>
               <p className="text-[#777777] leading-relaxed text-sm">Every {title} project begins with a deep dive into your market to ensure we deliver measurable ROI and competitive moat.</p>
            </div>
            
            <div className="p-8 md:p-10 rounded-2xl bg-white border border-[#E5E5E2] text-left shadow-xs hover:-translate-y-1 hover:border-[#D4AF37] transition-all duration-300">
               <div className="w-10 h-10 rounded-xl bg-[#F2F2F0] flex items-center justify-center text-[#A67C22] mb-6 border border-[#E5E5E2]">
                 <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
               </div>
               <h3 className="text-xl font-bold text-[#101010] mb-3 tracking-tight uppercase">Expert Execution</h3>
               <p className="text-[#777777] leading-relaxed text-sm">Our team of specialists utilize cutting-edge technology, enterprise security, and premium aesthetics to build your digital presence.</p>
            </div>

            <div className="p-8 md:p-10 rounded-2xl bg-white border border-[#E5E5E2] text-left shadow-xs hover:-translate-y-1 hover:border-[#D4AF37] transition-all duration-300">
               <div className="w-10 h-10 rounded-xl bg-[#F2F2F0] flex items-center justify-center text-[#A67C22] mb-6 border border-[#E5E5E2]">
                 <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
               </div>
               <h3 className="text-xl font-bold text-[#101010] mb-3 tracking-tight uppercase">Ongoing Growth</h3>
               <p className="text-[#777777] leading-relaxed text-sm">We don&apos;t just deliver a product; we partner with you to scale, monitor, and optimize your {title} operations continuously.</p>
            </div>
          </div>

          {/* Quick CTA to Contact / Enquiry */}
          <div className="mt-16 p-8 rounded-2xl bg-[#101010] text-white border border-[#D4AF37]/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <h4 className="text-lg font-serif text-white">Need customized {title} solutions?</h4>
              <p className="text-xs text-slate-300">Connect directly with our engineering team for a dedicated strategy.</p>
            </div>
            <Link
              href="/contact"
              className="px-7 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#E8D18A] to-[#A67C22] hover:from-[#A67C22] hover:to-[#D4AF37] text-[#101010] font-bold text-xs uppercase tracking-widest transition-all shadow-md hover:-translate-y-0.5 flex items-center gap-1.5 whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#101010]" />
              Discuss With Our Team
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
      <ServiceEnquiryModal serviceTitle={title} />
    </main>
  );
}
