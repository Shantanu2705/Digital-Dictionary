"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { POSTS } from "@/data/blog";
import { DynamicTextColor } from "@/components/DynamicTextColor";

export default function BlogPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-background">
      <Navbar />
      
      <section className="w-full pt-48 pb-24 relative z-10">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-4xl text-center mx-auto">
            <DynamicTextColor as="h1" className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 uppercase">
              Our <span className="font-serif italic font-light text-charcoal">Insights</span>
            </DynamicTextColor>
            <div className="bg-white/10 backdrop-blur-md border border-luxury-gold/30 rounded-3xl p-6 max-w-2xl mx-auto shadow-sm">
              <p className="text-xl text-charcoal font-semibold">
                Thoughts, perspectives, and strategies on technology, design, and digital growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full pb-24 relative z-10">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {POSTS.map((post) => (
              <Link href={`/blog/${post.id}`} key={post.id} className="group flex flex-col h-full bg-white/10 backdrop-blur-2xl rounded-[2rem] p-8 border border-luxury-gold/30 hover:bg-white/20 transition-all shadow-[0_10px_40px_rgba(212,175,55,0.1)] hover:shadow-[0_15px_50px_rgba(212,175,55,0.2)] hover:-translate-y-2 duration-500 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="flex justify-between items-start mb-12 relative z-10">
                  <span className="text-xs font-bold tracking-wider uppercase text-charcoal px-4 py-1.5 bg-white/30 border border-luxury-gold/20 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-charcoal font-bold text-sm bg-white/30 px-3 py-1 rounded-full">{post.date}</span>
                </div>
                
                <div className="relative z-10 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-charcoal mb-4 group-hover:text-charcoal transition-colors tracking-tight uppercase leading-snug drop-shadow-[0_1px_1px_rgba(255,255,255,1)]">
                    {post.title}
                  </h3>
                  <p className="text-charcoal mb-8 flex-grow font-semibold leading-relaxed drop-shadow-[0_1px_1px_rgba(255,255,255,1)]">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-2 text-sm font-bold text-charcoal group-hover:text-charcoal transition-colors mt-auto pt-4 border-t border-luxury-gold/20">
                    Read Article
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
