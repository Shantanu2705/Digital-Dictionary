import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Portfolio & Work",
  description: "Explore our diverse portfolio of digital experiences, custom websites, applications, and brand identities crafted for forward-thinking brands.",
  keywords: ["Digital Agency Portfolio", "Web Design Portfolio", "App Development Projects", "Branding Work", "Digital Dictionary Portfolio"],
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
