"use client";

import { motion } from "framer-motion";
import { PremiumButton } from "@/components/PremiumButton";
import { DynamicTextColor } from "@/components/DynamicTextColor";

export function HeroSection() {
  return (
    <section className="relative w-full h-screen min-h-[800px] flex flex-col justify-between overflow-hidden bg-transparent pt-32 pb-12 md:pt-40 md:pb-20">
      
      {/* Top Tag */}
      <div className="container px-6 md:px-12 w-full flex justify-center md:justify-start">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-block px-5 py-1.5 rounded-full border border-luxury-gold/50 bg-white shadow-sm">
            <DynamicTextColor as="span" className="text-[10px] tracking-[0.3em] uppercase font-bold">
              Premium Digital Agency
            </DynamicTextColor>
          </div>
        </motion.div>
      </div>

      {/* Bottom Content - Pushed below the central logo */}
      <div className="container px-6 md:px-12 w-full mt-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="flex flex-col md:flex-row items-end justify-between gap-10"
        >
          {/* Left Side: Elegant, smaller typography */}
          <div className="max-w-2xl text-left">
            <DynamicTextColor as={motion.h1} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight font-serif font-medium mb-6">
              We build <span className="italic font-light">digital</span> experiences that move business forward.
            </DynamicTextColor>

            <DynamicTextColor as={motion.p} className="text-sm md:text-base font-semibold tracking-wider uppercase max-w-md opacity-80">
              Technology &middot; Design &middot; Marketing
            </DynamicTextColor>
          </div>

          {/* Right Side: CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <PremiumButton href="/contact" withArrow className="px-6 py-2.5">
              Start a Project
            </PremiumButton>
            
            <PremiumButton href="/portfolio" className="bg-none px-6 py-2.5">
              Our Work
            </PremiumButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
