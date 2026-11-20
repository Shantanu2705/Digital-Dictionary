"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, ShieldCheck, Zap, Award, CheckCircle2, ChevronRight, Lock, TrendingUp, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative w-full min-h-[92vh] flex flex-col justify-center items-center overflow-hidden bg-gradient-to-b from-[#F5EFE1] via-[#EFE5D1] to-[#E6DAC0] pt-28 pb-16 md:pt-36 md:pb-20">
      {/* High-Impact Vibrant Ambient Mesh Lighting (Sapphire Blue + Imperial Gold + Forest Emerald) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[500px] bg-gradient-to-r from-amber-500/35 via-[#D4AF37]/40 to-yellow-500/35 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute top-10 right-[-5%] w-[550px] h-[550px] bg-gradient-to-br from-blue-600/30 via-indigo-600/25 to-sky-500/25 rounded-full blur-[110px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-[-5%] w-[520px] h-[520px] bg-gradient-to-tr from-emerald-600/25 via-teal-500/20 to-amber-500/25 rounded-full blur-[110px] pointer-events-none -z-10" />

      {/* Modern, precise corporate background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000d_1px,transparent_1px),linear-gradient(to_bottom,#0000000d_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_45%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      <div className="container mx-auto px-6 md:px-12 flex flex-col items-center text-center relative z-10 max-w-6xl pt-2">
        
        {/* Executive Headline (Sentence/Title case like Goldman Sachs / Microsoft) */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] leading-[1.12] tracking-tight font-serif font-medium text-slate-900 mb-5 max-w-4xl"
        >
          Enterprise Digital Solutions &amp; <br />
          <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-[#8C6A16] via-[#B8860B] to-[#C5A059]">
            Strategic Web Engineering.
          </span>
        </motion.h1>

        {/* Executive Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl font-normal text-slate-700 mb-8 max-w-3xl leading-relaxed"
        >
          Digital Dictionary partners with ambitious companies, healthcare institutions, and regional leaders to engineer secure, sub-second web platforms, custom software architectures, and scalable digital marketing engines.
        </motion.p>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-10"
        >
          <Link
            href="/contact"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#0B1528] hover:bg-[#111F38] text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 border-2 border-[#D4AF37] shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] group"
          >
            <span>Schedule a Strategy Consultation</span>
            <ArrowUpRight className="w-4 h-4 text-[#DFB76C] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>

          <Link 
            href="/portfolio" 
            className="w-full sm:w-auto px-8 py-3.5 rounded-full border-2 border-[#C5A059] bg-white/95 hover:bg-[#FAF8F3] text-slate-900 font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-xs hover:shadow-md"
          >
            <span>Explore Case Studies</span>
            <ChevronRight className="w-4 h-4 text-[#8C6A16]" />
          </Link>
        </motion.div>

        {/* 3-CARD EXECUTIVE CAPABILITY SHOWCASE DECK (PROMINENTLY VISIBLE IN VIEWPORT) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-left"
        >
          {/* Deck Card 1: Web Platforms */}
          <Link
            href="/web-development"
            className="group relative rounded-2xl overflow-hidden bg-white border border-[#D5C7A3] hover:border-blue-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1.5"
          >
            <div className="relative h-44 w-full overflow-hidden bg-slate-100">
              <Image
                src="/webdev_hero.jpg"
                alt="Web Engineering Platform"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/95 text-white text-[11px] font-bold shadow-sm backdrop-blur-xs">
                  <Zap className="w-3 h-3" />
                  100/100 Core Web Vitals
                </span>
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between bg-gradient-to-b from-white to-[#FAF6EE]">
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-blue-700 block mb-1">
                  High-Speed Engineering
                </span>
                <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-blue-700 transition-colors">
                  Next.js 16 Web Platforms
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  Sub-second page transitions, server-side rendering, and zero layout shift architectures.
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-[#E8DFC8] flex items-center justify-between text-xs font-semibold text-blue-700">
                <span>View Architecture</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Deck Card 2: Enterprise Software (ELEVATED & GOLD HIGHLIGHTED) */}
          <Link
            href="/software-development"
            className="group relative rounded-2xl overflow-hidden bg-white border-2 border-[#C5A059] shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col md:-translate-y-2 hover:-translate-y-3 ring-4 ring-[#C5A059]/15"
          >
            <div className="relative h-44 w-full overflow-hidden bg-slate-100">
              <Image
                src="/software_hero.jpg"
                alt="Enterprise Software Systems"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/95 text-white text-[11px] font-bold shadow-sm backdrop-blur-xs">
                  <Lock className="w-3 h-3" />
                  Zero-Vulnerability Hardened
                </span>
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between bg-gradient-to-b from-white to-[#FAF4E6]">
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#8C6A16] block mb-1">
                  Enterprise Cloud &amp; CRM
                </span>
                <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-[#8C6A16] transition-colors">
                  Custom Software Architectures
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  Tailored workflow engines, SaaS platforms, and secure multi-tenant cloud backends.
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-[#E8DFC8] flex items-center justify-between text-xs font-semibold text-[#8C6A16]">
                <span>Explore Capabilities</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Deck Card 3: Performance Marketing */}
          <Link
            href="/digital-marketing"
            className="group relative rounded-2xl overflow-hidden bg-white border border-[#D5C7A3] hover:border-indigo-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1.5"
          >
            <div className="relative h-44 w-full overflow-hidden bg-slate-100">
              <Image
                src="/marketing_hero.jpg"
                alt="Performance Marketing Engine"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-600/95 text-white text-[11px] font-bold shadow-sm backdrop-blur-xs">
                  <TrendingUp className="w-3 h-3" />
                  High-Conversion ROAS
                </span>
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between bg-gradient-to-b from-white to-[#FAF6EE]">
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-indigo-700 block mb-1">
                  Growth &amp; Search Domination
                </span>
                <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-indigo-700 transition-colors">
                  Performance Marketing Engines
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  Full-funnel Google and Meta campaigns backed by conversion tracking and algorithmic SEO.
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-[#E8DFC8] flex items-center justify-between text-xs font-semibold text-indigo-700">
                <span>View Growth Framework</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Institutional Trust Strip with Multi-Color Accents */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t-2 border-[#D5C7A3]"
        >
          <div className="flex flex-col items-center md:items-start p-4 rounded-xl bg-white border border-[#D5C7A3] shadow-xs">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm md:text-base">
              <div className="w-7 h-7 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0">
                <Award className="w-4 h-4" />
              </div>
              Govt. MSME
            </div>
            <span className="text-xs text-slate-600 mt-2 font-medium text-center md:text-left">
              Reg. UDYAM-WB-10-0098465
            </span>
          </div>

          <div className="flex flex-col items-center md:items-start p-4 rounded-xl bg-white border border-[#D5C7A3] shadow-xs">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm md:text-base">
              <div className="w-7 h-7 rounded-lg bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-700 shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              Sub-Second Speed
            </div>
            <span className="text-xs text-slate-600 mt-2 font-medium text-center md:text-left">
              Next.js 16 Edge Architecture
            </span>
          </div>

          <div className="flex flex-col items-center md:items-start p-4 rounded-xl bg-white border border-[#D5C7A3] shadow-xs">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm md:text-base">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              100% Hardened
            </div>
            <span className="text-xs text-slate-600 mt-2 font-medium text-center md:text-left">
              Strict CSP &amp; HSTS Security
            </span>
          </div>

          <div className="flex flex-col items-center md:items-start p-4 rounded-xl bg-white border border-[#D5C7A3] shadow-xs">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm md:text-base">
              <div className="w-7 h-7 rounded-lg bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-700 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              Siliguri Studio
            </div>
            <span className="text-xs text-slate-600 mt-2 font-medium text-center md:text-left">
              Direct Engineering Delivery
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}