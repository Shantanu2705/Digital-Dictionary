"use client";

import { motion } from "framer-motion";

const METHODOLOGY_STEPS = [
  {
    id: "01",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    topStripe: "from-blue-600 to-indigo-600",
    title: "Strategic Discovery & Requirements",
    desc: "We analyze business unit economics, competitive landscape, audience personas, and technical specifications to establish a definitive project roadmap."
  },
  {
    id: "02",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    topStripe: "from-purple-600 to-pink-600",
    title: "System Architecture & UI/UX Design",
    desc: "Our senior design team architects interactive prototypes, wireframes, and design systems aligned with corporate branding and conversion funnels."
  },
  {
    id: "03",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    topStripe: "from-amber-500 to-orange-500",
    title: "Production Engineering & Next.js Build",
    desc: "We build on Next.js 16 App Router, TypeScript, and Tailwind CSS. Clean, modular codebases engineered for zero downtime and sub-second load times."
  },
  {
    id: "04",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    topStripe: "from-emerald-600 to-teal-600",
    title: "Security Hardening & Quality Assurance",
    desc: "Rigorous cross-browser testing, automated vulnerability scans, CSP & HSTS security header configuration, and Core Web Vitals optimization."
  },
  {
    id: "05",
    badgeColor: "bg-cyan-50 text-cyan-700 border-cyan-200",
    topStripe: "from-cyan-600 to-blue-600",
    title: "Deployment & Managed Growth",
    desc: "Seamless zero-downtime deployment on global edge networks, followed by search console indexing, analytics tracking, and continuous compounding."
  },
];

export function ProcessSection() {
  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-[#EFE8D8] via-[#E6DBC6] to-[#EFE8D8] relative overflow-hidden border-b border-[#C8B89A]">
      <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-6xl">

        <div className="mb-16 text-center max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-widest font-bold text-[#8C6A16] block mb-2">
            Engineering Methodology
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-slate-900 tracking-tight mb-4">
            A Disciplined Framework for <span className="italic font-light text-[#8C6A16]">Predictable Results.</span>
          </h2>
          <p className="text-sm md:text-base text-slate-700 font-normal leading-relaxed">
            Every engagement follows our standardized institutional engineering process, ensuring absolute transparency, on-time delivery, and zero technical debt.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {METHODOLOGY_STEPS.map((step) => (
            <div
              key={step.id}
              className="group relative rounded-2xl bg-white border border-[#E2D8C3] hover:border-[#B8860B] transition-all shadow-xs hover:shadow-xl hover:-translate-y-1 duration-300 overflow-hidden flex flex-col justify-between"
            >
              <div className={`h-1 w-full bg-gradient-to-r ${step.topStripe}`} />

              <div className="p-8">
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-mono font-bold text-sm shadow-2xs ${step.badgeColor}`}>
                    {step.id}
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                    Phase {step.id}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#8C6A16] transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {step.desc}
                </p>
              </div>

              <div className="px-8 pb-6 pt-2 text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
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