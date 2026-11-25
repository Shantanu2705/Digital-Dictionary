import { ServicePackage, CompanySettings } from "@/types/portal";

export const INITIAL_PACKAGES: ServicePackage[] = [
  // SECTION A: WEB ARCHITECTURE
  {
    id: "pkg-opt-01",
    code: "OPT-01",
    name: "Single-Page Express Landing Page",
    category: "Web Architecture",
    shortDescription: "A hyper-optimized, fast-loading landing page designed to turn paid campaign traffic into WhatsApp enquiries or form submissions.",
    fullDescription: "Ideal when every click needs a clear next step. Built for lead capture campaigns across Google Ads, Meta Ads and localized discovery.",
    price: 12000,
    currency: "INR",
    billingType: "one-time",
    priceType: "fixed",
    includedFeatures: [
      "Single-page conversion funnel",
      "Sub-second load speed architecture",
      "WhatsApp & Direct Call integration",
      "Custom contact form with validation",
      "Mobile-first responsive engineering",
      "SSL/TLS security hardening",
      "Google Tag Manager & Meta Pixel setup"
    ],
    deliverables: [
      "Production-ready Next.js landing page",
      "Form submission routing to email/WhatsApp",
      "Analytics event tracking setup",
      "30 days warranty & launch support"
    ],
    deliveryTimeline: "5 - 7 Business Days",
    supportTerms: "30 days post-launch support",
    traditionalAgencyPrice: "₹20,000",
    designedFor: "Lead capture and high-intent paid advertising",
    active: true,
    displayOrder: 1
  },
  {
    id: "pkg-opt-02",
    code: "OPT-02",
    name: "Starter Business Website",
    category: "Web Architecture",
    shortDescription: "A five-page business website covering Home, About, Services, Gallery and Contact—built on a React/Next.js foundation.",
    fullDescription: "Designed to establish credibility and make it easy for customers to enquire. Engineered on Next.js for superior speed and SEO compared to sluggish WordPress templates.",
    price: 25000,
    currency: "INR",
    billingType: "one-time",
    priceType: "fixed",
    includedFeatures: [
      "5 Structured Pages (Home, About, Services, Gallery, Contact)",
      "Next.js App Router Architecture",
      "Core Web Vitals 95+ score optimization",
      "On-page Technical SEO foundation & schema markup",
      "WhatsApp chat button & inquiry forms",
      "Dynamic responsive layouts across mobile & desktop",
      "Security headers & zero-vulnerability hardening"
    ],
    deliverables: [
      "Full 5-page enterprise website deployment",
      "Google Search Console indexing",
      "Google Analytics 4 setup",
      "60 days post-launch support"
    ],
    deliveryTimeline: "10 - 14 Business Days",
    supportTerms: "60 days post-launch support",
    traditionalAgencyPrice: "₹50,000+",
    designedFor: "Local clinics, salons, consultants and growing service businesses",
    active: true,
    displayOrder: 2
  },
  {
    id: "pkg-opt-04",
    code: "OPT-04",
    name: "Corporate Authority Suite",
    category: "Web Architecture",
    shortDescription: "A 15-page B2B portal with CMS blogs, dynamic case studies and Google Analytics 4 tracking.",
    fullDescription: "Structured for deeper buyer research and organic search visibility. Designed for manufacturers, B2B suppliers, educational institutions and businesses with longer consultative sales cycles.",
    price: 49000,
    currency: "INR",
    billingType: "one-time",
    minimumPrice: 49000,
    priceType: "starting_from",
    includedFeatures: [
      "Up to 15 Structured Corporate Pages",
      "Integrated CMS for Articles, Case Studies & News",
      "Google Analytics 4 & Custom Conversion Goals",
      "AEO, GEO & Advanced Technical SEO Schema",
      "Custom Quotation / RFP Request Generator",
      "Interactive Filterable Project/Client Showcase",
      "Enterprise Edge CDN & sub-second global caching"
    ],
    deliverables: [
      "Comprehensive B2B Corporate Portal",
      "CMS admin access & training documentation",
      "Complete technical SEO & indexing verification",
      "90 days priority warranty & support"
    ],
    deliveryTimeline: "3 - 4 Weeks",
    supportTerms: "90 days priority support",
    traditionalAgencyPrice: "₹1.2 Lakh",
    designedFor: "Manufacturers, suppliers, healthcare institutions, and B2B enterprises",
    active: true,
    displayOrder: 3
  },
  {
    id: "pkg-opt-05",
    code: "OPT-05",
    name: "D2C E-Commerce Store",
    category: "Web Architecture",
    shortDescription: "An owned online storefront with UPI/Razorpay integration and SQL-backed infrastructure.",
    fullDescription: "Build a direct sales channel without relying entirely on third-party marketplace storefronts. Complete customer ownership, instant checkout, and zero middleman commissions.",
    price: 65000,
    currency: "INR",
    billingType: "one-time",
    priceType: "fixed",
    includedFeatures: [
      "Custom E-Commerce Storefront with Product Catalog",
      "Native UPI, Razorpay & Card Gateway Integration",
      "SQL-backed Order & Inventory Database",
      "Customer Cart & Instant One-Step Checkout",
      "Automated WhatsApp & Email Order Confirmations",
      "Admin Order Management & Dispatch Dashboard",
      "Coupon Codes & Promotional Discount Engine"
    ],
    deliverables: [
      "Fully operational D2C E-Commerce platform",
      "Payment gateway live credentials integration",
      "Admin inventory management tutorial",
      "90 days technical support"
    ],
    deliveryTimeline: "3 - 4 Weeks",
    supportTerms: "90 days technical support",
    traditionalAgencyPrice: "₹1.5 Lakh+",
    designedFor: "Retailers, fashion brands, and direct-to-consumer product brands",
    active: true,
    displayOrder: 4
  },

  // SECTION B: MOBILE APP ECOSYSTEMS
  {
    id: "pkg-opt-07",
    code: "OPT-07",
    name: "Native Mobile App (MVP)",
    category: "Mobile App Ecosystems",
    shortDescription: "A cross-platform Android/iOS app built with React Native. Includes Firebase OTP phone login and push notifications.",
    fullDescription: "Designed for businesses building repeat engagement and a dedicated customer channel directly installed on the customer's home screen.",
    price: 65000,
    currency: "INR",
    billingType: "one-time",
    priceType: "fixed",
    includedFeatures: [
      "Cross-platform Android & iOS Native App",
      "React Native shared high-performance codebase",
      "Firebase OTP Phone Number Authentication",
      "Targeted Push Notification Engine",
      "User Profile & Account Management",
      "Cloud Backend Integration & Real-Time Sync",
      "App Store & Google Play Store Submission Guidance"
    ],
    deliverables: [
      "Compiled Android APK / AAB & iOS Build files",
      "Connected Firebase Cloud Backend",
      "Store submission review & approval support",
      "60 days warranty & maintenance"
    ],
    deliveryTimeline: "4 - 5 Weeks",
    supportTerms: "60 days post-launch support",
    traditionalAgencyPrice: "₹2.5 Lakh",
    designedFor: "Businesses building repeat engagement and dedicated customer channels",
    active: true,
    displayOrder: 5
  },
  {
    id: "pkg-opt-08",
    code: "OPT-08",
    name: "Omnichannel Combo (Web + Native App)",
    category: "Mobile App Ecosystems",
    shortDescription: "A five-page website and native mobile app sharing the same database.",
    fullDescription: "Update information in one connected system and keep the web and app experience aligned. The ultimate value proposition for businesses that need both web presence and mobile app access.",
    price: 75000,
    currency: "INR",
    billingType: "one-time",
    priceType: "fixed",
    includedFeatures: [
      "Complete 5-Page Next.js Web Platform",
      "Native iOS & Android Mobile Application",
      "Unified Shared Cloud Database Architecture",
      "Synchronized Content & User Profiles",
      "Integrated Push Notifications & Web Alerts",
      "Single Admin Dashboard managing Web & App",
      "High-Speed Edge Delivery & TLS Encryption"
    ],
    deliverables: [
      "Production Web Platform on custom domain",
      "Android & iOS App Builds",
      "Unified Admin Management Dashboard",
      "90 days priority support"
    ],
    deliveryTimeline: "5 - 6 Weeks",
    supportTerms: "90 days priority support",
    traditionalAgencyPrice: "₹4 Lakh",
    designedFor: "Businesses that want a website and app working from one shared foundation",
    active: true,
    displayOrder: 6
  },
  {
    id: "pkg-opt-09",
    code: "OPT-09",
    name: "Service / Booking App Suite",
    category: "Mobile App Ecosystems",
    shortDescription: "A transactional application for workflows such as dynamic pricing, slot booking and admin dispatch panels.",
    fullDescription: "Supported by PostgreSQL relational data infrastructure. Designed for cab services, diagnostic centres, clinics, tours, and service businesses with multi-step booking operations.",
    price: 125000,
    currency: "INR",
    billingType: "one-time",
    minimumPrice: 125000,
    priceType: "starting_from",
    includedFeatures: [
      "Real-Time Slot Booking & Availability Calendar",
      "Dynamic Pricing & Distance/Time Calculation Engine",
      "Customer Mobile App (iOS & Android)",
      "Admin Dispatch & Fleet/Operator Control Panel",
      "PostgreSQL Relational Data Infrastructure",
      "Automated SMS/WhatsApp/Push Status Updates",
      "Online Advance & Post-Service Payment Gateway"
    ],
    deliverables: [
      "Complete Booking Ecosystem (Customer App + Admin Panel)",
      "Database schema & API architecture documentation",
      "Deployment on scalable cloud infrastructure",
      "120 days enterprise SLA & support"
    ],
    deliveryTimeline: "6 - 8 Weeks",
    supportTerms: "120 days enterprise support",
    traditionalAgencyPrice: "₹6 Lakh+",
    designedFor: "Cab services, diagnostic centres, clinics, and service businesses with booking operations",
    active: true,
    displayOrder: 7
  },

  // SECTION C: ONGOING CARE AND GROWTH
  {
    id: "pkg-opt-12",
    code: "OPT-12",
    name: "Ecosystem Care",
    category: "Ongoing Care & Growth",
    shortDescription: "Unified web + app database hosting, OS dependency updates and priority bug patching.",
    fullDescription: "Help maintain compatibility and reduce the risk of app-store disruption or unexpected website downtime. Proactive technical governance for your digital assets.",
    price: 7500,
    currency: "INR",
    billingType: "monthly",
    priceType: "fixed",
    includedFeatures: [
      "Managed High-Performance Cloud Database Hosting",
      "OS & Dependency Security Updates",
      "Weekly Automated Off-Site Backups",
      "Uptime Monitoring (99.9% Target) & Immediate Alerts",
      "Priority Bug Patching & Resolution",
      "App Store & Play Store Policy Compliance Checks",
      "Monthly Infrastructure Health Report"
    ],
    deliverables: [
      "Active 24/7 technical monitoring",
      "Monthly maintenance log & patch report",
      "Priority SLA response within 4 hours"
    ],
    supportTerms: "Monthly continuous retainer",
    designedFor: "Enterprises needing reliable cloud hosting and technical peace of mind",
    active: true,
    displayOrder: 8
  },
  {
    id: "pkg-opt-13",
    code: "OPT-13",
    name: "Local SEO & Maps",
    category: "Ongoing Care & Growth",
    shortDescription: "Google Business Profile optimization, 15 directory citations per month and two SEO articles.",
    fullDescription: "Designed to strengthen local discovery and capture relevant 'near me' searches. Drive organic local walk-ins, phone calls, and high-intent customer inquiries.",
    price: 10000,
    currency: "INR",
    billingType: "monthly",
    priceType: "fixed",
    includedFeatures: [
      "Google Business Profile (Maps) Complete Optimization",
      "15 High-Authority Local Directory Citations / Month",
      "2 Search-Engine-Optimized Articles / Month",
      "Local Keyword Rank Tracking & Competitor Monitoring",
      "Review Management & Response Strategy",
      "Local Schema Markup Maintenance",
      "Monthly Organic Growth & Impression Report"
    ],
    deliverables: [
      "Monthly citation audit & proof links",
      "2 published blog articles with keyword targets",
      "Comprehensive monthly Google Maps analytics report"
    ],
    supportTerms: "Monthly continuous retainer",
    designedFor: "Local businesses, clinics, retail stores, and regional service providers",
    active: true,
    displayOrder: 9
  },
  {
    id: "pkg-opt-16",
    code: "OPT-16",
    name: "Dual-Channel Ads (Meta + Google)",
    category: "Ongoing Care & Growth",
    shortDescription: "Campaign management across Facebook, Instagram and Google Search, with retargeting.",
    fullDescription: "Help drive relevant leads towards your sales team, CRM or WhatsApp. Advertising spend is paid separately directly to advertising platforms.",
    price: 25000,
    currency: "INR",
    billingType: "monthly",
    priceType: "fixed",
    adSpendSeparate: true,
    includedFeatures: [
      "Google Search & High-Intent Keyword Campaigns",
      "Meta (Facebook & Instagram) Feed & Story Ad Campaigns",
      "Custom Audience Retargeting & Pixel Tracking",
      "Continuous A/B Testing of Ad Copy & Visuals",
      "Conversion Tracking Setup on Forms & WhatsApp",
      "Negative Keyword & Waste-Spend Elimination",
      "Bi-Weekly Performance Reviews & ROAS Optimization"
    ],
    deliverables: [
      "Full ad creative copies & design assets",
      "Live campaign execution & bid management",
      "Comprehensive monthly ROAS & conversion metrics report"
    ],
    supportTerms: "Monthly retainer (Ad spend paid directly to Meta/Google)",
    designedFor: "Businesses ready to scale leads and sales through predictable paid advertising",
    active: true,
    displayOrder: 10
  },
  {
    id: "pkg-opt-17",
    code: "OPT-17",
    name: "360° Growth Engine",
    category: "Ongoing Care & Growth",
    shortDescription: "An outsourced growth pod combining Local SEO, Dual-Channel Ads, 12 edited reels per month and email/WhatsApp promotions.",
    fullDescription: "Coordinated digital marketing execution functioning as your dedicated outsourced CMO and creative growth pod. Advertising spend is paid separately.",
    price: 65000,
    currency: "INR",
    billingType: "monthly",
    priceType: "fixed",
    adSpendSeparate: true,
    includedFeatures: [
      "Complete Local SEO & Google Maps Domination",
      "Full Dual-Channel Meta & Google Ads Campaign Management",
      "12 Professionally Edited Short-Form Video Reels / Month",
      "Bi-Weekly WhatsApp & Email Campaign Blasts",
      "Conversion Rate Optimization across Landing Pages",
      "Dedicated Senior Growth Strategist & Account Manager",
      "Weekly Performance Standups & Executive Dashboards"
    ],
    deliverables: [
      "12 broadcast-ready video reels",
      "Ongoing ad creative & copy production",
      "Weekly and monthly growth reports",
      "Dedicated Slack/WhatsApp executive communication channel"
    ],
    supportTerms: "Monthly retainer (Ad spend paid directly to Meta/Google)",
    designedFor: "Established brands and growing enterprises wanting an all-in-one growth team",
    active: true,
    displayOrder: 11
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
