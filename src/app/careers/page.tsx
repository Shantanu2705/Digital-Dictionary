"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  Briefcase, 
  Mail, 
  FileText, 
  CheckCircle2, 
  ArrowUpRight, 
  Copy, 
  Check, 
  Code2, 
  Smartphone, 
  TrendingUp, 
  ShieldCheck, 
  Video, 
  Target, 
  Users, 
  GraduationCap, 
  Award,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";

const INTERNSHIP_ROLES = [
  {
    id: "full-stack-dev",
    title: "Full Stack Web Developer Intern",
    category: "Engineering",
    icon: Code2,
    badge: "Engineering Track",
    type: "Internship (3 - 6 Months)",
    stipend: "Performance-Linked Base + Milestone Bonus",
    description: "Build cutting-edge, high-speed digital web platforms and client portals using modern React, Next.js, and TypeScript architectures.",
    responsibilities: [
      "Develop responsive, ultra-fast web applications using Next.js, React, and Tailwind CSS",
      "Integrate RESTful APIs, Supabase, Firebase, and SQL databases",
      "Collaborate with design and security teams to implement pixel-perfect, secure UIs",
      "Optimize web vitals, load speeds, and cross-browser performance"
    ],
    requirements: [
      "Proficiency in JavaScript/TypeScript, React.js, and HTML5/CSS3",
      "Familiarity with Git/GitHub version control",
      "Curiosity to learn Next.js App Router and server-side rendering",
      "A live project or GitHub repository demonstrating your coding skills"
    ]
  },
  {
    id: "mobile-app-dev",
    title: "Mobile App Developer Intern",
    category: "Engineering",
    icon: Smartphone,
    badge: "Mobile Track",
    type: "Internship (3 - 6 Months)",
    stipend: "Performance-Linked Base + Milestone Bonus",
    description: "Engineer native-feel mobile applications for iOS and Android platforms with fluid animations, real-time sync, and offline capabilities.",
    responsibilities: [
      "Build cross-platform mobile apps using React Native or Flutter",
      "Connect frontend interfaces with cloud backends and third-party APIs",
      "Implement smooth gesture controls, push notifications, and local caching",
      "Test mobile apps across diverse screen resolutions and OS versions"
    ],
    requirements: [
      "Strong foundation in React Native, Flutter, or native Android/iOS basics",
      "Understanding of mobile UI/UX conventions and state management",
      "Familiarity with mobile app build workflows and debugging"
    ]
  },
  {
    id: "digital-marketing-seo",
    title: "Performance Marketing & SEO Intern",
    category: "Marketing",
    icon: TrendingUp,
    badge: "Growth Track",
    type: "Internship (3 - 6 Months)",
    stipend: "Performance-Linked Base + Milestone Bonus",
    description: "Run real-world search engine optimization campaigns, Meta and Google Ads, and analyze user conversion funnels for business clients.",
    responsibilities: [
      "Conduct keyword research, competitor analysis, and on-page technical SEO audits",
      "Assist in setting up and monitoring Google Search and Meta Ads campaigns",
      "Analyze Google Analytics (GA4) traffic data and generate performance reports",
      "Draft conversion-focused ad copy and content strategies"
    ],
    requirements: [
      "Solid understanding of digital marketing fundamentals and SEO concepts",
      "Analytical mindset with familiarity in Google Analytics or Meta Ads Manager",
      "Excellent written communication and persuasive copywriting ability"
    ]
  },
  {
    id: "ui-ux-designer",
    title: "UI/UX & Brand Identity Designer Intern",
    category: "Design",
    icon: Award,
    badge: "Design Track",
    type: "Internship (3 - 6 Months)",
    stipend: "Performance-Linked Base + Milestone Bonus",
    description: "Design clean, high-conversion user interfaces, design systems, and corporate branding collaterals for diverse industry clients.",
    responsibilities: [
      "Create high-fidelity wireframes, interactive prototypes, and design systems in Figma",
      "Design logo concepts, brand books, and social media collaterals",
      "Collaborate directly with developers to ensure design precision in code",
      "Conduct user journey mapping and conversion UI refinements"
    ],
    requirements: [
      "Proficiency in Figma and Adobe Creative Suite (Photoshop/Illustrator)",
      "Strong understanding of visual hierarchy, typography, and color theory",
      "A portfolio of UI designs, case studies, or graphic design projects"
    ]
  },
  {
    id: "cybersecurity",
    title: "Web Security & Cloud Infrastructure Intern",
    category: "Security",
    icon: ShieldCheck,
    badge: "Security Track",
    type: "Internship (3 - 6 Months)",
    stipend: "Performance-Linked Base + Milestone Bonus",
    description: "Audit client web applications, configure security headers, secure API endpoints, and ensure compliance with strict cyber defense protocols.",
    responsibilities: [
      "Perform vulnerability assessments on client web platforms and server configs",
      "Implement Content Security Policies (CSP), HSTS, and rate limiting",
      "Monitor DNS, SSL/TLS certificates, and edge caching configurations",
      "Draft security recommendations and incident mitigation reports"
    ],
    requirements: [
      "Knowledge of web security standards (OWASP Top 10, XSS, CSRF, SQLi)",
      "Understanding of Linux, HTTP protocol, DNS, and networking basics",
      "Passion for ethical hacking, penetration testing, and cloud architecture"
    ]
  },
  {
    id: "video-motion",
    title: "Video Production & Motion Graphics Intern",
    category: "Creative",
    icon: Video,
    badge: "Creative Track",
    type: "Internship (3 - 6 Months)",
    stipend: "Performance-Linked Base + Milestone Bonus",
    description: "Create engaging commercial ad videos, motion graphic assets, and brand storytelling pieces for prominent regional and national brands.",
    responsibilities: [
      "Edit commercial promotional videos, interviews, and brand reels",
      "Create motion graphic animations, lower thirds, and brand intros",
      "Collaborate with the creative team to brainstorm campaign visual hooks",
      "Color grade and balance audio for broadcast-quality outputs"
    ],
    requirements: [
      "Proficiency in Adobe Premiere Pro, After Effects, or DaVinci Resolve",
      "Strong sense of visual pacing, typography, sound design, and rhythm",
      "Showreel or portfolio demonstrating editing work"
    ]
  },
  {
    id: "business-dev",
    title: "Business Development & Client Solutions Intern",
    category: "Business",
    icon: Target,
    badge: "Business Track",
    type: "Internship (3 - 6 Months)",
    stipend: "Base Salary + Deal Incentive Structure",
    description: "Engage with business owners and institutional leaders, present Digital Dictionary technology capabilities, and assist in requirement scoping.",
    responsibilities: [
      "Conduct strategic discovery calls with prospective B2B clients",
      "Present Digital Dictionary digital solutions, case studies, and capabilities",
      "Follow up on inquiries and maintain transparent CRM pipeline records",
      "Assist senior leadership in preparing customized project proposals"
    ],
    requirements: [
      "Exceptional verbal and written communication in English and Hindi",
      "Professional demeanor, active listening, and consultative problem-solving skills",
      "Eagerness to learn corporate B2B technology consulting"
    ]
  }
];

