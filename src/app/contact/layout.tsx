import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Digital Dictionary. We are ready to help you establish a powerful digital presence, build software, and scale your business.",
  keywords: ["Contact Digital Agency", "Hire Web Developers", "Siliguri Digital Agency Contact", "Digital Dictionary Contact"],
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
