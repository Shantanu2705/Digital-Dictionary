import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/AuthContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#F9F6F0",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://digitaldictionary.in'),
  title: {
    template: "%s | Digital Dictionary - Enterprise Digital Agency",
    default: "Digital Dictionary | Enterprise Digital Agency & Strategic Web Engineering",
  },
  description: "Government of India MSME Registered enterprise digital solutions agency engineering high-performance web systems, custom software architectures, and data-driven marketing engines.",
  keywords: [
    "Digital Dictionary",
    "Enterprise Digital Agency",
    "Web Engineering",
    "Next.js Web Development",
    "Performance Digital Marketing",
    "SEO Services India",
    "Custom Software Development",
    "Enterprise CRM ERP",
    "E-Commerce Systems",
    "Mobile App Development",
    "Siliguri Web Design",
    "Government MSME Registered Agency",
    "Internships",
    "Careers"
  ],
  authors: [{ name: "Digital Dictionary", url: "https://digitaldictionary.in" }],
  creator: "Digital Dictionary",
  publisher: "Digital Dictionary",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://digitaldictionary.in/",
    title: "Digital Dictionary | Enterprise Digital Solutions & Strategic Web Engineering",
    description: "Government MSME Registered digital agency engineering high-speed web platforms, custom cloud software, and scalable digital marketing engines.",
    siteName: "Digital Dictionary",
    images: [{
      url: "/logo.png",
      width: 1200,
      height: 630,
      alt: "Digital Dictionary Official 3D Gold Logo"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Dictionary | Enterprise Digital Solutions",
    description: "Enterprise digital agency engineering high-speed web platforms, custom software, and performance marketing engines.",
    images: ["/logo.png"],
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
    canonical: "https://digitaldictionary.in",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://digitaldictionary.in/#organization",
      "name": "Digital Dictionary",
      "alternateName": "Digital Dictionary Agency",
      "legalName": "Digital Dictionary",
      "url": "https://digitaldictionary.in",
      "logo": {
        "@type": "ImageObject",
        "url": "https://digitaldictionary.in/logo.png",
        "caption": "Digital Dictionary Official 3D Gold Logo"
      },
      "image": "https://digitaldictionary.in/logo.png",
      "description": "Government of India MSME Registered enterprise digital agency engineering high-speed web platforms, custom software architectures, and performance marketing engines.",
      "email": "admin07digitaldictionary@gmail.com",
      "telephone": "+91 62911 11428",
      "taxID": "UDYAM-WB-10-0098465",
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": "+91 62911 11428",
          "contactType": "customer service",
          "areaServed": "IN",
          "availableLanguage": ["English", "Hindi", "Bengali"]
        },
        {
          "@type": "ContactPoint",
          "email": "hr@digitaldictionary.in",
          "contactType": "human resources",
          "description": "Internship and Career Applications"
        }
      ],
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Kawakhali Road, Kawakhali Bazar",
        "addressLocality": "Siliguri",
        "addressRegion": "West Bengal",
        "postalCode": "734012",
        "addressCountry": "IN"
      },
      "sameAs": [
        "https://www.facebook.com/profile.php?id=61577401455688",
        "https://wa.me/916291111428"
      ]
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://digitaldictionary.in/#professionalservice",
      "name": "Digital Dictionary",
      "url": "https://digitaldictionary.in",
      "telephone": "+91 62911 11428",
      "priceRange": "Contact for pricing",
      "image": "https://digitaldictionary.in/logo.png",
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "26.6975",
        "longitude": "88.3953"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Kawakhali Road, Kawakhali Bazar",
        "addressLocality": "Siliguri",
        "addressRegion": "West Bengal",
        "postalCode": "734012",
        "addressCountry": "IN"
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "09:30",
        "closes": "19:00"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Digital Solutions & Engineering Services",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Web Engineering & High-Speed Platforms" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Performance Digital Marketing & SEO" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Custom Software & Cloud Architecture" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "High-Conversion E-Commerce Systems" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Mobile Application Development" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Brand Systems & Strategic Visual Design" } }
        ]
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://digitaldictionary.in/#website",
      "url": "https://digitaldictionary.in",
      "name": "Digital Dictionary",
      "publisher": { "@id": "https://digitaldictionary.in/#organization" }
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-[#B8860B] selection:text-white relative">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}