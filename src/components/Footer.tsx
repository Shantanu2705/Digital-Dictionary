import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { ParticleBackground } from "./ParticleBackground";
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
    <footer className="w-full bg-background relative overflow-hidden pt-12 pb-12">
      <div className="absolute inset-0 pointer-events-none z-0">
        <ParticleBackground />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">

        {/* Center Logo & Social */}
        <div className="flex flex-col items-center justify-center text-center mb-16">
          <Link href="/" className="inline-block mb-8">
            <Image 
              src="/logo.png" 
              alt="Digital Dictionary" 
              width={180} 
              height={50} 
              className="object-contain"
            />
          </Link>
          
          <div className="flex items-center gap-4 mb-6">
            <a href="https://www.facebook.com/profile.php?id=61577401455688" className="w-10 h-10 rounded-full flex items-center justify-center text-white bg-[#1877F2] hover:opacity-90 transition-opacity" aria-label="Facebook">
              <FaFacebookF className="w-5 h-5" />
            </a>
            <a href="https://twitter.com/" className="w-10 h-10 rounded-full flex items-center justify-center text-white bg-black hover:opacity-90 transition-opacity border border-white/20" aria-label="X (Twitter)">
              <FaXTwitter className="w-4 h-4" />
            </a>
            <a href="https://instagram.com/" className="w-10 h-10 rounded-full flex items-center justify-center text-white bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-90 transition-opacity" aria-label="Instagram">
              <FaInstagram className="w-5 h-5" />
            </a>
            <a href="https://linkedin.com/" className="w-10 h-10 rounded-full flex items-center justify-center text-white bg-[#0A66C2] hover:opacity-90 transition-opacity" aria-label="LinkedIn">
              <FaLinkedinIn className="w-4 h-4" />
            </a>
            <a href="https://wa.me/916291111428" className="w-10 h-10 rounded-full flex items-center justify-center text-white bg-[#25D366] hover:opacity-90 transition-opacity" aria-label="WhatsApp">
              <FaWhatsapp className="w-5 h-5" />
            </a>
          </div>

          <div className="inline-flex items-center gap-2 bg-card border border-border rounded-full px-6 py-2 shadow-sm text-sm font-medium text-charcoal">
            <Star className="w-4 h-4 fill-luxury-gold text-luxury-gold" />
            5.0 Google review
          </div>
        </div>

        {/* Contact Details Row */}
        <div className="flex flex-col lg:flex-row items-center justify-between text-center lg:text-left gap-8 mb-16 text-gray-600 text-sm">
          <div className="flex items-center gap-2 justify-center lg:justify-start">
            <span className="text-luxury-gold">📞</span>
            <SmartContactLink type="phone" value="+91 62911 11428" className="hover:text-luxury-gold" />
            <span>/</span>
            <SmartContactLink type="phone" value="+91 62978 68104" className="hover:text-luxury-gold" />
          </div>

          <div className="flex items-center gap-2 justify-center">
            <span className="text-luxury-gold">📍</span>
            <p>Kawakhali Bazar, Kawakhali Road,<br />Siliguri, West Bengal, India, Pin: 734012</p>
          </div>

          <div className="flex flex-col items-center lg:items-end gap-1">
            <div className="flex items-center gap-2">
              <span className="text-luxury-gold">✉</span>
              <SmartContactLink type="email" value="admin07digitaldictionary@gmail.com" className="hover:text-luxury-gold" />
              <span>/</span>
            </div>
            <SmartContactLink type="email" value="supportdigitaldictionary@gmail.com" className="hover:text-luxury-gold ml-6" />
          </div>
        </div>

        {/* Department Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CONTACT_DEPTS.map((dept) => (
            <div key={dept.title} className="bg-card rounded-2xl p-6 text-center border border-border hover:border-luxury-gold transition-all duration-300 hover:-translate-y-1">
              <h4 className="text-[12px] font-bold tracking-widest uppercase text-luxury-gold mb-4">
                {dept.title}
              </h4>
              <div className="space-y-2 text-sm text-gray-600 flex flex-col items-center justify-center">
                <SmartContactLink type="phone" value={dept.phone} className="hover:text-luxury-gold transition-colors flex items-center gap-2">
                  <span className="text-luxury-gold">📞</span> {dept.phone}
                </SmartContactLink>
                <SmartContactLink type="email" value={dept.email} className="hover:text-luxury-gold transition-colors flex items-center gap-2 break-all text-xs">
                  <span className="text-luxury-gold">✉</span> {dept.email}
                </SmartContactLink>
              </div>
            </div>
          ))}
        </div>

        {/* Certifications & Copyright */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-gray-500 order-2 md:order-1 text-center md:text-left">
            &copy; {new Date().getFullYear()} Digital Dictionary. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4 order-1 md:order-2">
            <div className="flex flex-col items-center justify-center">
              <span className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-bold">Registered With</span>
              <div className="bg-white p-3 rounded-xl shadow-sm border border-border/50 hover:border-luxury-gold/50 hover:shadow-md transition-all duration-300">
                <Image 
                  src={msmeLogo} 
                  alt="MSME Udyam Registration - UDYAM-06-0068347" 
                  width={150} 
                  height={60} 
                  className="object-contain"
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
