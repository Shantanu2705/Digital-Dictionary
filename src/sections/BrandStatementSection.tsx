"use client";

import { motion } from "framer-motion";
import { DynamicTextColor } from "@/components/DynamicTextColor";

export function BrandStatementSection() {
  return (
    <section className="py-20 md:py-40 bg-transparent relative overflow-hidden pointer-events-none">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto w-full pointer-events-auto"
        >
          <div>
            <DynamicTextColor as={motion.h2} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-[1.0] tracking-tighter uppercase drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]">
              Digital presence is no longer just about being online.{" "}
              <span className="italic font-light text-charcoal">
                It&apos;s about being impossible to ignore.
              </span>
            </DynamicTextColor>
            
            <div className="mt-16 max-w-2xl ml-auto border-l-4 border-luxury-gold pl-8">
              <DynamicTextColor as={motion.p} className="text-xl md:text-2xl leading-relaxed font-bold tracking-wide drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
                Digital Dictionary helps businesses build authority, generate opportunities, and scale through intelligent technology, bespoke design, and data-driven digital marketing.
              </DynamicTextColor>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
