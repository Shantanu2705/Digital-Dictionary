"use client";

import { CheckCircle2, ShieldCheck, Zap, Award, Users } from "lucide-react";
import { motion } from "framer-motion";

const PILLARS = [
  {
    icon: Zap,
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    title: "Engineering Excellence Over Templates",
    desc: "We build dedicated React and Next.js platforms from scratch. No bloated plugins, no pirated WordPress themes, and zero vulnerabilities.",
  },
  {
    icon: Award,
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    title: "Commercial & Strategic Focus",
    desc: "A beautiful website is an asset only if it produces returns. Our architectures are engineered to capture verified leads, appointments, and sales.",
  },
  {
    icon: ShieldCheck,
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    title: "Enterprise Security & Compliance",
    desc: "Ministry of MSME registered with strict data protection, TLS encryption, and secure headers that keep your digital assets impenetrable.",
  },
  {
    icon: Users,
    badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    title: "Direct In-House Accountability",
    desc: "You partner with our full-time engineering and design team at our Siliguri studio. No outsourced freelancers or broken promises.",
  },
];

export function WhyUsSection() {
  return (
    <section className="py-24 md:py-32 bg-gradient-to-br from-[#0B1528] via-[#0F1E36] to-[#162A48] text-white relative overflow-hidden border-y-2 border-[#C5A059]/30">
      {/* Radiant ambient glow in deep navy */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 w-[500px] h-[500px] bg-[#1E3A8A]/20 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-[400px] h-[400px] bg-[#C5A059]/15 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* Subtle corporate grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none -z-10" />

      <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* Left Column: Institutional Statement */}
          <div className="w-full lg:w-5/12 space-y-6">
            <span className="text-xs uppercase tracking-widest font-bold text-[#DFB76C] block">
              The Digital Dictionary Standard
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-white leading-[1.15] tracking-tight">
              We engineer the <br />
              <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-[#DFB76C] via-[#F3E5AB] to-[#C5A059]">
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
                <span className="w-2.5 h-2.5 rounded-full bg-[#DFB76C] shrink-0" />
                <span>Ministry of MSME Registered &middot; UDYAM-WB-10-0098465</span>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Strategic Pillars with Jewel Badges */}
          <div className="w-full lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {PILLARS.map((pillar, index) => (
              <div 
                key={index}
                className="p-7 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[#DFB76C]/60 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all space-y-3 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shadow-xs ${pillar.badgeColor}`}>
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