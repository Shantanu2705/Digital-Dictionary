"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SmartContactLink } from "@/components/SmartContactLink";

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
      
      <section className="w-full pt-40 pb-24">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-medium tracking-tighter text-charcoal mb-6">
              Let&apos;s build something <br />
              <span className="font-serif italic text-luxury-gold">worth remembering.</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
              Fill out the form below or reach out to us directly. We&apos;ll get back to you within 24 hours.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-16 lg:gap-8 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div className="w-full lg:w-1/3 space-y-12">
              <div>
                <h3 className="text-sm uppercase tracking-widest text-luxury-gold font-medium mb-4">Contact</h3>
                <div className="space-y-4 text-charcoal text-lg">
                  <SmartContactLink type="email" value="supportdigitaldictionary@gmail.com" className="block hover:text-luxury-gold transition-colors" />
                  <SmartContactLink type="email" value="admin07digitaldictionary@gmail.com" className="block hover:text-luxury-gold transition-colors" />
                  <SmartContactLink type="phone" value="+91 62911 11428" className="block hover:text-luxury-gold transition-colors mt-4" />
                  <SmartContactLink type="phone" value="+91 62978 68104" className="block hover:text-luxury-gold transition-colors" />
                </div>
              </div>

              <div>
                <h3 className="text-sm uppercase tracking-widest text-luxury-gold font-medium mb-4">Location</h3>
                <p className="text-gray-600 text-lg leading-relaxed font-light">
                  Kawakhali Bazar,<br />
                  Kawakhali Road,<br />
                  Siliguri, West Bengal, India,<br />
                  Pin: 734012
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="w-full lg:w-2/3">
              <form onSubmit={handleSubmit} className="bg-card p-8 md:p-12 rounded-[32px] border border-border/50 shadow-[0_0_40px_rgba(255,255,255,0.02)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-2">Full Name *</label>
                    <input 
                      required
                      type="text" 
                      id="name" 
                      name="name"
                      maxLength={100}
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-charcoal outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold transition-all" 
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-2">Email Address *</label>
                    <input 
                      required
                      type="email" 
                      id="email" 
                      name="email"
                      maxLength={254}
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-charcoal outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold transition-all" 
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-600 mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone"
                      maxLength={30}
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-charcoal outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold transition-all" 
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-600 mb-2">Company Name</label>
                    <input 
                      type="text" 
                      id="company" 
                      name="company"
                      maxLength={150}
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-charcoal outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold transition-all" 
                    />
                  </div>
                </div>

                <div className="mb-8">
                  <label htmlFor="service" className="block text-sm font-medium text-gray-600 mb-2">Service Required *</label>
                  <select 
                    id="service" 
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-charcoal outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold transition-all"
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
                  <label htmlFor="message" className="block text-sm font-medium text-gray-600 mb-2">Project Details *</label>
                  <textarea 
                    required
                    id="message" 
                    name="message" 
                    rows={4}
                    maxLength={2000}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-charcoal outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold transition-all resize-none" 
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-charcoal text-white font-bold py-4 rounded-xl hover:bg-luxury-gold transition-colors active:scale-[0.98]"
                >
                  Send Enquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
