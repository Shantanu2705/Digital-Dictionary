"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PremiumButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  withArrow?: boolean;
  variant?: "primary" | "gold" | "secondary";
}

export function PremiumButton({ 
  href, 
  children, 
  className, 
  withArrow = false,
  variant = "primary"
}: PremiumButtonProps) {
  return (
    <Link 
      href={href} 
      className={cn(
        "group inline-flex items-center justify-center font-medium text-xs uppercase tracking-wider transition-all duration-200 outline-none select-none",
        variant === "primary" && "bg-[#0F172A] hover:bg-[#1E293B] text-white border border-[#967424]/50 hover:border-[#B8860B] shadow-sm hover:shadow-md px-7 py-3.5 rounded-full",
        variant === "gold" && "bg-[#967424] hover:bg-[#7D601C] text-white shadow-sm hover:shadow-md px-7 py-3.5 rounded-full",
        variant === "secondary" && "bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 hover:border-slate-400 px-7 py-3.5 rounded-full shadow-xs",
        className
      )}
    >
      <span>{children}</span>
      {withArrow && (
        <ArrowUpRight className="w-3.5 h-3.5 ml-2 text-[#DFB76C] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      )}
    </Link>
  );
}
