"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, X } from "lucide-react";

export function FloatingCallButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const phoneNumber = "+91 6297868104";
  const telLink = "tel:+916297868104";

  useEffect(() => {
    const checkMobile = () => {
      // Basic mobile detection checking window width and user agent
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
    <div className="fixed bottom-8 left-8 z-50 flex items-end">
      {/* Tooltip / Popup for Desktop */}
      <AnimatePresence>
        {isOpen && !isMobile && (
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute left-20 bottom-0 mb-2 p-6 bg-charcoal/95 backdrop-blur-xl border border-luxury-gold/30 rounded-2xl shadow-2xl w-80"
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-off-white/60 hover:text-luxury-gold transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h4 className="text-luxury-gold font-serif text-xl mb-3">
              Let's Talk!
            </h4>
            <p className="text-off-white/80 text-sm mb-5 leading-relaxed">
              Ready to elevate your digital presence? Give us a call directly to discuss how we can help your business grow.
            </p>
            <a 
              href={telLink}
              className="flex items-center gap-4 bg-black/60 rounded-xl p-4 border border-luxury-gold/20 hover:border-luxury-gold/50 transition-colors group/link cursor-pointer"
            >
              <div className="bg-luxury-gold/20 group-hover/link:bg-luxury-gold/30 transition-colors p-3 rounded-full">
                <Phone className="w-5 h-5 text-luxury-gold" />
              </div>
              <span className="text-off-white font-medium tracking-wide text-lg">
                {phoneNumber}
              </span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <button
        onClick={handleClick}
        className="group relative flex items-center justify-center w-16 h-16 bg-luxury-gold rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] transition-all duration-300 hover:scale-105"
        aria-label="Call Us"
      >
        <div className="absolute inset-0 rounded-full bg-luxury-gold animate-ping opacity-30 group-hover:opacity-40" style={{ animationDuration: '3s' }}></div>
        <Phone className="w-7 h-7 text-charcoal relative z-10" />
      </button>
    </div>
  );
}
