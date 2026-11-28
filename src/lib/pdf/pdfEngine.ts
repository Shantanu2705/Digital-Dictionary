import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { CompanySettings } from "@/types/portal";
import { DEFAULT_COMPANY_SETTINGS } from "@/lib/data/initialCatalogue";
import { OFFICIAL_LOGO_BASE64, OFFICIAL_STAMP_BASE64 } from "@/lib/pdf/assets";

// Brand Colors for PDF
const GOLD_METALLIC = [212, 175, 55]; // #D4AF37
const GOLD_CHAMPAGNE = [232, 209, 138]; // #E8D18A
const GOLD_DEEP = [166, 124, 34]; // #A67C22
const RICH_BLACK = [16, 16, 16]; // #101010
const CHARCOAL = [27, 27, 27]; // #1B1B1B
const MUTED_GREY = [119, 119, 119]; // #777777
const SOFT_GREY_BG = [245, 245, 243]; // #F5F5F3

export class DigitalDictionaryPDF {
  doc: jsPDF;
  settings: CompanySettings;
  pageCount: number;

  constructor(settings?: CompanySettings) {
    this.settings = settings || DEFAULT_COMPANY_SETTINGS;
    this.doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    this.pageCount = 1;
  }

  // Draw official metallic-gold double border around the A4 page
  drawPageBorders() {
    const doc = this.doc;
    const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
    const pageHeight = doc.internal.pageSize.getHeight(); // 297mm

    // Outer Gold Border (1.2pt)
    doc.setDrawColor(GOLD_METALLIC[0], GOLD_METALLIC[1], GOLD_METALLIC[2]);
    doc.setLineWidth(0.65);
    doc.rect(7, 7, pageWidth - 14, pageHeight - 14);

    // Inner Delicate Champagne Line (0.5pt)
    doc.setDrawColor(GOLD_CHAMPAGNE[0], GOLD_CHAMPAGNE[1], GOLD_CHAMPAGNE[2]);
    doc.setLineWidth(0.25);
    doc.rect(8.8, 8.8, pageWidth - 17.6, pageHeight - 17.6);

    // Subtle corner ornaments
    doc.setFillColor(GOLD_METALLIC[0], GOLD_METALLIC[1], GOLD_METALLIC[2]);
    doc.circle(7, 7, 0.6, "F");
    doc.circle(pageWidth - 7, 7, 0.6, "F");
    doc.circle(7, pageHeight - 7, 0.6, "F");
    doc.circle(pageWidth - 7, pageHeight - 7, 0.6, "F");
  }

  // Render official company letterhead with typography, metallic logo emblem and contact strip
  renderHeader(title: string, subtitle?: string, documentNumber?: string) {
    const doc = this.doc;
    const pageWidth = doc.internal.pageSize.getWidth();

    this.drawPageBorders();

    // Embed Official Metallic Logo Image (16mm x 12mm)
    try {
      doc.addImage(OFFICIAL_LOGO_BASE64, "PNG", 14, 11, 16, 12);
    } catch (e) {
      console.warn("Logo rendering notice:", e);
    }

    // Top Brand Name
    const brandX = 33;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13.5);
    doc.setTextColor(GOLD_DEEP[0], GOLD_DEEP[1], GOLD_DEEP[2]);
    doc.text(this.settings.companyName.toUpperCase(), brandX, 17);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(MUTED_GREY[0], MUTED_GREY[1], MUTED_GREY[2]);
    doc.text("ENGINEERING DIGITAL ECOSYSTEMS THAT DRIVE REVENUE", brandX, 21.5);

    // Right-aligned contact info in header (Carefully separated to avoid any collision)
    doc.setFontSize(7.2);
    doc.setTextColor(MUTED_GREY[0], MUTED_GREY[1], MUTED_GREY[2]);
    doc.text(`${this.settings.website}  |  ${this.settings.phone}`, pageWidth - 14, 17, { align: "right" });
    doc.text(`Govt. MSME: ${this.settings.msmeRegistration}`, pageWidth - 14, 21.5, { align: "right" });

    // Hairline separator in metallic gold
    doc.setDrawColor(GOLD_CHAMPAGNE[0], GOLD_CHAMPAGNE[1], GOLD_CHAMPAGNE[2]);
    doc.setLineWidth(0.35);
    doc.line(14, 25.5, pageWidth - 14, 25.5);

    // Document Banner Bar
    doc.setFillColor(RICH_BLACK[0], RICH_BLACK[1], RICH_BLACK[2]);
    doc.rect(14, 28.5, pageWidth - 28, 9, "F");

    // Title inside banner
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(255, 255, 255);
    doc.text(title.toUpperCase(), 18, 34.5);

