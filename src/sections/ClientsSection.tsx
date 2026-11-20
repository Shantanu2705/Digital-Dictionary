import Image from "next/image";

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
    <section className="py-20 md:py-28 bg-gradient-to-b from-[#EAE0CE] via-[#E2D4BF] to-[#EAE0CE] relative overflow-hidden border-b border-[#C8B89A]">
      <div className="container mx-auto px-6 md:px-12 mb-12 text-center relative z-10 max-w-4xl">
        <span className="text-xs uppercase tracking-widest font-bold text-[#8C6A16] block mb-2">
          Client Credentials &amp; Verified Deployments
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-slate-900 tracking-tight mb-4">
          Trusted by <span className="italic font-light text-[#8C6A16]">Ambitious Brands</span> &amp; Industry Leaders.
        </h2>
        <p className="text-slate-700 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          From regional leaders and healthcare networks to consumer enterprises, we engineer scalable platforms that drive verified commercial growth.
        </p>
      </div>
        
      {/* Infinite Horizontal Marquee with Full Color Logos */}
      <div className="relative flex overflow-hidden z-10 before:absolute before:left-0 before:top-0 before:w-32 before:h-full before:bg-gradient-to-r before:from-[#F2ECE1] before:to-transparent before:z-10 after:absolute after:right-0 after:top-0 after:w-32 after:h-full after:bg-gradient-to-l after:from-[#F2ECE1] after:to-transparent after:z-10">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused] py-3">
          {[...CLIENT_LOGOS, ...CLIENT_LOGOS].map((filename, index) => (
            <div 
              key={index}
              className="group flex-none w-[200px] sm:w-[240px] h-[115px] sm:h-[125px] bg-white rounded-2xl border border-[#D5C7A3] hover:border-[#B8860B] flex items-center justify-center p-5 mx-3 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative w-full h-full flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
                <Image
                  src={`/clients/${filename}`}
                  alt={`Client Logo ${index + 1}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 200px, 240px"
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