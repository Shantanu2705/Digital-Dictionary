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
  Video,
  ChevronRight,
  ArrowUpRight,
  Lock
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
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
          isScrolled 
            ? "py-2.5 shadow-sm bg-[#FAFAF8]/95 backdrop-blur-md border-[#E5E5E2]" 
            : "py-3.5 bg-[#FAFAF8]/90 backdrop-blur-sm border-[#E5E5E2]/80"
        )}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between max-w-7xl">
          
          {/* Logo on Left - High Visibility, Perfectly Contained */}
          <Link href="/" className="relative z-50 flex items-center group py-0.5" aria-label="Digital Dictionary Home">
            <Image
              src="/brand-logo.png"
              alt="Digital Dictionary Official Logo"
              width={260}
              height={195}
              className="object-contain h-14 sm:h-16 md:h-17 w-auto drop-shadow-xs transition-transform duration-200 group-hover:scale-105"
              priority
              unoptimized
            />
          </Link>

          {/* Desktop Navigation Links (Enterprise Google / Microsoft Style) */}
          <nav className="hidden lg:flex items-center space-x-7" aria-label="Primary Navigation">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <div
                  key={link.name}
                  className="relative"
                  onMouseEnter={() => link.hasMegaMenu && setMegaMenuOpen(true)}
                  onMouseLeave={() => link.hasMegaMenu && setMegaMenuOpen(false)}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-1.5 py-2 relative",
                      isActive 
                        ? "text-[#D4AF37] font-bold" 
                        : "text-[#101010] hover:text-[#D4AF37]"
                    )}
                  >
                    <span>{link.name}</span>
                    {link.hasMegaMenu && (
                      <ChevronDown className={cn("w-3.5 h-3.5 text-[#777777] transition-transform duration-200", megaMenuOpen && "rotate-180 text-[#D4AF37]")} />
                    )}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37] rounded-full" />
                    )}
                  </Link>

                  {/* Structured Mega-Menu Dropdown */}
                  {link.hasMegaMenu && megaMenuOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[800px] z-50 animate-in fade-in duration-200">
                      <div className="bg-white rounded-2xl border border-[#E5E5E2] shadow-2xl overflow-hidden flex">
                        
                        {/* Left Column: Solution Tracks */}
                        <div className="w-[45%] bg-[#F2F2F0] p-5 border-r border-[#E5E5E2]">
                          <span className="text-[10px] font-bold tracking-widest text-[#A67C22] uppercase block mb-3 px-3">
                            Solution Tracks
                          </span>
                          <div className="space-y-1">
                            {MEGA_MENU_SERVICES.map((service, idx) => {
                              const isSelected = activeServiceIdx === idx;
                              return (
                                <Link
                                  href={service.href}
                                  key={service.title}
                                  onMouseEnter={() => setActiveServiceIdx(idx)}
                                  className={cn(
                                    "flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all",
                                    isSelected 
                                      ? "bg-white text-[#101010] shadow-sm border border-[#E5E5E2] font-bold" 
                                      : "text-[#777777] hover:text-[#101010] hover:bg-white/60"
                                  )}
                                >
                                  <div className="flex items-center gap-2.5">
                                    <service.icon className={cn("w-4 h-4", isSelected ? "text-[#D4AF37]" : "text-[#777777]")} />
                                    <span>{service.title}</span>
                                  </div>
                                  {isSelected && <ChevronRight className="w-3.5 h-3.5 text-[#D4AF37]" />}
                                </Link>
                              );
                            })}
                          </div>
                        </div>

                        {/* Right Column: Detailed Sub-Capabilities */}
                        <div className="w-[55%] p-6 flex flex-col justify-between bg-white">
                          <div>
                            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#E5E5E2]">
                              <h4 className="text-sm font-bold text-[#101010]">
                                {MEGA_MENU_SERVICES[activeServiceIdx].title}
                              </h4>
                            </div>

                            <ul className="space-y-2.5">
                              {MEGA_MENU_SERVICES[activeServiceIdx].subItems.map((sub) => (
                                <li key={sub.name}>
                                  <Link 
                                    href={sub.href}
                                    className="text-xs text-[#777777] hover:text-[#D4AF37] flex items-center justify-between group transition-colors py-1"
                                  >
                                    <span>{sub.name}</span>
                                    <ChevronRight className="w-3 h-3 text-[#E5E5E2] group-hover:text-[#D4AF37] group-hover:translate-x-0.5 transition-all" />
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="pt-4 border-t border-[#E5E5E2] mt-6 flex items-center justify-between">
                            <Link 
                              href="/contact" 
                              className="text-xs text-[#A67C22] hover:underline flex items-center gap-1 font-bold uppercase tracking-wider"
                            >
                              Discuss Architecture &rarr;
                            </Link>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right Action Button & Mobile Toggle */}
          <div className="flex items-center gap-3 relative z-50">
            <Link
              href="/portal/login"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#D4AF37]/50 text-[#101010] hover:text-[#D4AF37] hover:border-[#D4AF37] text-xs font-semibold tracking-wider transition-all bg-white hover:bg-[#D4AF37]/10 shadow-2xs"
              title="Employee, Intern & Executive Portal Login"
            >
              <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Employee Login</span>
            </Link>

            <div className="hidden md:block">
              <PremiumButton href="/contact" variant="gold" className="px-5 py-2.5 text-xs">
                Get In Touch
              </PremiumButton>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#101010] hover:bg-[#F2F2F0] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </header>

      {/* Clean Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[74px] bg-[#FAFAF8] z-40 lg:hidden overflow-y-auto border-t border-[#E5E5E2] p-6 flex flex-col justify-between">
          <div className="space-y-3">
            {NAV_LINKS.map((link) => (
              <div key={link.name}>
                {link.hasMegaMenu ? (
                  <div>
                    <button
                      onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                      className="w-full flex items-center justify-between py-2.5 text-base font-bold text-[#101010] border-b border-[#E5E5E2]"
                    >
                      <span>{link.name}</span>
                      <ChevronDown className={cn("w-4 h-4 transition-transform text-[#777777]", mobileServicesOpen && "rotate-180 text-[#D4AF37]")} />
                    </button>

                    {mobileServicesOpen && (
                      <div className="pl-4 py-3 space-y-3 bg-[#F2F2F0] rounded-xl my-2">
                        {MEGA_MENU_SERVICES.map((cat) => (
                          <div key={cat.title}>
                            <button
                              onClick={() => setExpandedMobileCategory(expandedMobileCategory === cat.title ? null : cat.title)}
                              className="w-full flex items-center justify-between text-xs font-bold text-[#101010] py-1.5"
                            >
                              <span>{cat.title}</span>
                              <ChevronDown className={cn("w-3 h-3 text-[#777777]", expandedMobileCategory === cat.title && "rotate-180 text-[#D4AF37]")} />
                            </button>
                            {expandedMobileCategory === cat.title && (
                              <div className="pl-3 py-1 space-y-1">
                                {cat.subItems.map((sub) => (
                                  <Link
                                    key={sub.name}
                                    href={sub.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block text-xs text-[#777777] hover:text-[#101010] py-1"
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
                    className="block py-2.5 text-base font-bold text-[#101010] border-b border-[#E5E5E2] hover:text-[#D4AF37] transition-colors"
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-[#E5E5E2] mt-6 space-y-3">
            <Link
              href="/portal/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-[#D4AF37]/60 text-[#101010] text-xs font-bold uppercase tracking-wider bg-white shadow-xs hover:bg-[#D4AF37]/10 transition-colors"
            >
              <Lock className="w-4 h-4 text-[#D4AF37]" />
              <span>Employee &amp; Staff Login</span>
            </Link>

            <PremiumButton href="/contact" variant="gold" className="w-full justify-center">
              Schedule a Consultation
            </PremiumButton>
            <div className="text-center text-xs text-[#777777]">
              Direct Line: +91 62911 11428 &middot; hr@digitaldictionary.in
            </div>
          </div>
        </div>
      )}
    </>
  );
}
