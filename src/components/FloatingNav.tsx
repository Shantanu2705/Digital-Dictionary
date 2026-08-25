import { Mail } from "lucide-react";
import Link from "next/link";
import { SmartContactLink } from "./SmartContactLink";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa6";

export function FloatingNav() {
  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-4">
      {/* Gold Get In Touch Button */}
      <Link 
        href="/contact" 
        className="bg-luxury-gold hover:bg-bright-gold text-charcoal flex flex-col items-center justify-center py-6 px-3 rounded-l-2xl shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all cursor-pointer group"
      >
        <span 
          className="text-xs font-bold tracking-widest whitespace-nowrap mb-6 rotate-180" 
          style={{ writingMode: 'vertical-rl' }}
        >
          GET IN TOUCH
        </span>
        <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </Link>

      {/* Social Floating Icons */}
      <div className="flex flex-col gap-3 pr-3">
        <a 
          href="https://wa.me/916291111428"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full flex items-center justify-center text-white bg-[#25D366] hover:opacity-90 transition-opacity shadow-lg"
          aria-label="WhatsApp"
        >
           <FaWhatsapp className="w-5 h-5" />
        </a>
        <a 
          href="https://www.facebook.com/profile.php?id=61577401455688" 
          className="w-10 h-10 rounded-full flex items-center justify-center text-white bg-[#1877F2] hover:opacity-90 transition-opacity shadow-lg"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
        >
          <FaFacebookF className="w-5 h-5" />
        </a>
        <a 
          href="https://instagram.com" 
          className="w-10 h-10 rounded-full flex items-center justify-center text-white bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-90 transition-opacity shadow-lg"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <FaInstagram className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
}
