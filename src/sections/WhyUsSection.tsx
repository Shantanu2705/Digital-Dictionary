"use client";

import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { DynamicTextColor } from "@/components/DynamicTextColor";

const PILLARS = [
  {
    title: "UNCOMPROMISING QUALITY",
    desc: "We don't do templates or half-measures. Every line of code and every pixel is crafted for excellence.",
  },
  {
    title: "STRATEGIC EXECUTION",
    desc: "Beautiful design means nothing if it doesn't perform. We build systems that drive measurable ROI.",
  },
  {
    title: "SCALABLE TECHNOLOGY",
    desc: "Our architectures are built for the future. You won't outgrow the platforms we engineer.",
  },
  {
    title: "PREMIUM PARTNERSHIP",
    desc: "We act as your extended digital team, providing proactive guidance, transparency, and elite support.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

export function WhyUsSection() {
  return (
    <section className="py-20 md:py-32 bg-transparent relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 md:gap-12 items-start">
          {/* Left: Statement */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2"
          >
            <DynamicTextColor as={motion.h2} className="text-sm uppercase tracking-[0.2em] font-bold border-b-2 border-luxury-gold pb-2 inline-block mb-10">Why Digital Dictionary</DynamicTextColor>
            <DynamicTextColor as={motion.h3} className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.0] mb-10 uppercase drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]">
              We build the <span className="font-serif italic font-light text-charcoal">standard,</span> not the alternative.
            </DynamicTextColor>
            <DynamicTextColor as={motion.p} className="text-xl max-w-md font-bold leading-relaxed tracking-wide drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
              In a crowded market of agencies offering generic solutions, we chose to be the premium outlier.
            </DynamicTextColor>
          </motion.div>

          {/* Right: Pillars Grid */}
          <div className="w-full lg:w-1/2">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              {PILLARS.map((pillar) => (
                <motion.div 
                  variants={itemVariants}
                  key={pillar.title} 
                  className="bg-white/10 border border-luxury-gold/30 rounded-[2rem] p-8 flex flex-col justify-between shadow-[0_8px_30px_rgba(212,175,55,0.05)] hover:shadow-[0_15px_40px_rgba(212,175,55,0.2)] hover:-translate-y-2 transition-all duration-500 overflow-hidden relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <CheckCircle2 className="w-8 h-8 text-charcoal mb-8 opacity-100 group-hover:scale-110 transition-transform duration-300" />
                    <h4 className="text-xl font-bold mb-4 text-charcoal tracking-tight uppercase leading-tight drop-shadow-[0_1px_1px_rgba(255,255,255,1)]">{pillar.title}</h4>
                    <p className="text-gray-800 text-sm leading-relaxed font-bold drop-shadow-[0_1px_1px_rgba(255,255,255,1)]">
                      {pillar.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
