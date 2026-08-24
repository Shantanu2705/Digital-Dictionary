import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { FloatingNav } from "@/components/FloatingNav";
import ScrollAnimation from "@/components/ScrollAnimation";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Digital Dictionary | Premium Digital Agency",
  description: "Digital Dictionary provides premium digital solutions that help businesses establish a powerful digital presence, generate leads, improve visibility, and scale through technology, design and digital marketing.",
  openGraph: {
    title: "Digital Dictionary",
    description: "Digital Dictionary provides premium digital solutions that help businesses establish a powerful digital presence.",
    siteName: "Digital Dictionary",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased selection:bg-luxury-gold selection:text-white">
        <ScrollAnimation />
        <FloatingNav />
        {children}
      </body>
    </html>
  );
}
