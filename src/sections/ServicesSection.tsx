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
    topStripe: "from-blue-600 to-indigo-600",
    iconBg: "bg-blue-50 text-blue-700 border-blue-200",
    badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
    hoverBorder: "hover:border-blue-500",
    accentColor: "text-blue-700",
    description: "Enterprise web platforms, corporate websites, and portals built on Next.js and React. Engineered for sub-second page loads, maximum security, and search engine domination.",
    deliverables: ["Corporate Web Portals", "Server-Side Rendering (SSR)", "Core Web Vitals 100/100", "Enterprise CMS Integration"],
    href: "/web-development",
  },
  {
    id: "02",
    title: "Performance Digital Marketing & SEO",
    icon: Megaphone,
    tag: "Growth Engine",
    topStripe: "from-amber-500 to-orange-500",
    iconBg: "bg-amber-50 text-amber-700 border-amber-200",
    badgeBg: "bg-amber-50 text-amber-700 border-amber-200",
    hoverBorder: "hover:border-amber-500",
    accentColor: "text-amber-700",
    description: "Data-driven media campaigns across Google Ads, Meta, and algorithmic SEO that compound organically. Built around verified unit economics, conversions, and high ROAS.",
    deliverables: ["Full-Funnel Performance Ads", "Search Engine Optimization (SEO)", "Social Media Marketing", "Content & Conversion Strategy"],
    href: "/digital-marketing",
  },
  {
    id: "03",
    title: "Custom Software & Cloud Architecture",
    icon: Code,
    tag: "Enterprise SaaS",
    topStripe: "from-indigo-600 to-purple-600",
    iconBg: "bg-indigo-50 text-indigo-700 border-indigo-200",
    badgeBg: "bg-indigo-50 text-indigo-700 border-indigo-200",
    hoverBorder: "hover:border-indigo-500",
    accentColor: "text-indigo-700",
    description: "Tailor-made software platforms, custom CRMs, internal workflow automation systems, and SaaS architectures built to streamline operations and eliminate operational friction.",
    deliverables: ["Custom CRM & ERP Systems", "SaaS Product Engineering", "REST & GraphQL APIs", "Scalable Cloud Hosting"],
    href: "/software-development",
  },
  {
    id: "04",
    title: "High-Conversion E-Commerce Systems",
    icon: ShoppingBag,
    tag: "Digital Commerce",
    topStripe: "from-emerald-600 to-teal-600",
    iconBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    hoverBorder: "hover:border-emerald-500",
    accentColor: "text-emerald-700",
    description: "Scalable digital storefronts and omnichannel retail systems designed for effortless browsing, instant payment checkout, and zero cart abandonment.",
    deliverables: ["Custom Storefronts", "Payment Gateway Integration", "Inventory Management", "High-Volume Checkout Security"],
    href: "/ecommerce-development",
  },
  {
    id: "05",
    title: "Mobile Application Development",
    icon: Smartphone,
    tag: "iOS & Android",
    topStripe: "from-cyan-600 to-blue-600",
    iconBg: "bg-cyan-50 text-cyan-700 border-cyan-200",
    badgeBg: "bg-cyan-50 text-cyan-700 border-cyan-200",
    hoverBorder: "hover:border-cyan-500",
    accentColor: "text-cyan-700",
    description: "Native iOS, Android, and cross-platform applications with fluid gestures, offline support, push notification architectures, and real-time backend synchronization.",
    deliverables: ["iOS & Android Mobile Apps", "React Native & Flutter", "Real-Time Cloud Sync", "App Store & Play Store Deployment"],
    href: "/app-development",
  },
  {
    id: "06",
    title: "Brand Systems & Strategic Visual Design",
    icon: Palette,
    tag: "Brand Identity",
    topStripe: "from-rose-600 to-pink-600",
    iconBg: "bg-rose-50 text-rose-700 border-rose-200",
    badgeBg: "bg-rose-50 text-rose-700 border-rose-200",
    hoverBorder: "hover:border-rose-500",
    accentColor: "text-rose-700",
    description: "Complete visual identities, executive design languages, marketing collaterals, and UI/UX systems that command respect and establish market leadership.",
    deliverables: ["Corporate Identity Guidelines", "UI/UX & Interactive Design", "Marketing Collaterals", "Executive Brand Collateral"],
    href: "/graphics-designing",
  },
];

export function ServicesSection() {
  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-[#EFE8D8] via-[#E8DEC8] to-[#E2D6BC] relative overflow-hidden border-b border-[#D0C09F]" id="services">
      <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-6xl">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 pb-6 border-b border-[#D0C09F]">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-[#8C6A16] block mb-2">
              Capabilities &amp; Solutions
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-slate-900 tracking-tight">
              Enterprise Digital <span className="italic font-light text-[#8C6A16]">Solutions</span>
            </h2>
          </div>
          <Link 
            href="/services" 
            className="text-xs font-bold text-slate-800 hover:text-[#8C6A16] transition-colors flex items-center gap-1.5 uppercase tracking-wider self-start md:self-auto bg-white px-4 py-2.5 rounded-full border border-[#D8C7A0] shadow-2xs hover:shadow-sm"
          >
            <span>View Complete Solutions Catalog</span>
            <ArrowUpRight className="w-4 h-4 text-[#8C6A16]" />
          </Link>
        </div>
        
        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SOLUTIONS.map((sol) => (
            <div
              key={sol.id}
              className={`group relative rounded-2xl bg-white border border-[#E2D8C3] ${sol.hoverBorder} transition-all flex flex-col justify-between shadow-xs hover:shadow-xl hover:-translate-y-1.5 duration-300 overflow-hidden`}
            >
              {/* Vibrant Colored Top Stripe */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${sol.topStripe}`} />

              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform ${sol.iconBg}`}>
                    <sol.icon className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${sol.badgeBg}`}>
                      {sol.tag}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {sol.id}
                    </span>
                  </div>
                </div>

                <h3 className={`text-xl font-bold text-slate-900 mb-3 group-hover:${sol.accentColor} transition-colors`}>
                  {sol.title}
                </h3>

                <p className="text-sm text-slate-600 font-normal leading-relaxed mb-6">
                  {sol.description}
                </p>

                {/* Deliverables list */}
                <div className="space-y-2.5 mb-6 pt-4 border-t border-[#E8DFC8]">
                  {sol.deliverables.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-8 pb-7 pt-2">
                <Link
                  href={sol.href}
                  className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900 hover:${sol.accentColor} transition-colors group/link`}
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