"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { POSTS } from "@/data/blog";

export default function BlogPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-background">
      <Navbar />
      
      <section className="w-full pt-48 pb-24 border-b border-border/50 bg-background">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-medium tracking-tighter text-charcoal mb-6">
              Our <span className="font-serif italic text-luxury-gold">Insights</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl font-light">
              Thoughts, perspectives, and strategies on technology, design, and digital growth.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full py-24">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {POSTS.map((post) => (
              <Link href={`/blog/${post.id}`} key={post.id} className="group flex flex-col h-full bg-card rounded-3xl p-8 border border-border/50 hover:border-luxury-gold/50 transition-colors shadow-sm">
                <div className="flex justify-between items-start mb-16">
                  <span className="text-sm font-medium tracking-wider uppercase text-luxury-gold px-3 py-1 bg-luxury-gold/10 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-gray-600 text-sm">{post.date}</span>
                </div>
                
                <h3 className="text-2xl font-medium text-charcoal mb-4 group-hover:text-luxury-gold transition-colors tracking-tight">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-8 flex-grow font-light leading-relaxed">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center gap-2 text-sm font-medium text-charcoal group-hover:text-luxury-gold transition-colors">
                  Read Article
                  <ArrowUpRight className="w-4 h-4" />
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