    // Document Number on Right of banner
    if (documentNumber) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(GOLD_CHAMPAGNE[0], GOLD_CHAMPAGNE[1], GOLD_CHAMPAGNE[2]);
      doc.text(`REF: ${documentNumber}`, pageWidth - 18, 34.5, { align: "right" });
    }

    if (subtitle) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(7.5);
      doc.setTextColor(MUTED_GREY[0], MUTED_GREY[1], MUTED_GREY[2]);
      doc.text(subtitle, 14, 42);
      return 46; // Return next Y position
    }

    return 42; // Return next Y position
  }

  // Render bottom footer with pagination and confidentiality notice
  renderFooter(pageNumber: number, totalPages: number) {
    const doc = this.doc;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Footer divider line
    doc.setDrawColor(GOLD_CHAMPAGNE[0], GOLD_CHAMPAGNE[1], GOLD_CHAMPAGNE[2]);
    doc.setLineWidth(0.3);
    doc.line(15, pageHeight - 16, pageWidth - 15, pageHeight - 16);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(MUTED_GREY[0], MUTED_GREY[1], MUTED_GREY[2]);
    doc.text(
      `CONFIDENTIAL  •  ${this.settings.companyName}  •  ${this.settings.address}, ${this.settings.city}, WB ${this.settings.pinCode}`,
      15,
      pageHeight - 11.5
    );

    // Page Number
    doc.setFont("helvetica", "bold");
    doc.text(`Page ${pageNumber} of ${totalPages}`, pageWidth - 15, pageHeight - 11.5, { align: "right" });
  }

  // Render Authorised Signature & Stamp Area with official stamp image
  renderSignatureBlock(startY: number, signatoryTitle?: string, signatoryName?: string) {
    const doc = this.doc;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Check if remaining page height is too small for signature block
    let currentY = startY;
    if (currentY > pageHeight - 55) {
      doc.addPage();
      this.drawPageBorders();
      currentY = 35;
    }

    const blockWidth = 75;
    const blockX = pageWidth - 15 - blockWidth;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(RICH_BLACK[0], RICH_BLACK[1], RICH_BLACK[2]);
    doc.text(`For ${this.settings.companyName.toUpperCase()}`, blockX, currentY);

    // Draw Stamp Frame / Signature Box in delicate champagne gold
    doc.setDrawColor(GOLD_CHAMPAGNE[0], GOLD_CHAMPAGNE[1], GOLD_CHAMPAGNE[2]);
    doc.setLineWidth(0.25);
    doc.rect(blockX, currentY + 3, blockWidth, 25);

    // Embed Official Stamp & Signature (1024x529 -> 44mm x 22.7mm)
    try {
      const stampW = 44;
      const stampH = 22.7;
      const stampX = blockX + (blockWidth - stampW) / 2;
      const stampY = currentY + 4.15;
      doc.addImage(OFFICIAL_STAMP_BASE64, "JPEG", stampX, stampY, stampW, stampH);
    } catch (e) {
      console.warn("Could not embed official stamp in signature block:", e);
      doc.setFont("helvetica", "italic");
      doc.setFontSize(7.5);
      doc.setTextColor(GOLD_DEEP[0], GOLD_DEEP[1], GOLD_DEEP[2]);
      doc.text("[ Official Seal & Proprietor Signature Attached ]", blockX + blockWidth / 2, currentY + 16, { align: "center" });
    }

    // Signatory details
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(RICH_BLACK[0], RICH_BLACK[1], RICH_BLACK[2]);
    doc.text(signatoryName || this.settings.authorizedSignatoryName, blockX, currentY + 33);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(MUTED_GREY[0], MUTED_GREY[1], MUTED_GREY[2]);
    doc.text(signatoryTitle || this.settings.authorizedSignatoryDesignation, blockX, currentY + 37);

    return currentY + 43;
  }

  // Finalize all pages with page numbers and borders
  finalize() {
    const totalPages = this.doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      this.doc.setPage(i);
      this.drawPageBorders();
      this.renderFooter(i, totalPages);
    }
    return this.doc;
  }

  // Return base64 or blob URL
  toBlobUrl(): string {
    this.finalize();
    const blob = this.doc.output("blob");
    return URL.createObjectURL(blob);
  }

  save(fileName: string) {
    this.finalize();
    this.doc.save(fileName);
  }
}

// ==========================================
// 1. CLIENT AGREEMENT GENERATOR
// ==========================================
export function generateAgreementPDF(data: any, settings?: CompanySettings): DigitalDictionaryPDF {
  const pdf = new DigitalDictionaryPDF(settings);
  const doc = pdf.doc;
  let y = pdf.renderHeader("MASTER CLIENT SERVICE AGREEMENT", "Commercial Contract & Technical Scope", data.documentNumber);

  // Client & Agreement Metadata
  autoTable(doc, {
    startY: y,
    theme: "plain",
    styles: { fontSize: 8, cellPadding: 1.5, textColor: [30, 30, 30] },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 35, textColor: [119, 119, 119] },
      1: { cellWidth: 55 },
      2: { fontStyle: "bold", cellWidth: 35, textColor: [119, 119, 119] },
      3: { cellWidth: 55 },
    },
    body: [
      ["CLIENT NAME:", data.clientName || "—", "AGREEMENT DATE:", data.agreementDate || new Date().toLocaleDateString("en-GB")],
      ["COMPANY / BRAND:", data.companyName || "—", "EFFECTIVE DATE:", data.startDate || new Date().toLocaleDateString("en-GB")],
      ["CONTACT PERSON:", data.contactPerson || "—", "TARGET COMPLETION:", data.deliveryDate || "As per Milestone Schedule"],
      ["EMAIL & PHONE:", `${data.email || "—"} | ${data.phone || "—"}`, "AGREED AMOUNT:", `INR ${Number(data.agreedAmount || 0).toLocaleString("en-IN")}/-`],
    ],
  });

  y = (doc as any).lastAutoTable.finalY + 6;

  // Section 1: Project Scope & Deliverables
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(GOLD_DEEP[0], GOLD_DEEP[1], GOLD_DEEP[2]);
  doc.text("1. ENGAGEMENT SCOPE & ARCHITECTURAL DELIVERABLES", 15, y);
  y += 4.5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(RICH_BLACK[0], RICH_BLACK[1], RICH_BLACK[2]);
  const scopeDesc = data.projectScope || `Digital Dictionary agrees to engineer, design and deploy the selected enterprise package: ${data.packageName || "Custom Architecture Suite"}. This includes custom UI/UX design, Next.js / React engineering, database integration, SEO foundation, and security hardening.`;
  const splitScope = doc.splitTextToSize(scopeDesc, 180);
  doc.text(splitScope, 15, y);
  y += splitScope.length * 4 + 4;

  // Deliverables Table
  const deliverables = data.deliverables || [
    "Production-grade Next.js App Router codebase deployed on edge cloud infrastructure",
    "Sub-second load speed & Core Web Vitals 95+ score compliance",
    "Security configuration with Content Security Policy (CSP) and HSTS encryption",
    "Automated lead capture & WhatsApp / Email inquiry funnel routing",
    "Cross-browser and mobile responsive testing clearance"
  ];

  autoTable(doc, {
    startY: y,
    theme: "striped",
    headStyles: { fillColor: [24, 24, 24], textColor: [255, 255, 255], fontSize: 8 },
    styles: { fontSize: 8, cellPadding: 2 },
    head: [["#", "Core Deliverable Item", "Acceptance Criteria"]],
    body: deliverables.map((item: string, idx: number) => [
      String(idx + 1).padStart(2, "0"),
      item,
      "Tested and verified in staging before production cutover"
    ]),
  });

  y = (doc as any).lastAutoTable.finalY + 6;

  // Section 2: Financial Terms & Payment Schedule
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(GOLD_DEEP[0], GOLD_DEEP[1], GOLD_DEEP[2]);
  doc.text("2. COMMERCIAL TERMS & PAYMENT SCHEDULE", 15, y);
  y += 4.5;

  autoTable(doc, {
    startY: y,
    theme: "grid",
    headStyles: { fillColor: [166, 124, 34], textColor: [255, 255, 255], fontSize: 8 },
    styles: { fontSize: 8, cellPadding: 2 },
    head: [["Milestone Stage", "Percentage", "Amount (INR)", "Payment Trigger Condition"]],
    body: [
      ["Initial Deposit / Advance", "50%", `INR ${((data.agreedAmount || 0) * 0.5).toLocaleString("en-IN")}/-`, "Upon execution of this agreement & project kickoff"],
      ["Staging Preview & Approval", "30%", `INR ${((data.agreedAmount || 0) * 0.3).toLocaleString("en-IN")}/-`, "Upon approval of functional UI/UX & features in staging"],
      ["Production Deployment & Handover", "20%", `INR ${((data.agreedAmount || 0) * 0.2).toLocaleString("en-IN")}/-`, "Upon final domain launch, DNS setup & delivery completion"],
    ],
  });

  y = (doc as any).lastAutoTable.finalY + 6;

  // Section 3: Legal Terms (Confidentiality, IP, Revisions)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(GOLD_DEEP[0], GOLD_DEEP[1], GOLD_DEEP[2]);
  doc.text("3. TERMS OF GOVERNANCE, INTELLECTUAL PROPERTY & WARRANTY", 15, y);
  y += 4.5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(50, 50, 50);
  const termsText = [
    "A. Intellectual Property: Upon full settlement of all agreed amounts, the Client owns all custom graphics, branding, and proprietary frontend assets engineered for the project.",
    "B. Confidentiality: Both parties agree not to disclose any non-public business information, credentials, customer databases, or commercial trade secrets.",
    "C. Revisions: Includes up to two rounds of structured revisions during the staging review stage. Additional architectural changes outside the agreed scope will be quoted separately.",
    "D. Warranty: 60-day post-launch warranty covering any technical bugs, browser compatibility issues, or functional defects at zero additional charge."
  ];

  termsText.forEach((term) => {
    const split = doc.splitTextToSize(term, 180);
    doc.text(split, 15, y);
    y += split.length * 3.5 + 1.5;
  });

  y += 4;
  pdf.renderSignatureBlock(y, "Proprietor & Principal Architect", data.authorizedSignatory);

  return pdf;
}

