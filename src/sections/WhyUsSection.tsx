"use client";

import { ShieldCheck, Zap, Award, Users } from "lucide-react";
import { motion } from "framer-motion";

const PILLARS = [
  {
    icon: Zap,
    title: "Engineering Excellence Over Templates",
    desc: "We build dedicated React and Next.js platforms from scratch. No bloated plugins, no pirated WordPress themes, and zero vulnerabilities.",
  },
  {
    icon: Award,
    title: "Commercial & Strategic Focus",
    desc: "A beautiful website is an asset only if it produces returns. Our architectures are engineered to capture verified leads, appointments, and sales.",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise Security & Compliance",
    desc: "Ministry of MSME registered with strict data protection, TLS encryption, and secure headers that keep your digital assets impenetrable.",
  },
  {
    icon: Users,
    title: "Direct In-House Accountability",
    desc: "You partner with our full-time engineering and design team at our Siliguri studio. No outsourced freelancers or broken promises.",
  },
];

export function WhyUsSection() {
  return (
    <section className="py-24 md:py-32 bg-[#101010] text-white relative overflow-hidden border-y border-[#1B1B1B]">
      {/* Radiant ambient glow in champagne gold */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-[400px] h-[400px] bg-[#E8D18A]/5 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* Subtle corporate grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none -z-10" />

      <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* Left Column: Institutional Statement */}
          <div className="w-full lg:w-5/12 space-y-6">
            <span className="text-xs uppercase tracking-widest font-bold text-[#E8D18A] block">
              The Digital Dictionary Standard
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-white leading-[1.15] tracking-tight">
              We engineer the <br />
              <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#E8D18A] to-[#A67C22]">
                institutional standard,
              </span> <br />
              not the alternative.
            </h2>
            <p className="text-base text-slate-300 font-normal leading-relaxed">
              In an industry plagued by slow freelancers and overpriced agency bloat, Digital Dictionary delivers high-precision technology with complete corporate transparency and verified results.
            </p>
            
            <div className="pt-6 border-t border-white/10 space-y-3">
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-200">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
                <span>Verified Client Deployments Across Healthcare, Travel &amp; Industry</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] shrink-0" />
                <span>Ministry of MSME Registered &middot; UDYAM-WB-10-0098465</span>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Strategic Pillars */}
          <div className="w-full lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {PILLARS.map((pillar, index) => (
              <div 
                key={index}
                className="p-7 rounded-2xl bg-[#1B1B1B] border border-white/10 hover:border-[#D4AF37]/60 shadow-lg hover:shadow-2xl transition-all space-y-3 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shadow-xs">
                  <pillar.icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
