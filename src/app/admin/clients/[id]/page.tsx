"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Briefcase, 
  ArrowLeft, 
  DollarSign, 
  FileText, 
  Plus, 
  Clock, 
  Users, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Download,
  Share2,
  UserCheck
} from "lucide-react";
import { doc, getDoc, updateDoc, collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Client, DocumentRecord, UserProfile, ClientStatus, PaymentStatus } from "@/types/portal";
import { 
  generateAgreementPDF, 
  generateInvoicePDF, 
  generateWelcomeDocPDF, 
  generateQuotationPDF, 
  generateDeliveryGuidePDF 
} from "@/lib/pdf/pdfEngine";
import { generateDocumentNumber } from "@/lib/utils/numbering";
import { logActivity } from "@/lib/utils/audit";
import { cn } from "@/lib/utils";

export default function ClientProfilePage() {
  const params = useParams();
  const clientId = params.id as string;
  const router = useRouter();

  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [employees, setEmployees] = useState<UserProfile[]>([]);
  const [generatingDoc, setGeneratingDoc] = useState<string | null>(null);

  // Status & payment edit modal
  const [editStatusOpen, setEditStatusOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<ClientStatus>("active");
  const [newPaymentStatus, setNewPaymentStatus] = useState<PaymentStatus>("partial");
  const [newAmountPaid, setNewAmountPaid] = useState(0);
  const [selectedPrimaryEmployee, setSelectedPrimaryEmployee] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        // 1. Fetch Client
        const clientRef = doc(db, "clients", clientId);
        const clientSnap = await getDoc(clientRef);
        if (clientSnap.exists()) {
          const cData = { id: clientSnap.id, ...clientSnap.data() } as Client;
          setClient(cData);
          setNewStatus(cData.projectStatus);
          setNewPaymentStatus(cData.paymentStatus);
          setNewAmountPaid(cData.amountPaid || 0);
          setSelectedPrimaryEmployee(cData.primaryEmployeeId || "");
        }

        // 2. Fetch Client Documents
        const docsSnap = await getDocs(query(collection(db, "documents"), where("clientId", "==", clientId)));
        const docList: DocumentRecord[] = [];
        docsSnap.forEach((d) => docList.push({ id: d.id, ...d.data() } as DocumentRecord));
        setDocuments(docList);

        // 3. Fetch Team Members
        const empSnap = await getDocs(collection(db, "users"));
        const empList: UserProfile[] = [];
        empSnap.forEach((d) => empList.push(d.data() as UserProfile));
        setEmployees(empList);
      } catch (err) {
        console.warn("Could not load client details:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [clientId]);

  // Handle Generating a specific PDF right from the client profile
  const handleQuickGenerate = async (docType: "agreement" | "welcome" | "invoice" | "quotation" | "delivery_guide") => {
    if (!client) return;
    setGeneratingDoc(docType);

    try {
      const docNumber = await generateDocumentNumber(docType);
      const now = new Date().toISOString();

      let pdfInstance;
      let title = "";

      if (docType === "agreement") {
        title = `Client Agreement - ${client.companyName}`;
        pdfInstance = generateAgreementPDF({
          documentNumber: docNumber,
          clientName: client.companyName,
          companyName: client.companyName,
          contactPerson: client.contactPerson,
          email: client.email,
          phone: client.phone,
          packageName: client.selectedPackageName,
          agreedAmount: client.agreedAmount,
          startDate: client.projectStartDate,
          deliveryDate: client.expectedDeliveryDate,
          deliverables: client.selectedServices,
        });
      } else if (docType === "invoice") {
        title = `Tax Invoice - ${client.companyName}`;
        pdfInstance = generateInvoicePDF({
          documentNumber: docNumber,
          clientName: client.companyName,
          contactPerson: client.contactPerson,
          email: client.email,
          phone: client.phone,
          packageName: client.selectedPackageName,
          agreedAmount: client.agreedAmount,
          amountPaid: client.amountPaid,
          paymentStatus: client.paymentStatus,
        });
      } else if (docType === "welcome") {
        title = `Welcome Guide - ${client.companyName}`;
        pdfInstance = generateWelcomeDocPDF({
          documentNumber: docNumber,
          clientName: client.companyName,
          primaryEmployeeName: client.primaryEmployeeName,
        });
      } else if (docType === "quotation") {
        title = `Commercial Quotation - ${client.companyName}`;
        pdfInstance = generateQuotationPDF({
          documentNumber: docNumber,
          clientName: client.companyName,
          contactPerson: client.contactPerson,
          quotedAmount: client.quotedAmount || client.agreedAmount,
          packageName: client.selectedPackageName,
        });
      } else {
        title = `Delivery Guide - ${client.companyName}`;
        pdfInstance = generateDeliveryGuidePDF({
          documentNumber: docNumber,
          projectName: client.projectName,
        });
      }

      // Download PDF immediately in browser
      pdfInstance.save(`${docNumber}-${client.companyName.replace(/\s+/g, "_")}.pdf`);

      // Record in documents collection
      const newDocRecord: Omit<DocumentRecord, "id"> = {
        documentNumber: docNumber,
        documentType: docType,
        title,
        clientId: client.id,
        clientName: client.companyName,
        data: { generatedAt: now },
        status: "approved",
        versionNumber: 1,
        createdBy: "coo@digitaldictionary.in",
        createdByName: "Chief Operating Officer",
        approvedBy: "coo@digitaldictionary.in",
        approvedAt: now,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await addDoc(collection(db, "documents"), newDocRecord);
      setDocuments(prev => [{ id: docRef.id, ...newDocRecord }, ...prev]);

      await logActivity({
        userId: "admin",
        userEmail: "coo@digitaldictionary.in",
        action: "GENERATE_PDF",
        entityType: "document",
        entityId: docRef.id,
        details: `Generated ${docType} (${docNumber}) for ${client.companyName}`,
      });
    } catch (err: any) {
      console.error("PDF generation error:", err);
      alert(`Could not generate PDF: ${err.message}`);
    } finally {
      setGeneratingDoc(null);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client) return;

    try {
      const now = new Date().toISOString();
      const primaryEmp = employees.find(e => e.uid === selectedPrimaryEmployee);

      const updates: Partial<Client> = {
        projectStatus: newStatus,
        paymentStatus: newPaymentStatus,
        amountPaid: Number(newAmountPaid),
        outstandingAmount: Number(client.agreedAmount) - Number(newAmountPaid),
        primaryEmployeeId: primaryEmp?.uid || client.primaryEmployeeId || "",
        primaryEmployeeName: primaryEmp?.fullName || client.primaryEmployeeName || "",
        assignedEmployeeIds: primaryEmp?.uid ? [primaryEmp.uid] : (client.assignedEmployeeIds || []),
        updatedAt: now,
      };

      await updateDoc(doc(db, "clients", client.id), updates);
      setClient(prev => prev ? { ...prev, ...updates } : null);
      setEditStatusOpen(false);

      await logActivity({
        userId: "admin",
        userEmail: "coo@digitaldictionary.in",
        action: "UPDATE_CLIENT_STATUS",
        entityType: "client",
        entityId: client.id,
        details: `Updated ${client.companyName} status to ${newStatus}, assigned to ${primaryEmp?.fullName || "Unchanged"}`,
      });
    } catch (err: any) {
      alert(`Error updating: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-slate-400 flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin" />
        <span>Loading client profile...</span>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-12 text-center text-xs text-slate-400 space-y-3">
        <p className="font-bold text-white">Client record not found.</p>
        <Link href="/admin/clients" className="text-[#D4AF37] hover:underline">
          Return to directory
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="space-y-1">
          <Link
            href="/admin/clients"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Clients</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-serif font-bold text-white">
              {client.companyName || client.clientName}
            </h1>
            <span className="font-mono text-xs font-bold text-[#E8D18A] bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-md">
              {client.clientId}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {client.projectName} &middot; Created on {new Date(client.createdAt).toLocaleDateString("en-GB")}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setEditStatusOpen(true)}
            className="px-4 py-2 rounded-xl bg-neutral-800 border border-white/10 hover:border-[#D4AF37] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            Update Status / Assignment
          </button>
          <Link
            href={`/admin/onboarding?clientId=${client.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E8D18A] to-[#A67C22] text-[#101010] text-xs font-bold uppercase tracking-wider shadow-md hover:scale-[1.01] transition-all"
          >
            <Clock className="w-3.5 h-3.5 text-[#101010]" />
            <span>60-Min Onboarding</span>
          </Link>
        </div>
      </div>

      {/* Grid: Client Profile Particulars & Financial Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Client & Project Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Primary Engagement Scope */}
          <div className="p-6 rounded-2xl bg-[#121212] border border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="text-sm font-bold text-white">Engagement Scope</h3>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/10">
                {client.projectStatus.replace("_", " ")}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Project Name</span>
                <span className="font-bold text-white">{client.projectName}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Package Specification</span>
                <span className="font-semibold text-white">{client.selectedPackageName || "Custom Package"}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Primary Assigned Lead</span>
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  {client.primaryEmployeeName || "Unassigned"}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Target Completion</span>
                <span className="font-semibold text-white">{client.expectedDeliveryDate || "Milestone Based"}</span>
              </div>
            </div>

            {client.projectDescription && (
              <div className="pt-3 border-t border-white/10">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Scope Details</span>
                <p className="text-xs text-slate-300 leading-relaxed bg-[#181818] p-3 rounded-xl border border-white/10">
                  {client.projectDescription}
                </p>
              </div>
            )}
          </div>

          {/* Card: Client Document Generator Desk */}
          <div className="p-6 rounded-2xl bg-[#121212] border border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="text-sm font-bold text-white">Instant Document Generation Desk</h3>
              </div>
              <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">
                Official PDF Suite
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Generate official A4 documents formatted with gold borders, letterhead, and proprietor marks for this client:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <button
                onClick={() => handleQuickGenerate("agreement")}
                disabled={generatingDoc !== null}
                className="p-3.5 rounded-xl border border-white/10 hover:border-[#D4AF37] bg-[#181818] hover:bg-white/5 text-left transition-all group cursor-pointer disabled:opacity-50"
              >
                <div className="text-[11px] font-bold text-white group-hover:text-[#D4AF37]">Client Agreement</div>
                <div className="text-[9px] text-slate-400 mt-0.5">Master Contract</div>
              </button>

              <button
                onClick={() => handleQuickGenerate("welcome")}
                disabled={generatingDoc !== null}
                className="p-3.5 rounded-xl border border-white/10 hover:border-[#D4AF37] bg-[#181818] hover:bg-white/5 text-left transition-all group cursor-pointer disabled:opacity-50"
              >
                <div className="text-[11px] font-bold text-white group-hover:text-[#D4AF37]">Welcome Guide</div>
                <div className="text-[9px] text-slate-400 mt-0.5">Client Orientation</div>
              </button>

              <button
                onClick={() => handleQuickGenerate("invoice")}
                disabled={generatingDoc !== null}
                className="p-3.5 rounded-xl border border-white/10 hover:border-[#D4AF37] bg-[#181818] hover:bg-white/5 text-left transition-all group cursor-pointer disabled:opacity-50"
              >
                <div className="text-[11px] font-bold text-white group-hover:text-[#D4AF37]">Tax / Advance Invoice</div>
                <div className="text-[9px] text-slate-400 mt-0.5">Payment Advice</div>
              </button>

              <button
                onClick={() => handleQuickGenerate("quotation")}
                disabled={generatingDoc !== null}
                className="p-3.5 rounded-xl border border-white/10 hover:border-[#D4AF37] bg-[#181818] hover:bg-white/5 text-left transition-all group cursor-pointer disabled:opacity-50"
              >
                <div className="text-[11px] font-bold text-white group-hover:text-[#D4AF37]">Commercial Quotation</div>
                <div className="text-[9px] text-slate-400 mt-0.5">Formal Proposal</div>
              </button>

              <button
                onClick={() => handleQuickGenerate("delivery_guide")}
                disabled={generatingDoc !== null}
                className="p-3.5 rounded-xl border border-white/10 hover:border-[#D4AF37] bg-[#181818] hover:bg-white/5 text-left transition-all group cursor-pointer disabled:opacity-50"
              >
                <div className="text-[11px] font-bold text-white group-hover:text-[#D4AF37]">Delivery Guide</div>
                <div className="text-[9px] text-slate-400 mt-0.5">Production Handover</div>
              </button>

              <Link
                href={`/admin/documents/generate?clientId=${client.id}`}
                className="p-3.5 rounded-xl border border-white/10 hover:border-[#D4AF37] bg-[#181818] hover:bg-white/5 text-left transition-all group flex flex-col justify-between"
              >
                <div className="text-[11px] font-bold text-[#D4AF37]">Full PDF Studio &rarr;</div>
                <div className="text-[9px] text-slate-400 mt-0.5">Advanced Generator</div>
              </Link>
            </div>

            {generatingDoc && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                <span>Compiling A4 PDF with gold borders and official signature...</span>
              </div>
            )}
          </div>

          {/* List of Generated Documents */}
          <div className="p-6 rounded-2xl bg-[#121212] border border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-bold text-white">Generated Client Documents</h3>
              <span className="text-xs font-mono font-bold text-slate-400">{documents.length} Records</span>
            </div>

            {documents.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                No documents generated yet. Use the quick buttons above to generate the Agreement or Invoice.
              </div>
            ) : (
              <div className="space-y-2.5">
                {documents.map((d) => (
                  <div
                    key={d.id}
                    className="p-3.5 rounded-xl border border-white/10 flex items-center justify-between bg-[#181818]"
                  >
                    <div>
                      <div className="font-bold text-xs text-white">{d.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {d.documentNumber} &middot; {new Date(d.createdAt).toLocaleDateString("en-GB")}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-emerald-400 uppercase">
                      {d.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Financial Breakdown & Contact Details */}
        <div className="space-y-6">
          {/* Card: Financial Summary */}
          <div className="p-6 rounded-2xl bg-[#121212] border border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Commercial Ledger</h3>
              </div>
              <span className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded-md border",
                client.paymentStatus === "paid" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                client.paymentStatus === "partial" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                "bg-rose-500/10 text-rose-400 border-rose-500/20"
              )}>
                {client.paymentStatus?.toUpperCase() || "UNPAID"}
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Agreed Value:</span>
                <span className="font-mono font-bold text-white">
                  ₹{Number(client.agreedAmount || 0).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Amount Paid:</span>
                <span className="font-mono font-bold text-emerald-400">
                  ₹{Number(client.amountPaid || 0).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/10">
                <span className="font-bold text-white">Outstanding Balance:</span>
                <span className="font-mono font-bold text-rose-400">
                  ₹{Number(client.outstandingAmount || 0).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {client.paymentSchedule && (
              <div className="p-3 rounded-xl bg-[#181818] border border-white/10 text-[11px] text-slate-400 mt-3">
                <span className="font-bold text-white block mb-0.5">Schedule:</span>
                {client.paymentSchedule}
              </div>
            )}
          </div>

          {/* Card: Client Contact Particulars */}
          <div className="p-6 rounded-2xl bg-[#121212] border border-white/10 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-white pb-3 border-b border-white/10">
              Contact Coordinates
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Primary Contact</span>
                <span className="font-semibold text-white">{client.contactPerson}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Email</span>
                <a href={`mailto:${client.email}`} className="text-[#D4AF37] hover:underline font-mono">
                  {client.email}
                </a>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Phone / WhatsApp</span>
                <span className="text-white font-mono">{client.phone}</span>
              </div>
              {client.website && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Website</span>
                  <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:underline flex items-center gap-1">
                    <span>{client.website}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
              {client.address && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Address</span>
                  <span className="text-slate-300">{client.address}, {client.city}, {client.state} {client.pinCode}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Update Status / Assignment */}
      {editStatusOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form onSubmit={handleUpdateStatus} className="bg-[#121212] rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-white/10 text-white">
            <h3 className="text-base font-bold text-white pb-2 border-b border-white/10">
              Update Client Status &amp; Assignment
            </h3>

            <div>
              <label className="block text-xs font-bold text-white mb-1.5 uppercase tracking-wider">
                Project Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as ClientStatus)}
                className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#181818] text-white text-xs font-semibold outline-none focus:border-[#D4AF37]"
              >
                <option value="lead" className="bg-[#181818] text-white">Lead</option>
                <option value="negotiation" className="bg-[#181818] text-white">Negotiation</option>
                <option value="proposal_sent" className="bg-[#181818] text-white">Proposal Sent</option>
                <option value="closed_won" className="bg-[#181818] text-white">Closed — Won</option>
                <option value="active" className="bg-[#181818] text-white">Active (Production Underway)</option>
                <option value="on_hold" className="bg-[#181818] text-white">On Hold</option>
                <option value="completed" className="bg-[#181818] text-white">Completed</option>
                <option value="archived" className="bg-[#181818] text-white">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-white mb-1.5 uppercase tracking-wider">
                Assign Primary Lead Developer
              </label>
              <select
                value={selectedPrimaryEmployee}
                onChange={(e) => setSelectedPrimaryEmployee(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#181818] text-white text-xs font-semibold outline-none focus:border-[#D4AF37]"
              >
                <option value="" className="bg-[#181818] text-white">-- Unassigned --</option>
                {employees.map((emp) => (
                  <option key={emp.uid} value={emp.uid} className="bg-[#181818] text-white">
                    {emp.fullName} ({emp.designation})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-white mb-1.5 uppercase tracking-wider">
                  Payment Status
                </label>
                <select
                  value={newPaymentStatus}
                  onChange={(e) => setNewPaymentStatus(e.target.value as PaymentStatus)}
                  className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#181818] text-white text-xs font-semibold outline-none focus:border-[#D4AF37]"
                >
                  <option value="unpaid" className="bg-[#181818] text-white">Unpaid</option>
                  <option value="partial" className="bg-[#181818] text-white">Partial</option>
                  <option value="paid" className="bg-[#181818] text-white">Fully Settled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1.5 uppercase tracking-wider">
                  Amount Paid (INR)
                </label>
                <input
                  type="number"
                  value={newAmountPaid}
                  onChange={(e) => setNewAmountPaid(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#181818] text-white text-xs font-mono font-bold outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setEditStatusOpen(false)}
                className="px-4 py-2 rounded-xl border border-white/10 text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E8D18A] to-[#A67C22] text-[#101010] text-xs font-bold uppercase tracking-wider shadow-md hover:scale-[1.01] transition-all cursor-pointer"
              >
                Save Updates
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
