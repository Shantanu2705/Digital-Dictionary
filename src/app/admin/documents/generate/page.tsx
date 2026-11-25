"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { DocumentType, Client, PermanentEmployee, InternRecord } from "@/types/portal";
import { 
  FilePlus, 
  ArrowLeft, 
  Download, 
  Save, 
  Sparkles, 
  Building2, 
  Calendar, 
  DollarSign, 
  CheckCircle,
  FileText
} from "lucide-react";
import { 
  generateAgreementPDF, 
  generateInvoicePDF, 
  generateWelcomeDocPDF, 
  generateQuotationPDF, 
  generateInternNocPDF, 
  generatePayslipPDF, 
  generateDeliveryGuidePDF,
  generateInternOfferPDF
} from "@/lib/pdf/pdfEngine";

function DocumentGeneratorContent() {
  const searchParams = useSearchParams();
  const initialType = (searchParams.get("type") as DocumentType) || "agreement";
  const preClientId = searchParams.get("clientId") || "";
  const preUserId = searchParams.get("userId") || "";

  const [documentType, setDocumentType] = useState<DocumentType>(initialType);
  const [clients, setClients] = useState<Client[]>([]);
  const [employees, setEmployees] = useState<PermanentEmployee[]>([]);
  const [interns, setInterns] = useState<InternRecord[]>([]);

  // Selected relationships
  const [selectedClientId, setSelectedClientId] = useState(preClientId);
  const [selectedUserId, setSelectedUserId] = useState(preUserId);

  // Form Fields
  const [documentNumber, setDocumentNumber] = useState("");
  const [title, setTitle] = useState("Official Service Agreement");
  const [clientName, setClientName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [projectName, setProjectName] = useState("Enterprise Digital Infrastructure");
  const [amount, setAmount] = useState(50000);
  const [advanceAmount, setAdvanceAmount] = useState(25000);
  const [projectTimeline, setProjectTimeline] = useState("4 to 6 Weeks");
  const [scopeDetails, setScopeDetails] = useState("Full stack Next.js engineering, custom CMS architecture, sub-second Core Web Vitals optimization, and 90-day post-launch warranty.");
  
  // Intern / Academic Specific
  const [collegeName, setCollegeName] = useState("");
  const [universityName, setUniversityName] = useState("");
  const [course, setCourse] = useState("B.Tech Computer Science");
  const [rollNumber, setRollNumber] = useState("");
  const [supervisorName, setSupervisorName] = useState("Technical Director");

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    loadEntities();
    updateDocNumber(documentType);
  }, [documentType]);

  const loadEntities = async () => {
    try {
      const [cliSnap, empSnap, intSnap] = await Promise.all([
        getDocs(collection(db, "clients")),
        getDocs(collection(db, "employees")),
        getDocs(collection(db, "interns")),
      ]);
      const cliList = cliSnap.docs.map(d => ({ id: d.id, ...d.data() } as Client));
      const empList = empSnap.docs.map(d => ({ id: d.id, ...d.data() } as PermanentEmployee));
      const intList = intSnap.docs.map(d => ({ id: d.id, ...d.data() } as InternRecord));

      setClients(cliList);
      setEmployees(empList);
      setInterns(intList);

      if (preClientId) {
        const found = cliList.find(c => c.id === preClientId);
        if (found) populateFromClient(found);
      }
      if (preUserId) {
        const foundEmp = empList.find(e => e.id === preUserId);
        if (foundEmp) populateFromEmployee(foundEmp);
        const foundInt = intList.find(i => i.id === preUserId);
        if (foundInt) populateFromIntern(foundInt);
      }
    } catch (err) {
      console.error("Error loading entities:", err);
    }
  };

  const updateDocNumber = (type: DocumentType) => {
    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    const prefixes: Record<string, string> = {
      agreement: "DD-AGR",
      invoice: "DD-INV",
      quotation: "DD-QUO",
      welcome: "DD-WEL",
      delivery_guide: "DD-GDN",
      intern_noc: "DD-NOC",
      intern_offer: "DD-OFF",
      employee_payslip: "DD-PAY",
      intern_stipend: "DD-STP",
    };
    const prefix = prefixes[type] || "DD-DOC";
    setDocumentNumber(`${prefix}-${year}-${rand}`);

    const titles: Record<string, string> = {
      agreement: "Master Services & Development Agreement",
      invoice: "Tax & Commercial Invoice",
      quotation: "Strategic Commercial Quotation",
      welcome: "Client Executive Welcome Kit",
      delivery_guide: "Sub-Second Production Delivery Guide",
      intern_noc: "Institutional College Clearance NOC",
      intern_offer: "Internship Offer & Mentorship Terms",
      employee_payslip: "Monthly Salary Disbursement Advice",
      intern_stipend: "Academic Internship Stipend Advice",
    };
    setTitle(titles[type] || "Official Corporate Document");
  };

  const populateFromClient = (cli: Client) => {
    setClientName(cli.contactPerson || cli.companyName);
    setCompanyName(cli.companyName);
    setEmail(cli.email);
    setPhone(cli.phone);
    setProjectName(cli.projectName || "Enterprise Web Platform");
    setAmount(cli.agreedAmount || cli.quotedAmount || 50000);
    setAdvanceAmount(cli.advancePayment || 25000);
  };

  const populateFromEmployee = (emp: PermanentEmployee) => {
    setClientName(emp.fullName);
    setCompanyName("Digital Dictionary");
    setEmail(emp.email);
    setPhone(emp.phone);
    setAmount(emp.basicSalary + emp.allowances);
  };

  const populateFromIntern = (int: InternRecord) => {
    setClientName(int.fullName);
    setCollegeName(int.collegeName);
    setUniversityName(int.universityName || int.collegeName);
    setCourse(int.course);
    setRollNumber(int.collegeRollNo || "");
    setSupervisorName(int.assignedSupervisor || "Technical Lead");
    setEmail(int.email);
    setPhone(int.phone);
    setAmount(int.monthlyStipend);
  };

  const buildDocumentData = () => {
    return {
      documentNumber,
      clientName: clientName || "Valued Enterprise Client",
      companyName: companyName || "Client Organization",
      email: email || "contact@client.com",
      phone: phone || "+91 98765 43210",
      projectName: projectName || "Strategic Digital Architecture",
      agreementDate: new Date().toLocaleDateString("en-IN"),
      invoiceDate: new Date().toLocaleDateString("en-IN"),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN"),
      totalContractValue: Number(amount),
      advanceAmount: Number(advanceAmount),
      balanceAmount: Math.max(0, Number(amount) - Number(advanceAmount)),
      projectTimeline,
      scopeDeliverables: [
        scopeDetails,
        "Sub-Second Core Web Vitals optimization on Google Lighthouse 100/100 standards.",
        "Zero-Vulnerability Hardened Enterprise Architecture.",
        "90 Days dedicated warranty & technical support.",
      ],
      // For Invoice / Quotation table
      items: [
        {
          description: projectName + " — " + scopeDetails,
          qty: 1,
          rate: Number(amount),
          total: Number(amount),
        },
      ],
      subTotal: Number(amount),
      tax: Math.round(Number(amount) * 0.18),
      grandTotal: Math.round(Number(amount) * 1.18),
      // For Intern NOC
      nocNumber: documentNumber,
      internName: clientName,
      collegeName,
      universityName: universityName || collegeName,
      course,
      semester: "Final Year",
      rollNumber,
      department: "Engineering",
      supervisorName,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      durationMonths: 3,
      internshipMode: "Remote",
      monthlyStipend: Number(amount),
      reportingDate: new Date().toISOString().split("T")[0],
      // For Payslip
      payslipNumber: documentNumber,
      employeeName: clientName,
      employeeId: "DD-STAFF",
      designation: "Software Engineer",
      salaryMonth: new Date().toLocaleString("default", { month: "long", year: "numeric" }),
      payPeriod: "Full Month",
      basicSalary: Number(amount) * 0.7,
      allowances: Number(amount) * 0.3,
      deductions: 0,
      totalEarnings: Number(amount),
      netPay: Number(amount),
    };
  };

  const handleDownloadPDF = () => {
    const data = buildDocumentData();
    let pdfObj;

    switch (documentType) {
      case "agreement":
        pdfObj = generateAgreementPDF(data);
        break;
      case "invoice":
        pdfObj = generateInvoicePDF(data);
        break;
      case "welcome":
        pdfObj = generateWelcomeDocPDF(data);
        break;
      case "quotation":
        pdfObj = generateQuotationPDF(data);
        break;
      case "intern_noc":
        pdfObj = generateInternNocPDF(data);
        break;
      case "intern_offer":
        pdfObj = generateInternOfferPDF(data);
        break;
      case "employee_payslip":
      case "intern_stipend":
        pdfObj = generatePayslipPDF(data);
        break;
      case "delivery_guide":
        pdfObj = generateDeliveryGuidePDF(data);
        break;
      default:
        pdfObj = generateWelcomeDocPDF(data);
        break;
    }

    pdfObj.doc.save(`${documentNumber}_${title.replace(/\s+/g, "_")}.pdf`);
  };

  const handleSaveToRegistry = async () => {
    setSaving(true);
    setSuccessMsg(null);
    try {
      const data = buildDocumentData();
      await addDoc(collection(db, "documents"), {
        documentNumber,
        documentType,
        title,
        clientId: selectedClientId || null,
        clientName: companyName || clientName || "General",
        relatedUserId: selectedUserId || null,
        relatedUserName: clientName,
        data,
        status: "final",
        versionNumber: 1,
        createdBy: "COO",
        createdByName: "Company Operations",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      setSuccessMsg("Document saved into central repository successfully!");
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      alert("Failed to save: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top back */}
      <div>
        <Link
          href="/admin/documents"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Document Centre
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <FilePlus className="w-6 h-6 text-[#D4AF37]" />
          Enterprise PDF Document Studio
        </h1>
        <p className="text-sm text-neutral-400 mt-1">
          Automated A4 vector PDF engine with double metallic gold borders, official logo, and proprietor mark.
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Form */}
      <div className="space-y-6">
        {/* Step 1: Select Type & Fast autofill */}
        <div className="p-6 rounded-xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm space-y-4">
          <h2 className="text-base font-semibold text-white flex items-center gap-2 border-b border-white/5 pb-3">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            1. Document Classification & Autofill Source
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Document Type <span className="text-red-400">*</span>
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value as DocumentType)}
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
              >
                <option value="agreement">Client Master Service Agreement</option>
                <option value="invoice">Commercial Tax Invoice (18% GST)</option>
                <option value="quotation">Strategic Commercial Quotation</option>
                <option value="welcome">Client Executive Welcome Kit</option>
                <option value="delivery_guide">Sub-Second Delivery Guide</option>
                <option value="intern_noc">College Clearance NOC</option>
                <option value="intern_offer">Internship Offer Letter</option>
                <option value="employee_payslip">Monthly Salary Payslip</option>
                <option value="intern_stipend">Intern Stipend Advice</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Autofill from Existing Client
              </label>
              <select
                value={selectedClientId}
                onChange={(e) => {
                  setSelectedClientId(e.target.value);
                  const found = clients.find(c => c.id === e.target.value);
                  if (found) populateFromClient(found);
                }}
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
              >
                <option value="">-- Choose Client (Optional) --</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.companyName} ({c.contactPerson})</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Step 2: Document Header & Identification */}
        <div className="p-6 rounded-xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm space-y-4">
          <h2 className="text-base font-semibold text-white flex items-center gap-2 border-b border-white/5 pb-3">
            <FileText className="w-4 h-4 text-[#D4AF37]" />
            2. Reference Number & Party Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Document Number</label>
              <input
                type="text"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Document Title Banner</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Full Name / Contact Person</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Company / Organization</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Telephone / WhatsApp</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Project Scope or Academic Information */}
        {documentType === "intern_noc" || documentType === "intern_offer" ? (
          <div className="p-6 rounded-xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm space-y-4">
            <h2 className="text-base font-semibold text-white flex items-center gap-2 border-b border-white/5 pb-3">
              <Building2 className="w-4 h-4 text-[#D4AF37]" />
              Academic Clearance Parameters
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">College / Institute Name</label>
                <input
                  type="text"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  placeholder="e.g. Siliguri Institute of Technology"
                  className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">University Name</label>
                <input
                  type="text"
                  value={universityName}
                  onChange={(e) => setUniversityName(e.target.value)}
                  placeholder="e.g. MAKAUT"
                  className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Course & Degree</label>
                <input
                  type="text"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Roll / Registration Number</label>
                <input
                  type="text"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm space-y-4">
            <h2 className="text-base font-semibold text-white flex items-center gap-2 border-b border-white/5 pb-3">
              <DollarSign className="w-4 h-4 text-[#D4AF37]" />
              Commercial & Scope Parameters
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Total Valuation (₹)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Advance / Paid Amount (₹)</label>
                <input
                  type="number"
                  value={advanceAmount}
                  onChange={(e) => setAdvanceAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Timeline</label>
                <input
                  type="text"
                  value={projectTimeline}
                  onChange={(e) => setProjectTimeline(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-medium text-neutral-300 mb-1">Scope of Engagement</label>
                <textarea
                  rows={3}
                  value={scopeDetails}
                  onChange={(e) => setScopeDetails(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-white/5">
          <button
            type="button"
            onClick={handleDownloadPDF}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#D4AF37] text-black font-semibold text-sm shadow hover:brightness-110 transition-all"
          >
            <Download className="w-4 h-4" />
            Generate & Download A4 PDF
          </button>
          <button
            type="button"
            onClick={handleSaveToRegistry}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-sm border border-white/10 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save to Document Registry"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DocumentGeneratorStudio() {
  return (
    <Suspense fallback={
      <div className="py-24 text-center text-neutral-400">
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading Document Generator Studio...
      </div>
    }>
      <DocumentGeneratorContent />
    </Suspense>
  );
}
