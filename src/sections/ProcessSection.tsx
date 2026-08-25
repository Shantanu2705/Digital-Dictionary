"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const PROCESS = [
  { id: "01", title: "DISCOVER", desc: "Understand the business, the audience, and the objective." },
  { id: "02", title: "STRATEGIZE", desc: "Create the digital roadmap and architecture." },
  { id: "03", title: "DESIGN", desc: "Turn strategy into an unforgettable visual experience." },
  { id: "04", title: "BUILD", desc: "Engineer the solution with scalable, modern technology." },
  { id: "05", title: "LAUNCH", desc: "Deploy seamlessly and ensure flawless performance." },
  { id: "06", title: "GROW", desc: "Optimize continuously to compound results." },
];

export function ProcessSection() {
  return (
    <section className="py-20 md:py-24 bg-background relative">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24 text-center"
        >
          <h2 className="text-[12px] uppercase tracking-widest text-luxury-gold mb-4 font-medium">How We Work</h2>
          <h3 className="text-4xl md:text-5xl font-medium text-charcoal tracking-tighter">
            A proven methodology for <span className="font-serif italic text-luxury-gold">digital dominance.</span>
          </h3>
        </motion.div>

        <div className="max-w-4xl mx-auto relative">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[1px] bg-border -translate-x-1/2" />

          <div className="flex flex-col gap-16 md:gap-24">
            {PROCESS.map((step, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  key={step.id} 
                  className="relative flex flex-col md:flex-row items-center justify-between w-full group"
                >
                  {/* Left Side */}
                  <div className={cn(
                    "w-full md:w-[45%] pl-20 md:pl-0",
                    isEven ? "md:text-right md:pr-12" : "md:order-2 md:pl-12"
                  )}>
                    <div className="bg-card/50 backdrop-blur-sm border border-border p-8 rounded-3xl group-hover:border-luxury-gold/50 transition-colors">
                      <h4 className="text-2xl md:text-3xl font-medium text-charcoal mb-4 tracking-tight">
                        <span className="text-luxury-gold font-serif text-sm mr-4 md:hidden">{step.id}</span>
                        {step.title}
                      </h4>
                      <p className="text-gray-600 text-lg leading-relaxed font-light">
                        {step.desc}
                      </p>
                    </div>
                  </div>

                  {/* Center Node */}
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-card border-2 border-luxury-gold/30 flex items-center justify-center z-10 hidden md:flex group-hover:border-luxury-gold group-hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all">
                    <span className="font-serif text-luxury-gold text-xl">{step.id}</span>
                  </div>

                  {/* Right Side Empty for flex balance */}
                  <div className={cn(
                    "hidden md:block w-[45%]",
                    isEven ? "order-2" : ""
                  )} />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
