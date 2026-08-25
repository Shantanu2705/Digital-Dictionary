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
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  {
    name: "Digital Solutions",
    href: "#",
    hasMegaMenu: true,
  },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

const MEGA_MENU_SERVICES = [
  {
    title: "Digital Marketing",
    icon: Megaphone,
    href: "/digital-marketing",
    subItems: [
      { name: "SEO", href: "/seo" },
      { name: "Google Ads", href: "/google-ads" },
      { name: "Meta Ads", href: "/meta-ads" },
      { name: "Social Media Marketing", href: "/social-media-marketing" },
      { name: "Content Marketing", href: "/content-marketing" },
    ],
  },
  {
    title: "Web Development",
    icon: Monitor,
    href: "/web-development",
    subItems: [
      { name: "Corporate Websites", href: "/corporate-websites" },
      { name: "E-Commerce Stores", href: "/ecommerce-stores" },
      { name: "Web Portals", href: "/web-portals" },
      { name: "Landing Pages", href: "/landing-pages" },
    ],
  },
  {
    title: "Website Designing",
    icon: Palette,
    href: "/website-designing",
    subItems: [
      { name: "UI/UX Design", href: "/ui-ux-design" },
      { name: "Wireframing", href: "/wireframing" },
      { name: "Prototyping", href: "/prototyping" },
      { name: "Website Revamp", href: "/website-revamp" },
    ],
  },
  {
    title: "Software Development",
    icon: Code,
    href: "/software-development",
    subItems: [
      { name: "Custom Software", href: "/custom-software" },
      { name: "SaaS Development", href: "/saas-development" },
      { name: "CRM Systems", href: "/crm-systems" },
      { name: "ERP Solutions", href: "/erp-solutions" },
    ],
  },
  {
    title: "App Development",
    icon: Smartphone,
    href: "/app-development",
    subItems: [
      { name: "iOS Development", href: "/ios-development" },
      { name: "Android Development", href: "/android-development" },
      { name: "Cross-Platform Apps", href: "/cross-platform-apps" },
      { name: "App Maintenance", href: "/app-maintenance" },
    ],
  },
  {
    title: "Graphics Designing",
    icon: PenTool,
    href: "/graphics-designing",
    subItems: [
      { name: "Logo Design", href: "/logo-design" },
      { name: "Brand Identity", href: "/brand-identity" },
      { name: "Marketing Collaterals", href: "/marketing-collaterals" },
      { name: "Social Media Posts", href: "/social-media-posts" },
    ],
  },
  {
    title: "Domain Hosting",
    icon: Server,
    href: "/domain-hosting",
    subItems: [
      { name: "Shared Hosting", href: "/shared-hosting" },
      { name: "VPS Hosting", href: "/vps-hosting" },
      { name: "Dedicated Servers", href: "/dedicated-servers" },
      { name: "Domain Registration", href: "/domain-registration" },
    ],
  },
  {
    title: "Product Photography",
    icon: Camera,
    href: "/product-photography",
    subItems: [
      { name: "E-commerce Photography", href: "/ecommerce-photography" },
      { name: "Lifestyle Photography", href: "/lifestyle-photography" },
      { name: "Studio Shoots", href: "/studio-shoots" },
      { name: "Image Editing", href: "/image-editing" },
    ],
  },
  {
    title: "Commercial Ads",
    icon: Video,
    href: "/commercial-ads",
    subItems: [
      { name: "Video Production", href: "/video-production" },
      { name: "Ad Campaigns", href: "/ad-campaigns" },
      { name: "Scriptwriting", href: "/scriptwriting" },
      { name: "Post Production", href: "/post-production" },
    ],
  },
];


