"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { DynamicTextColor } from "@/components/DynamicTextColor";

import Image from "next/image";

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
    <main className="flex min-h-screen flex-col items-center justify-between bg-transparent">
      <Navbar />
      
      <section className="w-full pt-40 pb-24 relative z-10">
        <div className="container mx-auto px-6 md:px-12">
          <div className="mb-12">
            <DynamicTextColor as="h1" className="text-[12px] uppercase tracking-widest mb-4 font-bold border-b-2 border-luxury-gold inline-block pb-2">Our Portfolio</DynamicTextColor>
            <DynamicTextColor as="h2" className="text-4xl md:text-5xl font-bold tracking-tighter uppercase drop-shadow-[0_1px_1px_rgba(255,255,255,1)]">
              Recent work we&apos;re <br />
              <span className="font-serif italic font-light text-charcoal">proud of:</span>
            </DynamicTextColor>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-luxury-gold/30 rounded-3xl p-6 max-w-2xl shadow-sm mb-12">
            <p className="text-xl text-charcoal font-semibold">
                A collection of digital experiences we&apos;ve built for forward-thinking brands and organizations.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-12">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 shadow-sm border",
                  activeCategory === category 
                    ? "bg-gradient-to-r from-[#B38728] via-[#FBF5B7] to-[#B38728] text-charcoal border-luxury-gold shadow-[0_4px_15px_rgba(212,175,55,0.4)]" 
                    : "bg-white/20 backdrop-blur-md border-luxury-gold/30 text-charcoal hover:bg-white/40 hover:border-luxury-gold"
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
                    "group relative block overflow-hidden rounded-3xl bg-white/10 backdrop-blur-xl border border-luxury-gold/30 hover:border-luxury-gold shadow-sm hover:shadow-[0_10px_40px_rgba(212,175,55,0.2)] hover:-translate-y-1 transition-all duration-500",
                    spanClass
                  )}
                >
                {/* Project Image */}
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden transition-transform duration-700 group-hover:scale-105">
                  <div className="relative w-full h-full p-8 md:p-12">
                    <Image
                      src={`/clients/${project.image}`}
                      alt={project.title}
                      fill
                      className="object-contain p-4"
                    />
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="absolute inset-0 p-4 flex flex-col justify-end translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-10">
                  <p className="text-charcoal text-[10px] font-bold tracking-widest uppercase mb-1">
                    {project.category}
                  </p>
                  <h4 className="text-sm md:text-base font-medium text-off-white leading-snug mb-3">
                    {project.title}
                  </h4>
                  <div className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-off-white border border-white/20 hover:bg-luxury-gold transition-colors">
                    <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4" />
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
