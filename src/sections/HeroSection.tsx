"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, ShieldCheck, Zap, Award, CheckCircle2, ChevronRight, Lock, TrendingUp } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative w-full min-h-[90vh] flex flex-col justify-center items-center overflow-hidden bg-[#FAFAF8] pt-28 pb-16 md:pt-36 md:pb-20 border-b border-[#E5E5E2]">
      {/* Strategic Ambient Mesh Glow (Champagne Gold Refinement) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] bg-gradient-to-r from-[#D4AF37]/15 via-[#E8D18A]/20 to-[#A67C22]/15 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-12 right-[-5%] w-[450px] h-[450px] bg-[#E8D18A]/10 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-[-5%] w-[450px] h-[450px] bg-[#D4AF37]/10 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* Modern corporate background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_45%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      <div className="container mx-auto px-6 md:px-12 flex flex-col items-center text-center relative z-10 max-w-6xl pt-2">
        
        {/* Executive Headline (No redundant badge - leads directly with commanding authority) */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] leading-[1.12] tracking-tight font-serif font-medium text-[#101010] mb-5 max-w-4xl"
        >
          Enterprise Digital Solutions &amp; <br />
          <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-[#A67C22] via-[#D4AF37] to-[#A67C22]">
            Strategic Web Engineering.
          </span>
        </motion.h1>

        {/* Executive Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl font-normal text-[#1B1B1B]/80 mb-8 max-w-3xl leading-relaxed"
        >
          Digital Dictionary partners with ambitious companies, healthcare institutions, and regional leaders to engineer secure, sub-second web platforms, custom software architectures, and scalable digital marketing engines.
        </motion.p>

        {/* Action Buttons (Strategic Gold Primary & Minimal Corporate Secondary) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-10"
        >
          <Link
            href="/contact"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#E8D18A] to-[#A67C22] hover:from-[#A67C22] hover:to-[#D4AF37] text-[#101010] font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 border border-[#E8D18A]/60 shadow-sm hover:shadow-[0_4px_20px_rgba(212,175,55,0.3)] hover:scale-[1.01] active:scale-[0.99] group"
          >
            <span>Schedule a Strategy Consultation</span>
            <ArrowUpRight className="w-4 h-4 text-[#101010] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>

          <Link 
            href="/portfolio" 
            className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-[#E5E5E2] bg-white hover:bg-[#F2F2F0] text-[#101010] hover:border-[#D4AF37] font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-xs hover:shadow-sm"
          >
            <span>Explore Case Studies</span>
            <ChevronRight className="w-4 h-4 text-[#A67C22]" />
          </Link>
        </motion.div>

        {/* 3-CARD EXECUTIVE CAPABILITY SHOWCASE DECK */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-left"
        >
          {/* Deck Card 1: Web Platforms */}
          <Link
            href="/web-development"
            className="group relative rounded-2xl overflow-hidden bg-white border border-[#E5E5E2] hover:border-[#D4AF37] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1.5"
          >
            <div className="relative h-44 w-full overflow-hidden bg-[#F2F2F0]">
              <Image
                src="/webdev_hero.jpg"
                alt="Web Engineering Platform"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#101010]/90 text-[#E8D18A] border border-[#D4AF37]/30 text-[11px] font-bold shadow-sm backdrop-blur-xs">
                  <Zap className="w-3 h-3 text-[#D4AF37]" />
                  100/100 Core Web Vitals
                </span>
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between bg-white">
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#A67C22] block mb-1">
                  High-Speed Engineering
                </span>
                <h3 className="text-base font-bold text-[#101010] mb-1 group-hover:text-[#A67C22] transition-colors">
                  Next.js 16 Web Platforms
                </h3>
                <p className="text-xs text-[#777777] line-clamp-2 leading-relaxed">
                  Sub-second page transitions, server-side rendering, and zero layout shift architectures.
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-[#E5E5E2] flex items-center justify-between text-xs font-semibold text-[#101010] group-hover:text-[#A67C22]">
                <span>View Architecture</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Deck Card 2: Enterprise Software (ELEVATED & GOLD HIGHLIGHTED) */}
          <Link
            href="/software-development"
            className="group relative rounded-2xl overflow-hidden bg-white border-2 border-[#D4AF37] shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col md:-translate-y-2 hover:-translate-y-3 ring-4 ring-[#D4AF37]/15"
          >
            <div className="relative h-44 w-full overflow-hidden bg-[#F2F2F0]">
              <Image
                src="/software_hero.jpg"
                alt="Enterprise Software Systems"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37] text-[#101010] text-[11px] font-bold shadow-sm backdrop-blur-xs">
                  <Lock className="w-3 h-3 text-[#101010]" />
                  Zero-Vulnerability Hardened
                </span>
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between bg-white">
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#A67C22] block mb-1">
                  Enterprise Cloud &amp; CRM
                </span>
                <h3 className="text-base font-bold text-[#101010] mb-1 group-hover:text-[#A67C22] transition-colors">
                  Custom Software Architectures
                </h3>
                <p className="text-xs text-[#777777] line-clamp-2 leading-relaxed">
                  Tailored workflow engines, SaaS platforms, and secure multi-tenant cloud backends.
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-[#E5E5E2] flex items-center justify-between text-xs font-semibold text-[#A67C22]">
                <span>Explore Capabilities</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Deck Card 3: Performance Marketing */}
          <Link
            href="/digital-marketing"
            className="group relative rounded-2xl overflow-hidden bg-white border border-[#E5E5E2] hover:border-[#D4AF37] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1.5"
          >
            <div className="relative h-44 w-full overflow-hidden bg-[#F2F2F0]">
              <Image
                src="/marketing_hero.jpg"
                alt="Performance Marketing Engine"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#101010]/90 text-[#E8D18A] border border-[#D4AF37]/30 text-[11px] font-bold shadow-sm backdrop-blur-xs">
                  <TrendingUp className="w-3 h-3 text-[#D4AF37]" />
                  High-Conversion ROAS
                </span>
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between bg-white">
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#A67C22] block mb-1">
                  Growth &amp; Search Domination
                </span>
                <h3 className="text-base font-bold text-[#101010] mb-1 group-hover:text-[#A67C22] transition-colors">
                  Performance Marketing Engines
                </h3>
                <p className="text-xs text-[#777777] line-clamp-2 leading-relaxed">
                  Full-funnel Google and Meta campaigns backed by conversion tracking and algorithmic SEO.
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-[#E5E5E2] flex items-center justify-between text-xs font-semibold text-[#101010] group-hover:text-[#A67C22]">
                <span>View Growth Framework</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Institutional Trust Strip */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-[#E5E5E2]"
        >
          <div className="flex flex-col items-center md:items-start p-4 rounded-xl bg-white border border-[#E5E5E2] shadow-2xs">
            <div className="flex items-center gap-2 text-[#101010] font-bold text-sm md:text-base">
              <div className="w-7 h-7 rounded-lg bg-[#F2F2F0] border border-[#E5E5E2] flex items-center justify-center text-[#A67C22] shrink-0">
                <Award className="w-4 h-4" />
              </div>
              Govt. MSME
            </div>
            <span className="text-xs text-[#777777] mt-2 font-medium text-center md:text-left">
              Reg. UDYAM-WB-10-0098465
            </span>
          </div>

          <div className="flex flex-col items-center md:items-start p-4 rounded-xl bg-white border border-[#E5E5E2] shadow-2xs">
            <div className="flex items-center gap-2 text-[#101010] font-bold text-sm md:text-base">
              <div className="w-7 h-7 rounded-lg bg-[#F2F2F0] border border-[#E5E5E2] flex items-center justify-center text-[#A67C22] shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              Sub-Second Speed
            </div>
            <span className="text-xs text-[#777777] mt-2 font-medium text-center md:text-left">
              Next.js 16 Edge Architecture
            </span>
          </div>

          <div className="flex flex-col items-center md:items-start p-4 rounded-xl bg-white border border-[#E5E5E2] shadow-2xs">
            <div className="flex items-center gap-2 text-[#101010] font-bold text-sm md:text-base">
              <div className="w-7 h-7 rounded-lg bg-[#F2F2F0] border border-[#E5E5E2] flex items-center justify-center text-[#A67C22] shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              100% Hardened
            </div>
            <span className="text-xs text-[#777777] mt-2 font-medium text-center md:text-left">
              Strict CSP &amp; HSTS Security
            </span>
          </div>

          <div className="flex flex-col items-center md:items-start p-4 rounded-xl bg-white border border-[#E5E5E2] shadow-2xs">
            <div className="flex items-center gap-2 text-[#101010] font-bold text-sm md:text-base">
              <div className="w-7 h-7 rounded-lg bg-[#F2F2F0] border border-[#E5E5E2] flex items-center justify-center text-[#A67C22] shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              Siliguri Studio
            </div>
            <span className="text-xs text-[#777777] mt-2 font-medium text-center md:text-left">
              Direct Engineering Delivery
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
