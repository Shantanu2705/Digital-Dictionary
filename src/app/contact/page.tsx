"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SmartContactLink } from "@/components/SmartContactLink";
import { Mail, Phone, MapPin, Send, ShieldCheck, Clock } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "Digital Marketing",
    message: "",
    honeypot: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.honeypot) return;

    const cleanName = formData.name.trim().replace(/[<>]/g, "");
    const cleanEmail = formData.email.trim();
    const cleanPhone = formData.phone.trim();
    const cleanCompany = formData.company.trim().replace(/[<>]/g, "");
    const cleanService = formData.service;
    const cleanMessage = formData.message.trim().replace(/[<>]/g, "");

    const text = `*New Enquiry from Digital Dictionary Website*%0A%0A*Name:* ${encodeURIComponent(cleanName)}%0A*Email:* ${encodeURIComponent(cleanEmail)}%0A*Phone:* ${encodeURIComponent(cleanPhone)}%0A*Company:* ${encodeURIComponent(cleanCompany)}%0A*Service Required:* ${encodeURIComponent(cleanService)}%0A*Message:* ${encodeURIComponent(cleanMessage)}`;
    const whatsappUrl = `https://wa.me/916291111428?text=${text}`;
    
    setSubmitted(true);
    window.open(whatsappUrl, "_blank");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-[#FAFAF8] overflow-hidden relative">
      <Navbar />

      {/* Ambient gold glow */}
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#D4AF37]/5 rounded-full blur-[150px] pointer-events-none" />
      
      <section className="w-full pt-44 pb-24 relative z-10 border-b border-[#E5E5E2]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <span className="text-xs uppercase tracking-widest font-semibold text-[#A67C22] block mb-3">
              Direct Advisory &amp; Client Inquiries
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-medium tracking-tight mb-6 text-[#101010] leading-[1.15]">
              Connect With Our <br />
              <span className="italic font-light text-[#A67C22]">Strategy &amp; Technology Team.</span>
            </h1>
            <div className="bg-white border border-[#E5E5E2] rounded-2xl p-6 max-w-2xl mx-auto shadow-2xs">
              <p className="text-base text-[#1B1B1B]/80 font-normal leading-relaxed">
                Submit your project specifications or contact our studio directly. Our engineering leadership will review your requirements and respond with architectural guidance within 24 hours.
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 max-w-6xl mx-auto">
            {/* Contact Info Sidebar */}
            <div className="w-full lg:w-1/3 space-y-6">
              <div className="bg-white border border-[#E5E5E2] rounded-2xl p-7 shadow-xs">
                <div className="flex items-center gap-3 mb-5 border-b border-[#E5E5E2] pb-3">
                  <Mail className="w-5 h-5 text-[#A67C22]" />
                  <h3 className="text-xs uppercase tracking-widest text-[#A67C22] font-bold">Direct Channels</h3>
                </div>
                <div className="space-y-4 text-slate-700 text-sm font-medium">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#777777] block mb-1">General Inquiries</span>
                    <SmartContactLink type="email" value="admin07digitaldictionary@gmail.com" className="block text-[#101010] hover:text-[#A67C22] transition-colors break-all" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#777777] block mb-1">Internship &amp; Hiring</span>
                    <SmartContactLink type="email" value="hr@digitaldictionary.in" className="block text-[#A67C22] hover:underline font-bold break-all" />
                  </div>
                  <div className="pt-2 border-t border-[#E5E5E2]">
                    <span className="text-[10px] uppercase tracking-wider text-[#777777] block mb-1">Phone / WhatsApp</span>
                    <SmartContactLink type="phone" value="+91 62911 11428" className="block text-[#101010] hover:text-[#A67C22] transition-colors" />
                    <SmartContactLink type="phone" value="+91 62978 68104" className="block text-[#101010] hover:text-[#A67C22] transition-colors mt-1" />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#E5E5E2] rounded-2xl p-7 shadow-xs">
                <div className="flex items-center gap-3 mb-5 border-b border-[#E5E5E2] pb-3">
                  <MapPin className="w-5 h-5 text-[#A67C22]" />
                  <h3 className="text-xs uppercase tracking-widest text-[#A67C22] font-bold">Studio Location</h3>
                </div>
                <p className="text-[#101010] text-sm leading-relaxed">
                  Kawakhali Bazar,<br />
                  Kawakhali Road,<br />
                  Siliguri, West Bengal, India,<br />
                  PIN: 734012
                </p>
                <div className="mt-4 pt-4 border-t border-[#E5E5E2] flex items-center gap-2 text-xs text-[#777777]">
                  <Clock className="w-4 h-4 text-[#A67C22]" />
                  <span>Mon &ndash; Sat: 10:00 AM &ndash; 7:00 PM IST</span>
                </div>
              </div>

              <div className="bg-[#F2F2F0] border border-[#E5E5E2] rounded-2xl p-6 shadow-2xs">
                <div className="flex items-center gap-3 mb-2">
                  <ShieldCheck className="w-5 h-5 text-[#A67C22]" />
                  <span className="text-xs uppercase tracking-wider font-bold text-[#101010]">Client Guarantee</span>
                </div>
                <p className="text-xs text-[#777777] leading-relaxed">
                  Every project is covered by a milestone agreement, enterprise-grade Next.js architecture, and guaranteed 99.9% uptime deployment.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="w-full lg:w-2/3">
              <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-2xl border border-[#E5E5E2] shadow-xs relative overflow-hidden">
                <input 
                  type="text" 
                  name="honeypot" 
                  value={formData.honeypot} 
                  onChange={handleChange} 
                  className="hidden" 
                  tabIndex={-1} 
                  autoComplete="off" 
                />

                <div className="relative z-10">
                  <h2 className="text-xl md:text-2xl font-serif text-[#101010] mb-2 uppercase tracking-wide">
                    Project Consultation Form
                  </h2>
                  <p className="text-xs text-[#777777] mb-8">
                    Share your requirements with our technical team for a free estimation and architecture blueprint.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-xs font-bold text-[#A67C22] mb-2 uppercase tracking-wider">
                        Full Name *
                      </label>
                      <input 
                        required
                        type="text" 
                        id="name" 
                        name="name"
                        maxLength={100}
                        placeholder="e.g. Rahul Sharma"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-[#F2F2F0] border border-[#E5E5E2] rounded-xl px-4 py-3 text-[#101010] outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:bg-white transition-all text-sm placeholder:text-[#777777]" 
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs font-bold text-[#A67C22] mb-2 uppercase tracking-wider">
                        Email Address *
                      </label>
                      <input 
                        required
                        type="email" 
                        id="email" 
                        name="email"
                        maxLength={254}
                        placeholder="e.g. rahul@company.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-[#F2F2F0] border border-[#E5E5E2] rounded-xl px-4 py-3 text-[#101010] outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:bg-white transition-all text-sm placeholder:text-[#777777]" 
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-xs font-bold text-[#A67C22] mb-2 uppercase tracking-wider">
                        Phone Number *
                      </label>
                      <input 
                        required
                        type="tel" 
                        id="phone" 
                        name="phone"
                        maxLength={30}
                        placeholder="e.g. +91 98765 43210"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-[#F2F2F0] border border-[#E5E5E2] rounded-xl px-4 py-3 text-[#101010] outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:bg-white transition-all text-sm placeholder:text-[#777777]" 
                      />
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-xs font-bold text-[#A67C22] mb-2 uppercase tracking-wider">
                        Company / Brand Name
                      </label>
                      <input 
                        type="text" 
                        id="company" 
                        name="company"
                        maxLength={150}
                        placeholder="e.g. Apex Hospital / Shivaay Corp"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full bg-[#F2F2F0] border border-[#E5E5E2] rounded-xl px-4 py-3 text-[#101010] outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:bg-white transition-all text-sm placeholder:text-[#777777]" 
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="service" className="block text-xs font-bold text-[#A67C22] mb-2 uppercase tracking-wider">
                      Service or Product Required *
                    </label>
                    <select 
                      id="service" 
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full bg-[#F2F2F0] border border-[#E5E5E2] rounded-xl px-4 py-3 text-[#101010] outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:bg-white transition-all text-sm font-medium"
                    >
                      <option value="Single-Page Express Landing Page (₹12,000)">Single-Page Express Landing Page (₹12,000)</option>
                      <option value="Starter Business Website - 5 Pages (₹25,000)">Starter Business Website - 5 Pages (₹25,000)</option>
                      <option value="Growth Corporate Website - 10 Pages (₹35,000)">Growth Corporate Website - 10 Pages (₹35,000)</option>
                      <option value="Enterprise B2B Authority Portal (₹49,000+)">Enterprise B2B Authority Portal (₹49,000+)</option>
                      <option value="D2C E-Commerce Store (₹65,000)">D2C E-Commerce Store (₹65,000)</option>
                      <option value="Native Mobile App MVP (₹65,000)">Native Mobile App MVP (₹65,000)</option>
                      <option value="Omnichannel Combo: Web + Native App (₹75,000)">Omnichannel Combo: Web + Native App (₹75,000)</option>
                      <option value="Service / Booking Fleet App (₹1,25,000+)">Service / Booking Fleet App (₹1,25,000+)</option>
                      <option value="Digital Marketing & Performance Ads">Digital Marketing &amp; Performance Ads</option>
                      <option value="SEO Service & Local Google Maps">SEO Service &amp; Local Google Maps</option>
                      <option value="Brand Identity & Graphic Designing">Brand Identity &amp; Graphic Designing</option>
                      <option value="Custom Software Development">Custom Software Development</option>
                    </select>
                  </div>

                  <div className="mb-8">
                    <label htmlFor="message" className="block text-xs font-bold text-[#A67C22] mb-2 uppercase tracking-wider">
                      Project Details &amp; Objectives *
                    </label>
                    <textarea 
                      required
                      id="message" 
                      name="message" 
                      rows={4}
                      maxLength={2000}
                      placeholder="Describe your target audience, timeline, specific features needed, and key business goals..."
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full bg-[#F2F2F0] border border-[#E5E5E2] rounded-xl px-4 py-3 text-[#101010] outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:bg-white transition-all text-sm resize-none placeholder:text-[#777777]" 
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-[#D4AF37] via-[#E8D18A] to-[#A67C22] hover:from-[#A67C22] hover:to-[#D4AF37] text-[#101010] font-bold tracking-widest uppercase text-xs sm:text-sm py-4 rounded-xl hover:-translate-y-0.5 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border border-[#E8D18A]/60"
                  >
                    <Send className="w-4 h-4 text-[#101010]" />
                    Submit Project Enquiry
                  </button>

                  {submitted && (
                    <div className="mt-4 p-4 rounded-xl bg-[#F2F2F0] border border-[#D4AF37] text-center">
                      <p className="text-xs text-[#A67C22] font-bold">
                        Thank you! We are redirecting you to our official WhatsApp channel for instantaneous response.
                      </p>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
