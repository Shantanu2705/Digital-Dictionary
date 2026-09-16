import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { SmartContactLink } from "./SmartContactLink";
import { FaFacebookF, FaInstagram, FaXTwitter, FaLinkedinIn, FaWhatsapp } from "react-icons/fa6";
import msmeLogo from "../../public/msme-logo.png";

const CONTACT_DEPTS = [
  {
    title: "GET IN TOUCH",
    phone: "+91 62911 11428",
    email: "admin07digitaldictionary@gmail.com"
  },
  {
    title: "TECHNICAL SUPPORT",
    phone: "+91 62978 68104",
    email: "admin07digitaldictionary@gmail.com"
  },
  {
    title: "ACCOUNTS RELATED ISSUE",
    phone: "+91 62911 11428",
    email: "admin07digitaldictionary@gmail.com"
  },
  {
    title: "JOB & HIRING",
    phone: "+91 62911 11428",
    email: "supportdigitaldictionary@gmail.com"
  }
];

export function Footer() {
  return (
    <footer className="w-full bg-gradient-to-b from-transparent to-black border-t border-luxury-gold/30 relative overflow-hidden pt-32 pb-12">
      <div className="absolute inset-0 bg-black/60 pointer-events-none -z-10" />
      <div className="container mx-auto px-6 md:px-12 relative z-10">

        {/* Center Logo & Social */}
        <div className="flex flex-col items-center justify-center text-center mb-20">
          <Link href="/" className="inline-block mb-10 bg-white/5 backdrop-blur-md p-8 rounded-[3rem] border border-luxury-gold/20 shadow-[0_10px_40px_rgba(212,175,55,0.1)]">
            <Image 
              src="/logo.png" 
              alt="Digital Dictionary" 
              width={200} 
              height={60} 
              className="object-contain mix-blend-multiply"
            />
          </Link>
          
          <div className="flex items-center gap-6 mb-8">
            <a href="https://www.facebook.com/profile.php?id=61577401455688" className="w-12 h-12 rounded-full flex items-center justify-center text-off-white bg-[#1877F2]/80 hover:bg-[#1877F2] transition-all shadow-[0_4px_15px_rgba(24,119,242,0.3)] hover:-translate-y-1" aria-label="Facebook">
              <FaFacebookF className="w-6 h-6" />
            </a>
            <a href="https://twitter.com/" className="w-12 h-12 rounded-full flex items-center justify-center text-off-white bg-black/80 hover:bg-black transition-all shadow-[0_4px_15px_rgba(0,0,0,0.5)] hover:-translate-y-1 border border-white/10" aria-label="X (Twitter)">
              <FaXTwitter className="w-5 h-5" />
            </a>
            <a href="https://instagram.com/" className="w-12 h-12 rounded-full flex items-center justify-center text-off-white bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] opacity-90 hover:opacity-100 transition-all shadow-[0_4px_15px_rgba(220,39,67,0.3)] hover:-translate-y-1" aria-label="Instagram">
              <FaInstagram className="w-6 h-6" />
            </a>
            <a href="https://linkedin.com/" className="w-12 h-12 rounded-full flex items-center justify-center text-off-white bg-[#0A66C2]/80 hover:bg-[#0A66C2] transition-all shadow-[0_4px_15px_rgba(10,102,194,0.3)] hover:-translate-y-1" aria-label="LinkedIn">
              <FaLinkedinIn className="w-5 h-5" />
            </a>
            <a href="https://wa.me/916291111428" className="w-12 h-12 rounded-full flex items-center justify-center text-off-white bg-[#25D366]/80 hover:bg-[#25D366] transition-all shadow-[0_4px_15px_rgba(37,211,102,0.3)] hover:-translate-y-1" aria-label="WhatsApp">
              <FaWhatsapp className="w-6 h-6" />
            </a>
          </div>

          <div className="inline-flex items-center gap-3 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full px-8 py-3 text-sm font-bold text-off-white uppercase tracking-widest shadow-sm">
            <Star className="w-5 h-5 fill-white text-off-white" />
            5.0 Google review
          </div>
        </div>

        {/* Contact Details Row */}
        <div className="flex flex-col lg:flex-row items-center justify-between text-center lg:text-left gap-8 mb-20 text-off-white font-medium text-sm bg-white/5 backdrop-blur-sm p-10 rounded-[2.5rem] border border-white/10 shadow-lg">
          <div className="flex items-center gap-3 justify-center lg:justify-start text-lg">
            <span className="text-off-white">📞</span>
            <SmartContactLink type="phone" value="+91 62911 11428" className="hover:text-gray-400 transition-colors" />
            <span>/</span>
            <SmartContactLink type="phone" value="+91 62978 68104" className="hover:text-gray-400 transition-colors" />
          </div>

          <div className="flex items-center gap-3 justify-center text-lg">
            <span className="text-off-white">📍</span>
            <p>Kawakhali Bazar, Kawakhali Road,<br />Siliguri, West Bengal, Pin: 734012</p>
          </div>

          <div className="flex flex-col items-center lg:items-end gap-2 text-lg">
            <div className="flex items-center gap-3">
              <span className="text-off-white">✉</span>
              <SmartContactLink type="email" value="admin07digitaldictionary@gmail.com" className="hover:text-gray-400 transition-colors" />
            </div>
            <SmartContactLink type="email" value="supportdigitaldictionary@gmail.com" className="hover:text-gray-400 transition-colors ml-8" />
          </div>
        </div>

        {/* Department Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {CONTACT_DEPTS.map((dept) => (
            <div key={dept.title} className="bg-white/5 backdrop-blur-md p-8 rounded-[2rem] text-center border border-white/10 hover:border-luxury-gold/50 hover:-translate-y-2 transition-all shadow-sm">
              <h4 className="text-[12px] font-bold tracking-widest uppercase text-charcoal mb-6">
                {dept.title}
              </h4>
              <div className="space-y-3 text-sm text-off-white/90 flex flex-col items-center justify-center font-medium">
                <SmartContactLink type="phone" value={dept.phone} className="hover:text-charcoal transition-colors flex items-center gap-2">
                  <span className="text-charcoal">📞</span> {dept.phone}
                </SmartContactLink>
                <SmartContactLink type="email" value={dept.email} className="hover:text-charcoal transition-colors flex items-center gap-2 break-all text-[11px] uppercase tracking-wider">
                  <span className="text-charcoal">✉</span> {dept.email}
                </SmartContactLink>
              </div>
            </div>
          ))}
        </div>

        {/* Certifications & Copyright */}
        <div className="mt-24 pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-sm text-gray-400 font-medium tracking-widest uppercase order-2 md:order-1 text-center md:text-left">
            &copy; {new Date().getFullYear()} Digital Dictionary. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4 order-1 md:order-2">
            <div className="flex flex-col items-center justify-center">
              <span className="text-[10px] uppercase tracking-widest text-gray-500 mb-4 font-bold border-b border-gray-800 pb-1">Registered With</span>
              <div className="bg-white/90 p-4 rounded-xl shadow-sm border border-white/20">
                <Image 
                  src={msmeLogo}  
                  alt="MSME Udyam Registration - UDYAM-06-0068347" 
                  width={160} 
                  height={65} 
                  className="object-contain mix-blend-multiply"
                  unoptimized
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
