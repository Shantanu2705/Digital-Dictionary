import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { POSTS } from "@/data/blog";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Tag } from "lucide-react";
import React from "react";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const post = POSTS.find((p) => p.id.toString() === resolvedParams.id);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    keywords: [post.category, "Digital Dictionary Blog", "Digital Insights", "Web Development Trends"],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `https://digitaldictionary.in/blog/${post.id}`,
    },
    alternates: {
      canonical: `/blog/${post.id}`,
    }
  };
}

export default function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const post = POSTS.find((p) => p.id.toString() === resolvedParams.id);

  if (!post) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-[#FAFAF8] overflow-hidden relative">
      <Navbar />
      
      {/* Ambient gold glow */}
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none" />

      <article className="w-full pt-44 pb-32 min-h-screen relative z-10">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-[#A67C22] hover:underline transition-all text-xs uppercase tracking-widest font-bold mb-10"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Insights
          </Link>

          <div className="bg-white p-8 md:p-12 rounded-2xl border border-[#E5E5E2] shadow-xs mb-10">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="text-xs font-bold tracking-wider uppercase text-[#A67C22] px-3.5 py-1 bg-[#F2F2F0] border border-[#E5E5E2] rounded-full flex items-center gap-1.5">
                <Tag className="w-3 h-3 text-[#A67C22]" />
                {post.category}
              </span>
              <span className="text-[#777777] text-xs flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-[#A67C22]" />
                {post.date}
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium tracking-tight text-[#101010] mb-8 leading-tight">
              {post.title}
            </h1>
            
            <p className="text-lg md:text-xl text-[#1B1B1B]/80 font-normal leading-relaxed border-l-2 border-[#D4AF37] pl-6">
              {post.excerpt}
            </p>
          </div>

          <div className="bg-white p-8 md:p-12 rounded-2xl border border-[#E5E5E2] text-[#1B1B1B]/80 leading-relaxed space-y-6 text-base md:text-lg shadow-xs">
            {post.content.split('\n').map((paragraph, index) => {
              if (paragraph.trim().startsWith('##')) {
                return (
                  <h2 key={index} className="text-2xl md:text-3xl font-serif text-[#101010] mt-10 mb-4 pt-4 border-t border-[#E5E5E2] first:mt-0 first:pt-0 first:border-none">
                    {paragraph.replace('##', '').trim()}
                  </h2>
                );
              } else if (paragraph.trim().startsWith('#')) {
                return null;
              } else if (paragraph.trim()) {
                return <p key={index} className="leading-relaxed text-[#1B1B1B]/80">{paragraph}</p>;
              }
              return null;
            })}
          </div>

          {/* Share & Back */}
          <div className="mt-12 flex items-center justify-between pt-8 border-t border-[#E5E5E2]">
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-2 text-[#A67C22] hover:underline text-xs uppercase tracking-widest font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              All Insights
            </Link>

            <Link
              href="/contact"
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#E8D18A] to-[#A67C22] hover:from-[#A67C22] hover:to-[#D4AF37] text-[#101010] font-bold text-xs uppercase tracking-widest shadow-sm hover:-translate-y-0.5 transition-all"
            >
              Consult With Our Team
            </Link>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}
