"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Phone, Mail, MapPin, ChevronRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden mx-4 md:mx-12 my-20 py-20 md:py-24 bg-[#101010] text-white rounded-3xl border border-[#D4AF37]/30 shadow-2xl">
      {/* Radiant ambient glow in champagne gold */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[#D4AF37]/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-[#E8D18A]/5 rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* Subtle corporate microgrid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none -z-10" />

      <div className="container relative z-10 mx-auto px-6 md:px-12 flex flex-col items-center text-center max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs uppercase tracking-widest font-bold text-[#E8D18A] block mb-3">
            Start a Confidential Conversation
          </span>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-medium tracking-tight mb-6 text-white leading-[1.15]">
            Ready to Accelerate Your <br />
            <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#E8D18A] to-[#A67C22]">
              Digital Transformation?
            </span>
          </h2>
          
          <p className="text-base sm:text-lg mb-10 max-w-2xl mx-auto font-normal text-slate-300 leading-relaxed">
            Connect with our senior engineering team to discuss your project objectives, timeline, and architectural requirements. We respond with actionable next steps within 24 hours.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#E8D18A] to-[#A67C22] hover:from-[#A67C22] hover:to-[#D4AF37] text-[#101010] font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-[0_4px_25px_rgba(212,175,55,0.4)] hover:scale-[1.01] active:scale-[0.99] border border-[#E8D18A]/60 group"
            >
              <span>Schedule a Strategy Consultation</span>
              <ArrowUpRight className="w-4 h-4 text-[#101010] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>

            <Link
              href="/portfolio"
              className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 backdrop-blur-xs"
            >
              <span>Review Completed Projects</span>
              <ChevronRight className="w-4 h-4 text-[#E8D18A]" />
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-6 border-t border-white/10 text-xs text-slate-300 font-medium">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
              +91 62911 11428 / +91 62978 68104
            </span>
            <span>&middot;</span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
              admin07digitaldictionary@gmail.com
            </span>
            <span>&middot;</span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
              Siliguri, West Bengal
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
