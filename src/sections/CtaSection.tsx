"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden rounded-[40px] mx-4 md:mx-12 my-24 bg-card/50 backdrop-blur-xl border border-border/50 py-32">
      {/* Decorative Elements */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-luxury-gold to-transparent blur-[120px]" />
        <div className="absolute -bottom-1/2 -left-1/4 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black/5 to-transparent blur-[120px]" />
      </div>

      <div className="container relative z-10 mx-auto px-6 md:px-12 flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <h2 className="text-5xl md:text-7xl lg:text-[90px] leading-[1.05] font-medium tracking-tighter mb-8 text-charcoal">
            Let&apos;s build something <br />
            <span className="font-serif italic text-luxury-gold relative">
              worth remembering.
              <svg className="absolute -bottom-2 left-0 w-full opacity-50" viewBox="0 0 200 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 6C65.5 -1.5 138.5 -1.5 198 6" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto font-light">
            Ready to elevate your digital presence? We&apos;re currently accepting new projects. Let&apos;s discuss how we can help you scale.
          </p>
          
          <Link 
            href="/contact" 
            className="group relative inline-flex items-center justify-center gap-4 bg-charcoal text-white px-10 py-5 rounded-full text-lg font-bold overflow-hidden transition-all hover:bg-luxury-gold hover:text-black shadow-[0_0_40px_rgba(0,0,0,0.1)] hover:shadow-[0_0_40px_rgba(212,175,55,0.3)]"
          >
            <span className="relative z-10">Start Your Project</span>
            <span className="relative z-10 w-10 h-10 rounded-full border border-white/20 group-hover:border-black/30 flex items-center justify-center bg-white/10 group-hover:bg-black/5">
              <ArrowUpRight className="w-5 h-5" />
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
