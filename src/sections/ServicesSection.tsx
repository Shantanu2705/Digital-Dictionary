"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { DynamicTextColor } from "@/components/DynamicTextColor";

const SERVICES = [
  {
    id: "01",
    title: "DIGITAL MARKETING",
    description: "SEO, paid media, and content strategies that compound and drive measurable business outcomes. We focus on ROI-driven campaigns.",
    href: "/digital-marketing",
    span: "md:col-span-2 lg:col-span-2",
  },
  {
    id: "02",
    title: "WEB DEVELOPMENT",
    description: "Fast, scalable, and secure websites engineered for growth.",
    href: "/web-development",
    span: "md:col-span-1 lg:col-span-1",
  },
  {
    id: "03",
    title: "SOFTWARE DEV",
    description: "Custom digital platforms tailored to your operations.",
    href: "/software-development",
    span: "md:col-span-1 lg:col-span-1",
  },
  {
    id: "04",
    title: "eCOMMERCE",
    description: "High-converting storefronts built for scale and seamless transactions.",
    href: "/ecommerce-development",
    span: "md:col-span-2 lg:col-span-2",
  },
  {
    id: "05",
    title: "APP DEVELOPMENT",
    description: "Native and cross-platform mobile experiences.",
    href: "/app-development",
    span: "md:col-span-2 lg:col-span-1",
  },
  {
    id: "06",
    title: "BRAND IDENTITY",
    description: "Brand systems that feel intentional, premium, and distinctively yours.",
    href: "/graphics-designing",
    span: "md:col-span-1 lg:col-span-2",
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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export function ServicesSection() {
  return (
    <section className="py-20 md:py-32 bg-transparent relative" id="services">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8"
        >
          <div>
            <DynamicTextColor as={motion.h2} className="text-sm uppercase tracking-widest font-bold border-b-2 border-luxury-gold pb-2 inline-block mb-6">
              What We Do
            </DynamicTextColor>
            <DynamicTextColor as={motion.h3} className="text-5xl sm:text-6xl md:text-7xl font-serif tracking-tighter uppercase font-bold drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
              Bespoke Digital <span className="italic font-light text-charcoal">Solutions</span>
            </DynamicTextColor>
          </div>
          <Link href="/services" className="text-charcoal hover:text-off-white hover:bg-luxury-gold transition-colors flex items-center gap-2 text-sm font-bold border-2 border-luxury-gold px-6 py-3 uppercase tracking-widest bg-transparent rounded-full">
            View All Services <ArrowUpRight className="w-4 h-4" />
          </Link>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6"
        >
          {SERVICES.map((service) => (
            <motion.div 
              variants={itemVariants}
              key={service.id}
              className={cn(
                "group relative border border-luxury-gold/40 p-8 md:p-10 bg-white/10 hover:bg-white/20 transition-all flex flex-col justify-between h-full rounded-[2rem] shadow-[0_4px_30px_rgba(212,175,55,0.1)] hover:shadow-[0_10px_40px_rgba(212,175,55,0.3)] hover:-translate-y-2 duration-500 overflow-hidden",
                service.span
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="flex justify-between items-start mb-16 relative z-10">
                <span className="text-2xl font-serif text-soft-charcoal font-bold group-hover:text-charcoal transition-colors">
                  {service.id}
                </span>
                <Link href={service.href} className="w-12 h-12 border border-luxury-gold/50 rounded-full flex items-center justify-center group-hover:bg-luxury-gold text-charcoal group-hover:text-off-white transition-all duration-300 -mr-2 -mt-2 bg-white shadow-sm">
                  <ArrowUpRight className="w-5 h-5" />
                </Link>
              </div>
              
              <div className="relative z-10 mt-auto">
                <h3 className="text-2xl font-bold tracking-tight text-charcoal mb-4 uppercase drop-shadow-[0_1px_1px_rgba(255,255,255,1)]">
                  {service.title}
                </h3>
                <p className="text-gray-800 font-bold leading-relaxed max-w-md drop-shadow-[0_1px_1px_rgba(255,255,255,1)]">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