// ==========================================
// 2. OFFICIAL TAX / PROFORMA INVOICE GENERATOR
// ==========================================
export function generateInvoicePDF(data: any, settings?: CompanySettings): DigitalDictionaryPDF {
  const pdf = new DigitalDictionaryPDF(settings);
  const doc = pdf.doc;
  const pageWidth = doc.internal.pageSize.getWidth();

  let y = pdf.renderHeader("TAX INVOICE / PAYMENT ADVICE", "Official Commercial Document", data.documentNumber);

  // Billing & Invoice Header Table
  autoTable(doc, {
    startY: y,
    theme: "plain",
    styles: { fontSize: 8, cellPadding: 1.5 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 25, textColor: [119, 119, 119] },
      1: { cellWidth: 65 },
      2: { fontStyle: "bold", cellWidth: 30, textColor: [119, 119, 119] },
      3: { cellWidth: 60 },
    },
    body: [
      ["BILLED TO:", data.clientName || data.companyName, "INVOICE NO:", data.documentNumber || "DD-INV-2026-0001"],
      ["CONTACT:", data.contactPerson || "—", "INVOICE DATE:", data.invoiceDate || new Date().toLocaleDateString("en-GB")],
      ["EMAIL:", data.email || "—", "PAYMENT DUE:", data.dueDate || "Due Upon Receipt"],
      ["PHONE:", data.phone || "—", "STATUS:", (data.paymentStatus || "UNPAID").toUpperCase()],
    ],
  });

  y = (doc as any).lastAutoTable.finalY + 6;

  // Invoice Line Items
  const items = data.items || [
    { description: data.packageName || "Web Architecture & Digital Engineering", qty: 1, unitPrice: data.agreedAmount || 25000, total: data.agreedAmount || 25000 }
  ];

  const subtotal = items.reduce((acc: number, item: any) => acc + (Number(item.total) || 0), 0);
  const tax = Number(data.applicableTax || 0);
  const total = subtotal + tax;
  const amountPaid = Number(data.amountPaid || 0);
  const balanceDue = total - amountPaid;

  autoTable(doc, {
    startY: y,
    theme: "grid",
    headStyles: { fillColor: [24, 24, 24], textColor: [255, 255, 255], fontSize: 8.5 },
    styles: { fontSize: 8, cellPadding: 2.5 },
    columnStyles: {
      0: { cellWidth: 15, halign: "center" },
      1: { cellWidth: 95 },
      2: { cellWidth: 20, halign: "center" },
      3: { cellWidth: 25, halign: "right" },
      4: { cellWidth: 25, halign: "right", fontStyle: "bold" },
    },
    head: [["#", "Item Description & Engineering Scope", "Qty", "Rate (INR)", "Amount (INR)"]],
    body: items.map((item: any, i: number) => [
      String(i + 1).padStart(2, "0"),
      item.description,
      String(item.qty || 1),
      Number(item.unitPrice).toLocaleString("en-IN"),
      Number(item.total).toLocaleString("en-IN"),
    ]),
  });

  y = (doc as any).lastAutoTable.finalY + 4;

  // Financial Summary Breakdown Box
  const summaryX = pageWidth - 80;
  autoTable(doc, {
    startY: y,
    margin: { left: summaryX },
    tableWidth: 65,
    theme: "plain",
    styles: { fontSize: 8, cellPadding: 1.5 },
    columnStyles: {
      0: { fontStyle: "bold", textColor: [100, 100, 100] },
      1: { halign: "right", fontStyle: "bold" },
    },
    body: [
      ["SUBTOTAL:", `INR ${subtotal.toLocaleString("en-IN")}/-`],
      ["APPLICABLE TAX:", tax > 0 ? `INR ${tax.toLocaleString("en-IN")}/-` : "N/A (Exempted)"],
      ["TOTAL AMOUNT:", `INR ${total.toLocaleString("en-IN")}/-`],
      ["AMOUNT RECEIVED:", `INR ${amountPaid.toLocaleString("en-IN")}/-`],
      ["BALANCE DUE:", `INR ${balanceDue.toLocaleString("en-IN")}/-`],
    ],
  });

  // Banking & Payment Instructions on left
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(GOLD_DEEP[0], GOLD_DEEP[1], GOLD_DEEP[2]);
  doc.text("PAYMENT INSTRUCTIONS & BANK SETTLEMENT", 15, y + 4);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(50, 50, 50);
  doc.text("Account Name: Digital Dictionary", 15, y + 9);
  doc.text(`Bank / Method: IMPS / NEFT / RTGS / Direct UPI`, 15, y + 13);
  doc.text(`UPI ID / VPA: +91 62978 68104 (Verified Enterprise Channel)`, 15, y + 17);
  doc.text(`Transaction Reference: Please share UTR / Screenshot after transfer`, 15, y + 21);

  y = (doc as any).lastAutoTable.finalY + 12;
  pdf.renderSignatureBlock(y, "Accounts & Finance Department");

  return pdf;
}

