import Image from "next/image";
import { CLIENT_LOGOS } from "./ClientsSection";

export function AllBrandLogosSection() {
  return (
    <section className="py-16 bg-transparent relative z-10 -mt-12 mb-24">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {CLIENT_LOGOS.map((filename, index) => (
            <div 
              key={index}
              className="w-full aspect-[16/9] bg-white border border-luxury-gold/30 flex items-center justify-center p-4 hover:-translate-y-2 transition-transform shadow-[0_4px_20px_rgba(212,175,55,0.15)] hover:shadow-[0_10px_30px_rgba(212,175,55,0.3)] duration-300 rounded-[1.5rem]"
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={`/clients/${filename}`}
                  alt={`Brand Logo ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
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
