"use client";

import { motion } from "framer-motion";
import { PremiumButton } from "@/components/PremiumButton";
import { DynamicTextColor } from "@/components/DynamicTextColor";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden mx-4 md:mx-12 my-32 py-32 bg-transparent">
      
      {/* Decorative frame */}
      <div className="absolute inset-0 border border-luxury-gold/30 rounded-[3rem] pointer-events-none z-0" />
      <div className="absolute inset-4 border border-luxury-gold/10 rounded-[2.5rem] pointer-events-none z-0" />

      <div className="container relative z-10 mx-auto px-6 md:px-12 flex flex-col items-center text-center text-off-white pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl pointer-events-auto"
        >
          <DynamicTextColor as={motion.h2} className="text-6xl md:text-8xl lg:text-[110px] leading-[1.0] font-bold tracking-tighter mb-10 uppercase drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]">
            Let&apos;s build something <br />
            <span className="font-serif italic font-light relative text-charcoal">
              worth remembering.
              <svg className="absolute -bottom-4 left-0 w-full drop-shadow-[0_4px_10px_rgba(212,175,55,0.5)]" viewBox="0 0 200 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 6C65.5 -1.5 138.5 -1.5 198 6" stroke="#D4AF37" strokeWidth="4" strokeLinecap="square"/>
              </svg>
            </span>
          </DynamicTextColor>
          
          <DynamicTextColor as={motion.p} className="text-2xl mb-16 max-w-3xl mx-auto font-bold tracking-wide drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
            Ready to elevate your digital presence? We&apos;re currently accepting new projects. Let&apos;s discuss how we can help you scale.
          </DynamicTextColor>
          
          <PremiumButton href="/contact" withArrow>
            Start Your Project
          </PremiumButton>
        </motion.div>
      </div>
    </section>
  );
}