// ==========================================
// 3. CLIENT WELCOME DOCUMENT GENERATOR
// ==========================================
export function generateWelcomeDocPDF(data: any, settings?: CompanySettings): DigitalDictionaryPDF {
  const pdf = new DigitalDictionaryPDF(settings);
  const doc = pdf.doc;

  let y = pdf.renderHeader("EXECUTIVE ONBOARDING & WELCOME GUIDE", "Orientation & Communication Protocol", data.documentNumber);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(GOLD_DEEP[0], GOLD_DEEP[1], GOLD_DEEP[2]);
  doc.text(`Welcome to Digital Dictionary, ${data.clientName || data.companyName}!`, 15, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(30, 30, 30);
  const intro = `We are delighted to partner with you to engineer your digital ecosystem. Our dedicated team is committed to delivering a sub-second, enterprise-grade platform that compounds your brand authority and commercial revenue.`;
  const splitIntro = doc.splitTextToSize(intro, 180);
  doc.text(splitIntro, 15, y);
  y += splitIntro.length * 4 + 4;

  // Onboarding Steps Table
  autoTable(doc, {
    startY: y,
    theme: "striped",
    headStyles: { fillColor: [24, 24, 24], textColor: [255, 255, 255], fontSize: 8.5 },
    styles: { fontSize: 8, cellPadding: 2.5 },
    head: [["Stage", "Onboarding Activity", "Target Timeline", "Primary Ownership"]],
    body: [
      ["01", "Digital Audit & Brand Assets Collection", "Day 1 - 2", "Client & Project Lead"],
      ["02", "Architecture Wireframing & Staging Design", "Day 3 - 7", "UI/UX Engineering Team"],
      ["03", "Staging Interactive Review & Approvals", "Day 8 - 10", "Client Review Desk"],
      ["04", "Security Hardening, QA & Edge Deployment", "Day 11 - 14", "DevOps & Security Pod"],
      ["05", "Domain DNS Cutover & Google Indexing", "Launch Day", "Digital Dictionary Operations"],
    ],
  });

  y = (doc as any).lastAutoTable.finalY + 6;

  // Dedicated Communication Channels
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(GOLD_DEEP[0], GOLD_DEEP[1], GOLD_DEEP[2]);
  doc.text("YOUR DEDICATED TOUCHPOINTS & PROJECT TEAM", 15, y);
  y += 5;

  autoTable(doc, {
    startY: y,
    theme: "grid",
    headStyles: { fillColor: [166, 124, 34], textColor: [255, 255, 255], fontSize: 8 },
    styles: { fontSize: 8, cellPadding: 2 },
    head: [["Role", "Assigned Team Member", "Channel / Contact"]],
    body: [
      ["Project Lead & Strategist", data.primaryEmployeeName || "Lead Solutions Architect", "team@digitaldictionary.in"],
      ["Engineering Lead", "Senior Web Engineer", "dev@digitaldictionary.in"],
      ["Support & Updates Desk", "Client Services Team", `${pdf.settings.phone} / ${pdf.settings.supportEmail}`],
    ],
  });

  y = (doc as any).lastAutoTable.finalY + 8;
  pdf.renderSignatureBlock(y, "Executive Client Operations");

  return pdf;
}

// ==========================================
// 4. COMMERCIAL QUOTATION GENERATOR
// ==========================================
export function generateQuotationPDF(data: any, settings?: CompanySettings): DigitalDictionaryPDF {
  const pdf = new DigitalDictionaryPDF(settings);
  const doc = pdf.doc;
  const pageWidth = doc.internal.pageSize.getWidth();

  let y = pdf.renderHeader("COMMERCIAL PROPOSAL & QUOTATION", "Prepared Specifically for Client Review", data.documentNumber);

  autoTable(doc, {
    startY: y,
    theme: "plain",
    styles: { fontSize: 8, cellPadding: 1.5 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 25, textColor: [119, 119, 119] },
      1: { cellWidth: 65 },
      2: { fontStyle: "bold", cellWidth: 30, textColor: [119, 119, 119] },
      3: { cellWidth: 60 },
    },
    body: [
      ["PROPOSAL FOR:", data.clientName || data.companyName, "QUOTATION NO:", data.documentNumber || "DD-QUO-2026-0001"],
      ["ATTENTION:", data.contactPerson || "Management Team", "DATE OF ISSUE:", data.quotationDate || new Date().toLocaleDateString("en-GB")],
      ["PROJECT NAME:", data.projectName || "Enterprise Web Platform", "VALID UNTIL:", data.expiryDate || "15 Days from Issue"],
    ],
  });

  y = (doc as any).lastAutoTable.finalY + 6;

  const items = data.items || [
    { description: data.packageName || "Enterprise Web Platform", qty: 1, unitPrice: data.quotedAmount || 35000, total: data.quotedAmount || 35000 }
  ];

  autoTable(doc, {
    startY: y,
    theme: "grid",
    headStyles: { fillColor: [24, 24, 24], textColor: [255, 255, 255], fontSize: 8.5 },
    styles: { fontSize: 8, cellPadding: 2.5 },
    columnStyles: {
      0: { cellWidth: 15, halign: "center" },
      1: { cellWidth: 95 },
      2: { cellWidth: 20, halign: "center" },
      3: { cellWidth: 25, halign: "right" },
      4: { cellWidth: 25, halign: "right", fontStyle: "bold" },
    },
    head: [["#", "Package / Scope Description", "Qty", "Unit Price", "Total (INR)"]],
    body: items.map((item: any, i: number) => [
      String(i + 1).padStart(2, "0"),
      item.description,
      String(item.qty || 1),
      Number(item.unitPrice).toLocaleString("en-IN"),
      Number(item.total).toLocaleString("en-IN"),
    ]),
  });

  y = (doc as any).lastAutoTable.finalY + 4;

  const total = items.reduce((acc: number, item: any) => acc + (Number(item.total) || 0), 0);
  const discount = Number(data.discount || 0);
  const finalVal = total - discount;

  autoTable(doc, {
    startY: y,
    margin: { left: pageWidth - 80 },
    tableWidth: 65,
    theme: "plain",
    styles: { fontSize: 8, cellPadding: 1.5 },
    columnStyles: {
      0: { fontStyle: "bold", textColor: [100, 100, 100] },
      1: { halign: "right", fontStyle: "bold" },
    },
    body: [
      ["TOTAL VALUE:", `INR ${total.toLocaleString("en-IN")}/-`],
      ["PROMOTIONAL DISCOUNT:", discount > 0 ? `- INR ${discount.toLocaleString("en-IN")}/-` : "—"],
      ["OFFERED PRICE:", `INR ${finalVal.toLocaleString("en-IN")}/-`],
    ],
  });

  y = (doc as any).lastAutoTable.finalY + 8;
  pdf.renderSignatureBlock(y, "Commercial Solutions Director");

  return pdf;
}

