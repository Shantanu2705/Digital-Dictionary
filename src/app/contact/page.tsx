"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SmartContactLink } from "@/components/SmartContactLink";
import { DynamicTextColor } from "@/components/DynamicTextColor";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "Digital Marketing",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `*New Enquiry from Website*%0A%0A*Name:* ${formData.name}%0A*Email:* ${formData.email}%0A*Phone:* ${formData.phone}%0A*Company:* ${formData.company}%0A*Service Required:* ${formData.service}%0A*Message:* ${formData.message}`;
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/916291111428?text=${encodedText}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-background">
      <Navbar />
      
      <section className="w-full pt-40 pb-24 relative z-10">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <DynamicTextColor as="h1" className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 uppercase">
              Let&apos;s build something <br />
              <span className="font-serif italic font-light text-charcoal">worth remembering.</span>
            </DynamicTextColor>
            <div className="bg-white/10 backdrop-blur-md border border-luxury-gold/30 rounded-3xl p-6 max-w-2xl mx-auto shadow-sm">
              <p className="text-xl text-charcoal font-semibold">
                Fill out the form below or reach out to us directly. We&apos;ll get back to you within 24 hours.
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-16 lg:gap-8 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div className="w-full lg:w-1/3 space-y-8">
              <div className="bg-white/10 backdrop-blur-xl border border-luxury-gold/30 rounded-[2rem] p-8 shadow-[0_10px_40px_rgba(212,175,55,0.1)]">
                <h3 className="text-sm uppercase tracking-widest text-charcoal font-bold mb-6 border-b border-luxury-gold/20 pb-2">Contact</h3>
                <div className="space-y-4 text-charcoal text-lg font-semibold drop-shadow-[0_1px_1px_rgba(255,255,255,1)]">
                  <SmartContactLink type="email" value="supportdigitaldictionary@gmail.com" className="block hover:text-charcoal transition-colors break-all" />
                  <SmartContactLink type="email" value="admin07digitaldictionary@gmail.com" className="block hover:text-charcoal transition-colors break-all" />
                  <SmartContactLink type="phone" value="+91 62911 11428" className="block hover:text-charcoal transition-colors mt-6" />
                  <SmartContactLink type="phone" value="+91 62978 68104" className="block hover:text-charcoal transition-colors" />
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-xl border border-luxury-gold/30 rounded-[2rem] p-8 shadow-[0_10px_40px_rgba(212,175,55,0.1)]">
                <h3 className="text-sm uppercase tracking-widest text-charcoal font-bold mb-6 border-b border-luxury-gold/20 pb-2">Location</h3>
                <p className="text-charcoal text-lg leading-relaxed font-semibold drop-shadow-[0_1px_1px_rgba(255,255,255,1)]">
                  Kawakhali Bazar,<br />
                  Kawakhali Road,<br />
                  Siliguri, West Bengal, India,<br />
                  Pin: 734012
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="w-full lg:w-2/3">
              <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-2xl p-8 md:p-12 rounded-[3rem] border border-luxury-gold/30 shadow-[0_10px_40px_rgba(212,175,55,0.15)] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/5 to-transparent pointer-events-none" />
                <div className="relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                      <label htmlFor="name" className="block text-sm font-bold text-charcoal mb-2 uppercase tracking-wider">Full Name *</label>
                      <input 
                        required
                        type="text" 
                        id="name" 
                        name="name"
                        maxLength={100}
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-white/40 border border-luxury-gold/30 rounded-xl px-4 py-3 text-charcoal outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold focus:bg-white/60 transition-all font-semibold" 
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-bold text-charcoal mb-2 uppercase tracking-wider">Email Address *</label>
                      <input 
                        required
                        type="email" 
                        id="email" 
                        name="email"
                        maxLength={254}
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-white/40 border border-luxury-gold/30 rounded-xl px-4 py-3 text-charcoal outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold focus:bg-white/60 transition-all font-semibold" 
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-bold text-charcoal mb-2 uppercase tracking-wider">Phone Number</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        name="phone"
                        maxLength={30}
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-white/40 border border-luxury-gold/30 rounded-xl px-4 py-3 text-charcoal outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold focus:bg-white/60 transition-all font-semibold" 
                      />
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-sm font-bold text-charcoal mb-2 uppercase tracking-wider">Company Name</label>
                      <input 
                        type="text" 
                        id="company" 
                        name="company"
                        maxLength={150}
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full bg-white/40 border border-luxury-gold/30 rounded-xl px-4 py-3 text-charcoal outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold focus:bg-white/60 transition-all font-semibold" 
                      />
                    </div>
                  </div>

                  <div className="mb-8">
                    <label htmlFor="service" className="block text-sm font-bold text-charcoal mb-2 uppercase tracking-wider">Service Required *</label>
                    <select 
                      id="service" 
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full bg-white/40 border border-luxury-gold/30 rounded-xl px-4 py-3 text-charcoal outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold focus:bg-white/60 transition-all font-semibold"
                    >
                      <option value="Digital Marketing">Digital Marketing</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Software Development">Software Development</option>
                      <option value="eCommerce Development">eCommerce Development</option>
                      <option value="App Development">App Development</option>
                      <option value="Brand Identity Design">Brand Identity Design</option>
                      <option value="Website Design">Website Design</option>
                      <option value="SEO Service">SEO Service</option>
                    </select>
                  </div>

                  <div className="mb-8">
                    <label htmlFor="message" className="block text-sm font-bold text-charcoal mb-2 uppercase tracking-wider">Project Details *</label>
                    <textarea 
                      required
                      id="message" 
                      name="message" 
                      rows={4}
                      maxLength={2000}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full bg-white/40 border border-luxury-gold/30 rounded-xl px-4 py-3 text-charcoal outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold focus:bg-white/60 transition-all font-semibold resize-none" 
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-[#B38728] via-[#FBF5B7] to-[#B38728] text-charcoal font-bold tracking-widest uppercase text-sm py-5 rounded-xl hover:-translate-y-1 transition-all shadow-[0_4px_15px_rgba(212,175,55,0.4)] hover:shadow-[0_10px_25px_rgba(212,175,55,0.6)]"
                  >
                    Send Enquiry
                  </button>
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
