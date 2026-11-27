import Link from "next/link";
import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ParticleBackground } from "@/components/ParticleBackground";
import { INITIAL_PACKAGES } from "@/lib/data/initialCatalogue";
import {
  ArrowUpRight,
  CheckCircle2,
  Monitor,
  Smartphone,
  Layers,
  Workflow,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  HelpCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "The Premium Service Collection | Digital Dictionary",
  description:
    "Explore Digital Dictionary's structured website architecture, cross-platform mobile applications, connected web + app ecosystems, commerce workflows, and ongoing growth plans.",
};

const CATEGORY_SECTIONS = [
  {
    id: "Website Architecture",
    num: "02",
    title: "Website Architecture",
    subtitle: "Website packages with clear page limits.",
    note: "A page is a distinct website destination such as Home, About, Services or Contact. Standard website packages include responsive layouts, brand-aligned UI, enquiry touchpoints, basic on-page SEO, QA checks and one agreed revision cycle.",
    icon: Monitor,
  },
  {
    id: "Mobile Application Systems",
    num: "03",
    title: "Mobile Application Systems",
    subtitle: "Mobile apps, scoped by screens and functionality.",
    note: "Built cross-platform for Android and iOS using React Native. Covers agreed screen counts, core navigation, account flows, cloud backend setup, push notifications and release handover assistance.",
    icon: Smartphone,
  },
  {
    id: "Connected Web + App",
    num: "04",
    title: "Connected Web + App Packages",
    subtitle: "One business. One connected experience.",
    note: "Designed for businesses that want a website and mobile app built around a shared backend database, API layer and authentication architecture to eliminate duplicate data entry.",
    icon: Layers,
  },
  {
    id: "Commerce & Business Workflows",
    num: "05",
    title: "Commerce & Business Workflows",
    subtitle: "Purpose-built systems for transactions and operations.",
    note: "Scoped around your business workflow, user roles, operational dashboards, payment gateways, booking flows, live tracking and third-party API integrations.",
    icon: Workflow,
  },
  {
    id: "Ongoing Care & Growth",
    num: "06",
    title: "Ongoing Care & Growth",
    subtitle: "Launch is the beginning. Keep improving.",
    note: "Recurring monthly technical governance, local SEO & Google Maps optimisation, dual-channel Meta + Google performance ads and full 360° growth execution.",
    icon: TrendingUp,
  },
];

const DELIVERY_PATH = [
  { stage: "01 Discovery", desc: "Understand business goals, audience, workflows, current systems and success criteria." },
  { stage: "02 Scope & Proposal", desc: "Confirm page/screen count, features, integrations, timeline and payment milestones." },
  { stage: "03 Design & Build", desc: "Review structure and design direction, then develop against approved milestones." },
  { stage: "04 QA & Security", desc: "Test agreed user journeys, responsive behaviour, forms, integrations and release readiness." },
  { stage: "05 Deploy & Handover", desc: "Deploy to agreed infrastructure, provide access handover and outline ongoing responsibilities." },
];

const FAQS = [
  {
    q: "Does 10 pages mean 10 app screens?",
    a: "No. Website pages and mobile app screens are scoped separately according to their distinct architecture and interaction complexity.",
  },
  {
    q: "Can I add more pages or screens later?",
    a: "Yes. Standard pages and standard app screens can be expanded cleanly, while complex workflows or dynamic integrations are scoped separately.",
  },
  {
    q: "Are Android and iOS both included?",
    a: "Yes. Our mobile packages are engineered on a React Native cross-platform codebase for both Android and iOS, subject to store and device compatibility.",
  },
  {
    q: "Can I request a completely custom feature or workflow?",
    a: "Yes. We review your exact business workflow and deliver a dedicated scope, timeline and milestone proposal before development begins.",
  },
];