// ==========================================
// 5. COLLEGE NOC (NO OBJECTION CERTIFICATE)
// ==========================================
export function generateInternNocPDF(data: any, settings?: CompanySettings): DigitalDictionaryPDF {
  const pdf = new DigitalDictionaryPDF(settings);
  const doc = pdf.doc;

  const candidateName = data.fullName || data.internName || "Student Candidate";
  const internId = data.internId || data.employeeId || "DD-INT-2026-0001";
  const role = data.internshipRole || data.role || data.designation || "Business Development Intern";
  const department = data.department || "Business Development & Operations";
  const collegeName = data.collegeName || "Institution / College";
  const universityName = data.universityName || data.collegeName || "Partner University";
  const course = data.course || "Degree Program";
  const semester = data.semester || "Final Year";
  const rollNumber = data.collegeRollNo || data.rollNumber || data.rollNo || "N/A";
  const supervisor = data.assignedSupervisor || data.supervisor || data.supervisorName || "Operations & Strategy Lead";
  const startDate = data.startDate || "2026-12-01";
  const endDate = data.endDate || "2027-05-30";
  const durationMonths = data.durationMonths || 6;
  const rawStipend = data.monthlyStipend !== undefined ? data.monthlyStipend : (data.stipendAmount !== undefined ? data.stipendAmount : 0);
  const stipendAmount = Number(rawStipend) || 0;
  const workMode = (data.internshipMode || data.workMode || "Remote").toUpperCase();
  const nocNumber = data.nocNumber || data.documentNumber || `DD-NOC-${new Date().getFullYear()}-${internId.replace(/[^0-9]/g, "") || "001"}`;

  let y = pdf.renderHeader("NO OBJECTION CERTIFICATE (NOC)", "Institutional Internship Endorsement & Clearance", nocNumber);

  // Addressee Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(GOLD_DEEP[0], GOLD_DEEP[1], GOLD_DEEP[2]);
  doc.text(`DATE OF ISSUE: ${new Date().toLocaleDateString("en-GB")}`, 14, y);
  y += 4.5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(RICH_BLACK[0], RICH_BLACK[1], RICH_BLACK[2]);
  doc.text("TO WHOMSOEVER IT MAY CONCERN  /  INSTITUTIONAL HEAD OF DEPARTMENT", 14, y);
  y += 4.5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.6);
  doc.setTextColor(40, 40, 40);
  const p1 = `This is to formally certify that Digital Dictionary has accepted and confirmed the internship engagement of the student outlined below for an academic-industrial curriculum engagement. We have verified their enrollment credentials and confirm their participation under direct senior mentorship:`;
  const splitP1 = doc.splitTextToSize(p1, 182);
  doc.text(splitP1, 14, y);
  y += splitP1.length * 3.7 + 3;

  // Student Particulars Table
  autoTable(doc, {
    startY: y,
    theme: "grid",
    headStyles: { fillColor: [166, 124, 34], textColor: [255, 255, 255], fontSize: 8, fontStyle: "bold" },
    styles: { fontSize: 7.5, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 48, textColor: [80, 80, 80] },
      1: { cellWidth: 134, textColor: [20, 20, 20] },
    },
    head: [["Student & Institutional Particulars", "Official Clearance & Engagement Record"]],
    body: [
      ["Student Full Name", candidateName],
      ["Official Intern ID", internId],
      ["College / Institute Name", collegeName],
      ["Affiliated University", universityName],
      ["Course & Degree Program", course],
      ["Academic Semester & Roll No", `${semester}  |  Roll No: ${rollNumber}`],
      ["Internship Role / Designation", role],
      ["Functional Department", department],
      ["Industry Mentor / Supervisor", supervisor],
      ["Approved Training Period", `${startDate} to ${endDate} (${durationMonths} Months Duration)`],
      ["Approved Working Arrangement", workMode],
      ["Sanctioned Monthly Stipend", stipendAmount > 0 ? `INR ${stipendAmount.toLocaleString("en-IN")}/- per month` : "Academic Training / Merited"],
    ],
  });

  y = (doc as any).lastAutoTable.finalY + 4.5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.8);
  doc.setTextColor(GOLD_DEEP[0], GOLD_DEEP[1], GOLD_DEEP[2]);
  doc.text("INSTITUTIONAL UNDERTAKING & ACADEMIC CLEARANCE:", 14, y);
  y += 4;

  const clauses = [
    "1. Curriculum Alignment: Digital Dictionary confirms that the student's training curriculum involves live enterprise assignments, industry tools, project reviews, and direct mentorship.",
    "2. Attendance & Verification: Digital Dictionary maintains verifiable digital logs of hours, deliverables, and milestone submissions to satisfy university attendance criteria.",
    "3. Final Evaluation & NOC Clearance: We have no objection to the student undertaking this engagement as part of their degree requirements. Upon successful completion, a formal Industrial Certificate and Project Report Sign-off will be provided.",
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(50, 50, 50);
  clauses.forEach((c) => {
    const split = doc.splitTextToSize(c, 182);
    doc.text(split, 14, y);
    y += split.length * 3.4 + 1.2;
  });

  y += 3;
  pdf.renderSignatureBlock(y, "Executive Leadership & University Relations", "Authorized Signatory");

  return pdf;
}

