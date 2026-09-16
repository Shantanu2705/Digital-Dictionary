"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { DynamicTextColor } from "@/components/DynamicTextColor";

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
    <section className="py-20 md:py-32 bg-transparent relative">
      <div className="container mx-auto px-6 md:px-12 relative z-10 text-off-white">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-32 text-center"
        >
          <DynamicTextColor as={motion.h2} className="text-sm uppercase tracking-[0.2em] font-bold border-b-2 border-luxury-gold pb-2 inline-block mb-6">How We Work</DynamicTextColor>
          <DynamicTextColor as={motion.h3} className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter uppercase drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
            A proven methodology for <span className="font-serif italic font-light text-charcoal">digital dominance.</span>
          </DynamicTextColor>
        </motion.div>

        <div className="max-w-5xl mx-auto relative">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-luxury-gold/30 -translate-x-1/2" />

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
                    isEven ? "md:text-right md:pr-16" : "md:order-2 md:pl-16"
                  )}>
                    <div className="bg-transparent border border-luxury-gold/30 p-10 group-hover:bg-white/5 transition-all rounded-[2rem] shadow-[0_8px_30px_rgba(212,175,55,0.05)] hover:shadow-[0_15px_40px_rgba(212,175,55,0.2)] hover:-translate-y-2 duration-300 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <div className="relative z-10">
                        <h4 className="text-3xl md:text-4xl font-bold text-charcoal mb-6 tracking-tight uppercase drop-shadow-[0_1px_1px_rgba(255,255,255,1)]">
                          <span className="font-serif text-lg mr-4 md:hidden text-charcoal">{step.id}</span>
                          {step.title}
                        </h4>
                        <p className="text-gray-800 text-lg leading-relaxed font-bold drop-shadow-[0_1px_1px_rgba(255,255,255,1)]">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Center Node */}
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-20 h-20 bg-white border-[3px] border-luxury-gold flex items-center justify-center z-10 hidden md:flex shadow-[0_4px_15px_rgba(212,175,55,0.3)] group-hover:shadow-[0_8px_25px_rgba(212,175,55,0.5)] transition-all rounded-full group-hover:scale-110">
                    <span className="font-serif font-bold text-charcoal text-2xl group-hover:text-charcoal transition-colors">{step.id}</span>
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
