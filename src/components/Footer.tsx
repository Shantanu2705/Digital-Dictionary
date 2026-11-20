import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Mail, Phone, MapPin, Award, ArrowUpRight } from "lucide-react";
import { SmartContactLink } from "./SmartContactLink";
import { FaFacebookF, FaInstagram, FaXTwitter, FaLinkedinIn, FaWhatsapp } from "react-icons/fa6";

export function Footer() {
  return (
    <footer className="w-full bg-[#0A1128] border-t-2 border-[#C5A059]/40 text-slate-300 relative overflow-hidden pt-16 pb-12">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#1E3A8A]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-6xl">

        {/* Multi-Column Corporate Layout (Goldman Sachs / Microsoft Standard) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-14 border-b border-white/10">
          
          {/* Column 1 & 2: Corporate Summary & Official MSME Picture Card */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-block">
              <Image 
                src="/brand-logo.png" 
                alt="Digital Dictionary" 
                width={190} 
                height={55} 
                className="object-contain h-14 w-auto"
                unoptimized
              />
            </Link>

            <p className="text-sm text-slate-300 leading-relaxed font-normal max-w-sm">
              Digital Dictionary is an enterprise digital solutions agency engineering high-performance web systems, custom software architectures, and data-driven marketing engines for forward-thinking organizations.
            </p>

            {/* Official Government MSME Registration Picture Card (PROMINENT & ELEVATED) */}
            <div className="p-4 rounded-2xl bg-white border-2 border-[#C5A059] space-y-2 max-w-sm shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest text-[#8C6A16] font-bold block">
                  Official Government Registration
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Verified
                </span>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs shrink-0 flex items-center justify-center">
                  <Image 
                    src="/msme-logo.png"  
                    alt="Ministry of MSME - Government of India" 
                    width={150} 
                    height={60} 
                    className="object-contain h-12 w-auto"
                    priority
                  />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Ministry of MSME</span>
                  <span className="text-[11px] text-slate-700 font-mono font-semibold block">Reg: UDYAM-WB-10-0098465</span>
                  <span className="text-[10px] text-[#8C6A16] font-semibold">Government of India Enterprise</span>
                </div>
              </div>
            </div>

            {/* Verified Social Channels */}
            <div className="flex items-center gap-2 pt-2">
              <a 
                href="https://www.facebook.com/profile.php?id=61577401455688" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-lg bg-white/10 border border-white/10 text-slate-300 hover:text-white hover:bg-white/20 hover:border-[#DFB76C] flex items-center justify-center transition-all shadow-2xs"
                aria-label="Facebook"
              >
                <FaFacebookF className="w-3.5 h-3.5" />
              </a>
              <a 
                href="https://instagram.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-lg bg-white/10 border border-white/10 text-slate-300 hover:text-white hover:bg-white/20 hover:border-[#DFB76C] flex items-center justify-center transition-all shadow-2xs"
                aria-label="Instagram"
              >
                <FaInstagram className="w-3.5 h-3.5" />
              </a>
              <a 
                href="https://twitter.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-lg bg-white/10 border border-white/10 text-slate-300 hover:text-white hover:bg-white/20 hover:border-[#DFB76C] flex items-center justify-center transition-all shadow-2xs"
                aria-label="X (Twitter)"
              >
                <FaXTwitter className="w-3.5 h-3.5" />
              </a>
              <a 
                href="https://linkedin.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-lg bg-white/10 border border-white/10 text-slate-300 hover:text-white hover:bg-white/20 hover:border-[#DFB76C] flex items-center justify-center transition-all shadow-2xs"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn className="w-3.5 h-3.5" />
              </a>
              <a 
                href="https://wa.me/916291111428" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-lg bg-[#25D366] text-white flex items-center justify-center hover:opacity-90 transition-all shadow-2xs"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 3: Solutions */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest font-bold text-[#DFB76C]">
              Solutions
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
              <li>
                <Link href="/web-development" className="hover:text-white transition-colors">Web Engineering</Link>
              </li>
              <li>
                <Link href="/digital-marketing" className="hover:text-white transition-colors">Digital Marketing &amp; SEO</Link>
              </li>
              <li>
                <Link href="/software-development" className="hover:text-white transition-colors">Custom Software &amp; CRM</Link>
              </li>
              <li>
                <Link href="/ecommerce-development" className="hover:text-white transition-colors">E-Commerce Systems</Link>
              </li>
              <li>
                <Link href="/app-development" className="hover:text-white transition-colors">Mobile App Development</Link>
              </li>
              <li>
                <Link href="/graphics-designing" className="hover:text-white transition-colors">Brand Identity &amp; Design</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Company & Careers */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest font-bold text-[#DFB76C]">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:text-white transition-colors">Client Portfolio</Link>
              </li>
              <li>
                <Link href="/careers" className="text-[#DFB76C] font-bold hover:underline flex items-center gap-1">
                  <span>Careers &amp; Internships</span>
                  <span className="text-[10px] bg-amber-400/20 text-[#DFB76C] px-1.5 py-0.2 rounded border border-[#DFB76C]/30">Hiring</span>
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">Insights &amp; Articles</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">Studio Location</Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Direct Desks */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest font-bold text-[#DFB76C]">
              Direct Desks
            </h4>
            <div className="space-y-3 text-xs text-slate-300">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#DFB76C] block mb-0.5">Hiring &amp; Internships</span>
                <SmartContactLink type="email" value="hr@digitaldictionary.in" className="text-[#DFB76C] font-bold hover:underline break-all" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Client Strategy</span>
                <SmartContactLink type="email" value="admin07digitaldictionary@gmail.com" className="text-slate-200 hover:text-white break-all" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Direct Line</span>
                <SmartContactLink type="phone" value="+91 62911 11428" className="text-white font-semibold hover:text-[#DFB76C]" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Studio Location</span>
                <p className="text-slate-300 leading-tight">Kawakhali Road, Siliguri, WB 734012</p>
              </div>
            </div>
          </div>

        </div>

        {/* Legal & Compliance Bottom Bar with MSME Picture Seal */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="bg-white px-3 py-1.5 rounded-lg border border-[#C5A059] shadow-xs shrink-0">
              <Image 
                src="/msme-logo.png"  
                alt="MSME Registration" 
                width={100} 
                height={40} 
                className="object-contain h-7 w-auto"
              />
            </div>
            <p suppressHydrationWarning className="font-normal text-slate-300">
              &copy; {new Date().getFullYear()} Digital Dictionary. All rights reserved. &middot; Government of India MSME Registered (UDYAM-WB-10-0098465).
            </p>
          </div>

          <div className="flex items-center gap-6 text-slate-400 font-medium">
            <Link href="/contact" className="hover:text-white transition-colors">Security Disclosure</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}