// ==========================================
// 6. MONTHLY PAYSLIP / STIPEND STATEMENT
// ==========================================
export function generatePayslipPDF(data: any, settings?: CompanySettings): DigitalDictionaryPDF {
  const pdf = new DigitalDictionaryPDF(settings);
  const doc = pdf.doc;
  const pageWidth = doc.internal.pageSize.getWidth();

  const isIntern = data.type === "intern";
  const docTitle = isIntern ? "MONTHLY STIPEND STATEMENT" : "CONFIDENTIAL SALARY PAYSLIP";
  const refNo = data.documentNumber || data.payslipNumber;

  let y = pdf.renderHeader(docTitle, `Pay Period: ${data.salaryMonth || "Current Month"}`, refNo);

  autoTable(doc, {
    startY: y,
    theme: "plain",
    styles: { fontSize: 8, cellPadding: 1.5 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 35, textColor: [119, 119, 119] },
      1: { cellWidth: 55 },
      2: { fontStyle: "bold", cellWidth: 35, textColor: [119, 119, 119] },
      3: { cellWidth: 55 },
    },
    body: [
      [isIntern ? "INTERN NAME:" : "EMPLOYEE NAME:", data.employeeName || data.fullName || "—", isIntern ? "INTERN ID:" : "EMPLOYEE ID:", data.employeeId || "—"],
      ["DESIGNATION:", data.designation || "—", "DEPARTMENT:", data.department || "General"],
      ["PAY PERIOD:", data.payPeriod || data.salaryMonth || "—", "PAYMENT STATUS:", (data.paymentStatus || "PAID").toUpperCase()],
    ],
  });

  y = (doc as any).lastAutoTable.finalY + 6;

  const baseAmt = Number(data.basicSalary ?? data.monthlyStipend ?? 0) || 0;
  const allowancesAmt = Number(data.allowances || 0) || 0;
  const bonusAmt = Number(data.bonus || 0) || 0;
  const incentivesAmt = Number(data.incentives || 0) || 0;
  const overtimeAmt = Number(data.overtime || 0) || 0;
  const customAdditions: { label: string; amount: number }[] = Array.isArray(data.customAdditions)
    ? data.customAdditions.filter((c: any) => c && (c.label || Number(c.amount) > 0))
    : [];

  const earnings: [string, number][] = [
    [isIntern ? "Monthly Base Stipend" : "Basic Salary", baseAmt],
  ];

  if (!isIntern || allowancesAmt > 0) {
    earnings.push([isIntern ? "Allowances & Reimbursements" : "HRA & Allowances", allowancesAmt]);
  }
  if (bonusAmt > 0) {
    earnings.push(["Performance Bonus", bonusAmt]);
  }
  if (!isIntern || incentivesAmt > 0) {
    earnings.push(["Performance Incentives / Commission", incentivesAmt]);
  }
  if (overtimeAmt > 0) {
    earnings.push(["Overtime / Milestone Reward", overtimeAmt]);
  }
  for (const item of customAdditions) {
    if (Number(item.amount) > 0) {
      earnings.push([item.label || "Additional Earnings", Number(item.amount)]);
    }
  }

  const deductions: [string, number][] = [
    [data.deductionReason ? `Deductions (${data.deductionReason})` : "Statutory / Advance Deductions", Number(data.deductions || 0) || 0],
  ];

  const totalEarnings = earnings.reduce((sum, item) => sum + Number(item[1]), 0);
  const totalDeductions = deductions.reduce((sum, item) => sum + Number(item[1]), 0);
  const netPay = Math.max(0, totalEarnings - totalDeductions);

  const rowCount = Math.max(earnings.length, deductions.length);
  const tableBody: string[][] = [];
  for (let i = 0; i < rowCount; i++) {
    const eItem = earnings[i];
    const dItem = deductions[i];
    tableBody.push([
      eItem ? eItem[0] : "—",
      eItem ? `INR ${Number(eItem[1]).toLocaleString("en-IN")}/-` : "—",
      dItem ? dItem[0] : "—",
      dItem ? `INR ${Number(dItem[1]).toLocaleString("en-IN")}/-` : "—",
    ]);
  }
  tableBody.push([
    "TOTAL EARNINGS",
    `INR ${totalEarnings.toLocaleString("en-IN")}/-`,
    "TOTAL DEDUCTIONS",
    `INR ${totalDeductions.toLocaleString("en-IN")}/-`,
  ]);

  autoTable(doc, {
    startY: y,
    theme: "grid",
    headStyles: { fillColor: [24, 24, 24], textColor: [255, 255, 255], fontSize: 8 },
    styles: { fontSize: 8, cellPadding: 2 },
    head: [["Earnings Item", "Amount (INR)", "Deductions Item", "Amount (INR)"]],
    body: tableBody,
  });

  y = (doc as any).lastAutoTable.finalY + 4;

  // Net Pay Highlight Box
  doc.setFillColor(SOFT_GREY_BG[0], SOFT_GREY_BG[1], SOFT_GREY_BG[2]);
  doc.rect(15, y, pageWidth - 30, 10, "F");
  doc.setDrawColor(GOLD_METALLIC[0], GOLD_METALLIC[1], GOLD_METALLIC[2]);
  doc.setLineWidth(0.4);
  doc.rect(15, y, pageWidth - 30, 10, "D");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(GOLD_DEEP[0], GOLD_DEEP[1], GOLD_DEEP[2]);
  doc.text(isIntern ? "NET STIPEND TRANSFERRED:" : "NET SALARY TRANSFERRED:", 19, y + 6.5);

  doc.setTextColor(RICH_BLACK[0], RICH_BLACK[1], RICH_BLACK[2]);
  doc.text(`INR ${netPay.toLocaleString("en-IN")}/-`, pageWidth - 19, y + 6.5, { align: "right" });

  y += 14;

  if (data.remarks) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(90, 90, 90);
    doc.text(`Remarks: ${String(data.remarks)}`, 15, y);
    y += 6;
  } else {
    y += 2;
  }

  pdf.renderSignatureBlock(y, "Finance & Payroll Department");

  return pdf;
}