export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [activeServiceIdx, setActiveServiceIdx] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-background/80 backdrop-blur-2xl border-b border-border py-4 shadow-sm"
            : "bg-transparent py-6"
        )}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="relative z-50 flex items-center">
            <Image
              src="/logo.png"
              alt="Digital Dictionary"
              width={180}
              height={50}
              className="object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-8">
            {NAV_LINKS.map((link) => (
              <div
                key={link.name}
                className="relative group"
                onMouseEnter={() => link.hasMegaMenu && setMegaMenuOpen(true)}
                onMouseLeave={() => link.hasMegaMenu && setMegaMenuOpen(false)}
              >
                <Link
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-all flex items-center pb-6 -mb-6 group",
                    link.name === "Digital Solutions" ? "" : "text-charcoal hover:text-luxury-gold"
                  )}
                >
                  <span className={cn(
                    "relative flex items-center gap-1 transition-all py-1",
                    link.name === "Digital Solutions" 
                      ? "text-luxury-gold bg-charcoal px-4 py-1.5 rounded-full shadow-lg border border-luxury-gold/30 hover:border-luxury-gold hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]" 
                      : (pathname === link.href ? "text-luxury-gold" : "")
                  )}>
                    {link.name}
                    {link.hasMegaMenu && (
                      <ChevronDown className={cn("w-4 h-4 transition-transform", megaMenuOpen && "rotate-180")} />
                    )}
                    {link.name !== "Digital Solutions" && (
                      <span 
                        className={cn(
                          "absolute bottom-0 left-0 w-full h-[2px] bg-luxury-gold rounded-full transition-all duration-300",
                          pathname === link.href ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100"
                        )} 
                      />
                    )}
                  </span>
                </Link>

                {/* Mega Menu Dropdown */}
                {link.hasMegaMenu && megaMenuOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-[750px] bg-card rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] border border-border flex overflow-hidden z-50">
                    
                    {/* Left Pane - Services List */}
                    <div className="w-[45%] bg-background p-6 border-r border-border">
                      <h4 className="text-[11px] font-bold tracking-widest text-luxury-gold uppercase mb-4 ml-4">
                        SERVICES
                      </h4>
                      <div className="flex flex-col h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {MEGA_MENU_SERVICES.map((service, idx) => {
                          const isActive = activeServiceIdx === idx;
                          return (
                            <Link
                              href={service.href}
                              key={service.title}
                              onMouseEnter={() => setActiveServiceIdx(idx)}
                              className={cn(
                                "flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 mb-1",
                                isActive 
                                  ? "bg-luxury-gold text-white shadow-md" 
                                  : "text-gray-600 hover:bg-card hover:text-luxury-gold"
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <service.icon className={cn("w-4 h-4", isActive ? "text-white" : "text-luxury-gold")} />
                                <span className={cn("text-sm font-medium", isActive ? "text-white" : "text-gray-700")}>
                                  {service.title}
                                </span>
                              </div>
                              {isActive && <ChevronRight className="w-4 h-4 text-white" />}
                            </Link>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right Pane - Sub Items */}
                    <div className="w-[55%] bg-card p-10">
                      {MEGA_MENU_SERVICES[activeServiceIdx] && (
                        <div>
                          <div className="flex items-center gap-3 mb-6">
                            <div className="text-luxury-gold">
                              {(() => {
                                const Icon = MEGA_MENU_SERVICES[activeServiceIdx].icon;
                                return <Icon className="w-6 h-6" />;
                              })()}
                            </div>
                            <h3 className="text-xl font-bold text-charcoal">
                              {MEGA_MENU_SERVICES[activeServiceIdx].title}
                            </h3>
                          </div>
                          
                          <div className="w-full h-[1px] bg-border mb-8" />
                          
                          <ul className="space-y-6">
                            {MEGA_MENU_SERVICES[activeServiceIdx].subItems.map((subItem) => (
                              <li key={subItem.name}>
                                <Link
                                  href={subItem.href}
                                  className="flex items-center gap-4 text-gray-600 hover:text-luxury-gold hover:translate-x-1 transition-all text-sm font-medium"
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-luxury-gold/50" />
                                  {subItem.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center gap-4 relative z-50">
            <Link
              href="/contact"
              className="hidden md:inline-flex bg-charcoal text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-luxury-gold transition-colors items-center gap-2"
            >
              Quick Consultation &rarr;
            </Link>

            <button
              className="lg:hidden text-charcoal hover:text-luxury-gold transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background pt-24 px-6 pb-6 flex flex-col overflow-y-auto">
           <div className="flex flex-col space-y-6 mt-12">
            {NAV_LINKS.map((link) => (
              <div key={link.name}>
                <Link
                  href={link.href}
                  className="text-4xl font-serif text-charcoal hover:text-luxury-gold transition-colors"
                  onClick={() => !link.hasMegaMenu && setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
                {link.hasMegaMenu && (
                  <div className="mt-6 ml-4 space-y-6">
                    {MEGA_MENU_SERVICES.map((service) => (
                      <div key={service.title}>
                        <h4 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider flex items-center gap-2">
                           <service.icon className="w-4 h-4 text-luxury-gold" />
                           {service.title}
                        </h4>
                        <ul className="space-y-3 pl-6">
                          {service.subItems.map((item) => (
                            <li key={item.name}>
                              <Link
                                href={item.href}
                                className="text-lg text-gray-600 hover:text-charcoal"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-auto pt-12">
            <Link
              href="/contact"
              className="w-full block text-center bg-charcoal text-white px-8 py-4 rounded-full text-lg font-bold"
              onClick={() => setMobileMenuOpen(false)}
            >
              Quick Consultation &rarr;
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
