"use client";

import { motion } from "framer-motion";

const METHODOLOGY_STEPS = [
  {
    id: "01",
    title: "Strategic Discovery & Requirements",
    desc: "We analyze business unit economics, competitive landscape, audience personas, and technical specifications to establish a definitive project roadmap."
  },
  {
    id: "02",
    title: "System Architecture & UI/UX Design",
    desc: "Our senior design team architects interactive prototypes, wireframes, and design systems aligned with corporate branding and conversion funnels."
  },
  {
    id: "03",
    title: "Production Engineering & Next.js Build",
    desc: "We build on Next.js 16 App Router, TypeScript, and Tailwind CSS. Clean, modular codebases engineered for zero downtime and sub-second load times."
  },
  {
    id: "04",
    title: "Security Hardening & Quality Assurance",
    desc: "Rigorous cross-browser testing, automated vulnerability scans, CSP & HSTS security header configuration, and Core Web Vitals optimization."
  },
  {
    id: "05",
    title: "Deployment & Managed Growth",
    desc: "Seamless zero-downtime deployment on global edge networks, followed by search console indexing, analytics tracking, and continuous compounding."
  },
];

export function ProcessSection() {
  return (
    <section className="py-24 md:py-32 bg-[#FAFAF8] relative overflow-hidden border-b border-[#E5E5E2]">
      <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-6xl">

        <div className="mb-16 text-center max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-widest font-bold text-[#A67C22] block mb-2">
            Engineering Methodology
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-[#101010] tracking-tight mb-4">
            A Disciplined Framework for <span className="italic font-light text-[#A67C22]">Predictable Results.</span>
          </h2>
          <p className="text-sm md:text-base text-[#777777] font-normal leading-relaxed">
            Every engagement follows our standardized institutional engineering process, ensuring absolute transparency, on-time delivery, and zero technical debt.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {METHODOLOGY_STEPS.map((step) => (
            <div
              key={step.id}
              className="group relative rounded-2xl bg-white border border-[#E5E5E2] hover:border-[#D4AF37] transition-all shadow-xs hover:shadow-xl hover:-translate-y-1 duration-300 overflow-hidden flex flex-col justify-between"
            >
              <div className="h-1 w-full bg-gradient-to-r from-[#D4AF37] via-[#E8D18A] to-[#A67C22]" />

              <div className="p-8">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[#F2F2F0] border border-[#E5E5E2] flex items-center justify-center font-mono font-bold text-sm text-[#101010] shadow-2xs group-hover:bg-[#D4AF37] group-hover:text-[#101010] transition-colors">
                    {step.id}
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#777777]">
                    Phase {step.id}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#101010] mb-2 group-hover:text-[#A67C22] transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#777777] leading-relaxed font-normal">
                  {step.desc}
                </p>
              </div>

              <div className="px-8 pb-6 pt-2 text-[11px] font-semibold text-[#777777] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Verified Milestones</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
