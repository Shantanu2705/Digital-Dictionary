import { ServicePackage, CompanySettings } from "@/types/portal";

export const CATALOGUE_ADDONS = {
  additionalPageRate: 2500,
  additionalScreenRate: 4000,
  optionalModules: [
    {
      id: "mod-cms",
      name: "Admin Dashboard / CMS",
      pricingNote: "Quoted by number of roles, modules, reports and content workflows.",
      suggestedPrice: 15000,
    },
    {
      id: "mod-payment",
      name: "Payment Gateway Integration",
      pricingNote: "Integration quoted by provider and checkout complexity; provider transaction charges extra.",
      suggestedPrice: 8000,
    },
    {
      id: "mod-gps",
      name: "Maps, GPS & Live Tracking",
      pricingNote: "Quoted by tracking frequency, map APIs, user roles and real-time architecture.",
      suggestedPrice: 22000,
    },
    {
      id: "mod-chat",
      name: "Chat, Messaging & Notifications",
      pricingNote: "Quoted by channels, automation, volume and third-party provider.",
      suggestedPrice: 14000,
    },
    {
      id: "mod-multilingual",
      name: "Multilingual / Multi-Region",
      pricingNote: "Quoted by language count, translation responsibility and content structure.",
      suggestedPrice: 12000,
    },
  ],
};

