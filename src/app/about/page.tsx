import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Lightbulb, PenTool, Code, Rocket, CheckCircle2, Quote, Star } from "lucide-react";
import Image from "next/image";
import { DynamicTextColor } from "@/components/DynamicTextColor";

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
    <main className="flex min-h-screen flex-col items-center justify-between bg-transparent overflow-hidden relative">
      <Navbar />
      
      {/* Hero / Our Story */}
      <section className="w-full pt-48 pb-12 relative z-10">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <DynamicTextColor as="h2" className="text-[10px] md:text-[12px] uppercase tracking-[0.2em] font-medium border-b-2 border-luxury-gold inline-block pb-2 mb-6">
            OUR STORY
          </DynamicTextColor>
          <DynamicTextColor as="h1" className="text-5xl md:text-7xl lg:text-[85px] font-bold tracking-tighter leading-[1.05] mb-8">
            People obsessed with <br />
            premium craft.
          </DynamicTextColor>
          <div className="bg-white/10 backdrop-blur-md border border-luxury-gold/30 rounded-3xl p-6 max-w-3xl mx-auto shadow-sm">
            <p className="text-lg md:text-xl text-charcoal font-semibold leading-relaxed">
              Digital Dictionary is a team of strategists, designers, and engineers working from a shared studio,
              building work we&apos;re proud to sign.
            </p>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section className="w-full py-24 relative z-10">
        <div className="container mx-auto px-6 md:px-12">
          <div className="bg-white/10 backdrop-blur-xl border border-luxury-gold/30 rounded-[3rem] p-10 md:p-16 shadow-[0_10px_40px_rgba(212,175,55,0.15)] flex flex-col lg:flex-row gap-16 lg:gap-24 items-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
            
            {/* Left Image Placeholder */}
            <div className="w-full lg:w-1/2 relative z-10">
              <div className="relative aspect-[4/3] md:aspect-square lg:aspect-[4/5] rounded-[32px] overflow-hidden border border-luxury-gold/20 shadow-sm bg-white/20 p-2 md:p-4">
                <div className="w-full h-full rounded-[24px] overflow-hidden relative bg-black flex items-center justify-center border border-luxury-gold/40">
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
            <div className="w-full lg:w-1/2 relative z-10">
              <h2 className="text-[12px] uppercase tracking-[0.2em] text-charcoal mb-6 font-bold flex items-center gap-2">
                <span className="w-1 h-3 bg-luxury-gold inline-block" /> ABOUT US
              </h2>
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-charcoal leading-[1.1] mb-8 uppercase drop-shadow-[0_1px_1px_rgba(255,255,255,1)]">
                Your Digital Growth <br />Partner.
              </h3>
              
              <div className="space-y-6 text-charcoal font-semibold leading-relaxed mb-10 text-lg drop-shadow-[0_1px_1px_rgba(255,255,255,1)]">
                <p>At Digital Dictionary, we don&apos;t just build websites; we craft digital ecosystems designed to captivate your audience and convert visitors into loyal customers.</p>
                <p>By merging stunning, high-end design with technical excellence and aggressive marketing strategies, we provide a holistic approach to conquering the digital landscape.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-charcoal font-bold text-sm">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-charcoal" />
                  Bespoke, Luxury Web Design
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-charcoal" />
                  Data-Driven ROI Marketing
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-charcoal" />
                  Conversion-Optimized Funnels
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-charcoal" />
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
            <DynamicTextColor as="h2" className="text-[12px] uppercase tracking-[0.2em] mb-4 font-bold border-b-2 border-luxury-gold inline-block pb-2">
              HOW WE WORK
            </DynamicTextColor>
            <DynamicTextColor as="h3" className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter uppercase mb-6">
              Our Process
            </DynamicTextColor>
            <div className="bg-white/10 backdrop-blur-md border border-luxury-gold/30 rounded-full py-3 px-8 shadow-sm inline-block">
              <p className="text-lg text-charcoal font-semibold">
                We follow a streamlined, results-driven process to transform your vision into a digital reality.
              </p>
            </div>
          </div>

          <div className="relative">
            {/* Horizontal Line connecting steps (visible on md+) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-[1px] bg-luxury-gold/30 -z-10" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
              {PROCESS.map((item) => (
                <div key={item.step} className="flex flex-col items-center group">
                  <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md border border-luxury-gold/50 flex items-center justify-center mb-8 relative z-10 text-charcoal shadow-[0_0_20px_rgba(212,175,55,0.15)] group-hover:bg-white/40 group-hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all duration-300">
                    <item.icon className="w-8 h-8" />
                  </div>
                  <div className="bg-white/10 backdrop-blur-md border border-luxury-gold/20 p-6 rounded-2xl w-full h-full">
                    <h4 className="text-lg font-bold text-charcoal mb-4 uppercase">{item.step}</h4>
                    <p className="text-charcoal text-sm leading-relaxed font-semibold">{item.desc}</p>
                  </div>
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
            <DynamicTextColor as="h2" className="text-[12px] uppercase tracking-[0.2em] mb-4 font-bold border-b-2 border-luxury-gold inline-block pb-2">
              TESTIMONIALS
            </DynamicTextColor>
            <DynamicTextColor as="h3" className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter uppercase">
              Loved by discerning brands.
            </DynamicTextColor>
          </div>

          <div className="max-w-4xl mx-auto relative">
            <div className="bg-white/10 backdrop-blur-2xl p-10 md:p-16 rounded-[32px] border border-luxury-gold/30 shadow-[0_10px_40px_rgba(212,175,55,0.15)] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/5 to-transparent pointer-events-none" />
              
              <div className="relative z-10">
                {/* Stars */}
                <div className="flex items-center gap-1 mb-8 text-charcoal">
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                </div>
                
                <div className="relative">
                  <p className="text-lg md:text-xl text-charcoal font-bold leading-relaxed mb-12 max-w-2xl pr-12 drop-shadow-[0_1px_1px_rgba(255,255,255,1)]">
                    &quot;{TESTIMONIALS[0].quote}&quot;
                  </p>
                  {/* Quote Icon */}
                  <div className="absolute -top-4 right-0 w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-charcoal border border-luxury-gold/30 shadow-sm">
                    <Quote className="w-6 h-6 fill-current rotate-180" />
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-8 border-t border-luxury-gold/20">
                  <div className="w-12 h-12 rounded-full bg-white/20 border border-luxury-gold/30 overflow-hidden flex items-center justify-center shadow-sm">
                     <span className="text-charcoal text-xs font-bold">IMG</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-charcoal text-sm uppercase tracking-wider">{TESTIMONIALS[0].name}</h4>
                    <p className="text-xs text-charcoal mt-1 font-bold">{TESTIMONIALS[0].company}</p>
                  </div>
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
