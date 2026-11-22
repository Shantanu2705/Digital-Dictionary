"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PremiumButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  withArrow?: boolean;
  variant?: "primary" | "gold" | "secondary" | "dark";
}

export function PremiumButton({ 
  href, 
  children, 
  className, 
  withArrow = false,
  variant = "gold"
}: PremiumButtonProps) {
  return (
    <Link 
      href={href} 
      className={cn(
        "group inline-flex items-center justify-center font-bold text-xs uppercase tracking-wider transition-all duration-200 outline-none select-none rounded-full px-7 py-3.5",
        // Gold Primary Button (Per Master Prompt Section 2 & 8)
        variant === "gold" && "bg-gradient-to-r from-[#D4AF37] via-[#E8D18A] to-[#A67C22] hover:from-[#A67C22] hover:to-[#D4AF37] text-[#101010] border border-[#E8D18A]/60 shadow-sm hover:shadow-[0_4px_20px_rgba(212,175,55,0.3)] hover:scale-[1.01] active:scale-[0.99]",
        // Dark / Charcoal Button
        (variant === "primary" || variant === "dark") && "bg-[#101010] hover:bg-[#1B1B1B] text-white border border-[#D4AF37]/50 hover:border-[#D4AF37] shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99]",
        // Minimal Secondary Outline Button
        variant === "secondary" && "bg-white hover:bg-[#FAFAF8] text-[#101010] border border-[#E5E5E2] hover:border-[#D4AF37] shadow-xs hover:shadow-sm",
        className
      )}
    >
      <span>{children}</span>
      {withArrow && (
        <ArrowUpRight className={cn(
          "w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
          variant === "gold" ? "text-[#101010]" : "text-[#D4AF37]"
        )} />
      )}
    </Link>
  );
}
