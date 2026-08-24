import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ParticleBackground } from "@/components/ParticleBackground";
import { ServiceEnquiryModal } from "@/components/ServiceEnquiryModal";
import Image from "next/image";
import fs from "fs";
import path from "path";

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
      
      {/* Global Particle Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <ParticleBackground />
      </div>
      
      {/* Hero Section */}
      <section className="w-full pt-48 pb-24 relative z-10">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <h2 className="text-[12px] uppercase tracking-[0.2em] text-luxury-gold mb-6 font-medium">
            DIGITAL SOLUTIONS
          </h2>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-charcoal leading-[1.05] mb-8 max-w-4xl mx-auto">
            Premium {title} <br /> Services
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-16 font-light">
            We deliver state-of-the-art solutions tailored to elevate your brand. 
            Our {title} services are built on data-driven strategies and luxury design principles.
          </p>

          <div className="relative w-full max-w-5xl mx-auto aspect-[21/9] rounded-[32px] overflow-hidden shadow-lg border border-border/50">
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
      <section className="w-full py-24 relative z-10 bg-background">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-8 rounded-[24px] bg-card border border-border/50 text-center shadow-sm">
               <h3 className="text-2xl font-bold text-charcoal mb-4 tracking-tight">Strategic Approach</h3>
               <p className="text-gray-600 leading-relaxed text-sm font-light">Every {title} project begins with a deep dive into your market to ensure we deliver measurable ROI.</p>
            </div>
            <div className="p-8 rounded-[24px] bg-card border border-border/50 text-center shadow-sm">
               <h3 className="text-2xl font-bold text-charcoal mb-4 tracking-tight">Expert Execution</h3>
               <p className="text-gray-600 leading-relaxed text-sm font-light">Our team of specialists utilize cutting-edge technology and premium aesthetics to build your digital presence.</p>
            </div>
            <div className="p-8 rounded-[24px] bg-card border border-border/50 text-center shadow-sm">
               <h3 className="text-2xl font-bold text-charcoal mb-4 tracking-tight">Ongoing Growth</h3>
               <p className="text-gray-600 leading-relaxed text-sm font-light">We don&apos;t just deliver a product; we partner with you to scale and optimize your {title} operations.</p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
      <ServiceEnquiryModal serviceTitle={title} />
    </main>
  );
}