// ==========================================
// 7. INTERN OFFER LETTER
// ==========================================
export function generateInternOfferPDF(data: any, settings?: CompanySettings): DigitalDictionaryPDF {
  const pdf = new DigitalDictionaryPDF(settings);
  const doc = pdf.doc;
  const pageWidth = doc.internal.pageSize.getWidth();

  const candidateName = data.fullName || data.internName || "Alvira Mallick";
  const internId = data.internId || data.employeeId || "DD-INT-2026-9358";
  const role = data.internshipRole || data.role || data.designation || "Business Development Intern";
  const department = data.department || "Business Development & Strategy";
  const collegeName = data.collegeName || "Institution / College";
  const universityName = data.universityName || data.collegeName || "Partner University";
  const course = data.course || "Degree Program";
  const supervisor = data.assignedSupervisor || data.supervisor || data.supervisorName || "Operations & Strategy Lead";
  const startDate = data.startDate || "2026-12-01";
  const endDate = data.endDate || "2027-05-30";
  const durationMonths = data.durationMonths || 6;
  const rawStipend = data.monthlyStipend !== undefined ? data.monthlyStipend : (data.stipendAmount !== undefined ? data.stipendAmount : 15000);
  const stipendAmount = Number(rawStipend) || 0;
  const workMode = (data.internshipMode || data.workMode || "Remote").toUpperCase();
  const email = data.email || "alvira@digitaldictionary.in";
  const phone = data.phone || "+91 6398360422";
  const offerNumber = data.offerNumber || data.documentNumber || `DD-OFF-${new Date().getFullYear()}-${internId.replace(/[^0-9]/g, "") || "001"}`;

  let y = pdf.renderHeader("FORMAL INTERNSHIP APPOINTMENT OFFER", "Academic & Industrial Training Cohort", offerNumber);

  // Metadata Table (Candidate & Institutional Context)
  autoTable(doc, {
    startY: y,
    theme: "plain",
    styles: { fontSize: 7.5, cellPadding: 1.2 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 32, textColor: [100, 100, 100] },
      1: { cellWidth: 63, fontStyle: "bold", textColor: [20, 20, 20] },
      2: { fontStyle: "bold", cellWidth: 30, textColor: [100, 100, 100] },
      3: { cellWidth: 55, textColor: [30, 30, 30] },
    },
    body: [
      ["OFFER DATE:", data.offerDate || new Date().toLocaleDateString("en-GB"), "OFFICIAL ID:", internId],
      ["CANDIDATE NAME:", candidateName, "DEPARTMENT:", department],
      ["COLLEGE / UNIV:", collegeName, "OFFICIAL EMAIL:", email],
      ["DEGREE & COURSE:", course, "CONTACT / TEL:", phone],
    ],
  });

  y = (doc as any).lastAutoTable.finalY + 3;

  // Formal Subject Accent Box
  doc.setFillColor(250, 246, 235);
  doc.roundedRect(14, y, pageWidth - 28, 7.5, 1, 1, "F");
  doc.setDrawColor(GOLD_CHAMPAGNE[0], GOLD_CHAMPAGNE[1], GOLD_CHAMPAGNE[2]);
  doc.setLineWidth(0.3);
  doc.roundedRect(14, y, pageWidth - 28, 7.5, 1, 1, "D");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.2);
  doc.setTextColor(GOLD_DEEP[0], GOLD_DEEP[1], GOLD_DEEP[2]);
  doc.text(`SUBJECT: APPOINTMENT OFFER FOR THE POSITION OF ${role.toUpperCase()}`, 18, y + 5);

  y += 11;

  // Formal Opening
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(RICH_BLACK[0], RICH_BLACK[1], RICH_BLACK[2]);
  doc.text(`Dear ${candidateName},`, 14, y);
  y += 4.5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.6);
  doc.setTextColor(40, 40, 40);
  const introText = `On behalf of Digital Dictionary, we are pleased to extend this formal offer of appointment for the position of ${role}. Following our evaluation of your credentials and interview assessment, we believe your skills, enthusiasm, and academic foundation align with our strategic mission. During this tenure, you will work on live corporate workflows, gain direct executive mentorship, and collaborate with our cross-functional teams.`;
  const splitIntro = doc.splitTextToSize(introText, 182);
  doc.text(splitIntro, 14, y);
  y += splitIntro.length * 3.8 + 3.5;

  // Core Engagement Terms Table
  autoTable(doc, {
    startY: y,
    theme: "grid",
    headStyles: { fillColor: [24, 24, 24], textColor: [255, 255, 255], fontSize: 8, fontStyle: "bold" },
    styles: { fontSize: 7.5, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 48, textColor: [80, 80, 80] },
      1: { cellWidth: 134, textColor: [20, 20, 20] },
    },
    head: [["Core Engagement Terms", "Official Specification & Agreed Parameters"]],
    body: [
      ["Designation / Role", role],
      ["Functional Department", department],
      ["Reporting Supervisor / Mentor", supervisor],
      ["Tenure & Engagement Dates", `${startDate} to ${endDate} (${durationMonths} Months Duration)`],
      ["Working Arrangement", workMode],
      ["Monthly Fixed Stipend", `INR ${stipendAmount.toLocaleString("en-IN")}/- per month (Disbursed monthly on 5th)`],
      ["Weekly Commitment", "Monday to Friday (Flexible hours aligned with academic schedule)"],
      ["Assigned Workstation", "Digital Dictionary Cloud Portal & Corporate Suite"],
    ],
  });

  y = (doc as any).lastAutoTable.finalY + 4.5;

  // Obligations & Standards
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.8);
  doc.setTextColor(GOLD_DEEP[0], GOLD_DEEP[1], GOLD_DEEP[2]);
  doc.text("CORE TERMS & PROFESSIONAL OBLIGATIONS:", 14, y);
  y += 4;

  const terms = [
    "1. Practical Training & Deliverables: You agree to execute assigned strategic tasks, maintain scheduled communication with your supervisor, and submit milestone project reports.",
    "2. Confidentiality & Non-Disclosure: All proprietary intelligence, internal codebases, strategic methodologies, and client records accessed during this engagement remain strictly confidential.",
    "3. Intellectual Property (IP): All work products, assets, software, and creative materials developed during your tenure shall remain the sole intellectual property of Digital Dictionary.",
    "4. Completion Credentials: Upon satisfactory completion of your tenure, you will receive an official Industrial Experience Certificate, Letter of Recommendation (LOR), and College Clearance NOC.",
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(60, 60, 60);
  terms.forEach((t) => {
    const split = doc.splitTextToSize(t, 182);
    doc.text(split, 14, y);
    y += split.length * 3.3 + 1;
  });

  y += 2.5;

  // Two-column signature block (Left: Candidate Acceptance; Right: Company Seal & Signature)
  const colW = 85;
  const leftX = 14;
  const rightX = pageWidth - 14 - colW;

  // Left column: Candidate acceptance
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(RICH_BLACK[0], RICH_BLACK[1], RICH_BLACK[2]);
  doc.text("CANDIDATE ACCEPTANCE:", leftX, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(MUTED_GREY[0], MUTED_GREY[1], MUTED_GREY[2]);
  doc.text("I acknowledge and accept the terms of this appointment.", leftX, y + 3.8);

  doc.setDrawColor(215, 215, 215);
  doc.setLineWidth(0.25);
  doc.rect(leftX, y + 5.5, colW, 25);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.text("Candidate Signature & Date", leftX + colW / 2, y + 27, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.8);
  doc.setTextColor(RICH_BLACK[0], RICH_BLACK[1], RICH_BLACK[2]);
  doc.text(candidateName, leftX, y + 35);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(MUTED_GREY[0], MUTED_GREY[1], MUTED_GREY[2]);
  doc.text(`Student ID: ${internId}  •  ${collegeName}`, leftX, y + 38.5);

  // Right column: For Digital Dictionary
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(RICH_BLACK[0], RICH_BLACK[1], RICH_BLACK[2]);
  doc.text(`FOR ${settings?.companyName?.toUpperCase() || "DIGITAL DICTIONARY"}`, rightX, y);

  doc.setDrawColor(GOLD_CHAMPAGNE[0], GOLD_CHAMPAGNE[1], GOLD_CHAMPAGNE[2]);
  doc.setLineWidth(0.25);
  doc.rect(rightX, y + 5.5, colW, 25);

  try {
    const stampW = 44;
    const stampH = 22.7;
    const stampX = rightX + (colW - stampW) / 2;
    const stampY = y + 6.65;
    doc.addImage(OFFICIAL_STAMP_BASE64, "JPEG", stampX, stampY, stampW, stampH);
  } catch (e) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(7.5);
    doc.setTextColor(GOLD_DEEP[0], GOLD_DEEP[1], GOLD_DEEP[2]);
    doc.text("[ Official Seal & Proprietor Signature Attached ]", rightX + colW / 2, y + 18, { align: "center" });
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.8);
  doc.setTextColor(RICH_BLACK[0], RICH_BLACK[1], RICH_BLACK[2]);
  doc.text(settings?.authorizedSignatoryName || "Authorized Signatory", rightX, y + 35);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(MUTED_GREY[0], MUTED_GREY[1], MUTED_GREY[2]);
  doc.text(settings?.authorizedSignatoryDesignation || "Executive Leadership & University Relations", rightX, y + 38.5);

  return pdf;
}

