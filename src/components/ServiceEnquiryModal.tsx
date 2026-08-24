"use client";

import { useState, useEffect } from "react";
import { X, Send } from "lucide-react";
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
    // Show modal after 15 seconds if it hasn't been closed by the user
    const timer = setTimeout(() => {
      if (!hasClosed) {
        setIsOpen(true);
      }
    }, 15000);

    return () => clearTimeout(timer);
  }, [hasClosed]);

  const handleClose = () => {
    setIsOpen(false);
    setHasClosed(true);
  };

  const handleSendEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneNumber = "916297868104"; // Provided by user
    const defaultMessage = `Hello, I am interested in the ${serviceTitle} service.\n\nMy name is ${name}.`;
    const finalMessage = message ? `${defaultMessage}\n\n${message}` : defaultMessage;
    
    const encodedMessage = encodeURIComponent(finalMessage);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Close the modal
    handleClose();
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={handleClose}
      />
      
      <div 
        className={cn(
          "relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100",
          "animate-in fade-in zoom-in duration-300"
        )}
      >
        {/* Header */}
        <div className="bg-charcoal p-6 text-center relative">
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-[11px] font-bold tracking-widest text-luxury-gold uppercase mb-2">
            Quick Enquiry
          </h3>
          <h2 className="text-xl font-medium text-white">
            Interested in {serviceTitle}?
          </h2>
        </div>

        {/* Body */}
        <div className="p-8">
          <p className="text-sm text-gray-500 mb-6 text-center">
            Fill out the form below to discuss your project requirements.
          </p>

          <form onSubmit={handleSendEnquiry} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1 text-left">
                Your Name *
              </label>
              <input
                id="name"
                type="text"
                required
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold outline-none transition-all text-sm text-charcoal"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-xs font-medium text-gray-700 mb-1 text-left">
                Additional Message (Optional)
              </label>
              <textarea
                id="message"
                rows={3}
                maxLength={2000}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold outline-none transition-all text-sm resize-none text-charcoal"
                placeholder="Tell us a bit about your project..."
              />
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-charcoal hover:bg-charcoal/90 text-white py-3.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send Enquiry
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
