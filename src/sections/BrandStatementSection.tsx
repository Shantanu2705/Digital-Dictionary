"use client";

import { motion } from "framer-motion";

export function BrandStatementSection() {
  return (
    <section className="py-32 md:py-48 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto w-full"
        >
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif font-medium leading-[1.1] text-charcoal tracking-tighter">
              Digital presence is no longer just about being online.{" "}
              <span className="text-luxury-gold">
                It&apos;s about being impossible to ignore.
              </span>
            </h2>
            
            <div className="mt-16 max-w-2xl ml-auto">
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-light">
                Digital Dictionary helps businesses build authority, generate opportunities, and scale through intelligent technology, bespoke design, and data-driven digital marketing.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Decorative large D */}
      <div className="absolute -left-20 top-1/2 -translate-y-1/2 text-[40vw] font-serif font-bold text-luxury-gold/5 pointer-events-none select-none z-0">
        D
      </div>
    </section>
  );
}
