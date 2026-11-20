"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const CATEGORIES = [
  "All", 
  "Hospitality", 
  "Travel", 
  "Brand Identity", 
  "Retail",
  "Healthcare",
  "Sports",
  "Automotive"
];

const PROJECTS = [
  { id: 1, title: "Shivaay International", category: "Hospitality", size: "small", image: "WhatsApp Image 2026-08-22 at 21.01.07.jpeg" },
  { id: 2, title: "BAGDOGRA CAB SERVICE", category: "Travel", size: "small", image: "WhatsApp Image 2026-08-22 at 21.02.01.jpeg" },
  { id: 3, title: "Sneha Tour & Travels", category: "Travel", size: "small", image: "WhatsApp Image 2026-08-22 at 21.02.23.jpeg" },
  { id: 4, title: "ROYal SIKKIM", category: "Travel", size: "large", image: "WhatsApp Image 2026-08-22 at 21.03.03.jpeg" },
  { id: 5, title: "Premium Beauty Spa", category: "Brand Identity", size: "small", image: "WhatsApp Image 2026-08-22 at 21.04.17.jpeg" },
  { id: 6, title: "CT India Cosmetica", category: "Retail", size: "small", image: "WhatsApp Image 2026-08-22 at 21.05.25.jpeg" },
  { id: 7, title: "SIKKIM CABS", category: "Travel", size: "small", image: "WhatsApp Image 2026-08-22 at 21.06.46.jpeg" },
  { id: 8, title: "Ozzy Tours & Travels", category: "Travel", size: "large", image: "WhatsApp Image 2026-08-22 at 21.08.42.jpeg" },
  { id: 9, title: "SURE CURE", category: "Healthcare", size: "small", image: "WhatsApp Image 2026-08-22 at 21.11.06.jpeg" },
  { id: 10, title: "Polymummy Healthcare", category: "Healthcare", size: "small", image: "WhatsApp Image 2026-08-22 at 21.32.55.jpeg" },
  { id: 11, title: "KSO STAR", category: "Brand Identity", size: "small", image: "WhatsApp Image 2026-08-22 at 21.33.37.jpeg" },
  { id: 12, title: "IBL 3X3 LEAGUE", category: "Sports", size: "large", image: "WhatsApp Image 2026-08-22 at 21.36.32.jpeg" },
  { id: 13, title: "ashma", category: "Brand Identity", size: "small", image: "WhatsApp Image 2026-08-22 at 21.37.24.jpeg" },
  { id: 14, title: "BAGDOGRA BIKE RENTAL", category: "Automotive", size: "small", image: "WhatsApp Image 2026-08-22 at 21.40.33.jpeg" },
  { id: 15, title: "SADDIYATRA", category: "Travel", size: "small", image: "WhatsApp Image 2026-08-22 at 21.51.35.jpeg" },
  { id: 16, title: "BETHEL RESIDENCY", category: "Hospitality", size: "large", image: "WhatsApp Image 2026-08-22 at 21.53.39.jpeg" },
  { id: 17, title: "Himalayan Vintage Holidays", category: "Travel", size: "large", image: "project4.jpeg" },
  { id: 18, title: "Mahakal Bus Services", category: "Travel", size: "small", image: "project3.jpeg" },
  { id: 19, title: "Whistling Wind Resort", category: "Hospitality", size: "small", image: "project6.jpeg" },
  { id: 20, title: "Quick Trip Now", category: "Travel", size: "large", image: "QuickTripNow.png" },
  { id: 21, title: "Etripzo", category: "Travel", size: "small", image: "project8.jpeg" },
  { id: 22, title: "Take a Trip Make Memories", category: "Travel", size: "small", image: "project7.jpeg" },
  { id: 23, title: "Siliguri Institute of Nursing", category: "Brand Identity", size: "large", image: "Siliguri.jpeg" },
  { id: 24, title: "Gajagamini Forest Resort", category: "Travel", size: "small", image: "project5.jpeg" },
  { id: 25, title: "HOTEL TSA", category: "Hospitality", size: "small", image: "Screenshot 2026-08-25 120051.png" },
  { id: 26, title: "99 BIKE RIDERS", category: "Automotive", size: "small", image: "Screenshot 2026-08-25 120143.png" },
  { id: 27, title: "NORTH EAST HIMALAYAN TRAVELS", category: "Travel", size: "small", image: "Screenshot 2026-08-25 120216.png" },
  { id: 28, title: "Wonder Marble", category: "Retail", size: "small", image: "Screenshot 2026-08-25 120308.png" },
  { id: 29, title: "CAFE AFFAIR", category: "Hospitality", size: "small", image: "Screenshot 2026-08-25 120339.png" },
  { id: 30, title: "ARAV SIKKIM TRAVELS", category: "Travel", size: "small", image: "Screenshot 2026-08-25 120413.png" },
  { id: 31, title: "MOONLIGHT INSTITUTE OF MANAGEMENT", category: "Brand Identity", size: "small", image: "Screenshot 2026-08-25 120452.png" },
  { id: 32, title: "Siliguri CAR Booking", category: "Travel", size: "small", image: "Screenshot 2026-08-25 120519.png" },
  { id: 33, title: "CRESTOVA HOLIDAYS", category: "Travel", size: "small", image: "WhatsApp Image 2026-08-22 at 22.07.42.jpeg" },
  { id: 34, title: "TNW", category: "Brand Identity", size: "small", image: "WhatsApp Image 2026-08-22 at 22.12.51.jpeg" },
  { id: 35, title: "SWASTIK TRIPLINE", category: "Travel", size: "small", image: "WhatsApp Image 2026-08-24 at 23.22.34.jpeg" },
  { id: 36, title: "Yes Doctor", category: "Healthcare", size: "small", image: "Yes Doctor.png" },
  { id: 37, title: "Brand Identity", category: "Brand Identity", size: "small", image: "project1.jpeg" },
  { id: 38, title: "DS Customer Solutions", category: "Brand Identity", size: "large", image: "DS Customer Solutions.jpeg" },
  { id: 39, title: "Mine Labour Protection Campaign", category: "Brand Identity", size: "large", image: "Mine Labour Protection Campaign.jpeg" },
];

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = activeCategory === "All" 
    ? PROJECTS 
    : PROJECTS.filter(p => p.category === activeCategory);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-background overflow-hidden relative">
      <Navbar />

      {/* Ambient gold glow */}
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#C5A059]/10 rounded-full blur-[140px] pointer-events-none" />
      
      <section className="w-full pt-44 pb-24 relative z-10">
        <div className="container mx-auto px-6 md:px-12">
          <div className="mb-10 text-center md:text-left">
            <span className="text-xs uppercase tracking-widest mb-3 font-semibold text-[#8C6A16] block">
              Credentials &amp; Deployments
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium tracking-tight text-slate-900 leading-tight">
              Client Case Studies &amp; <br />
              <span className="italic font-light text-[#8C6A16]">Production Work.</span>
            </h1>
          </div>
          
          <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 max-w-2xl shadow-2xs mb-10">
            <p className="text-sm md:text-base text-slate-600 font-normal leading-relaxed">
              A curated portfolio of high-performance web systems, brand architectures, and booking engines engineered by Digital Dictionary.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2.5 mb-12">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-2xs border cursor-pointer",
                  activeCategory === category 
                    ? "bg-[#0F172A] text-white border-[#0F172A] font-bold" 
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                )}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[280px] grid-flow-row-dense">
            {filteredProjects.map((project, index) => {
              const pattern = index % 8;
              let spanClass = "md:col-span-1 md:row-span-1";
              if (pattern === 0 || pattern === 6) spanClass = "md:col-span-2 md:row-span-2";
              else if (pattern === 3 || pattern === 7) spanClass = "md:col-span-2 md:row-span-1";

              return (
                <div
                  key={project.id}
                  className={cn(
                    "group relative block overflow-hidden rounded-3xl bg-white border border-[#E8DFC8] hover:border-[#C5A059] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300",
                    spanClass
                  )}
                >
                  {/* Project Image */}
                  <div className="absolute inset-0 flex items-center justify-center overflow-hidden transition-transform duration-700 group-hover:scale-105 p-6 md:p-8">
                    <div className="relative w-full h-full">
                      <Image
                        src={`/clients/${project.image}`}
                        alt={project.title}
                        fill
                        className="object-contain"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Dark Gradient Overlay for Contrast on hover only */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Hover Details */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
                    <span className="text-[#DFB76C] text-[10px] font-bold tracking-[0.2em] uppercase mb-1">
                      {project.category}
                    </span>
                    <h3 className="text-base md:text-lg font-bold text-white leading-snug mb-3">
                      {project.title}
                    </h3>
                    <div className="w-9 h-9 shrink-0 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/40 hover:bg-[#C5A059] hover:border-[#C5A059] transition-colors">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA to Contact / Custom Project */}
          <div className="mt-20 p-8 md:p-12 rounded-2xl bg-[#F8FAFC] border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xs">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#8C6A16] block mb-1">
                Initiate a Project
              </span>
              <h3 className="text-xl md:text-2xl font-serif font-bold text-slate-900">
                Ready to Engineer a High-Performance Digital Platform?
              </h3>
            </div>
            <Link
              href="/contact"
              className="px-7 py-3.5 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-xs uppercase tracking-wider shadow-xs hover:shadow-sm transition-all whitespace-nowrap flex items-center gap-2"
            >
              <span>Schedule a Consultation</span>
              <ArrowUpRight className="w-4 h-4 text-[#DFB76C]" />
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
