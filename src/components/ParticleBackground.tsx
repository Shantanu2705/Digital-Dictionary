export function ParticleBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Luxury Soft Gold Shimmering Dots */}
      <div className="absolute top-[10%] left-[8%] w-1.5 h-1.5 bg-[#C5A059] rounded-full opacity-40" />
      <div className="absolute top-[18%] right-[20%] w-1 h-1 bg-[#DFB76C] rounded-full opacity-30" />
      <div className="absolute top-[38%] left-[28%] w-1.5 h-1.5 bg-[#C5A059] rounded-full opacity-35" />
      <div className="absolute top-[58%] right-[12%] w-1 h-1 bg-[#8C6A16] rounded-full opacity-30" />
      <div className="absolute bottom-[22%] left-[12%] w-1.5 h-1.5 bg-[#DFB76C] rounded-full opacity-35" />
      <div className="absolute bottom-[8%] right-[30%] w-1 h-1 bg-[#C5A059] rounded-full opacity-30" />

      {/* Ambient Gold Sparks */}
      <div className="absolute top-[6%] right-[8%] w-1 h-1 bg-[#DFB76C] rounded-full opacity-35" />
      <div className="absolute top-[28%] left-[16%] w-1.5 h-1.5 bg-[#C5A059] rounded-full opacity-30" />
      <div className="absolute top-[48%] right-[38%] w-1 h-1 bg-[#8C6A16] rounded-full opacity-25" />
      <div className="absolute bottom-[32%] left-[6%] w-1 h-1 bg-[#C5A059] rounded-full opacity-30" />
      <div className="absolute bottom-[12%] right-[18%] w-1.5 h-1.5 bg-[#DFB76C] rounded-full opacity-40" />
    </div>
  );
}