export default function ServicesCatalogPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-[#FAFAF8] overflow-hidden relative">
      <Navbar />

      <div className="fixed inset-0 pointer-events-none z-0">
        <ParticleBackground />
      </div>

      {/* Hero Section */}
      <section className="w-full pt-40 pb-20 relative z-10 border-b border-[#E5E5E2]">
        <div className="container mx-auto px-6 md:px-12 max-w-6xl text-center">
          <span className="text-xs uppercase tracking-widest font-bold text-[#A67C22] inline-flex items-center gap-1.5 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            The Premium Service Collection &middot; 2026
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-medium tracking-tight text-[#101010] leading-[1.1] max-w-4xl mx-auto mb-6">
            Engineering Digital Ecosystems That{" "}
            <span className="italic font-light text-[#A67C22]">Drive Revenue.</span>
          </h1>
          <p className="text-base md:text-lg text-[#555555] max-w-3xl mx-auto leading-relaxed mb-10">
            A clear, structured guide to our website architecture, cross-platform mobile applications, connected omnichannel bundles, custom business workflows and ongoing growth solutions. Every engagement begins with a defined scope and tailored commercial proposal.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {CATEGORY_SECTIONS.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                className="px-4 py-2 rounded-full bg-white border border-[#E5E5E2] hover:border-[#D4AF37] text-xs font-semibold text-[#101010] hover:text-[#A67C22] transition-all shadow-2xs"
              >
                {sec.num} / {sec.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Foundation Strip */}
      <section className="w-full py-14 relative z-10 bg-white border-b border-[#E5E5E2]">
        <div className="container mx-auto px-6 md:px-12 max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Web Platforms", tech: "Next.js & React — responsive interfaces, sub-second page delivery and technical SEO foundations." },
              { title: "Mobile Applications", tech: "React Native — shared Android & iOS codebase tailored to project requirements." },
              { title: "Cloud & Data", tech: "Firebase, Vercel & PostgreSQL — selected according to architecture, scale and workflow needs." },
              { title: "Discovery & Visibility", tech: "SEO, AEO & GEO foundations, structured content and Google Maps local discovery." },
            ].map((item) => (
              <div key={item.title} className="p-5 rounded-xl bg-[#FAFAF8] border border-[#E5E5E2]">
                <div className="text-xs font-bold uppercase tracking-wider text-[#A67C22] mb-1.5">
                  {item.title}
                </div>
                <p className="text-xs text-[#555555] leading-relaxed">{item.tech}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All 5 Service Categories */}
      <div className="w-full relative z-10 divide-y divide-[#E5E5E2]">
        {CATEGORY_SECTIONS.map((sec, sIdx) => {
          const sectionPackages = INITIAL_PACKAGES.filter((p) => p.category === sec.id && p.active !== false);
          const Icon = sec.icon;
          const anchorId = sec.id.toLowerCase().replace(/[^a-z0-9]+/g, "-");

          return (
            <section
              key={sec.id}
              id={anchorId}
              className={`py-20 ${sIdx % 2 === 1 ? "bg-white" : "bg-[#FAFAF8]"}`}
            >
              <div className="container mx-auto px-6 md:px-12 max-w-6xl">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                  <div>
                    <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#A67C22] mb-2">
                      <Icon className="w-4 h-4" />
                      <span>{sec.num} / {sec.title}</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-serif font-medium text-[#101010]">
                      {sec.subtitle}
                    </h2>
                    <p className="text-sm text-[#666666] mt-2 max-w-3xl leading-relaxed">{sec.note}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sectionPackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="rounded-2xl bg-white border border-[#E5E5E2] hover:border-[#D4AF37] p-7 flex flex-col justify-between shadow-2xs hover:shadow-lg transition-all duration-300"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-4">
                          <span className="px-2.5 py-1 rounded-md bg-[#F2F2F0] text-[#A67C22] border border-[#E5E5E2] text-[11px] font-mono font-bold">
                            {pkg.code}
                          </span>
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#777777]">
                            {pkg.billingType === "monthly" ? "Monthly Plan" : "Scoped Engagement"}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold text-[#101010] mb-2">{pkg.name}</h3>
                        <p className="text-xs text-[#666666] leading-relaxed mb-4">
                          {pkg.fullDescription}
                        </p>

                        {(pkg.pageLimit || pkg.screenLimit) && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {pkg.pageLimit && (
                              <span className="px-2.5 py-1 rounded bg-[#FAFAF8] border border-[#E5E5E2] text-[11px] font-semibold text-[#101010]">
                                Website: {pkg.pageLimit}
                              </span>
                            )}
                            {pkg.screenLimit && (
                              <span className="px-2.5 py-1 rounded bg-[#FAFAF8] border border-[#E5E5E2] text-[11px] font-semibold text-[#101010]">
                                Mobile: {pkg.screenLimit}
                              </span>
                            )}
                          </div>
                        )}

                        <div className="space-y-2 pt-4 border-t border-[#E5E5E2] mb-6">
                          {pkg.includedFeatures.slice(0, 4).map((feat, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-[#333333]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#A67C22] shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Link
                        href={`/contact?service=${encodeURIComponent(pkg.name)}`}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#101010] hover:bg-[#A67C22] text-white text-xs font-bold uppercase tracking-wider transition-colors"
                      >
                        Request Custom Proposal
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* Delivery Path & FAQs */}
      <section className="w-full py-20 bg-[#101010] text-white relative z-10">
        <div className="container mx-auto px-6 md:px-12 max-w-6xl space-y-16">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-[#D4AF37] block mb-2">
              08 / From First Conversation to Launch
            </span>
            <h2 className="text-3xl font-serif font-medium text-white mb-8">
              A Structured Path. No Hidden Steps.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {DELIVERY_PATH.map((step) => (
                <div key={step.stage} className="p-5 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-xs font-mono font-bold text-[#D4AF37] mb-2">{step.stage}</div>
                  <p className="text-xs text-neutral-300 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-white/10">
            {FAQS.map((f) => (
              <div key={f.q} className="p-6 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-start gap-2.5">
                  <HelpCircle className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1.5">{f.q}</h4>
                    <p className="text-xs text-neutral-400 leading-relaxed">{f.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-6">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E8D18A] text-[#101010] text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-lg"
            >
              Book a Free 15-Minute Digital Audit
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
