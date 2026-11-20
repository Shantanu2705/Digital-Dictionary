import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Lightbulb, PenTool, Code, Rocket, CheckCircle2, Quote, Star, Sparkles } from "lucide-react";
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
    <main className="flex min-h-screen flex-col items-center justify-between bg-background overflow-hidden relative">
      <Navbar />
      
      {/* Background ambient lighting */}
      <div className="absolute top-28 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#C5A059]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Hero / Our Story */}
      <section className="w-full pt-44 pb-16 relative z-10">
        <div className="container mx-auto px-6 md:px-12 text-center max-w-4xl">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#8C6A16] block mb-3">
            Corporate Profile &amp; Origins
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-medium tracking-tight text-slate-900 leading-[1.15] mb-6">
            Engineers &amp; Strategists Committed to <br />
            <span className="italic font-light text-[#8C6A16]">Institutional Craft.</span>
          </h1>
          <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 md:p-8 max-w-3xl mx-auto shadow-2xs">
            <p className="text-base md:text-lg text-slate-600 font-normal leading-relaxed">
              Digital Dictionary is an enterprise digital engineering firm based in Siliguri, West Bengal. We partner with discerning institutions to architect technology systems that scale.
            </p>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section className="w-full py-20 relative z-10">
        <div className="container mx-auto px-6 md:px-12">
          <div className="bg-white border border-[#E8DFC8] rounded-[3rem] p-8 md:p-16 shadow-sm flex flex-col lg:flex-row gap-12 lg:gap-20 items-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FAF8F3] via-transparent to-transparent pointer-events-none" />
            
            {/* Left Image Showcase */}
            <div className="w-full lg:w-1/2 relative z-10">
              <div className="relative aspect-[4/3] md:aspect-square lg:aspect-[4/5] rounded-[32px] overflow-hidden border border-[#E8DFC8] shadow-md p-2 md:p-3 bg-white">
                <div className="w-full h-full rounded-[24px] overflow-hidden relative flex items-center justify-center border border-[#E8DFC8]">
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
              <span className="text-xs uppercase tracking-[0.25em] text-[#8C6A16] mb-4 font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#B8860B] inline-block" /> ABOUT US
              </span>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1] mb-8 uppercase font-serif">
                Your Digital Growth <br />
                <span className="italic font-light text-[#B8860B] text-gold-gradient">Partner.</span>
              </h2>
              
              <div className="space-y-5 text-slate-700 font-normal leading-relaxed mb-10 text-base md:text-lg">
                <p>At Digital Dictionary, we don&apos;t just build websites; we craft digital ecosystems designed to captivate your audience and convert visitors into loyal customers.</p>
                <p>By merging stunning, high-end design with technical excellence and aggressive marketing strategies, we provide a holistic approach to conquering the digital landscape.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-slate-800 font-semibold text-sm">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#C5A059] shrink-0" />
                  Bespoke, Luxury Web Design
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#C5A059] shrink-0" />
                  Data-Driven ROI Marketing
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#C5A059] shrink-0" />
                  Conversion-Optimized Funnels
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#C5A059] shrink-0" />
                  24/7 Dedicated Partnership
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="w-full py-20 relative z-10 bg-[#FAF8F3] border-y border-[#E8DFC8]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <span className="text-xs uppercase tracking-[0.25em] mb-4 font-bold border-b border-[#E8DFC8] inline-block pb-2 text-[#8C6A16]">
              HOW WE WORK
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight uppercase mb-6 text-slate-900 font-serif">
              Our Process
            </h2>
            <div className="bg-white border border-[#E8DFC8] rounded-full py-3 px-8 shadow-sm inline-block">
              <p className="text-base md:text-lg text-slate-700">
                We follow a streamlined, results-driven process to transform your vision into a digital reality.
              </p>
            </div>
          </div>

          <div className="relative">
            {/* Horizontal Line connecting steps */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-[1px] bg-[#C5A059]/40 -z-10" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              {PROCESS.map((item) => (
                <div key={item.step} className="flex flex-col items-center group">
                  <div className="w-20 h-20 rounded-full bg-white border-2 border-[#C5A059] flex items-center justify-center mb-6 relative z-10 text-[#B8860B] shadow-sm group-hover:scale-105 group-hover:bg-[#C5A059] group-hover:text-white transition-all duration-300">
                    <item.icon className="w-8 h-8" />
                  </div>
                  <div className="bg-white border border-[#E8DFC8] p-6 rounded-2xl w-full h-full shadow-sm group-hover:border-[#C5A059] transition-colors">
                    <h3 className="text-base font-bold text-slate-900 mb-3 uppercase tracking-wider">{item.step}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-20 pb-36 relative z-10">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.25em] mb-4 font-bold border-b border-[#E8DFC8] inline-block pb-2 text-[#8C6A16]">
              TESTIMONIALS
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight uppercase text-slate-900 font-serif">
              Loved by <span className="italic font-light text-[#B8860B] text-gold-gradient">discerning brands.</span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto relative">
            <div className="bg-white p-8 md:p-14 rounded-[32px] border border-[#E8DFC8] shadow-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FAF8F3] via-transparent to-transparent pointer-events-none" />
              
              <div className="relative z-10">
                {/* Stars */}
                <div className="flex items-center gap-1.5 mb-8 text-[#C5A059]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#C5A059]" />
                  ))}
                </div>
                
                <div className="relative">
                  <p className="text-lg md:text-2xl text-slate-800 font-normal leading-relaxed mb-10 max-w-2xl pr-8 italic font-serif">
                    &quot;{TESTIMONIALS[0].quote}&quot;
                  </p>
                  {/* Quote Icon */}
                  <div className="absolute -top-4 right-0 w-14 h-14 bg-[#FAF8F3] rounded-full flex items-center justify-center text-[#B8860B] border border-[#E8DFC8] shadow-sm">
                    <Quote className="w-6 h-6 fill-[#C5A059]/30 rotate-180" />
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-6 border-t border-[#E8DFC8]">
                  <div className="w-12 h-12 rounded-full bg-[#FAF8F3] border border-[#E8DFC8] overflow-hidden flex items-center justify-center text-[#8C6A16] font-bold text-xs">
                    SJ
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider">{TESTIMONIALS[0].name}</h4>
                    <p className="text-xs text-[#8C6A16] mt-0.5 font-bold">{TESTIMONIALS[0].company}</p>
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
