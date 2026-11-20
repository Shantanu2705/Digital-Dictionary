import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers & Internships | Digital Dictionary",
  description: "Join the Digital Dictionary Talent Pod. Apply for live client internships in Full Stack Web Development, Mobile Apps, SEO, Cybersecurity, Video Editing, and Sales. Send your resume to hr@digitaldictionary.in.",
  keywords: [
    "Digital Dictionary Careers",
    "Digital Dictionary Internships",
    "Web Developer Internship",
    "React Internship",
    "Next.js Internship",
    "SEO Internship Siliguri",
    "Cybersecurity Internship",
    "Digital Agency Jobs",
    "hr@digitaldictionary.in"
  ],
  openGraph: {
    title: "Careers & Internships | Digital Dictionary",
    description: "Launch your career with production-grade engineering, marketing, and design. Apply to hr@digitaldictionary.in.",
    url: "https://digitaldictionary.in/careers",
    type: "website",
  },
  alternates: {
    canonical: "/careers",
  }
};

export default function CareersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
