import Image from "next/image";

const CLIENT_LOGOS = [
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
  "project1.jpeg"
];

export function ClientsSection() {
  return (
    <section className="py-24 bg-background relative overflow-hidden border-t border-border/50 mt-12">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-10 left-[10%] w-1 h-1 bg-luxury-gold/50 rounded-full" />
        <div className="absolute top-20 right-[20%] w-1.5 h-1.5 bg-black/10 rounded-full" />
        <div className="absolute bottom-10 left-[30%] w-2 h-2 bg-luxury-gold rounded-full" />
        <div className="absolute top-1/2 left-[5%] w-1 h-1 bg-black/5 rounded-full" />
        <div className="absolute bottom-[20%] right-[10%] w-1 h-1 bg-luxury-gold/30 rounded-full" />
        <div className="absolute top-[30%] left-[40%] w-1.5 h-1.5 bg-black/20 rounded-full" />
      </div>

      <div className="container mx-auto px-6 md:px-12 mb-16 text-center relative z-10 overflow-hidden">
        <h2 className="text-sm uppercase tracking-[0.2em] text-luxury-gold font-medium mb-4">
          OUR CLIENTS
        </h2>
        <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-charcoal mb-12">
          Trusted by ambitious brands.
        </h3>
        
        {/* Infinite Horizontal Scroll Container */}
        <div className="relative flex overflow-hidden before:absolute before:left-0 before:top-0 before:w-32 before:h-full before:bg-gradient-to-r before:from-background before:to-transparent before:z-10 after:absolute after:right-0 after:top-0 after:w-32 after:h-full after:bg-gradient-to-l after:from-background after:to-transparent after:z-10">
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
            {[...CLIENT_LOGOS, ...CLIENT_LOGOS].map((filename, index) => (
              <div 
                key={index}
                className="flex-none w-[280px] h-[160px] bg-white rounded-2xl border border-border/50 flex items-center justify-center p-6 mx-3 opacity-90 hover:opacity-100 transition-opacity"
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={`/clients/${filename}`}
                    alt={`Client Logo ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
