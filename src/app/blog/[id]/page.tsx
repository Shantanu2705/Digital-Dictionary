import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { POSTS } from "@/data/blog";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import React from "react";

export default function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const post = POSTS.find((p) => p.id.toString() === resolvedParams.id);

  if (!post) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-white">
      <Navbar />
      
      <article className="w-full pt-48 pb-24 bg-background min-h-screen">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-gray-500 hover:text-charcoal transition-colors mb-12"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Insights
          </Link>

          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium tracking-wider uppercase text-charcoal px-3 py-1 bg-luxury-gold/10 rounded-full">
                {post.category}
              </span>
              <span className="text-soft-charcoal text-sm">{post.date}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-medium tracking-tight text-charcoal mb-6">
              {post.title}
            </h1>
            <p className="text-xl text-soft-charcoal">
              {post.excerpt}
            </p>
          </div>

          <div className="prose prose-lg max-w-none text-soft-charcoal prose-headings:text-charcoal prose-headings:font-medium prose-a:text-charcoal hover:prose-a:text-charcoal/80 prose-h1:hidden">
            {/* Simple Markdown Rendering */}
            {post.content.split('\n').map((paragraph, index) => {
              if (paragraph.trim().startsWith('##')) {
                return <h2 key={index} className="text-3xl mt-12 mb-6">{paragraph.replace('##', '').trim()}</h2>;
              } else if (paragraph.trim().startsWith('#')) {
                return null; // Skip main title as it's already rendered
              } else if (paragraph.trim()) {
                return <p key={index} className="mb-6 leading-relaxed">{paragraph}</p>;
              }
              return null;
            })}
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}
