"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Target, Cpu } from "lucide-react";

export function BrandStatementSection() {
  return (
    <section className="py-20 md:py-28 bg-[#101010] text-white relative overflow-hidden border-y border-[#1B1B1B]">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[300px] bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="space-y-12"
        >
          {/* Main Statement */}
          <div className="max-w-4xl border-l-4 border-[#D4AF37] pl-6 md:pl-8">
            <span className="text-xs uppercase tracking-widest font-semibold text-[#E8D18A] block mb-3">
              Strategic Executive Perspective
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium leading-[1.18] text-white tracking-tight">
              A digital presence is no longer just about having an address online.{" "}
              <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#E8D18A] to-[#D4AF37]">
                It is about establishing enduring institutional authority and commercial scale.
              </span>
            </h2>
          </div>

          {/* 3 Pillars of Delivery */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-white/10">
            <div className="p-7 rounded-2xl bg-[#1B1B1B] border border-white/10 hover:border-[#D4AF37]/50 shadow-md hover:shadow-xl transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shadow-2xs group-hover:scale-105 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-[#E8D18A] transition-colors">
                Architectural Precision
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                We engineer with Next.js App Router, TypeScript, and distributed edge networks to ensure sub-second latency, zero code bloat, and 100% Core Web Vitals.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-[#1B1B1B] border border-white/10 hover:border-[#D4AF37]/50 shadow-md hover:shadow-xl transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shadow-2xs group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-[#E8D18A] transition-colors">
                Institutional Security
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                Hardened against cyber threats with strict Content Security Policies, HSTS encryption, and sanitized data pipelines that safeguard client information.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-[#1B1B1B] border border-white/10 hover:border-[#D4AF37]/50 shadow-md hover:shadow-xl transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shadow-2xs group-hover:scale-105 transition-transform">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-[#E8D18A] transition-colors">
                Measurable Business ROI
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                Every interface, SEO strategy, and media campaign is built around tangible unit economics — driving verified leads, appointments, and commercial growth.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
