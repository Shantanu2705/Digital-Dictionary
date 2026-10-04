import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog & Insights",
  description: "Read our latest thoughts, perspectives, and strategies on technology, web design, digital marketing, and business growth from the Digital Dictionary team.",
  keywords: ["Digital Marketing Blog", "Web Design Trends", "SEO Strategies", "Tech Insights", "Digital Dictionary Blog"],
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
