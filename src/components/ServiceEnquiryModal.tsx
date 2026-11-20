"use client";

import { useState, useEffect } from "react";
import { X, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceEnquiryModalProps {
  serviceTitle: string;
}

export function ServiceEnquiryModal({ serviceTitle }: ServiceEnquiryModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasClosed, setHasClosed] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasClosed) {
        setIsOpen(true);
      }
    }, 18000);

    return () => clearTimeout(timer);
  }, [hasClosed]);

  const handleClose = () => {
    setIsOpen(false);
    setHasClosed(true);
  };

  const handleSendEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneNumber = "916297868104";
    const cleanName = name.trim().replace(/[<>]/g, "");
    const cleanMessage = message.trim().replace(/[<>]/g, "");
    const defaultMessage = `Hello, I am interested in the ${serviceTitle} service.\n\nMy name is ${cleanName}.`;
    const finalMessage = cleanMessage ? `${defaultMessage}\n\n${cleanMessage}` : defaultMessage;
    
    const encodedMessage = encodeURIComponent(finalMessage);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    handleClose();
    window.open(whatsappUrl, "_blank");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
        onClick={handleClose}
      />
      
      <div 
        className={cn(
          "relative w-full max-w-md bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden border border-[#E8DFC8]",
          "animate-in fade-in zoom-in duration-300"
        )}
      >
        {/* Header */}
        <div className="bg-[#FAF8F3] p-6 text-center relative border-b border-[#E8DFC8]">
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E8DFC8] text-[#8C6A16] text-[10px] font-bold tracking-widest uppercase mb-2 shadow-sm">
            <Sparkles className="w-3 h-3 text-[#B8860B]" />
            Quick Consultation
          </div>
          <h2 className="text-xl font-serif text-slate-900">
            Interested in {serviceTitle}?
          </h2>
        </div>

        {/* Body */}
        <div className="p-8">
          <p className="text-xs text-slate-600 mb-6 text-center leading-relaxed">
            Connect directly with our technical leadership team to discuss scope and timelines.
          </p>

          <form onSubmit={handleSendEnquiry} className="space-y-4">
            <div>
              <label htmlFor="modal-name" className="block text-xs font-bold text-[#8C6A16] mb-1.5 text-left uppercase tracking-wider">
                Your Name *
              </label>
              <input
                id="modal-name"
                type="text"
                required
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#FAF8F3] border border-[#E8DFC8] focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] focus:bg-white outline-none transition-all text-sm text-slate-900 placeholder:text-slate-400"
                placeholder="e.g. Rahul Sharma"
              />
            </div>

            <div>
              <label htmlFor="modal-message" className="block text-xs font-bold text-[#8C6A16] mb-1.5 text-left uppercase tracking-wider">
                Project Notes (Optional)
              </label>
              <textarea
                id="modal-message"
                rows={3}
                maxLength={2000}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#FAF8F3] border border-[#E8DFC8] focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] focus:bg-white outline-none transition-all text-sm resize-none text-slate-900 placeholder:text-slate-400"
                placeholder="Briefly tell us what you'd like to build..."
              />
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-gradient-to-r from-[#DFB76C] via-[#F2D675] to-[#C5A059] text-slate-900 py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 text-slate-900" />
              Chat on WhatsApp Directly
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
