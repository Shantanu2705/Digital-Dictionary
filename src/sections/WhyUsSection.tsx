"use client";

import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const PILLARS = [
  {
    title: "Uncompromising Quality",
    desc: "We don't do templates or half-measures. Every line of code and every pixel is crafted for excellence.",
  },
  {
    title: "Strategic Execution",
    desc: "Beautiful design means nothing if it doesn't perform. We build systems that drive measurable ROI.",
  },
  {
    title: "Scalable Technology",
    desc: "Our architectures are built for the future. You won't outgrow the platforms we engineer.",
  },
  {
    title: "Premium Partnership",
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
    <section className="py-20 md:py-24 bg-background relative overflow-hidden">
      {/* Subtle Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] bg-luxury-gold/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row gap-16 md:gap-8 items-center">
          {/* Left: Statement */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="w-full md:w-1/2"
          >
            <h2 className="text-[12px] uppercase tracking-widest text-luxury-gold mb-6 font-medium">Why Digital Dictionary</h2>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-[1.1] mb-8 text-charcoal">
              We build the <span className="font-serif italic text-luxury-gold">standard,</span> not the alternative.
            </h3>
            <p className="text-gray-600 text-lg max-w-md font-light leading-relaxed">
              In a crowded market of agencies offering generic solutions, we chose to be the premium outlier.
            </p>
          </motion.div>

          {/* Right: Pillars Grid */}
          <div className="w-full md:w-1/2">
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
                  className="bg-card/80 backdrop-blur-sm border border-border hover:border-luxury-gold/50 transition-colors rounded-[24px] p-8 flex flex-col justify-between"
                >
                  <CheckCircle2 className="w-8 h-8 text-luxury-gold mb-6 opacity-80" />
                  <div>
                    <h4 className="text-xl font-medium mb-3 text-charcoal tracking-tight">{pillar.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed font-light">
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
