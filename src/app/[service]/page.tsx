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
    <main className="flex min-h-screen flex-col items-center justify-between bg-background overflow-hidden relative">
      <Navbar />
      
      <div className="fixed inset-0 pointer-events-none z-0">
        <ParticleBackground />
      </div>

      {/* Ambient gold glow */}
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#C5A059]/10 rounded-full blur-[140px] pointer-events-none" />
      
      {/* Hero Section */}
      <section className="w-full pt-44 pb-20 relative z-10">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <span className="text-xs uppercase tracking-[0.25em] font-bold border-b border-[#E8DFC8] inline-block pb-2 mb-6 text-[#8C6A16]">
            DIGITAL SOLUTIONS &middot; SPECIALIZED CAPABILITY
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] mb-8 max-w-4xl mx-auto uppercase text-slate-900 font-serif">
            Premium {title} <br />
            <span className="italic font-light text-[#B8860B] text-gold-gradient">Services</span>
          </h1>
          <div className="bg-white border border-[#E8DFC8] rounded-3xl p-6 max-w-3xl mx-auto shadow-sm mb-14">
            <p className="text-base md:text-lg text-slate-700 font-normal leading-relaxed">
              We deliver state-of-the-art solutions tailored to elevate your brand. 
              Our {title} services are built on data-driven strategies and luxury design principles.
            </p>
          </div>

          <div className="relative w-full max-w-5xl mx-auto aspect-[21/9] rounded-[32px] overflow-hidden shadow-md border border-[#E8DFC8]">
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
      <section className="w-full py-20 relative z-10 bg-[#FAF8F3] border-y border-[#E8DFC8]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 md:p-10 rounded-[2rem] bg-white border border-[#E8DFC8] text-left shadow-sm hover:-translate-y-1 hover:border-[#C5A059] transition-all duration-300">
               <div className="w-10 h-10 rounded-full bg-[#FAF8F3] flex items-center justify-center text-[#B8860B] mb-6 border border-[#E8DFC8]">
                 <CheckCircle2 className="w-5 h-5" />
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight uppercase">Strategic Approach</h3>
               <p className="text-slate-600 leading-relaxed text-sm">Every {title} project begins with a deep dive into your market to ensure we deliver measurable ROI and competitive moat.</p>
            </div>
            
            <div className="p-8 md:p-10 rounded-[2rem] bg-white border border-[#E8DFC8] text-left shadow-sm hover:-translate-y-1 hover:border-[#C5A059] transition-all duration-300">
               <div className="w-10 h-10 rounded-full bg-[#FAF8F3] flex items-center justify-center text-[#B8860B] mb-6 border border-[#E8DFC8]">
                 <CheckCircle2 className="w-5 h-5" />
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight uppercase">Expert Execution</h3>
               <p className="text-slate-600 leading-relaxed text-sm">Our team of specialists utilize cutting-edge technology, enterprise security, and premium aesthetics to build your digital presence.</p>
            </div>

            <div className="p-8 md:p-10 rounded-[2rem] bg-white border border-[#E8DFC8] text-left shadow-sm hover:-translate-y-1 hover:border-[#C5A059] transition-all duration-300">
               <div className="w-10 h-10 rounded-full bg-[#FAF8F3] flex items-center justify-center text-[#B8860B] mb-6 border border-[#E8DFC8]">
                 <CheckCircle2 className="w-5 h-5" />
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight uppercase">Ongoing Growth</h3>
               <p className="text-slate-600 leading-relaxed text-sm">We don&apos;t just deliver a product; we partner with you to scale, monitor, and optimize your {title} operations continuously.</p>
            </div>
          </div>

          {/* Quick CTA to Contact / Enquiry */}
          <div className="mt-16 p-8 rounded-3xl bg-white border border-[#E8DFC8] flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div>
              <h4 className="text-lg font-serif text-slate-900">Need customized {title} solutions?</h4>
              <p className="text-xs text-slate-500">Connect directly with our engineering team for a dedicated strategy.</p>
            </div>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#DFB76C] to-[#C5A059] text-slate-900 font-bold text-xs uppercase tracking-widest transition-all shadow-sm hover:-translate-y-0.5 flex items-center gap-1.5 whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-900" />
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
