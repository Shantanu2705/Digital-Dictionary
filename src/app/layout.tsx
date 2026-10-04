import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { FloatingNav } from "@/components/FloatingNav";
import ScrollAnimation from "@/components/ScrollAnimation";
import { GlobalScrollColor } from "@/components/GlobalScrollColor";
import { FloatingCallButton } from "@/components/FloatingCallButton";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://digitaldictionary.in'),
  title: {
    template: "%s | Digital Dictionary",
    default: "Digital Dictionary | Premium Digital Agency & Web Development",
  },
  description: "Digital Dictionary provides premium digital solutions that help businesses establish a powerful digital presence, generate leads, improve visibility, and scale through technology, design and digital marketing.",
  keywords: [
    "Digital Agency",
    "Web Development",
    "Digital Marketing",
    "SEO Services",
    "Branding",
    "Premium Website Design",
    "Application Development",
    "Software Development",
    "Siliguri Digital Agency",
    "eCommerce Development",
    "India",
    "Top Digital Agency"
  ],
  authors: [{ name: "Digital Dictionary", url: "https://digitaldictionary.in" }],
  creator: "Digital Dictionary",
  publisher: "Digital Dictionary",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://digitaldictionary.in/",
    title: "Digital Dictionary | Premium Digital Agency",
    description: "Premium digital solutions helping businesses establish a powerful digital presence through technology, design and digital marketing.",
    siteName: "Digital Dictionary",
    images: [{
      url: "/icon.png",
      width: 800,
      height: 800,
      alt: "Digital Dictionary Logo"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Dictionary | Premium Digital Agency",
    description: "Premium digital solutions helping businesses establish a powerful digital presence through technology, design and digital marketing.",
    images: ["/icon.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-full flex flex-col bg-transparent text-foreground antialiased selection:bg-luxury-gold selection:text-off-white">
        <GlobalScrollColor />
        <ScrollAnimation />
        <FloatingNav />
        {children}
        <FloatingCallButton />
      </body>
    </html>
  );
}
