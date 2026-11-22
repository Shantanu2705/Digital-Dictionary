"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowUpRight, Clock } from "lucide-react";
import Link from "next/link";
import { POSTS } from "@/data/blog";

export default function BlogPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-[#FAFAF8] overflow-hidden relative">
      <Navbar />
      
      {/* Ambient gold glow */}
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none" />

      <section className="w-full pt-44 pb-16 relative z-10 border-b border-[#E5E5E2]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-4xl text-center mx-auto">
            <span className="text-xs uppercase tracking-widest font-bold text-[#A67C22] inline-block mb-3">
              ARTICLES &amp; PERSPECTIVES
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 uppercase text-[#101010] font-serif">
              Our <span className="font-serif italic font-light text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#E8D18A] to-[#A67C22]">Insights</span>
            </h1>
            <div className="bg-white border border-[#E5E5E2] rounded-2xl p-6 max-w-2xl mx-auto shadow-2xs">
              <p className="text-base md:text-lg text-[#1B1B1B]/80 font-normal">
                Thoughts, perspectives, and strategies on technology, design, cybersecurity, and digital growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-20 pb-32 relative z-10">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {POSTS.map((post) => (
              <Link 
                href={`/blog/${post.id}`} 
                key={post.id} 
                className="group flex flex-col h-full bg-white rounded-2xl p-8 border border-[#E5E5E2] hover:border-[#D4AF37] transition-all shadow-xs hover:shadow-lg hover:-translate-y-1 duration-300 overflow-hidden relative"
              >
                <div className="flex justify-between items-center mb-6 relative z-10">
                  <span className="text-[11px] font-bold tracking-wider uppercase text-[#A67C22] px-3 py-1 bg-[#F2F2F0] border border-[#E5E5E2] rounded-full">
                    {post.category}
                  </span>
                  <span className="text-[#777777] font-medium text-xs flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#A67C22]" />
                    {post.date}
                  </span>
                </div>
                
                <div className="relative z-10 flex flex-col flex-grow">
                  <h2 className="text-xl font-bold text-[#101010] mb-3 group-hover:text-[#A67C22] transition-colors tracking-tight uppercase leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-[#777777] mb-6 flex-grow font-normal text-sm leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs font-bold text-[#101010] group-hover:text-[#A67C22] transition-colors mt-auto pt-4 border-t border-[#E5E5E2] uppercase tracking-widest">
                    <span>Read Full Article</span>
                    <ArrowUpRight className="w-4 h-4 text-[#A67C22] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
