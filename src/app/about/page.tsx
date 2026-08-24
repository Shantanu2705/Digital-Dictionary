import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ParticleBackground } from "@/components/ParticleBackground";
import { Lightbulb, PenTool, Code, Rocket, CheckCircle2, Quote, Star } from "lucide-react";
import Image from "next/image";

const PROCESS = [
  {
    step: "1. Discovery",
    desc: "We analyze your goals, audience, and competitors to formulate a winning strategy.",
    icon: Lightbulb
  },
  {
    step: "2. Design",
    desc: "Crafting stunning, user-centric interfaces that perfectly align with your brand.",
    icon: PenTool
  },
  {
    step: "3. Development",
    desc: "Building scalable, high-performance architecture using cutting-edge technologies.",
    icon: Code
  },
  {
    step: "4. Launch & Scale",
    desc: "Rigorous testing followed by deployment and ongoing marketing strategies.",
    icon: Rocket
  },
];

const TESTIMONIALS = [
  {
    quote: "Working with Digital Dictionary has been an excellent experience. Their creative approach and technical expertise helped us attract more customers online.",
    name: "SINGH JI",
    company: "Take A Trip",
  },
];

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-background overflow-hidden relative">
      <Navbar />
      
      {/* Global Particle Background for the entire page */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <ParticleBackground />
      </div>
      
      {/* Hero / Our Story */}
      <section className="w-full pt-48 pb-12 relative z-10">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <h2 className="text-[10px] md:text-[12px] uppercase tracking-[0.2em] text-luxury-gold mb-6 font-medium">
            OUR STORY
          </h2>
          <h1 className="text-5xl md:text-7xl lg:text-[85px] font-bold tracking-tighter text-charcoal leading-[1.05] mb-8">
            People obsessed with <br />
            premium craft.
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
            Digital Dictionary is a team of strategists, designers, and engineers working from a shared studio,
            building work we&apos;re proud to sign.
          </p>
        </div>
      </section>

      {/* About Us */}
      <section className="w-full py-24 relative z-10">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
            {/* Left Image Placeholder */}
            <div className="w-full lg:w-1/2">
              <div className="relative aspect-[4/3] md:aspect-square lg:aspect-[4/5] rounded-[32px] overflow-hidden border border-border shadow-sm bg-card p-2 md:p-4">
                <div className="w-full h-full rounded-[24px] overflow-hidden relative bg-black flex items-center justify-center">
                   <Image 
                     src="/workspace.jpg" 
                     alt="Creative Agency Workspace"
                     fill
                     className="object-cover opacity-80"
                   />
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="w-full lg:w-1/2">
              <h2 className="text-[12px] uppercase tracking-[0.2em] text-luxury-gold mb-6 font-medium flex items-center gap-2">
                <span className="w-1 h-3 bg-luxury-gold inline-block" /> ABOUT US
              </h2>
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-charcoal leading-[1.1] mb-8">
                Your Digital Growth <br />Partner.
              </h3>
              
              <div className="space-y-6 text-gray-600 font-light leading-relaxed mb-10 text-lg">
                <p>At Digital Dictionary, we don&apos;t just build websites; we craft digital ecosystems designed to captivate your audience and convert visitors into loyal customers.</p>
                <p>By merging stunning, high-end design with technical excellence and aggressive marketing strategies, we provide a holistic approach to conquering the digital landscape.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-charcoal font-medium text-sm">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-luxury-gold" />
                  Bespoke, Luxury Web Design
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-luxury-gold" />
                  Data-Driven ROI Marketing
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-luxury-gold" />
                  Conversion-Optimized Funnels
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-luxury-gold" />
                  24/7 Dedicated Partnership
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="w-full py-24 relative z-10">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-24 max-w-3xl mx-auto">
            <h2 className="text-[12px] uppercase tracking-[0.2em] text-luxury-gold mb-4 font-medium">
              HOW WE WORK
            </h2>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-charcoal mb-6">
              Our Process
            </h3>
            <p className="text-lg text-gray-600 font-light">
              We follow a streamlined, results-driven process to transform your vision into a digital reality.
            </p>
          </div>

          <div className="relative">
            {/* Horizontal Line connecting steps (visible on md+) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-[1px] bg-luxury-gold/30 -z-10" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
              {PROCESS.map((item) => (
                <div key={item.step} className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-card border border-luxury-gold/50 flex items-center justify-center mb-8 relative z-10 text-luxury-gold shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                    <item.icon className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-charcoal mb-4">{item.step}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed px-4 font-light">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-24 pb-48 relative z-10">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-[12px] uppercase tracking-[0.2em] text-luxury-gold mb-4 font-medium">
              TESTIMONIALS
            </h2>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-charcoal">
              Loved by discerning brands.
            </h3>
          </div>

          <div className="max-w-4xl mx-auto relative">
            <div className="bg-card p-10 md:p-16 rounded-[32px] border border-border shadow-[0_10px_40px_-15px_rgba(255,255,255,0.05)]">
              {/* Stars */}
              <div className="flex items-center gap-1 mb-8 text-luxury-gold">
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
              </div>
              
              <div className="relative">
                <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed mb-12 max-w-2xl pr-12">
                  &quot;{TESTIMONIALS[0].quote}&quot;
                </p>
                {/* Quote Icon */}
                <div className="absolute top-0 right-0 w-12 h-12 bg-luxury-gold rounded-full flex items-center justify-center text-charcoal">
                  <Quote className="w-5 h-5 fill-current rotate-180" />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-8 border-t border-border">
                <div className="w-12 h-12 rounded-full bg-background border border-border overflow-hidden flex items-center justify-center">
                   <span className="text-gray-600 text-xs font-bold">IMG</span>
                </div>
                <div>
                  <h4 className="font-bold text-charcoal text-sm">{TESTIMONIALS[0].name}</h4>
                  <p className="text-xs text-gray-500 mt-1 font-light">{TESTIMONIALS[0].company}</p>
                </div>
              </div>
            </div>

            {/* Static Pagination Dots */}
            <div className="flex items-center justify-center gap-2 mt-12">
              <div className="w-2 h-2 rounded-full bg-luxury-gold/30" />
              <div className="w-6 h-2 rounded-full bg-luxury-gold" />
              <div className="w-2 h-2 rounded-full bg-luxury-gold/30" />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
