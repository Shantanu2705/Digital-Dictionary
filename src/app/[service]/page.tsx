import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ParticleBackground } from "@/components/ParticleBackground";
import { ServiceEnquiryModal } from "@/components/ServiceEnquiryModal";
import Image from "next/image";
import fs from "fs";
import path from "path";
import { DynamicTextColor } from "@/components/DynamicTextColor";

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
  
  // Convert slug to Title Case (e.g. "google-ads" -> "Google Ads")
  const title = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Check if custom image has been generated yet, otherwise use fallback
  const customImagePath = path.join(process.cwd(), 'public', `${slug}.jpg`);
  const imageSrc = fs.existsSync(customImagePath) ? `/${slug}.jpg` : getFallbackImage(slug);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-background overflow-hidden relative">
      <Navbar />
      
      <div className="fixed inset-0 pointer-events-none z-0">
        <ParticleBackground />
      </div>
      
      {/* Hero Section */}
      <section className="w-full pt-48 pb-24 relative z-10">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <DynamicTextColor as="h2" className="text-[12px] uppercase tracking-[0.2em] font-bold border-b-2 border-luxury-gold inline-block pb-2 mb-6">
            DIGITAL SOLUTIONS
          </DynamicTextColor>
          <DynamicTextColor as="h1" className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.05] mb-8 max-w-4xl mx-auto uppercase">
            Premium {title} <br /> Services
          </DynamicTextColor>
          <div className="bg-white/10 backdrop-blur-md border border-luxury-gold/30 rounded-3xl p-6 max-w-3xl mx-auto shadow-sm mb-16">
            <p className="text-lg md:text-xl text-charcoal font-semibold leading-relaxed">
              We deliver state-of-the-art solutions tailored to elevate your brand. 
              Our {title} services are built on data-driven strategies and luxury design principles.
            </p>
          </div>

          <div className="relative w-full max-w-5xl mx-auto aspect-[21/9] rounded-[32px] overflow-hidden shadow-lg border border-luxury-gold/30">
             <Image 
               src={imageSrc} 
               alt={`${title} Services`}
               fill
               className="object-cover"
               priority
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="w-full py-24 relative z-10 bg-transparent">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-10 rounded-[2rem] bg-white/10 backdrop-blur-xl border border-luxury-gold/30 text-center shadow-[0_10px_40px_rgba(212,175,55,0.1)] hover:-translate-y-2 hover:bg-white/20 transition-all duration-500">
               <h3 className="text-2xl font-bold text-charcoal mb-4 tracking-tight uppercase">Strategic Approach</h3>
               <p className="text-charcoal leading-relaxed text-sm font-semibold">Every {title} project begins with a deep dive into your market to ensure we deliver measurable ROI.</p>
            </div>
            <div className="p-10 rounded-[2rem] bg-white/10 backdrop-blur-xl border border-luxury-gold/30 text-center shadow-[0_10px_40px_rgba(212,175,55,0.1)] hover:-translate-y-2 hover:bg-white/20 transition-all duration-500">
               <h3 className="text-2xl font-bold text-charcoal mb-4 tracking-tight uppercase">Expert Execution</h3>
               <p className="text-charcoal leading-relaxed text-sm font-semibold">Our team of specialists utilize cutting-edge technology and premium aesthetics to build your digital presence.</p>
            </div>
            <div className="p-10 rounded-[2rem] bg-white/10 backdrop-blur-xl border border-luxury-gold/30 text-center shadow-[0_10px_40px_rgba(212,175,55,0.1)] hover:-translate-y-2 hover:bg-white/20 transition-all duration-500">
               <h3 className="text-2xl font-bold text-charcoal mb-4 tracking-tight uppercase">Ongoing Growth</h3>
               <p className="text-charcoal leading-relaxed text-sm font-semibold">We don&apos;t just deliver a product; we partner with you to scale and optimize your {title} operations.</p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
      <ServiceEnquiryModal serviceTitle={title} />
    </main>
  );
}