// ==========================================
// 8. DELIVERY GUIDE GENERATOR
// ==========================================
export function generateDeliveryGuidePDF(data: any, settings?: CompanySettings): DigitalDictionaryPDF {
  const pdf = new DigitalDictionaryPDF(settings);
  const doc = pdf.doc;

  let y = pdf.renderHeader("PROJECT DELIVERY GUIDE & HANDOVER SPECIFICATIONS", "Technical Standards & Production Handover", data.documentNumber);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(GOLD_DEEP[0], GOLD_DEEP[1], GOLD_DEEP[2]);
  doc.text(`PROJECT: ${data.projectName || "Enterprise Web Deployment"}`, 15, y);
  y += 5;

  autoTable(doc, {
    startY: y,
    theme: "striped",
    headStyles: { fillColor: [24, 24, 24], textColor: [255, 255, 255], fontSize: 8 },
    styles: { fontSize: 8, cellPadding: 2 },
    head: [["Category", "Handover Item / Specification", "Verification Status"]],
    body: [
      ["DNS & Domains", "A Records and CNAME configured to edge network", "Verified Live"],
      ["SSL/TLS Security", "HSTS & Let's Encrypt / Cloudflare SSL certificate", "A+ Grade Hardened"],
      ["Search Console", "Sitemap.xml submitted to Google Search Console", "Indexed Successfully"],
      ["Form Routing", "Contact form & WhatsApp links routed to verified numbers", "100% Tested"],
      ["Admin Access", "CMS / Admin credentials delivered to designated client email", "Delivered"],
    ],
  });

  y = (doc as any).lastAutoTable.finalY + 8;
  pdf.renderSignatureBlock(y, "Senior DevOps & Handover Architect");

  return pdf;
}

// ==========================================
// 9. PACKAGE MENU PDF GENERATOR (2026 CATALOGUE & CUSTOM PRICING)
// ==========================================
export function generatePackageMenuPDF(
  packages: any[],
  settings?: CompanySettings,
  customSubtitle?: string
): DigitalDictionaryPDF {
  const pdf = new DigitalDictionaryPDF(settings);
  const doc = pdf.doc;
  const pageWidth = doc.internal.pageSize.getWidth();

  let y = pdf.renderHeader(
    "THE PREMIUM SERVICE COLLECTION (2026)",
    customSubtitle || "Engineering Digital Ecosystems That Drive Revenue"
  );

  const formatPackageLimits = (pkg: any) => {
    const parts: string[] = [];
    if (pkg.pageLimit) parts.push(`Web: ${pkg.pageLimit}`);
    if (pkg.screenLimit) parts.push(`App: ${pkg.screenLimit}`);
    return parts.join(" | ");
  };

  const formatPackagePrice = (pkg: any) => {
    if (pkg.priceType === "custom_quote" || (Number(pkg.price) <= 0 && pkg.priceType !== "fixed")) {
      return "Custom quote";
    }
    const base = `INR ${Number(pkg.price || 0).toLocaleString("en-IN")}`;
    if (pkg.billingType === "monthly") return `${base} / mo`;
    if (pkg.priceType === "starting_from") return `${base}+`;
    return base;
  };

  autoTable(doc, {
    startY: y,
    theme: "grid",
    headStyles: { fillColor: [24, 24, 24], textColor: [255, 255, 255], fontSize: 7.5 },
    styles: { fontSize: 7, cellPadding: 1.8 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 18 },
      1: { cellWidth: 32, textColor: [90, 90, 90] },
      2: { fontStyle: "bold", cellWidth: 38 },
      3: { cellWidth: 66 },
      4: { fontStyle: "bold", cellWidth: 28, halign: "right" },
    },
    head: [["Code", "Category", "Package / Solution", "Limits & Scope Summary", "Price (INR)"]],
    body: packages.map((pkg) => {
      const limits = formatPackageLimits(pkg);
      const summary = limits ? `[${limits}] ${pkg.shortDescription || ""}` : pkg.shortDescription || "";
      return [
        pkg.code,
        pkg.category,
        pkg.name,
        summary.substring(0, 125),
        formatPackagePrice(pkg),
      ];
    }),
    didDrawPage: () => {
      pdf.drawPageBorders();
    },
  });

  y = (doc as any).lastAutoTable.finalY + 5;

  if (y > 245) {
    doc.addPage();
    pdf.drawPageBorders();
    y = 18;
  }

  // Catalogue Add-ons & Notes Box
  doc.setFillColor(248, 246, 240);
  doc.setDrawColor(GOLD_CHAMPAGNE[0], GOLD_CHAMPAGNE[1], GOLD_CHAMPAGNE[2]);
  doc.roundedRect(14, y, pageWidth - 28, 16, 1.5, 1.5, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(GOLD_DEEP[0], GOLD_DEEP[1], GOLD_DEEP[2]);
  doc.text("CATALOGUE ADD-ON RATES & COMMERCIAL TERMS", 18, y + 5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(60, 60, 60);
  doc.text(
    "• Additional Website Pages: INR 2,500 per extra standard page   |   Additional App Screens: INR 4,000 per extra standard screen",
    18,
    y + 9.5
  );
  doc.text(
    "• All prices are in Indian Rupees (INR). Applicable GST, third-party APIs, domain/hosting, and ad spend are billed separately unless agreed.",
    18,
    y + 13.5
  );

  y += 22;
  if (y > 250) {
    doc.addPage();
    pdf.drawPageBorders();
    y = 22;
  }
  pdf.renderSignatureBlock(y, "Commercial Solutions Director");

  return pdf;
}
