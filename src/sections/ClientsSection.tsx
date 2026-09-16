import Image from "next/image";
import { DynamicTextColor } from "@/components/DynamicTextColor";

export const CLIENT_LOGOS = [
  "DS Customer Solutions.jpeg",
  "Mine Labour Protection Campaign.jpeg",
  "WhatsApp Image 2026-08-22 at 21.01.07.jpeg",
  "WhatsApp Image 2026-08-22 at 21.02.01.jpeg",
  "WhatsApp Image 2026-08-22 at 21.02.23.jpeg",
  "WhatsApp Image 2026-08-22 at 21.03.03.jpeg",
  "WhatsApp Image 2026-08-22 at 21.04.17.jpeg",
  "WhatsApp Image 2026-08-22 at 21.05.25.jpeg",
  "WhatsApp Image 2026-08-22 at 21.06.46.jpeg",
  "WhatsApp Image 2026-08-22 at 21.08.42.jpeg",
  "WhatsApp Image 2026-08-22 at 21.11.06.jpeg",
  "WhatsApp Image 2026-08-22 at 21.32.55.jpeg",
  "WhatsApp Image 2026-08-22 at 21.33.37.jpeg",
  "WhatsApp Image 2026-08-22 at 21.36.32.jpeg",
  "WhatsApp Image 2026-08-22 at 21.37.24.jpeg",
  "WhatsApp Image 2026-08-22 at 21.40.33.jpeg",
  "WhatsApp Image 2026-08-22 at 21.51.35.jpeg",
  "WhatsApp Image 2026-08-22 at 21.53.39.jpeg",
  "WhatsApp Image 2026-08-22 at 22.07.42.jpeg",
  "WhatsApp Image 2026-08-22 at 22.12.51.jpeg",
  "WhatsApp Image 2026-08-24 at 23.22.34.jpeg",
  "project4.jpeg",
  "project3.jpeg",
  "project6.jpeg",
  "QuickTripNow.png",
  "project8.jpeg",
  "project7.jpeg",
  "Siliguri.jpeg",
  "project5.jpeg",
  "Screenshot 2026-08-25 120051.png",
  "Screenshot 2026-08-25 120143.png",
  "Screenshot 2026-08-25 120216.png",
  "Screenshot 2026-08-25 120308.png",
  "Screenshot 2026-08-25 120339.png",
  "Screenshot 2026-08-25 120413.png",
  "Screenshot 2026-08-25 120452.png",
  "Screenshot 2026-08-25 120519.png",
  "Yes Doctor.png",
  "project1.jpeg",
  "project2.jpeg"
];

export function ClientsSection() {
  return (
    <section className="py-24 bg-transparent relative overflow-hidden mt-12">
      <div className="container mx-auto px-6 md:px-12 mb-16 text-center relative z-10 overflow-hidden">
        <DynamicTextColor as="h2" className="text-sm uppercase tracking-[0.2em] font-bold mb-4 border-b-2 border-luxury-gold inline-block pb-2">
          OUR CLIENTS
        </DynamicTextColor>
        <DynamicTextColor as="h3" className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-12 uppercase drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]">
          Trusted by ambitious brands.
        </DynamicTextColor>
      </div>
        
      {/* Infinite Horizontal Scroll Container */}
      <div className="relative flex overflow-hidden z-10 before:absolute before:left-0 before:top-0 before:w-32 before:h-full before:bg-gradient-to-r before:from-white/50 before:to-transparent before:z-10 after:absolute after:right-0 after:top-0 after:w-32 after:h-full after:bg-gradient-to-l after:from-white/50 after:to-transparent after:z-10">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused] py-8">
          {[...CLIENT_LOGOS, ...CLIENT_LOGOS].map((filename, index) => (
            <div 
              key={index}
              className="flex-none w-[280px] h-[160px] bg-white border border-luxury-gold/30 flex items-center justify-center p-6 mx-4 opacity-100 hover:-translate-y-2 transition-transform shadow-[0_4px_20px_rgba(212,175,55,0.15)] hover:shadow-[0_10px_30px_rgba(212,175,55,0.3)] duration-300 rounded-[2rem]"
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={`/clients/${filename}`}
                  alt={`Client Logo ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
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
