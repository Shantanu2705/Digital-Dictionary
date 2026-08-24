"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative w-full h-screen min-h-[800px] flex items-center justify-center overflow-hidden bg-background pt-20">
      {/* Static Background Decorative Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] rounded-full bg-luxury-gold/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[50vw] h-[50vw] rounded-full bg-luxury-gold/5 blur-[150px]" />
      </div>

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.2] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '4rem 4rem',
        }}
      />

      <div className="container relative z-10 px-6 md:px-12 w-full flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-[1100px] mx-auto"
        >
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-luxury-gold/30 bg-card backdrop-blur-sm shadow-sm">
            <span className="text-luxury-gold text-sm tracking-widest uppercase font-bold">Premium Digital Agency</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-[100px] leading-[1.05] tracking-tighter font-serif font-medium text-charcoal mb-8">
            WE BUILD <span className="italic text-luxury-gold relative">DIGITAL</span><br />
            EXPERIENCES THAT<br />
            MOVE BUSINESS <span className="relative">
              FORWARD.
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 6C65.5 -1.5 138.5 -1.5 198 6" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-12">
            We help businesses establish a powerful digital presence, generate leads, and scale through technology, design, and marketing.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/contact" className="group relative px-8 py-4 bg-charcoal text-white rounded-full overflow-hidden hover:bg-luxury-gold transition-colors font-bold shadow-md">
              Start a Project &rarr;
            </Link>
            
            <Link href="/portfolio" className="group flex items-center gap-2 text-gray-600 font-medium hover:text-luxury-gold transition-colors">
              <span className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:border-luxury-gold transition-colors bg-card shadow-sm">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 11L11 1M11 1H3.5M11 1V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              View Our Work
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
