"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, X } from "lucide-react";

export function FloatingCallButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const phoneNumber = "+91 62978 68104";
  const telLink = "tel:+916297868104";

  useEffect(() => {
    const checkMobile = () => {
      const mobileAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(window.innerWidth < 768 || mobileAgent);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleClick = () => {
    if (isMobile) {
      window.location.href = telLink;
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-[99999] flex items-end">
      {/* Tooltip / Popup for Desktop */}
      <AnimatePresence>
        {isOpen && !isMobile && (
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute left-20 bottom-0 mb-2 p-6 bg-white/98 backdrop-blur-2xl border border-[#E8DFC8] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] w-80 text-left"
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-[#B8860B] transition-colors"
              aria-label="Close call modal"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="inline-block px-3 py-1 rounded-full bg-[#FAF8F3] border border-[#E8DFC8] text-[#8C6A16] text-[10px] font-bold tracking-widest uppercase mb-3">
              Direct Phone Line
            </div>
            <h4 className="text-slate-900 font-serif text-xl mb-2">
              Let&apos;s Talk!
            </h4>
            <p className="text-slate-600 text-xs mb-5 leading-relaxed">
              Ready to elevate your digital presence? Give us a call directly to discuss your project requirements.
            </p>
            <a 
              href={telLink}
              className="flex items-center gap-3.5 bg-[#FAF8F3] rounded-2xl p-3.5 border border-[#E8DFC8] hover:border-[#C5A059] hover:bg-white transition-all group/link cursor-pointer shadow-sm"
            >
              <div className="bg-[#C5A059]/20 group-hover/link:bg-[#C5A059] transition-colors p-2.5 rounded-full text-[#8C6A16] group-hover/link:text-white">
                <Phone className="w-4 h-4" />
              </div>
              <span className="text-slate-900 font-semibold tracking-wider text-sm">
                {phoneNumber}
              </span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <button
        onClick={handleClick}
        className="group relative flex items-center justify-center w-14 h-14 bg-gradient-to-r from-[#DFB76C] via-[#F2D675] to-[#C5A059] rounded-full shadow-[0_4px_25px_rgba(197,160,89,0.5)] hover:shadow-[0_4px_35px_rgba(197,160,89,0.8)] transition-all duration-300 hover:scale-105"
        aria-label="Call Us"
      >
        <div className="absolute inset-0 rounded-full bg-[#C5A059] animate-ping opacity-25 group-hover:opacity-40" style={{ animationDuration: '2.5s' }} />
        <Phone className="w-6 h-6 text-slate-900 relative z-10" />
      </button>
    </div>
  );
}