export const INITIAL_PACKAGES: ServicePackage[] = [
  // ==========================================
  // 02 / WEBSITE ARCHITECTURE (6 Packages)
  // ==========================================
  {
    id: "pkg-web-01",
    code: "WEB-01",
    name: "Express Landing Page",
    category: "Website Architecture",
    pageLimit: "1 page",
    shortDescription: "Campaigns, lead capture and a focused online presence.",
    fullDescription: "A focused single-page website built for advertising campaigns, product launches, and direct WhatsApp or enquiry lead capture.",
    price: 12000,
    currency: "INR",
    billingType: "one-time",
    priceType: "fixed",
    includedFeatures: [
      "1 Distinct Conversion Page",
      "Responsive layout for mobile, tablet & desktop",
      "Brand-aligned UI design and navigation",
      "Contact / enquiry section with agreed form fields",
      "Social links & WhatsApp/call touchpoints",
      "Basic on-page SEO setup and metadata",
      "Pre-launch functional checks & deployment assistance"
    ],
    deliverables: [
      "Production Next.js landing page",
      "One agreed revision cycle for design/content alignment",
      "30 days post-launch support"
    ],
    deliveryTimeline: "5 - 7 Business Days",
    supportTerms: "1 agreed revision cycle included",
    designedFor: "Campaigns, lead capture and a focused online presence",
    active: true,
    displayOrder: 1
  },
  {
    id: "pkg-web-02",
    code: "WEB-02",
    name: "Starter Website",
    category: "Website Architecture",
    pageLimit: "Up to 5 pages",
    shortDescription: "Local businesses, consultants and service providers.",
    fullDescription: "A 5-page business foundation covering key brand destinations such as Home, About, Services, Gallery and Contact.",
    price: 25000,
    currency: "INR",
    billingType: "one-time",
    priceType: "fixed",
    includedFeatures: [
      "Up to 5 Distinct Pages",
      "Responsive layout for mobile, tablet & desktop",
      "Brand-aligned UI design and navigation",
      "Contact/enquiry section with agreed form fields",
      "Social links and WhatsApp/call touchpoints",
      "Basic on-page SEO setup and metadata",
      "Pre-launch functional checks and deployment assistance"
    ],
    deliverables: [
      "Full 5-page Next.js website deployment",
      "One agreed revision cycle included",
      "Additional standard pages at ₹2,500/page"
    ],
    deliveryTimeline: "10 - 14 Business Days",
    supportTerms: "Pre-launch QA & deployment assistance",
    designedFor: "Local businesses, consultants and service providers",
    active: true,
    displayOrder: 2
  },
  {
    id: "pkg-web-03",
    code: "WEB-03",
    name: "Business Website",
    category: "Website Architecture",
    pageLimit: "Up to 10 pages",
    shortDescription: "Businesses needing a broader service and company profile.",
    fullDescription: "Expanded 10-page architecture enabling dedicated pages for individual service lines, case highlights, leadership, and customer pathways.",
    price: 35000,
    currency: "INR",
    billingType: "one-time",
    priceType: "fixed",
    includedFeatures: [
      "Up to 10 Distinct Pages",
      "Responsive layout for mobile, tablet & desktop",
      "Brand-aligned UI design and navigation",
      "Contact/enquiry section with agreed form fields",
      "Social links and WhatsApp/call touchpoints",
      "Basic on-page SEO setup and metadata",
      "Pre-launch functional checks and deployment assistance"
    ],
    deliverables: [
      "Complete 10-page corporate website",
      "One agreed revision cycle included",
      "Additional standard pages at ₹2,500/page"
    ],
    deliveryTimeline: "2 - 3 Weeks",
    supportTerms: "Pre-launch QA & deployment assistance",
    designedFor: "Businesses needing a broader service and company profile",
    active: true,
    displayOrder: 3
  },
  {
    id: "pkg-web-04",
    code: "WEB-04",
    name: "Professional Website",
    category: "Website Architecture",
    pageLimit: "Up to 15 pages",
    shortDescription: "Growing brands, B2B companies and detailed service portfolios.",
    fullDescription: "A structured 15-page digital presence crafted for consultative B2B firms, multi-service agencies, and high-trust institutions.",
    price: 49000,
    currency: "INR",
    billingType: "one-time",
    priceType: "fixed",
    includedFeatures: [
      "Up to 15 Distinct Pages",
      "Responsive layout for mobile, tablet & desktop",
      "Brand-aligned UI design and navigation",
      "Structured enquiry journeys & WhatsApp/call touchpoints",
      "On-page SEO foundations & metadata",
      "Pre-launch functional checks & deployment assistance"
    ],
    deliverables: [
      "15-page enterprise web foundation",
      "Agreed revision cycle & QA verification",
      "Additional standard pages at ₹2,500/page"
    ],
    deliveryTimeline: "3 - 4 Weeks",
    supportTerms: "Pre-launch QA & deployment assistance",
    designedFor: "Growing brands, B2B companies and detailed service portfolios",
    active: true,
    displayOrder: 4
  },
  {
    id: "pkg-web-05",
    code: "WEB-05",
    name: "Enterprise Website",
    category: "Website Architecture",
    pageLimit: "Up to 20 pages",
    shortDescription: "Larger organisations with multiple departments or content sections.",
    fullDescription: "Comprehensive 20-page multi-department architecture built on Next.js & React for enterprise visibility and scale.",
    price: 65000,
    currency: "INR",
    billingType: "one-time",
    priceType: "fixed",
    includedFeatures: [
      "Up to 20 Distinct Pages",
      "Multi-department & content section navigation",
      "Responsive layout across mobile, tablet & desktop",
      "Conversion-focused enquiry paths & touchpoints",
      "Technical SEO, AEO & GEO structured metadata",
      "Pre-launch functional checks & security QA"
    ],
    deliverables: [
      "20-page enterprise website on custom domain",
      "Architecture & handover documentation",
      "Additional standard pages at ₹2,500/page"
    ],
    deliveryTimeline: "4 - 5 Weeks",
    supportTerms: "QA & security verification included",
    designedFor: "Larger organisations with multiple departments or content sections",
    active: true,
    displayOrder: 5
  },
  {
    id: "pkg-web-06",
    code: "WEB-06",
    name: "Custom Website",
    category: "Website Architecture",
    pageLimit: "20+ pages",
    shortDescription: "Large portals, complex content structures and bespoke workflows.",
    fullDescription: "Bespoke multi-page portals with CMS, blog management, multilingual content, user accounts, dashboards, booking engines, or custom integrations.",
    price: 0,
    currency: "INR",
    billingType: "custom",
    priceType: "custom_quote",
    includedFeatures: [
      "20+ Pages & Dynamic Routing",
      "Optional CMS, Blog Management & User Accounts",
      "Advanced Animations & Multilingual Content",
      "Custom Dashboards & Third-Party Integrations",
      "Full Security Hardening & QA Checklist"
    ],
    deliverables: [
      "Detailed feature specification & milestone proposal",
      "Custom Next.js & React web application",
      "Dedicated deployment & handover"
    ],
    deliveryTimeline: "Scoped per Proposal",
    supportTerms: "Custom SLA",
    designedFor: "Large portals, complex content structures and bespoke workflows",
    active: true,
    displayOrder: 6
  },

  // ==========================================
  // 03 / MOBILE APPLICATION SYSTEMS (4 Packages)
  // ==========================================
  {
    id: "pkg-app-01",
    code: "APP-01",
    name: "Mobile App MVP",
    category: "Mobile Application Systems",
    screenLimit: "Up to 10 screens",
    shortDescription: "A focused first release for a defined customer journey.",
    fullDescription: "React Native cross-platform application for Android and iOS covering a core customer journey with Firebase/backend MVP setup.",
    price: 65000,
    currency: "INR",
    billingType: "one-time",
    priceType: "fixed",
    includedFeatures: [
      "React Native cross-platform app (Android & iOS)",
      "Up to 10 agreed app screens in MVP tier",
      "Basic navigation & standard form interactions",
      "One agreed user type & basic account flow",
      "Firebase / backend setup for agreed MVP data model",
      "Basic push notification setup (if required)",
      "Build, QA and release handover assistance"
    ],
    deliverables: [
      "Android & iOS builds from shared codebase",
      "Connected Firebase/backend setup",
      "Additional standard screens at ₹4,000/screen"
    ],
    deliveryTimeline: "4 - 5 Weeks",
    supportTerms: "Build, QA & release handover assistance",
    designedFor: "A focused first release for a defined customer journey",
    active: true,
    displayOrder: 7
  },
  {
    id: "pkg-app-02",
    code: "APP-02",
    name: "Professional App",
    category: "Mobile Application Systems",
    screenLimit: "Up to 15 screens",
    shortDescription: "More customer journeys and a broader feature set.",
    fullDescription: "Cross-platform Android and iOS React Native app expanding to 15 screens for richer customer interactions and account workflows.",
    price: 85000,
    currency: "INR",
    billingType: "one-time",
    priceType: "fixed",
    includedFeatures: [
      "React Native cross-platform app (Android & iOS)",
      "Up to 15 agreed app screens",
      "Expanded customer journeys & standard interactions",
      "Account flows, authentication & push notifications",
      "Firebase / cloud backend setup for agreed model",
      "Build, QA and store release handover assistance"
    ],
    deliverables: [
      "Android & iOS production builds",
      "Cloud data model & notifications setup",
      "Additional standard screens at ₹4,000/screen"
    ],
    deliveryTimeline: "5 - 6 Weeks",
    supportTerms: "Build, QA & release handover assistance",
    designedFor: "More customer journeys and a broader feature set",
    active: true,
    displayOrder: 8
  },
  {
    id: "pkg-app-03",
    code: "APP-03",
    name: "Advanced App",
    category: "Mobile Application Systems",
    screenLimit: "Up to 20 screens",
    shortDescription: "Richer workflows, multiple modules and expanded functionality.",
    fullDescription: "A 20-screen cross-platform mobile suite built on React Native to support multi-module customer operations.",
    price: 110000,
    currency: "INR",
    billingType: "one-time",
    priceType: "fixed",
    includedFeatures: [
      "React Native cross-platform app (Android & iOS)",
      "Up to 20 agreed app screens",
      "Multiple feature modules & richer workflows",
      "Cloud backend synchronization & push notifications",
      "QA testing & release handover assistance"
    ],
    deliverables: [
      "Compiled Android & iOS applications",
      "Configured cloud backend & push architecture",
      "Additional standard screens at ₹4,000/screen"
    ],
    deliveryTimeline: "6 - 8 Weeks",
    supportTerms: "Build, QA & release handover assistance",
    designedFor: "Richer workflows, multiple modules and expanded functionality",
    active: true,
    displayOrder: 9
  },
  {
    id: "pkg-app-04",
    code: "APP-04",
    name: "Enterprise App",
    category: "Mobile Application Systems",
    screenLimit: "20+ screens",
    shortDescription: "Complex operations, multiple roles and bespoke integrations.",
    fullDescription: "Custom-scoped mobile ecosystem supporting multiple user roles, complex admin panels, live tracking, chat, offline sync, or third-party APIs.",
    price: 0,
    currency: "INR",
    billingType: "custom",
    priceType: "custom_quote",
    includedFeatures: [
      "20+ Screens & Multiple User Roles",
      "Complex Admin Panels & Real-Time Workflows",
      "Optional Live Tracking, Chat & Offline Sync",
      "Custom Third-Party APIs & Subscription Logic",
      "Dedicated QA, Security & Release Support"
    ],
    deliverables: [
      "Technical architecture specification",
      "Multi-role Android & iOS applications",
      "Release & handover governance"
    ],
    deliveryTimeline: "Scoped per Proposal",
    supportTerms: "Custom Enterprise SLA",
    designedFor: "Complex operations, multiple roles and bespoke integrations",
    active: true,
    displayOrder: 10
  },

  // ==========================================
  // 04 / CONNECTED WEB + APP PACKAGES (4 Bundles)
  // ==========================================
  {
    id: "pkg-cmb-01",
    code: "CMB-01",
    name: "Launch Combo",
    category: "Connected Web + App",
    pageLimit: "Up to 5 pages",
    screenLimit: "Up to 10 screens",
    shortDescription: "Website (up to 5 pages) + Mobile App (up to 10 screens) on a shared backend.",
    fullDescription: "Unified launch bundle pairing a 5-page responsive website with a 10-screen React Native mobile app connected through a shared backend and data model.",
    price: 75000,
    currency: "INR",
    billingType: "one-time",
    priceType: "fixed",
    includedFeatures: [
      "Website: Up to 5 pages (SEO-ready & enquiry forms)",
      "Mobile App: Up to 10 customer-facing screens",
      "Shared Backend Database, API & Authentication Layer",
      "Reduced duplicate data entry & unified data model",
      "Push notifications & app release setup (where selected)"
    ],
    deliverables: [
      "Responsive Next.js Website",
      "Android & iOS React Native App",
      "Connected Cloud Architecture"
    ],
    deliveryTimeline: "5 - 6 Weeks",
    supportTerms: "Unified release & handover",
    designedFor: "New ventures launching web + mobile around a shared architecture",
    active: true,
    displayOrder: 11
  },
  {
    id: "pkg-cmb-02",
    code: "CMB-02",
    name: "Business Combo",
    category: "Connected Web + App",
    pageLimit: "Up to 10 pages",
    screenLimit: "Up to 10 screens",
    shortDescription: "Website (up to 10 pages) + Mobile App (up to 10 screens) on a shared backend.",
    fullDescription: "Connected growth bundle combining a 10-page business website with a 10-screen customer mobile application sharing one common data foundation.",
    price: 95000,
    currency: "INR",
    billingType: "one-time",
    priceType: "fixed",
    includedFeatures: [
      "Website: Up to 10 pages (SEO-ready & enquiry funnels)",
      "Mobile App: Up to 10 screens (Android & iOS)",
      "Shared Database, API & Business Data Rules",
      "Consistent information across Web and Mobile"
    ],
    deliverables: [
      "10-page Next.js Business Website",
      "10-screen React Native Mobile App",
      "Shared Backend & API Layer"
    ],
    deliveryTimeline: "6 - 7 Weeks",
    supportTerms: "Unified release & handover",
    designedFor: "Businesses needing a broader company website plus a customer mobile app",
    active: true,
    displayOrder: 12
  },
  {
    id: "pkg-cmb-03",
    code: "CMB-03",
    name: "Professional Combo",
    category: "Connected Web + App",
    pageLimit: "Up to 15 pages",
    screenLimit: "Up to 15 screens",
    shortDescription: "Website (up to 15 pages) + Mobile App (up to 15 screens) on a shared backend.",
    fullDescription: "High-capacity connected bundle offering up to 15 web pages and 15 cross-platform mobile screens built on an integrated API and database layer.",
    price: 125000,
    currency: "INR",
    billingType: "one-time",
    priceType: "fixed",
    includedFeatures: [
      "Website: Up to 15 pages",
      "Mobile App: Up to 15 screens (Android & iOS)",
      "Shared Cloud Backend, Authentication & Data Rules",
      "Coordinated Web & App QA & Security Checks"
    ],
    deliverables: [
      "15-page Next.js Web Platform",
      "15-screen React Native App",
      "Architecture Document & Handover"
    ],
    deliveryTimeline: "7 - 9 Weeks",
    supportTerms: "Unified release & handover",
    designedFor: "Scaling organisations with multi-service web portfolios and customer apps",
    active: true,
    displayOrder: 13
  },
  {
    id: "pkg-cmb-04",
    code: "CMB-04",
    name: "Enterprise Combo",
    category: "Connected Web + App",
    pageLimit: "Up to 20 pages",
    screenLimit: "Up to 20 screens",
    shortDescription: "Website (up to 20 pages) + Mobile App (up to 20 screens) on a shared backend.",
    fullDescription: "Flagship omnichannel bundle uniting a 20-page enterprise website and a 20-screen native mobile app over a shared data and API architecture.",
    price: 155000,
    currency: "INR",
    billingType: "one-time",
    priceType: "fixed",
    includedFeatures: [
      "Website: Up to 20 pages",
      "Mobile App: Up to 20 screens (Android & iOS)",
      "Unified Shared Cloud Database & API Architecture",
      "End-to-End QA, Security Verification & Handover"
    ],
    deliverables: [
      "20-page Enterprise Website",
      "20-screen Native Mobile Application",
      "Shared Cloud Foundation & Deployment"
    ],
    deliveryTimeline: "8 - 10 Weeks",
    supportTerms: "Unified release & handover",
    designedFor: "Large organisations requiring complete connected web & mobile ecosystems",
    active: true,
    displayOrder: 14
  },

  // ==========================================
  // 05 / COMMERCE & BUSINESS WORKFLOWS (4 Solutions)
  // ==========================================
  {
    id: "pkg-com-01",
    code: "COM-01",
    name: "D2C E-commerce Website",
    category: "Commerce & Business Workflows",
    shortDescription: "Product catalogue, product detail structure, cart/checkout journey and payment integration planning.",
    fullDescription: "Owned D2C online store engineered for seamless product discovery, structured catalogue presentation, cart/checkout flow and payment integration.",
    price: 65000,
    currency: "INR",
    billingType: "one-time",
    minimumPrice: 65000,
    priceType: "starting_from",
    includedFeatures: [
      "Structured Product Catalogue & Category Navigation",
      "Product Detail Pages & Variant Architecture",
      "Cart & Checkout User Journey",
      "Payment Gateway Integration Planning",
      "Responsive High-Speed Next.js Storefront"
    ],
    deliverables: [
      "Production D2C E-commerce Web Platform",
      "Payment integration & checkout QA",
      "Scoped shipping & admin workflow configuration"
    ],
    deliveryTimeline: "4 - 6 Weeks",
    supportTerms: "Final scope adjusted for product volume & workflows",
    designedFor: "Retailers and D2C brands building an owned commerce channel",
    active: true,
    displayOrder: 15
  },
  {
    id: "pkg-com-02",
    code: "COM-02",
    name: "Service / Booking App Suite",
    category: "Commerce & Business Workflows",
    shortDescription: "Booking flow, slot selection, operational data and admin/dispatch workflow as agreed.",
    fullDescription: "Transactional booking system built around appointment/slot selection, operational records, and admin/dispatch management. Dynamic pricing, maps, and live tracking scoped separately.",
    price: 125000,
    currency: "INR",
    billingType: "one-time",
    minimumPrice: 125000,
    priceType: "starting_from",
    includedFeatures: [
      "Customer Booking Flow & Time-Slot Selection",
      "Operational Data Models & Service Management",
      "Admin / Dispatch Workflow Panel as Agreed",
      "Relational / Cloud Database Architecture",
      "Payment Gateway Readiness"
    ],
    deliverables: [
      "Customer Booking Application",
      "Admin & Dispatch Control Panel",
      "Database & Workflow Documentation"
    ],
    deliveryTimeline: "6 - 8 Weeks",
    supportTerms: "Dynamic pricing, maps & live tracking scoped separately",
    designedFor: "Clinics, diagnostics, fleets, salons, tours and booking-driven businesses",
    active: true,
    displayOrder: 16
  },
  {
    id: "pkg-com-03",
    code: "COM-03",
    name: "CRM / ERP / Business Portal",
    category: "Commerce & Business Workflows",
    shortDescription: "Role-based access, dashboards, records, approvals, reports and integrations designed around the client's operating process.",
    fullDescription: "Tailor-made internal management portal, CRM or ERP engineered around your exact roles, approval chains, reporting outputs and operational data workflows.",
    price: 0,
    currency: "INR",
    billingType: "custom",
    priceType: "custom_quote",
    includedFeatures: [
      "Role-Based Access Control (RBAC)",
      "Operational Dashboards, Records & Audit Logs",
      "Custom Approval Chains & Automated Reporting",
      "Bespoke Integrations Around Operating Process"
    ],
    deliverables: [
      "Workflow Scope & Architecture Document",
      "Custom Business Portal Application",
      "Team Onboarding & Admin Handover"
    ],
    deliveryTimeline: "Scoped per Proposal",
    supportTerms: "Milestone quotation after workflow scoping",
    designedFor: "Organisations digitising internal operations, approvals and records",
    active: true,
    displayOrder: 17
  },
  {
    id: "pkg-com-04",
    code: "COM-04",
    name: "Custom API / Integration",
    category: "Commerce & Business Workflows",
    shortDescription: "Payment, messaging, third-party platforms, legacy systems and data synchronisation based on API availability and provider requirements.",
    fullDescription: "Specialized systems integration engineering connecting payment providers, messaging gateways, legacy tools, ERPs, or external SaaS APIs cleanly.",
    price: 0,
    currency: "INR",
    billingType: "custom",
    priceType: "custom_quote",
    includedFeatures: [
      "Payment & Messaging Provider Integrations",
      "Third-Party SaaS & Legacy System Connectivity",
      "Automated Webhooks & Data Synchronisation",
      "Error Handling & API Security Hardening"
    ],
    deliverables: [
      "Integration Specification & API Mapping",
      "Production Connectors & Verification Logs"
    ],
    deliveryTimeline: "Scoped per Proposal",
    supportTerms: "Provider fees & external subscriptions billed separately",
    designedFor: "Businesses connecting legacy systems, payment gateways, or third-party APIs",
    active: true,
    displayOrder: 18
  },

  // ==========================================
  // 06 / ONGOING CARE & GROWTH (4 Monthly Retainers)
  // ==========================================
  {
    id: "pkg-grw-01",
    code: "GRW-01",
    name: "Ecosystem Care",
    category: "Ongoing Care & Growth",
    shortDescription: "Unified web + app platform care, dependency updates and priority bug patching for the agreed systems.",
    fullDescription: "Monthly technical governance covering unified website and mobile application care, dependency security updates and priority bug resolution.",
    price: 7500,
    currency: "INR",
    billingType: "monthly",
    priceType: "fixed",
    includedFeatures: [
      "Unified Web + App Platform Care",
      "Dependency & Runtime Updates",
      "Priority Bug Patching for Agreed Systems",
      "Pre-agreed System Health & Stability Checks"
    ],
    deliverables: [
      "Ongoing dependency updates & patching",
      "Priority technical support for agreed systems"
    ],
    supportTerms: "Recurring monthly retainer (Hosting billed separately unless agreed)",
    designedFor: "Businesses wanting dependable ongoing technical care after launch",
    active: true,
    displayOrder: 19
  },
  {
    id: "pkg-grw-02",
    code: "GRW-02",
    name: "Local SEO & Maps",
    category: "Ongoing Care & Growth",
    shortDescription: "Google Business Profile optimisation, 15 directory citations per month and 2 SEO articles.",
    fullDescription: "Structured local discovery retainer focused on Google Business Profile optimisation, consistent local directory citations and search-focused editorial content.",
    price: 10000,
    currency: "INR",
    billingType: "monthly",
    priceType: "fixed",
    includedFeatures: [
      "Google Business Profile Optimisation",
      "15 Local Directory Citations per Month",
      "2 SEO-Focused Articles per Month",
      "Local Discovery & Profile Hygiene Maintenance"
    ],
    deliverables: [
      "Monthly citation & GBP optimisation report",
      "2 published SEO articles per month"
    ],
    supportTerms: "Recurring monthly marketing retainer",
    designedFor: "Local clinics, offices, retail brands and regional service providers",
    active: true,
    displayOrder: 20
  },
  {
    id: "pkg-grw-03",
    code: "GRW-03",
    name: "Dual-Channel Ads (Meta + Google)",
    category: "Ongoing Care & Growth",
    shortDescription: "Campaign management across Facebook, Instagram and Google Search, with retargeting where suitable. Ad spend is extra.",
    fullDescription: "End-to-end performance campaign management across Meta (Facebook & Instagram) and Google Search, complete with structured retargeting funnels.",
    price: 25000,
    currency: "INR",
    billingType: "monthly",
    priceType: "fixed",
    adSpendSeparate: true,
    includedFeatures: [
      "Meta (Facebook & Instagram) Campaign Management",
      "Google Search Campaign Management",
      "Audience Retargeting Setup where Suitable",
      "Ad Performance Tracking & Optimisation"
    ],
    deliverables: [
      "Active campaign setup, monitoring & optimisation",
      "Periodic performance & indicator reporting"
    ],
    supportTerms: "Monthly retainer; advertising spend paid directly to Meta/Google",
    designedFor: "Businesses scaling enquiries and conversions across Search and Social",
    active: true,
    displayOrder: 21
  },
  {
    id: "pkg-grw-04",
    code: "GRW-04",
    name: "360° Growth Engine",
    category: "Ongoing Care & Growth",
    shortDescription: "Local SEO, dual-channel ads, 12 edited reels per month and email/WhatsApp promotions.",
    fullDescription: "Full-spectrum monthly growth execution combining Local SEO & Maps, Dual-Channel Meta + Google Ads, 12 edited video reels, and email/WhatsApp promotion cycles.",
    price: 65000,
    currency: "INR",
    billingType: "monthly",
    priceType: "fixed",
    adSpendSeparate: true,
    includedFeatures: [
      "Local SEO & Google Business Profile Optimisation",
      "Dual-Channel Ads Management (Meta + Google)",
      "12 Edited Reels per Month",
      "Email & WhatsApp Promotional Campaigns",
      "Coordinated Publishing Calendar & Performance Reporting"
    ],
    deliverables: [
      "12 edited monthly video reels",
      "Active Local SEO + Dual-Channel Ads management",
      "Email/WhatsApp campaign execution & performance report"
    ],
    supportTerms: "Monthly retainer; ad spend & stock/paid external tools separate",
    designedFor: "Ambitious brands wanting a complete connected growth engine",
    active: true,
    displayOrder: 22
  }
];

export const INITIAL_SERVICE_PACKAGES: ServicePackage[] = INITIAL_PACKAGES;

export const DEFAULT_COMPANY_SETTINGS: CompanySettings = {
  companyName: "Digital Dictionary",
  tagline: "Engineering Digital Ecosystems That Drive Revenue",
  address: "Kawakhali Bazar, Kawakhali Road",
  city: "Siliguri",
  state: "West Bengal",
  pinCode: "734012",
  phone: "+91 6297 868 104",
  email: "contact@digitaldictionary.in",
  supportEmail: "support@digitaldictionary.in",
  website: "www.digitaldictionary.in",
  msmeRegistration: "UDYAM-WB-10-0098465",
  authorizedSignatoryName: "Authorized Signatory",
  authorizedSignatoryDesignation: "Proprietor / Executive Director",
  ceoSignatureUrl: "/official-stamp.jpg",
  proprietorStampUrl: "/official-stamp.jpg",
  defaultCurrency: "INR",
  dateFormat: "DD/MM/YYYY",
  pdfBorderGold: true,
  pdfDoubleBorder: true
};
