"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowUpRight, BookOpen, Clock } from "lucide-react";
import Link from "next/link";
import { POSTS } from "@/data/blog";

export default function BlogPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-background overflow-hidden relative">
      <Navbar />
      
      {/* Ambient gold glow */}
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#C5A059]/10 rounded-full blur-[140px] pointer-events-none" />

      <section className="w-full pt-44 pb-16 relative z-10">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-4xl text-center mx-auto">
            <span className="text-xs uppercase tracking-[0.25em] font-bold border-b border-[#E8DFC8] inline-block pb-2 mb-6 text-[#8C6A16]">
              ARTICLES &amp; PERSPECTIVES
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 uppercase text-slate-900 font-serif">
              Our <span className="font-serif italic font-light text-[#B8860B] text-gold-gradient">Insights</span>
            </h1>
            <div className="bg-white border border-[#E8DFC8] rounded-3xl p-6 max-w-2xl mx-auto shadow-sm">
              <p className="text-base md:text-lg text-slate-700 font-normal">
                Thoughts, perspectives, and strategies on technology, design, cybersecurity, and digital growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full pb-32 relative z-10">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {POSTS.map((post) => (
              <Link 
                href={`/blog/${post.id}`} 
                key={post.id} 
                className="group flex flex-col h-full bg-white rounded-[2rem] p-8 border border-[#E8DFC8] hover:border-[#C5A059] transition-all shadow-sm hover:shadow-md hover:-translate-y-1 duration-300 overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#FAF8F3] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                <div className="flex justify-between items-center mb-8 relative z-10">
                  <span className="text-[11px] font-bold tracking-wider uppercase text-[#8C6A16] px-3.5 py-1 bg-[#FAF8F3] border border-[#E8DFC8] rounded-full">
                    {post.category}
                  </span>
                  <span className="text-slate-500 font-medium text-xs flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#B8860B]" />
                    {post.date}
                  </span>
                </div>
                
                <div className="relative z-10 flex flex-col flex-grow">
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 group-hover:text-[#B8860B] transition-colors tracking-tight uppercase leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-slate-600 mb-8 flex-grow font-normal text-sm md:text-base leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs font-bold text-[#8C6A16] group-hover:translate-x-1 transition-transform mt-auto pt-4 border-t border-[#E8DFC8] uppercase tracking-widest">
                    Read Full Article
                    <ArrowUpRight className="w-4 h-4" />
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
