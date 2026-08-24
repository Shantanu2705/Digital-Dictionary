"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { 
  Megaphone, 
  Monitor, 
  Palette, 
  Code, 
  Smartphone, 
  Server, 
  Camera, 
  Video,
  Sparkles
} from "lucide-react";

interface DynamicHeroGraphicProps {
  slug: string;
}

export function DynamicHeroGraphic({ slug }: DynamicHeroGraphicProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // Only set mounted in effect to avoid hydration mismatch
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Simple hash function to generate deterministic numbers from string
  const hash = (str: string) => {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(31, h) + str.charCodeAt(i) | 0;
    }
    return Math.abs(h);
  };

  const seed = hash(slug);
  
  // Deterministic values based on slug
  const hue1 = seed % 360;
  const hue2 = (seed * 2) % 360;
  const hue3 = (seed * 3) % 360;
  
  const getCategoryConfig = () => {
    const s = slug.toLowerCase();
    if (s.includes('commercial') || s.includes('video') || s.includes('script') || s.includes('production')) return { icon: Video, color: "from-red-500/20 to-orange-500/20" };
    if (s.includes('photography') || s.includes('shoot') || s.includes('image')) return { icon: Camera, color: "from-zinc-500/20 to-gray-400/20" };
    if (s.includes('hosting') || s.includes('server') || s.includes('domain')) return { icon: Server, color: "from-cyan-500/20 to-blue-500/20" };
    if (s.includes('app') || s.includes('ios') || s.includes('android')) return { icon: Smartphone, color: "from-emerald-500/20 to-teal-500/20" };
    if (s.includes('software') || s.includes('saas') || s.includes('crm') || s.includes('erp')) return { icon: Code, color: "from-indigo-500/20 to-purple-500/20" };
    if (s.includes('design') || s.includes('ui') || s.includes('wireframe') || s.includes('prototype') || s.includes('logo') || s.includes('identity') || s.includes('collateral') || s.includes('post')) return { icon: Palette, color: "from-fuchsia-500/20 to-pink-500/20" };
    if (s.includes('web') || s.includes('ecommerce') || s.includes('portal') || s.includes('corporate') || s.includes('landing')) return { icon: Monitor, color: "from-blue-500/20 to-indigo-500/20" };
    if (s.includes('marketing') || s.includes('seo') || s.includes('ads') || s.includes('campaign')) return { icon: Megaphone, color: "from-amber-500/20 to-yellow-500/20" };
    
    return { icon: Sparkles, color: "from-luxury-gold/20 to-yellow-600/20" };
  };

  const config = getCategoryConfig();
  const Icon = config.icon;

  if (!mounted) return <div className="w-full h-full bg-charcoal/5 animate-pulse rounded-[32px]"></div>;

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0A0A0A] rounded-[32px] group">
      {/* Dynamic Mesh Gradients */}
      <div 
        className="absolute inset-0 opacity-40 transition-transform duration-1000 group-hover:scale-110"
        style={{
          background: `
            radial-gradient(circle at ${(seed % 100)}% ${(seed * 2) % 100}%, hsl(${hue1}, 70%, 50%) 0%, transparent 50%),
            radial-gradient(circle at ${(seed * 3) % 100}% ${(seed * 4) % 100}%, hsl(${hue2}, 70%, 50%) 0%, transparent 50%),
            radial-gradient(circle at ${(seed * 5) % 100}% ${(seed * 6) % 100}%, hsl(${hue3}, 70%, 50%) 0%, transparent 50%)
          `,
          filter: 'blur(60px)'
        }}
      />

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Floating Abstract Shapes */}
      <div 
        className="absolute w-64 h-64 border border-white/10 rounded-full top-1/4 left-1/4 animate-[spin_20s_linear_infinite]"
        style={{ transform: `scale(${(seed % 10) / 5 + 0.5})` }}
      />
      <div 
        className="absolute w-96 h-96 border border-white/5 rounded-full bottom-1/4 right-1/4 animate-[spin_30s_linear_infinite_reverse]"
      />

      {/* Glassmorphism Center piece */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className={cn(
          "relative w-48 h-48 md:w-64 md:h-64 rounded-3xl backdrop-blur-xl border border-white/20 bg-white/5 flex items-center justify-center overflow-hidden shadow-2xl transition-all duration-700 group-hover:scale-105 group-hover:bg-white/10",
          `bg-gradient-to-br ${config.color}`
        )}>
          {/* Inner Glow */}
          <div className="absolute inset-0 opacity-50 bg-gradient-to-t from-transparent to-white/20" />
          
          <Icon className="w-20 h-20 md:w-28 md:h-28 text-white/90 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3" />
        </div>
      </div>
      
      {/* Decorative dots */}
      <div className="absolute top-8 left-8 flex gap-2">
        <div className="w-2 h-2 rounded-full bg-white/40" />
        <div className="w-2 h-2 rounded-full bg-white/20" />
        <div className="w-2 h-2 rounded-full bg-white/10" />
      </div>
    </div>
  );
}
