"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  ChevronDown, 
  Menu, 
  X, 
  Megaphone, 
  Monitor, 
  Palette, 
  Code, 
  Smartphone, 
  PenTool, 
  Server, 
  Camera, 
  Video,
  ChevronRight,
  Phone,
  Mail,
  Award
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PremiumButton } from "./PremiumButton";

interface NavLinkItem {
  name: string;
  href: string;
  hasMegaMenu?: boolean;
}

const NAV_LINKS: NavLinkItem[] = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  {
    name: "Digital Solutions",
    href: "#",
    hasMegaMenu: true,
  },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Careers", href: "/careers" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

const MEGA_MENU_SERVICES = [
  {
    title: "Digital Marketing",
    icon: Megaphone,
    href: "/digital-marketing",
    subItems: [
      { name: "SEO Optimization", href: "/seo" },
      { name: "Google Search & Display Ads", href: "/google-ads" },
      { name: "Meta & Social Ads", href: "/meta-ads" },
      { name: "Social Media Strategy", href: "/social-media-marketing" },
      { name: "Content & Copywriting", href: "/content-marketing" },
    ],
  },
  {
    title: "Web Development",
    icon: Monitor,
    href: "/web-development",
    subItems: [
      { name: "Corporate Web Portals", href: "/corporate-websites" },
      { name: "High-Scale E-Commerce", href: "/ecommerce-stores" },
      { name: "Custom Web Applications", href: "/web-portals" },
      { name: "High-Conversion Landing Pages", href: "/landing-pages" },
    ],
  },
  {
    title: "Website Designing",
    icon: Palette,
    href: "/website-designing",
    subItems: [
      { name: "UI/UX Architecture", href: "/ui-ux-design" },
      { name: "Wireframing & Prototyping", href: "/wireframing" },
      { name: "Figma Component Systems", href: "/prototyping" },
      { name: "Full Website Redesign", href: "/website-revamp" },
    ],
  },
  {
    title: "Software Development",
    icon: Code,
    href: "/software-development",
    subItems: [
      { name: "Custom Business Software", href: "/custom-software" },
      { name: "SaaS Platform Engineering", href: "/saas-development" },
      { name: "Internal CRM Architectures", href: "/crm-systems" },
      { name: "Enterprise ERP Solutions", href: "/erp-solutions" },
    ],
  },
  {
    title: "App Development",
    icon: Smartphone,
    href: "/app-development",
    subItems: [
      { name: "Native iOS Apps", href: "/ios-development" },
      { name: "Native Android Apps", href: "/android-development" },
      { name: "Cross-Platform React Native", href: "/cross-platform-apps" },
      { name: "App Maintenance & SLA", href: "/app-maintenance" },
    ],
  },
  {
    title: "Graphics Designing",
    icon: PenTool,
    href: "/graphics-designing",
    subItems: [
      { name: "Corporate Logo Design", href: "/logo-design" },
      { name: "Brand Guidelines & System", href: "/brand-identity" },
      { name: "Executive Marketing Collaterals", href: "/marketing-collaterals" },
      { name: "Social Media Campaign Kits", href: "/social-media-posts" },
    ],
  },
  {
    title: "Cloud & Infrastructure",
    icon: Server,
    href: "/domain-hosting",
    subItems: [
      { name: "High-Performance Cloud Hosting", href: "/shared-hosting" },
      { name: "Dedicated Server Deployment", href: "/vps-hosting" },
      { name: "Enterprise Edge CDN", href: "/dedicated-servers" },
      { name: "Domain & DNS Governance", href: "/domain-registration" },
    ],
  },
  {
    title: "Commercial Media & Video",
    icon: Video,
    href: "/commercial-ads",
    subItems: [
      { name: "Commercial Video Production", href: "/video-production" },
      { name: "Digital Ad Campaigns", href: "/ad-campaigns" },
      { name: "Scriptwriting & Storyboards", href: "/scriptwriting" },
      { name: "Color Grading & Post Production", href: "/post-production" },
    ],
  },
];

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [activeServiceIdx, setActiveServiceIdx] = useState(0);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b border-[#E2D8C3] backdrop-blur-md",
          isScrolled ? "py-2 shadow-xs bg-white/98" : "py-3 md:py-3.5 bg-white/95"
        )}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between max-w-7xl">
          
          {/* Logo on Left - Big, Bold, Beautiful & Perfectly Contained */}
          <Link href="/" className="relative z-50 flex items-center group py-0.5">
            <Image
              src="/brand-logo.png"
              alt="Digital Dictionary"
              width={260}
              height={195}
              className="object-contain h-14 sm:h-16 md:h-17 w-auto drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
              priority
              unoptimized
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            {NAV_LINKS.map((link) => (
              <div
                key={link.name}
                className="relative"
                onMouseEnter={() => link.hasMegaMenu && setMegaMenuOpen(true)}
                onMouseLeave={() => link.hasMegaMenu && setMegaMenuOpen(false)}
              >
                <Link
                  href={link.href}
                  className={cn(
                    "text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-1.5 py-2",
                    pathname === link.href ? "text-[#8C6A16]" : "text-slate-700 hover:text-slate-900"
                  )}
                >
                  <span>{link.name}</span>
                  {link.hasMegaMenu && (
                    <ChevronDown className={cn("w-3.5 h-3.5 text-slate-400 transition-transform", megaMenuOpen && "rotate-180")} />
                  )}
                </Link>

                {/* Structured Mega-Menu Dropdown (Like Microsoft / Google Cloud) */}
                {link.hasMegaMenu && megaMenuOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[780px] z-50">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex">
                      
                      {/* Left Column: Solution Tracks */}
                      <div className="w-[45%] bg-[#F8FAFC] p-5 border-r border-slate-200">
                        <span className="text-[10px] font-bold tracking-widest text-[#8C6A16] uppercase block mb-3 px-3">
                          Solution Tracks
                        </span>
                        <div className="space-y-1">
                          {MEGA_MENU_SERVICES.map((service, idx) => {
                            const isActive = activeServiceIdx === idx;
                            return (
                              <Link
                                href={service.href}
                                key={service.title}
                                onMouseEnter={() => setActiveServiceIdx(idx)}
                                className={cn(
                                  "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                                  isActive 
                                    ? "bg-white text-slate-900 shadow-xs border border-slate-200 font-bold" 
                                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                                )}
                              >
                                <div className="flex items-center gap-2.5">
                                  <service.icon className={cn("w-4 h-4", isActive ? "text-[#8C6A16]" : "text-slate-400")} />
                                  <span>{service.title}</span>
                                </div>
                                {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#8C6A16]" />}
                              </Link>
                            );
                          })}
                        </div>
                      </div>

                      {/* Right Column: Detailed Sub-Capabilities */}
                      <div className="w-[55%] p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
                            <h4 className="text-sm font-bold text-slate-900">
                              {MEGA_MENU_SERVICES[activeServiceIdx].title}
                            </h4>
                          </div>

                          <ul className="space-y-3">
                            {MEGA_MENU_SERVICES[activeServiceIdx].subItems.map((sub) => (
                              <li key={sub.name}>
                                <Link 
                                  href={sub.href}
                                  className="text-xs text-slate-600 hover:text-[#8C6A16] flex items-center justify-between group transition-colors"
                                >
                                  <span>{sub.name}</span>
                                  <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-[#8C6A16] group-hover:translate-x-0.5 transition-all" />
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-4 border-t border-slate-100 mt-6 flex items-center justify-between">
                          <Link 
                            href="/contact" 
                            className="text-xs text-[#8C6A16] hover:underline flex items-center gap-1 font-bold uppercase tracking-wider"
                          >
                            Discuss Solution With Team &rarr;
                          </Link>
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Action Button & Mobile Toggle */}
          <div className="flex items-center gap-4 relative z-50">
            <div className="hidden md:block">
              <Link
                href="/contact"
                className="px-5 py-2 rounded-full bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#996515] hover:from-[#996515] hover:to-[#B8860B] text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] border border-[#F3E5AB]/40 inline-flex items-center gap-1.5"
              >
                <span>Get In Touch</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </header>

      {/* Clean Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[74px] bg-white z-40 lg:hidden overflow-y-auto border-t border-slate-200 p-6 flex flex-col justify-between">
          <div className="space-y-4">
            {NAV_LINKS.map((link) => (
              <div key={link.name}>
                {link.hasMegaMenu ? (
                  <div>
                    <button
                      onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                      className="w-full flex items-center justify-between py-2 text-base font-bold text-slate-900 border-b border-slate-100"
                    >
                      <span>{link.name}</span>
                      <ChevronDown className={cn("w-4 h-4 transition-transform", mobileServicesOpen && "rotate-180")} />
                    </button>

                    {mobileServicesOpen && (
                      <div className="pl-4 py-3 space-y-3 bg-[#F8FAFC] rounded-xl my-2">
                        {MEGA_MENU_SERVICES.map((cat) => (
                          <div key={cat.title}>
                            <button
                              onClick={() => setExpandedMobileCategory(expandedMobileCategory === cat.title ? null : cat.title)}
                              className="w-full flex items-center justify-between text-xs font-bold text-slate-800 py-1"
                            >
                              <span>{cat.title}</span>
                              <ChevronDown className={cn("w-3 h-3", expandedMobileCategory === cat.title && "rotate-180")} />
                            </button>
                            {expandedMobileCategory === cat.title && (
                              <div className="pl-3 py-1 space-y-1">
                                {cat.subItems.map((sub) => (
                                  <Link
                                    key={sub.name}
                                    href={sub.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block text-xs text-slate-600 hover:text-slate-900 py-1"
                                  >
                                    {sub.name}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-base font-bold text-slate-900 border-b border-slate-100 hover:text-[#8C6A16] transition-colors"
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-slate-200 mt-6 space-y-3">
            <PremiumButton href="/contact" className="w-full justify-center">
              Schedule a Consultation
            </PremiumButton>
            <div className="text-center text-xs text-slate-500">
              Direct Phone: +91 62911 11428 &middot; hr@digitaldictionary.in
            </div>
          </div>
        </div>
      )}
    </>
  );
}
