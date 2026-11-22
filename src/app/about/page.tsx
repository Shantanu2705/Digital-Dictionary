import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Lightbulb, PenTool, Code, Rocket, CheckCircle2, Quote, Star } from "lucide-react";
import Image from "next/image";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | Digital Dictionary",
  description: "Digital Dictionary is a team of strategists, designers, and engineers. Learn about our story, luxury web design, data-driven marketing, and dedicated partnerships.",
  keywords: ["About Digital Dictionary", "Our Story", "Luxury Web Design Team", "Digital Agency India", "Best Digital Marketing Agency"],
  alternates: {
    canonical: "/about",
  }
};

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
    <main className="flex min-h-screen flex-col items-center justify-between bg-[#FAFAF8] overflow-hidden relative">
      <Navbar />
      
      {/* Background ambient lighting */}
      <div className="absolute top-28 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Hero / Our Story */}
      <section className="w-full pt-44 pb-16 relative z-10 border-b border-[#E5E5E2]">
        <div className="container mx-auto px-6 md:px-12 text-center max-w-4xl">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#A67C22] block mb-3">
            Corporate Profile &amp; Origins
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-medium tracking-tight text-[#101010] leading-[1.15] mb-6">
            Engineers &amp; Strategists Committed to <br />
            <span className="italic font-light text-[#A67C22]">Institutional Craft.</span>
          </h1>
          <div className="bg-white border border-[#E5E5E2] rounded-2xl p-6 md:p-8 max-w-3xl mx-auto shadow-2xs">
            <p className="text-base md:text-lg text-[#1B1B1B]/80 font-normal leading-relaxed">
              Digital Dictionary is an enterprise digital engineering firm based in Siliguri, West Bengal. We partner with discerning institutions to architect technology systems that scale.
            </p>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section className="w-full py-20 relative z-10">
        <div className="container mx-auto px-6 md:px-12">
          <div className="bg-white border border-[#E5E5E2] rounded-3xl p-8 md:p-14 shadow-xs flex flex-col lg:flex-row gap-12 lg:gap-16 items-center relative overflow-hidden">
            
            {/* Left Image Showcase */}
            <div className="w-full lg:w-1/2 relative z-10">
              <div className="relative aspect-[4/3] md:aspect-square lg:aspect-[4/5] rounded-2xl overflow-hidden border border-[#E5E5E2] shadow-md p-2 bg-white">
                <div className="w-full h-full rounded-xl overflow-hidden relative flex items-center justify-center">
                   <Image 
                     src="/workspace.jpg" 
                     alt="Creative Agency Workspace"
                     fill
                     className="object-cover hover:scale-105 transition-transform duration-700"
                   />
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="w-full lg:w-1/2 relative z-10">
              <span className="text-xs uppercase tracking-widest text-[#A67C22] mb-4 font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] inline-block" /> ABOUT US
              </span>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#101010] leading-[1.1] mb-6 uppercase font-serif">
                Your Digital Growth <br />
                <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#E8D18A] to-[#A67C22]">Partner.</span>
              </h2>
              
              <div className="space-y-4 text-[#1B1B1B]/80 font-normal leading-relaxed mb-8 text-base md:text-lg">
                <p>At Digital Dictionary, we don&apos;t just build websites; we craft digital ecosystems designed to captivate your audience and convert visitors into loyal customers.</p>
                <p>By merging stunning, high-end design with technical excellence and aggressive marketing strategies, we provide a holistic approach to conquering the digital landscape.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-[#101010] font-semibold text-sm">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0" />
                  Bespoke, Luxury Web Design
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0" />
                  Data-Driven ROI Marketing
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0" />
                  Conversion-Optimized Funnels
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0" />
                  24/7 Dedicated Partnership
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="w-full py-20 relative z-10 bg-[#F2F2F0] border-y border-[#E5E5E2]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="text-xs uppercase tracking-widest mb-3 font-bold text-[#A67C22] block">
              HOW WE WORK
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight uppercase mb-4 text-[#101010] font-serif">
              Our Process
            </h2>
            <div className="bg-white border border-[#E5E5E2] rounded-full py-2.5 px-6 shadow-2xs inline-block">
              <p className="text-sm md:text-base text-[#777777]">
                We follow a streamlined, results-driven process to transform your vision into a digital reality.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              {PROCESS.map((item) => (
                <div key={item.step} className="flex flex-col items-center group">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-[#E5E5E2] flex items-center justify-center mb-5 relative z-10 text-[#A67C22] shadow-2xs group-hover:scale-105 group-hover:border-[#D4AF37] transition-all duration-300">
                    <item.icon className="w-7 h-7 text-[#D4AF37]" />
                  </div>
                  <div className="bg-white border border-[#E5E5E2] p-6 rounded-2xl w-full h-full shadow-2xs group-hover:border-[#D4AF37] transition-colors">
                    <h3 className="text-sm font-bold text-[#101010] mb-2 uppercase tracking-wider">{item.step}</h3>
                    <p className="text-[#777777] text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-20 pb-32 relative z-10">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-14">
            <span className="text-xs uppercase tracking-widest mb-2 font-bold text-[#A67C22] block">
              TESTIMONIALS
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight uppercase text-[#101010] font-serif">
              Loved by <span className="italic font-light text-[#A67C22]">discerning brands.</span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto relative">
            <div className="bg-white p-8 md:p-12 rounded-3xl border border-[#E5E5E2] shadow-sm relative overflow-hidden">
              <div className="relative z-10">
                {/* Stars */}
                <div className="flex items-center gap-1.5 mb-6 text-[#D4AF37]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#D4AF37]" />
                  ))}
                </div>
                
                <div className="relative">
                  <p className="text-lg md:text-xl text-[#101010] font-normal leading-relaxed mb-8 max-w-2xl pr-8 italic font-serif">
                    &quot;{TESTIMONIALS[0].quote}&quot;
                  </p>
                  {/* Quote Icon */}
                  <div className="absolute -top-2 right-0 w-12 h-12 bg-[#F2F2F0] rounded-xl flex items-center justify-center text-[#A67C22] border border-[#E5E5E2] shadow-2xs">
                    <Quote className="w-5 h-5 fill-[#D4AF37]/30 rotate-180" />
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-6 border-t border-[#E5E5E2]">
                  <div className="w-10 h-10 rounded-full bg-[#F2F2F0] border border-[#E5E5E2] overflow-hidden flex items-center justify-center text-[#A67C22] font-bold text-xs">
                    SJ
                  </div>
                  <div>
                    <h4 className="font-bold text-[#101010] text-sm uppercase tracking-wider">{TESTIMONIALS[0].name}</h4>
                    <p className="text-xs text-[#A67C22] mt-0.5 font-bold">{TESTIMONIALS[0].company}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
