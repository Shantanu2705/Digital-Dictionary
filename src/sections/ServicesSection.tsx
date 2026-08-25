"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
    <section className="py-20 md:py-24 bg-background relative" id="services">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8"
        >
          <div>
            <h2 className="text-[12px] uppercase tracking-widest text-luxury-gold mb-4 font-medium">What We Do</h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-serif text-charcoal tracking-tighter">
              Bespoke Digital <span className="italic text-luxury-gold">Solutions</span>
            </h3>
          </div>
          <Link href="/services" className="text-gray-600 hover:text-charcoal transition-colors flex items-center gap-2 text-sm font-medium">
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
                "group relative border border-border rounded-3xl p-6 md:p-8 bg-card hover:bg-card/50 transition-colors overflow-hidden flex flex-col justify-between h-full",
                service.span
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="flex justify-between items-start mb-8 relative z-10">
                <span className="text-sm font-serif text-luxury-gold/50 font-bold group-hover:text-luxury-gold transition-colors">
                  {service.id}
                </span>
                <Link href={service.href} className="w-12 h-12 rounded-full border border-border bg-white/50 flex items-center justify-center group-hover:border-luxury-gold group-hover:bg-luxury-gold group-hover:text-white text-gray-600 transition-all duration-300 backdrop-blur-sm -mr-2 -mt-2">
                  <ArrowUpRight className="w-5 h-5" />
                </Link>
              </div>
              
              <div className="relative z-10 mt-auto">
                <h3 className="text-2xl font-medium tracking-tight text-charcoal mb-3 group-hover:text-luxury-gold transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 font-light leading-relaxed max-w-md">
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