export default function CareersPage() {
  const [copied, setCopied] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const hrEmail = "hr@digitaldictionary.in";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(hrEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const generateMailto = (roleTitle: string = "Internship Position") => {
    const subject = encodeURIComponent(`[Internship Application] - ${roleTitle} - [Your Full Name]`);
    const body = encodeURIComponent(
`Dear Hiring Team at Digital Dictionary,

I am writing to submit my formal application for the "${roleTitle}" internship opportunity at Digital Dictionary.

--- APPLICANT PROFILE ---
• Full Name: [Your Full Name]
• Mobile / WhatsApp: [Your Phone Number]
• Location / City: [Your Current City]
• College / University & Year: [e.g. Final Year B.Tech CSE / Graduate]
• Target Role: ${roleTitle}

--- CREDENTIALS & PORTFOLIO ---
• Portfolio / Website: [Your Portfolio Link]
• GitHub / Code Samples: [GitHub Link, if applicable]
• LinkedIn Profile: [LinkedIn URL]

--- CANDIDATE STATEMENT ---
[Briefly mention 2-3 sentences explaining your technical background, why you wish to join Digital Dictionary, and what you can contribute to our production pods.]

I have attached my updated resume in PDF format to this email for your review.

Thank you for your time and consideration.

Sincerely,
[Your Full Name]`
    );

    return `mailto:${hrEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-white overflow-hidden relative">
      <Navbar />

      {/* Hero Header */}
      <section className="w-full pt-40 pb-16 relative z-10 bg-[#F8FAFC] border-b border-slate-200">
        <div className="container mx-auto px-6 md:px-12 text-center max-w-5xl">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-200 bg-white shadow-2xs mb-6">
            <GraduationCap className="w-4 h-4 text-[#8C6A16]" />
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-700">
              Digital Dictionary Talent Program &middot; 2026 Cohort
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-medium tracking-tight text-slate-900 mb-6 leading-tight">
            Build Your Career on <br />
            <span className="italic font-light text-[#8C6A16]">Production-Grade Systems.</span>
          </h1>

          <p className="text-base md:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed mb-12">
            At Digital Dictionary, interns work directly alongside senior engineers and strategists on live client architectures, enterprise web applications, and real-world commercial campaigns.
          </p>

          {/* FORMAL APPLICATION DESK BANNER */}
          <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-2xl p-8 md:p-10 shadow-xs text-left">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#8C6A16] block mb-1">
                  Official Talent Recruitment Desk
                </span>
                <h2 className="text-xl md:text-2xl font-serif text-slate-900 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#8C6A16]" />
                  Direct Applications: <span className="text-slate-900 font-mono font-bold">{hrEmail}</span>
                </h2>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  onClick={handleCopyEmail}
                  className="px-5 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 shadow-2xs cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-600" />
                      Email Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-500" />
                      Copy HR Email
                    </>
                  )}
                </button>

                <a
                  href={generateMailto("General Internship Application")}
                  className="px-6 py-2.5 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-xs uppercase tracking-wider shadow-xs hover:shadow-sm transition-all flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-[#DFB76C]" />
                  Open Email Client
                </a>
              </div>
            </div>

            {/* MANDATORY APPLICATION INSTRUCTIONS */}
            <div className="pt-6">
              <h3 className="text-xs uppercase tracking-wider font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8C6A16]" />
                Mandatory Application Instructions for All Candidates:
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#F8FAFC] rounded-xl p-5 border border-slate-200">
                  <div className="w-7 h-7 rounded-md bg-white text-[#8C6A16] border border-slate-200 flex items-center justify-center font-bold text-xs mb-3 shadow-2xs">
                    01
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">Target Role in Subject</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Specify the exact role in the email subject line. Format: <br />
                    <span className="text-slate-900 font-mono text-[11px] font-semibold block mt-1">
                      [Internship] - &lt;Role Title&gt; - &lt;Your Name&gt;
                    </span>
                  </p>
                </div>

                <div className="bg-[#F8FAFC] rounded-xl p-5 border border-slate-200">
                  <div className="w-7 h-7 rounded-md bg-white text-[#8C6A16] border border-slate-200 flex items-center justify-center font-bold text-xs mb-3 shadow-2xs">
                    02
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">Updated PDF Resume</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Attach your updated resume in <strong className="text-slate-900 font-semibold">PDF format</strong>. Highlight technical proficiencies, coursework, and relevant tools.
                  </p>
                </div>

                <div className="bg-[#F8FAFC] rounded-xl p-5 border border-slate-200">
                  <div className="w-7 h-7 rounded-md bg-white text-[#8C6A16] border border-slate-200 flex items-center justify-center font-bold text-xs mb-3 shadow-2xs">
                    03
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">Work Samples &amp; Proof</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Include your GitHub repository, live project links, Figma design portfolio, or writing samples for technical review.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* OPEN INTERNSHIP TRACKS */}
      <section className="w-full py-20 relative z-10">
        <div className="container mx-auto px-6 md:px-12 max-w-6xl">
          
          <div className="mb-12 pb-4 border-b border-slate-200 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest font-semibold text-[#8C6A16] block mb-1">
                Open Cohort Tracks
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                Explore Available Internship Opportunities
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Location: On-Site Siliguri Studio &amp; Hybrid
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {INTERNSHIP_ROLES.map((role) => (
              <div
                key={role.id}
                className="p-8 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-slate-200 flex items-center justify-center text-[#8C6A16]">
                        <role.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                          {role.category}
                        </span>
                        <h3 className="text-lg font-bold text-slate-900 leading-snug">
                          {role.title}
                        </h3>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-md bg-[#F8FAFC] border border-slate-200 text-slate-700 whitespace-nowrap">
                      {role.badge}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    {role.description}
                  </p>

                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block mb-2">
                        Core Responsibilities:
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {role.responsibilities.map((resp, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-1.5 shrink-0" />
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block mb-2">
                        Requirements:
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {role.requirements.map((req, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between gap-4">
                  <span className="text-xs font-medium text-slate-500">
                    Duration: {role.type}
                  </span>

                  <a
                    href={generateMailto(role.title)}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-semibold uppercase tracking-wider shadow-2xs hover:shadow-xs transition-all"
                  >
                    <span>Apply via Email</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#DFB76C]" />
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* WHY INTERN AT DIGITAL DICTIONARY */}
      <section className="w-full py-16 relative z-10 bg-[#F8FAFC] border-t border-slate-200">
        <div className="container mx-auto px-6 md:px-12 max-w-5xl">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-widest font-semibold text-[#8C6A16] block mb-2">
              Career Development Standards
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mb-3">
              Why Launch Your Career at Digital Dictionary?
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl mx-auto">
              Our internship program is structured as an intensive incubator for future technology leaders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
              <h3 className="text-sm font-bold text-slate-900">Direct Senior Mentorship</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Weekly architectural code reviews, 1-on-1 strategy sessions, and direct access to agency leadership.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
              <h3 className="text-sm font-bold text-slate-900">Live Client Deployments</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                No simulated toy apps. Your code, designs, and campaigns will ship to production for real paying clients.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
              <h3 className="text-sm font-bold text-slate-900">Full-Time Conversion Path</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Top performers in each cohort receive formal full-time associate offers and equity consideration.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
