"use client";

import Link from "next/link";
import { ArrowUpRight, Monitor, Code, Megaphone, ShoppingBag, Smartphone, Palette } from "lucide-react";
import { motion } from "framer-motion";

const SOLUTIONS = [
  {
    id: "01",
    title: "Web Engineering & High-Speed Platforms",
    icon: Monitor,
    tag: "Core Engineering",
    description: "Enterprise web platforms, corporate websites, and portals built on Next.js and React. Engineered for sub-second page loads, maximum security, and search engine domination.",
    deliverables: ["Corporate Web Portals", "Server-Side Rendering (SSR)", "Core Web Vitals 100/100", "Enterprise CMS Integration"],
    href: "/web-development",
  },
  {
    id: "02",
    title: "Performance Digital Marketing & SEO",
    icon: Megaphone,
    tag: "Growth Engine",
    description: "Data-driven media campaigns across Google Ads, Meta, and algorithmic SEO that compound organically. Built around verified unit economics, conversions, and high ROAS.",
    deliverables: ["Full-Funnel Performance Ads", "Search Engine Optimization (SEO)", "Social Media Marketing", "Content & Conversion Strategy"],
    href: "/digital-marketing",
  },
  {
    id: "03",
    title: "Custom Software & Cloud Architecture",
    icon: Code,
    tag: "Enterprise SaaS",
    description: "Tailor-made software platforms, custom CRMs, internal workflow automation systems, and SaaS architectures built to streamline operations and eliminate operational friction.",
    deliverables: ["Custom CRM & ERP Systems", "SaaS Product Engineering", "REST & GraphQL APIs", "Scalable Cloud Hosting"],
    href: "/software-development",
  },
  {
    id: "04",
    title: "High-Conversion E-Commerce Systems",
    icon: ShoppingBag,
    tag: "Digital Commerce",
    description: "Scalable digital storefronts and omnichannel retail systems designed for effortless browsing, instant payment checkout, and zero cart abandonment.",
    deliverables: ["Custom Storefronts", "Payment Gateway Integration", "Inventory Management", "High-Volume Checkout Security"],
    href: "/ecommerce-development",
  },
  {
    id: "05",
    title: "Mobile Application Development",
    icon: Smartphone,
    tag: "iOS & Android",
    description: "Native iOS, Android, and cross-platform applications with fluid gestures, offline support, push notification architectures, and real-time backend synchronization.",
    deliverables: ["iOS & Android Mobile Apps", "React Native & Flutter", "Real-Time Cloud Sync", "App Store & Play Store Deployment"],
    href: "/app-development",
  },
  {
    id: "06",
    title: "Brand Systems & Strategic Visual Design",
    icon: Palette,
    tag: "Brand Identity",
    description: "Complete visual identities, executive design languages, marketing collaterals, and UI/UX systems that command respect and establish market leadership.",
    deliverables: ["Corporate Identity Guidelines", "UI/UX & Interactive Design", "Marketing Collaterals", "Executive Brand Collateral"],
    href: "/graphics-designing",
  },
];

export function ServicesSection() {
  return (
    <section className="py-24 md:py-32 bg-[#FAFAF8] relative overflow-hidden border-b border-[#E5E5E2]" id="services">
      <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-6xl">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 pb-6 border-b border-[#E5E5E2]">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-[#A67C22] block mb-2">
              Capabilities &amp; Solutions
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-[#101010] tracking-tight">
              Enterprise Digital <span className="italic font-light text-[#A67C22]">Solutions</span>
            </h2>
          </div>
          <Link 
            href="/services" 
            className="text-xs font-bold text-[#101010] hover:text-[#A67C22] transition-colors flex items-center gap-1.5 uppercase tracking-wider self-start md:self-auto bg-white px-5 py-2.5 rounded-full border border-[#E5E5E2] shadow-2xs hover:border-[#D4AF37]"
          >
            <span>View Complete Solutions Catalog</span>
            <ArrowUpRight className="w-4 h-4 text-[#A67C22]" />
          </Link>
        </div>
        
        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SOLUTIONS.map((sol) => (
            <div
              key={sol.id}
              className="group relative rounded-2xl bg-white border border-[#E5E5E2] hover:border-[#D4AF37] transition-all flex flex-col justify-between shadow-xs hover:shadow-xl hover:-translate-y-1.5 duration-300 overflow-hidden"
            >
              {/* Subtle Metallic Gold Top Stripe */}
              <div className="h-1 w-full bg-gradient-to-r from-[#D4AF37] to-[#E8D18A]" />

              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#F2F2F0] border border-[#E5E5E2] flex items-center justify-center text-[#101010] group-hover:text-[#D4AF37] group-hover:border-[#D4AF37]/40 shadow-2xs group-hover:scale-105 transition-all">
                    <sol.icon className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#F2F2F0] text-[#777777] border border-[#E5E5E2]">
                      {sol.tag}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#777777] bg-[#F2F2F0] px-2 py-0.5 rounded-md border border-[#E5E5E2]">
                      {sol.id}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-[#101010] mb-3 group-hover:text-[#A67C22] transition-colors">
                  {sol.title}
                </h3>

                <p className="text-sm text-[#777777] font-normal leading-relaxed mb-6">
                  {sol.description}
                </p>

                {/* Deliverables list */}
                <div className="space-y-2.5 mb-6 pt-4 border-t border-[#E5E5E2]">
                  {sol.deliverables.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-[#101010] font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-8 pb-7 pt-2">
                <Link
                  href={sol.href}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#101010] hover:text-[#A67C22] transition-colors group/link"
                >
                  <span>Explore Architecture</span>
                  <ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
