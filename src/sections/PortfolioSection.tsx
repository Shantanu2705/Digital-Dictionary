"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { motion } from "framer-motion";

const PROJECTS = [
  { id: 1, title: "Himalayan Vintage Holidays", category: "Travel", size: "large", image: "project1.jpeg" },
  { id: 2, title: "Mahakal Bus Services", category: "Travel", size: "small", image: "project2.jpeg" },
  { id: 3, title: "Whistling Wind Resort", category: "Hospitality", size: "small", image: "project3.jpeg" },
  { id: 4, title: "Quick Trip Now", category: "Travel", size: "large", image: "project4.jpeg" },
  { id: 5, title: "Etripzo", category: "Travel", size: "small", image: "project5.jpeg" },
  { id: 6, title: "Take a Trip Make Memories", category: "Travel", size: "small", image: "project6.jpeg" },
  { id: 7, title: "Siliguri Institute of Nursing", category: "Brand Identity", size: "large", image: "project7.jpeg" },
  { id: 8, title: "IBL 3X3 LEAGUE", category: "Sports", size: "small", image: "WhatsApp Image 2026-08-22 at 21.36.32.jpeg" },
  { id: 9, title: "Gajagamini Forest Resort", category: "Travel", size: "small", image: "project8.jpeg" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5 } }
};

export function PortfolioSection() {
  return (
    <section className="py-32 bg-background relative">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8"
        >
          <div>
            <h2 className="text-[12px] uppercase tracking-widest text-luxury-gold mb-4 font-medium">Selected Work</h2>
            <h3 className="text-4xl md:text-5xl font-medium text-charcoal tracking-tighter">
              Recent work we&apos;re <br />
              <span className="font-serif italic text-luxury-gold">proud of:</span>
            </h3>
          </div>
          <Link 
            href="/portfolio" 
            className="text-sm font-medium uppercase tracking-wider text-gray-600 hover:text-charcoal transition-colors pb-2 border-b border-gray-400 hover:border-luxury-gold"
          >
            View All Projects
          </Link>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {PROJECTS.map((project) => (
            <motion.div
              variants={itemVariants}
              key={project.id}
              className={cn(
                "group relative block overflow-hidden rounded-3xl bg-white border border-border/50",
                project.size === "large" ? "md:col-span-2 md:row-span-2 h-[400px] md:h-[624px]" : "h-[300px]"
              )}
            >
              {/* Project Image */}
              <div className="absolute inset-0 bg-white flex items-center justify-center overflow-hidden transition-transform duration-700 group-hover:scale-105">
                <div className="relative w-full h-full p-8 md:p-12">
                  <Image
                    src={`/clients/${project.image}`}
                    alt={project.title}
                    fill
                    className="object-contain p-4"
                  />
                </div>
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Content */}
              <div className="absolute inset-0 p-4 flex flex-col justify-end translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-10">
                <p className="text-luxury-gold text-[10px] font-bold tracking-widest uppercase mb-1">
                  {project.category}
                </p>
                <h4 className="text-sm md:text-base font-medium text-white leading-snug mb-3">
                  {project.title}
                </h4>
                <div className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:bg-luxury-gold transition-colors">
                  <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
