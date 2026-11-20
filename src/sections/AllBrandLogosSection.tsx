import Image from "next/image";
import { CLIENT_LOGOS } from "./ClientsSection";

export function AllBrandLogosSection() {
  return (
    <section className="py-20 relative z-20 bg-[#E0D4C0] border-b border-[#C4B294]">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-widest font-bold text-[#8C6A16] block mb-2">
            Complete Client Roster
          </span>
          <h3 className="text-2xl sm:text-3xl font-serif font-medium text-slate-900 tracking-tight">
            Selected Client Deployments &amp; Brand Partners
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 mt-2 max-w-xl mx-auto">
            All 40 enterprise, healthcare, regional, and commercial brands engineered and accelerated by Digital Dictionary.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 place-items-center">
          {CLIENT_LOGOS.map((filename, index) => (
            <div
              key={index}
              className="group relative w-full h-[65px] sm:h-[75px] md:h-[80px] bg-white rounded-xl border border-[#D5C7A3] hover:border-[#B8860B] flex items-center justify-center p-3 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="relative w-full h-full flex items-center justify-center transform group-hover:scale-105 transition-transform duration-200">
                <Image
                  src={`/clients/${encodeURIComponent(filename)}`}
                  alt={`Brand Partner ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 140px, (max-width: 1024px) 180px, 200px"
                  className="object-contain"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
