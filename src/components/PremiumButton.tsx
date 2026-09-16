"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PremiumButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  withArrow?: boolean;
}

export function PremiumButton({ href, children, className, withArrow = false }: PremiumButtonProps) {
  return (
    <Link href={href} className={cn("group relative inline-flex items-center justify-center rounded-full outline-none", className)}>
      {/* Glow effect behind */}
      <div className="absolute inset-0 bg-gradient-to-r from-luxury-gold via-bright-gold to-luxury-gold rounded-full blur-md opacity-60 group-hover:opacity-100 group-hover:blur-lg transition-all duration-500" />
      
      {/* Actual button surface */}
      <div className="relative flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#B38728] via-[#FBF5B7] to-[#B38728] rounded-full border border-white/40 shadow-[0_4px_15px_rgba(212,175,55,0.4)] overflow-hidden transition-transform duration-300 group-hover:-translate-y-1">
        
        {/* Shimmer overlay */}
        <div className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_1.5s_infinite] skew-x-12" />
        
        <span className="relative z-10 text-charcoal font-bold tracking-widest uppercase text-sm drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
          {children}
        </span>
        
        {withArrow && (
          <span className="relative z-10 w-8 h-8 rounded-full bg-white/40 border border-white/60 flex items-center justify-center text-charcoal shadow-sm group-hover:bg-white transition-colors">
            <ArrowUpRight className="w-4 h-4" />
          </span>
        )}
      </div>
    </Link>
  );
}
