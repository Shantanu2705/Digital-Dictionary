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

    // Embed Official Metallic Logo Image (750x560 -> 16mm x 12mm)
    try {
      doc.addImage(OFFICIAL_LOGO_BASE64, "PNG", 15, 12, 16, 12);
    } catch (e) {
      console.warn("Logo rendering notice:", e);
    }

    // Top Brand Name & Sub-tagline aligned nicely next to the logo emblem
    const brandX = 33.5;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14.5);
    doc.setTextColor(GOLD_DEEP[0], GOLD_DEEP[1], GOLD_DEEP[2]);
    doc.text(this.settings.companyName.toUpperCase(), brandX, 18);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.2);
    doc.setTextColor(MUTED_GREY[0], MUTED_GREY[1], MUTED_GREY[2]);
    doc.text(this.settings.tagline.toUpperCase(), brandX, 22.5);

    // Right-aligned contact info in header
    doc.setFontSize(7.5);
    doc.text(`${this.settings.website}  |  ${this.settings.phone}`, pageWidth - 15, 18, { align: "right" });
    doc.text(`${this.settings.email}  |  Govt. MSME Reg: ${this.settings.msmeRegistration}`, pageWidth - 15, 22.5, { align: "right" });

    // Hairline separator in metallic gold
    doc.setDrawColor(GOLD_CHAMPAGNE[0], GOLD_CHAMPAGNE[1], GOLD_CHAMPAGNE[2]);
    doc.setLineWidth(0.4);
    doc.line(15, 27, pageWidth - 15, 27);

    // Document Banner Bar
    doc.setFillColor(RICH_BLACK[0], RICH_BLACK[1], RICH_BLACK[2]);
    doc.rect(15, 30.5, pageWidth - 30, 11, "F");

    // Title inside banner
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(255, 255, 255);
    doc.text(title.toUpperCase(), 19, 37.5);

    // Document Number on Right of banner
    if (documentNumber) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(GOLD_CHAMPAGNE[0], GOLD_CHAMPAGNE[1], GOLD_CHAMPAGNE[2]);
      doc.text(`REF: ${documentNumber}`, pageWidth - 19, 37.5, { align: "right" });
    }

    if (subtitle) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.setTextColor(MUTED_GREY[0], MUTED_GREY[1], MUTED_GREY[2]);
      doc.text(subtitle, 15, 46.5);
      return 51.5; // Return next Y position
    }

    return 47.5; // Return next Y position
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

  let y = pdf.renderHeader("NO OBJECTION CERTIFICATE (NOC)", "Institutional Internship Endorsement", data.documentNumber);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(RICH_BLACK[0], RICH_BLACK[1], RICH_BLACK[2]);
  doc.text("TO WHOMSOEVER IT MAY CONCERN", 15, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(30, 30, 30);

  const textParagraphs = [
    `This is to certify that Digital Dictionary has accepted and confirmed the internship engagement of the student outlined below:`,
  ];

  textParagraphs.forEach((p) => {
    const split = doc.splitTextToSize(p, 180);
    doc.text(split, 15, y);
    y += split.length * 4 + 2;
  });

  // Student & Academic Particulars Table
  autoTable(doc, {
    startY: y,
    theme: "grid",
    headStyles: { fillColor: [166, 124, 34], textColor: [255, 255, 255], fontSize: 8.5 },
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 50, textColor: [80, 80, 80] },
      1: { cellWidth: 130 },
    },
    body: [
      ["STUDENT NAME:", data.fullName || data.internName || "—"],
      ["COLLEGE / INSTITUTION:", data.collegeName || "—"],
      ["UNIVERSITY:", data.universityName || "—"],
      ["DEGREE / COURSE & BRANCH:", `${data.course || "—"} (${data.department || "Engineering"})`],
      ["SEMESTER / YEAR:", `${data.semester || "—"}  |  Roll No: ${data.collegeRollNo || "—"}`],
      ["INTERNSHIP DESIGNATION:", data.internshipRole || "Full Stack Web Developer Intern"],
      ["ENGAGEMENT DURATION:", `${data.startDate || "—"} to ${data.endDate || "—"} (${data.durationMonths || 3} Months)`],
      ["WORKING MODE:", (data.internshipMode || "Hybrid / Studio").toUpperCase()],
    ],
  });

  y = (doc as any).lastAutoTable.finalY + 6;

  const endorse = `Digital Dictionary confirms that the student will work on live enterprise platforms, technical codebases, and digital engineering workflows under direct senior mentorship. We have no objection to the student completing this program as part of their academic curriculum.`;
  const splitEndorse = doc.splitTextToSize(endorse, 180);
  doc.text(splitEndorse, 15, y);
  y += splitEndorse.length * 4 + 8;

  pdf.renderSignatureBlock(y, "HR & University Relations Desk");

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

  let y = pdf.renderHeader(docTitle, `Pay Period: ${data.salaryMonth || "Current Month"}`, data.documentNumber);

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
      ["EMPLOYEE NAME:", data.employeeName || data.fullName, "EMPLOYEE ID:", data.employeeId || "—"],
      ["DESIGNATION:", data.designation || "—", "DEPARTMENT:", data.department || "Engineering"],
      ["PAY PERIOD:", data.payPeriod || data.salaryMonth || "—", "PAYMENT STATUS:", (data.paymentStatus || "PAID").toUpperCase()],
    ],
  });

  y = (doc as any).lastAutoTable.finalY + 6;

  const earnings = isIntern 
    ? [["Monthly Base Stipend", Number(data.basicSalary || data.monthlyStipend || 0)]]
    : [
        ["Basic Salary", Number(data.basicSalary || 0)],
        ["HRA & Allowances", Number(data.allowances || 0)],
        ["Performance Incentives", Number(data.incentives || 0)],
      ];

  const deductions = [
    ["Statutory / Advance Deductions", Number(data.deductions || 0)],
  ];

  const totalEarnings = earnings.reduce((sum, item) => sum + Number(item[1]), 0);
  const totalDeductions = deductions.reduce((sum, item) => sum + Number(item[1]), 0);
  const netPay = totalEarnings - totalDeductions;

  autoTable(doc, {
    startY: y,
    theme: "grid",
    headStyles: { fillColor: [24, 24, 24], textColor: [255, 255, 255], fontSize: 8 },
    styles: { fontSize: 8, cellPadding: 2 },
    head: [["Earnings Item", "Amount (INR)", "Deductions Item", "Amount (INR)"]],
    body: [
      [earnings[0][0], `INR ${earnings[0][1].toLocaleString("en-IN")}/-`, deductions[0][0], `INR ${deductions[0][1].toLocaleString("en-IN")}/-`],
      ...(isIntern ? [] : [
        [earnings[1][0], `INR ${earnings[1][1].toLocaleString("en-IN")}/-`, "—", "—"],
        [earnings[2][0], `INR ${earnings[2][1].toLocaleString("en-IN")}/-`, "—", "—"],
      ]),
      ["TOTAL EARNINGS", `INR ${totalEarnings.toLocaleString("en-IN")}/-`, "TOTAL DEDUCTIONS", `INR ${totalDeductions.toLocaleString("en-IN")}/-`],
    ],
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
  doc.text("NET SALARY TRANSFERRED:", 19, y + 6.5);

  doc.setTextColor(RICH_BLACK[0], RICH_BLACK[1], RICH_BLACK[2]);
  doc.text(`INR ${netPay.toLocaleString("en-IN")}/-`, pageWidth - 19, y + 6.5, { align: "right" });

  y += 16;
  pdf.renderSignatureBlock(y, "Finance & Payroll Department");

  return pdf;
}

// ==========================================
// 7. INTERN OFFER LETTER
// ==========================================
export function generateInternOfferPDF(data: any, settings?: CompanySettings): DigitalDictionaryPDF {
  const pdf = new DigitalDictionaryPDF(settings);
  const doc = pdf.doc;

  let y = pdf.renderHeader("FORMAL INTERNSHIP APPOINTMENT OFFER", "Academic & Industrial Training Cohort", data.documentNumber);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(RICH_BLACK[0], RICH_BLACK[1], RICH_BLACK[2]);
  doc.text(`Date: ${data.offerDate || new Date().toLocaleDateString("en-GB")}`, 15, y);
  y += 5;
  doc.text(`To: ${data.fullName || data.internName}`, 15, y);
  y += 4;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`${data.collegeName || "Institution"}, ${data.course || "Degree"}`, 15, y);
  y += 7;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(GOLD_DEEP[0], GOLD_DEEP[1], GOLD_DEEP[2]);
  doc.text(`Subject: Offer of Internship — ${data.internshipRole || "Full Stack Web Developer Intern"}`, 15, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(30, 30, 30);

  const paragraphs = [
    `Dear ${data.fullName || data.internName},`,
    `Following your interview and technical evaluation, we are pleased to offer you an internship position at Digital Dictionary.`,
    `Your role will involve collaborating with our senior engineering team to architect live web platforms, client portals, and cloud backends.`,
  ];

  paragraphs.forEach((p) => {
    const split = doc.splitTextToSize(p, 180);
    doc.text(split, 15, y);
    y += split.length * 4 + 2;
  });

  autoTable(doc, {
    startY: y,
    theme: "grid",
    headStyles: { fillColor: [24, 24, 24], textColor: [255, 255, 255], fontSize: 8 },
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 50 }, 1: { cellWidth: 130 } },
    body: [
      ["Position Title", data.internshipRole || "Web Engineering Intern"],
      ["Department", data.department || "Engineering & Technology"],
      ["Reporting Supervisor", data.assignedSupervisor || "Lead Architect"],
      ["Start & End Date", `${data.startDate || "Kickoff Date"} to ${data.endDate || "Completion Date"}`],
      ["Monthly Stipend", `INR ${Number(data.monthlyStipend || 0).toLocaleString("en-IN")}/- (Performance-linked bonus)`],
      ["Working Arrangement", (data.internshipMode || "Hybrid").toUpperCase()],
    ],
  });

  y = (doc as any).lastAutoTable.finalY + 8;
  pdf.renderSignatureBlock(y, "Talent & University Recruitment Lead");

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
// 9. PACKAGE MENU PDF GENERATOR
// ==========================================
export function generatePackageMenuPDF(packages: any[], settings?: CompanySettings): DigitalDictionaryPDF {
  const pdf = new DigitalDictionaryPDF(settings);
  const doc = pdf.doc;

  let y = pdf.renderHeader("OFFICIAL DIGITAL SOLUTIONS CATALOGUE", "Enterprise Packages & Pricing Menu");

  autoTable(doc, {
    startY: y,
    theme: "grid",
    headStyles: { fillColor: [24, 24, 24], textColor: [255, 255, 255], fontSize: 8 },
    styles: { fontSize: 7.5, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 20 },
      1: { fontStyle: "bold", cellWidth: 50 },
      2: { cellWidth: 70 },
      3: { cellWidth: 20, halign: "center" },
      4: { fontStyle: "bold", cellWidth: 20, halign: "right" },
    },
    head: [["Code", "Package Name", "Scope Summary", "Billing", "Price (INR)"]],
    body: packages.map((pkg) => [
      pkg.code,
      pkg.name,
      pkg.shortDescription || pkg.fullDescription?.substring(0, 70) + "...",
      pkg.billingType === "monthly" ? "Monthly" : "One-Time",
      `INR ${Number(pkg.price).toLocaleString("en-IN")}${pkg.priceType === "starting_from" ? "+" : ""}`,
    ]),
  });

  y = (doc as any).lastAutoTable.finalY + 8;
  pdf.renderSignatureBlock(y, "Commercial Solutions Director");

  return pdf;
}
