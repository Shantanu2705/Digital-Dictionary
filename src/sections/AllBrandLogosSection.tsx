import Image from "next/image";
import { CLIENT_LOGOS } from "./ClientsSection";

export function AllBrandLogosSection() {
  return (
    <section className="py-20 relative z-20">
      <div className="container mx-auto px-4 w-full">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-x-4 gap-y-6 md:gap-x-6 md:gap-y-8 place-items-center">
          {CLIENT_LOGOS.map((filename, index) => (
            <div 
              key={index}
              className="group relative w-[120px] h-[60px] sm:w-[150px] sm:h-[75px] md:w-[180px] md:h-[90px] lg:w-[200px] lg:h-[100px] bg-white flex items-center justify-center p-3 sm:p-5 shadow-[0_4px_15px_rgba(255,255,255,0.1)] hover:shadow-[0_8px_25px_rgba(255,255,255,0.3)] hover:-translate-y-1 transition-all duration-300 rounded-[3rem]"
            >
              <div className="relative w-full h-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <Image
                  src={`/clients/${encodeURIComponent(filename)}`}
                  alt={`Brand Logo ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 33vw, 16vw"
                  className="object-contain mix-blend-multiply"
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
